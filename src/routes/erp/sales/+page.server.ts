import { asc, desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import {
	createSalesDraftFormSchema,
	postSalesShipmentFormSchema
} from '$lib/application/erp/schemas';
import { db } from '$lib/server/db';
import { finishedProduct, salesShipment, salesShipmentLine } from '$lib/server/db/schema';
import { parseSalesLinesInput } from '$lib/server/erp/line-parser';
import { createSalesDraft, postSalesShipment } from '$lib/server/erp/sales';
import { setFormMessageError, toActionErrorMessage } from '$lib/server/erp/superforms-action';

const createSalesDraftAdapter = zod4(createSalesDraftFormSchema);
const postSalesShipmentAdapter = zod4(postSalesShipmentFormSchema);

const createPostFormId = (salesShipmentId: number): string => `sales-post-${salesShipmentId}`;

export const load: PageServerLoad = async () => {
	const [products, shipments, lines] = await Promise.all([
		db.select().from(finishedProduct).orderBy(asc(finishedProduct.code)),
		db.select().from(salesShipment).orderBy(desc(salesShipment.id)),
		db
			.select({
				id: salesShipmentLine.id,
				salesShipmentId: salesShipmentLine.salesShipmentId,
				lineNo: salesShipmentLine.lineNo,
				productId: salesShipmentLine.productId,
				productCode: finishedProduct.code,
				productName: finishedProduct.name,
				quantity: salesShipmentLine.quantity,
				sellingUnitPrice: salesShipmentLine.sellingUnitPrice,
				revenue: salesShipmentLine.revenue,
				cogsUnitCost: salesShipmentLine.cogsUnitCost,
				cogsTotal: salesShipmentLine.cogsTotal,
				grossProfit: salesShipmentLine.grossProfit,
				grossMargin: salesShipmentLine.grossMargin
			})
			.from(salesShipmentLine)
			.innerJoin(finishedProduct, eq(finishedProduct.id, salesShipmentLine.productId))
			.orderBy(salesShipmentLine.salesShipmentId, salesShipmentLine.lineNo)
	]);

	const lineMap = new Map<number, typeof lines>();
	for (const line of lines) {
		const current = lineMap.get(line.salesShipmentId) ?? [];
		current.push(line);
		lineMap.set(line.salesShipmentId, current);
	}

	const shipmentsWithLines = shipments.map((shipment) => ({
		...shipment,
		lines: lineMap.get(shipment.id) ?? []
	}));

	const createDraftForm = await superValidate(
		{
			shipmentNumber: '',
			lines: ''
		},
		createSalesDraftAdapter
	);

	const postForms = await Promise.all(
		shipmentsWithLines.map((shipment) =>
			superValidate(
				{
					salesShipmentId: shipment.id
				},
				postSalesShipmentAdapter,
				{
					id: createPostFormId(shipment.id)
				}
			)
		)
	);

	return {
		products,
		shipments: shipmentsWithLines,
		createDraftForm,
		postForms
	};
};

export const actions: Actions = {
	createDraft: async (event) => {
		const form = await superValidate(event.request, createSalesDraftAdapter);
		if (!form.valid) {
			return fail(400, { form, action: 'createDraft' });
		}

		try {
			await createSalesDraft({
				shipmentNumber: form.data.shipmentNumber,
				lines: parseSalesLinesInput(form.data.lines)
			});
		} catch (error) {
			const mapped = toActionErrorMessage(error);
			return fail(mapped.status, {
				action: 'createDraft',
				form: setFormMessageError(form, mapped.message),
				message: mapped.message
			});
		}

		return {
			action: 'createDraft',
			...message(form, 'Sales draft created')
		};
	},
	post: async (event) => {
		const formData = await event.request.formData();
		const targetSalesShipmentId = Number(formData.get('salesShipmentId'));
		const form = await superValidate(formData, postSalesShipmentAdapter, {
			id: createPostFormId(targetSalesShipmentId)
		});

		if (!form.valid) {
			return fail(400, {
				action: 'post',
				targetSalesShipmentId,
				postForm: form
			});
		}

		try {
			await postSalesShipment(form.data.salesShipmentId);
		} catch (error) {
			const mapped = toActionErrorMessage(error);
			return fail(mapped.status, {
				action: 'post',
				targetSalesShipmentId,
				postForm: setFormMessageError(form, mapped.message),
				message: mapped.message
			});
		}

		return {
			action: 'post',
			targetSalesShipmentId,
			message: 'Sales posted'
		};
	}
};
