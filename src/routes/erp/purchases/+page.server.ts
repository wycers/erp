import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import {
	createPurchaseDraftFormSchema,
	postPurchaseOrderFormSchema
} from '$lib/application/erp/schemas';
import { db } from '$lib/server/db';
import { materialSku, purchaseOrder, purchaseOrderLine } from '$lib/server/db/schema';
import { parsePurchaseLinesInput } from '$lib/server/erp/line-parser';
import { createPurchaseDraft, postPurchaseOrder } from '$lib/server/erp/purchase';
import { setFormMessageError, toActionErrorMessage } from '$lib/server/erp/superforms-action';

const createPurchaseDraftAdapter = zod4(createPurchaseDraftFormSchema);
const postPurchaseOrderAdapter = zod4(postPurchaseOrderFormSchema);

const createPostFormId = (purchaseOrderId: number): string => `purchase-post-${purchaseOrderId}`;

export const load: PageServerLoad = async () => {
	const [materials, orders, lines] = await Promise.all([
		db.select().from(materialSku).orderBy(materialSku.code),
		db.select().from(purchaseOrder).orderBy(desc(purchaseOrder.id)),
		db
			.select({
				id: purchaseOrderLine.id,
				purchaseOrderId: purchaseOrderLine.purchaseOrderId,
				lineNo: purchaseOrderLine.lineNo,
				materialSkuId: purchaseOrderLine.materialSkuId,
				materialCode: materialSku.code,
				materialName: materialSku.name,
				quantity: purchaseOrderLine.quantity,
				lineAmount: purchaseOrderLine.lineAmount,
				unitPrice: purchaseOrderLine.unitPrice,
				allocatedFreight: purchaseOrderLine.allocatedFreight,
				landedUnitCost: purchaseOrderLine.landedUnitCost
			})
			.from(purchaseOrderLine)
			.innerJoin(materialSku, eq(materialSku.id, purchaseOrderLine.materialSkuId))
			.orderBy(purchaseOrderLine.purchaseOrderId, purchaseOrderLine.lineNo)
	]);

	const lineMap = new Map<number, typeof lines>();
	for (const line of lines) {
		const current = lineMap.get(line.purchaseOrderId) ?? [];
		current.push(line);
		lineMap.set(line.purchaseOrderId, current);
	}

	const ordersWithLines = orders.map((order) => ({
		...order,
		lines: lineMap.get(order.id) ?? []
	}));

	const createDraftForm = await superValidate(
		{
			orderNumber: '',
			freightAmount: 0,
			lines: ''
		},
		createPurchaseDraftAdapter
	);

	const postForms = await Promise.all(
		ordersWithLines.map((order) =>
			superValidate(
				{
					purchaseOrderId: order.id
				},
				postPurchaseOrderAdapter,
				{
					id: createPostFormId(order.id)
				}
			)
		)
	);

	return {
		materials,
		orders: ordersWithLines,
		createDraftForm,
		postForms
	};
};

export const actions: Actions = {
	createDraft: async (event) => {
		const form = await superValidate(event.request, createPurchaseDraftAdapter);
		if (!form.valid) {
			return fail(400, { form, action: 'createDraft' });
		}

		try {
			await createPurchaseDraft({
				orderNumber: form.data.orderNumber,
				freightAmount: form.data.freightAmount,
				lines: parsePurchaseLinesInput(form.data.lines)
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
			...message(form, 'Purchase draft created')
		};
	},
	post: async (event) => {
		const formData = await event.request.formData();
		const targetPurchaseOrderId = Number(formData.get('purchaseOrderId'));
		const form = await superValidate(formData, postPurchaseOrderAdapter, {
			id: createPostFormId(targetPurchaseOrderId)
		});

		if (!form.valid) {
			return fail(400, {
				action: 'post',
				targetPurchaseOrderId,
				postForm: form
			});
		}

		try {
			await postPurchaseOrder(form.data.purchaseOrderId);
		} catch (error) {
			const mapped = toActionErrorMessage(error);
			return fail(mapped.status, {
				action: 'post',
				targetPurchaseOrderId,
				postForm: setFormMessageError(form, mapped.message),
				message: mapped.message
			});
		}

		return {
			action: 'post',
			targetPurchaseOrderId,
			message: 'Purchase posted'
		};
	}
};
