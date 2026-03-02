import { asc, desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import {
	createProductionDraftFormSchema,
	postProductionOrderFormSchema
} from '$lib/application/erp/schemas';
import { db } from '$lib/server/db';
import {
	finishedProduct,
	materialSku,
	productionOrder,
	productionOrderComponent
} from '$lib/server/db/schema';
import { createProductionDraft, postProductionOrder } from '$lib/server/erp/production';
import { setFormMessageError, toActionErrorMessage } from '$lib/server/erp/superforms-action';

const createProductionDraftAdapter = zod4(createProductionDraftFormSchema);
const postProductionOrderAdapter = zod4(postProductionOrderFormSchema);

const createPostFormId = (productionOrderId: number): string =>
	`production-post-${productionOrderId}`;

export const load: PageServerLoad = async () => {
	const [products, orders, components] = await Promise.all([
		db.select().from(finishedProduct).orderBy(asc(finishedProduct.code)),
		db
			.select({
				id: productionOrder.id,
				orderNumber: productionOrder.orderNumber,
				productId: productionOrder.productId,
				productCode: finishedProduct.code,
				productName: finishedProduct.name,
				outputQuantity: productionOrder.outputQuantity,
				status: productionOrder.status,
				totalConsumedCost: productionOrder.totalConsumedCost,
				unitCost: productionOrder.unitCost,
				createdAt: productionOrder.createdAt
			})
			.from(productionOrder)
			.innerJoin(finishedProduct, eq(finishedProduct.id, productionOrder.productId))
			.orderBy(desc(productionOrder.id)),
		db
			.select({
				productionOrderId: productionOrderComponent.productionOrderId,
				lineNo: productionOrderComponent.lineNo,
				materialSkuId: productionOrderComponent.materialSkuId,
				materialCode: materialSku.code,
				materialName: materialSku.name,
				requiredQuantity: productionOrderComponent.requiredQuantity,
				unitCost: productionOrderComponent.unitCost,
				totalCost: productionOrderComponent.totalCost
			})
			.from(productionOrderComponent)
			.innerJoin(materialSku, eq(materialSku.id, productionOrderComponent.materialSkuId))
			.orderBy(productionOrderComponent.productionOrderId, productionOrderComponent.lineNo)
	]);

	const componentMap = new Map<number, typeof components>();
	for (const component of components) {
		const current = componentMap.get(component.productionOrderId) ?? [];
		current.push(component);
		componentMap.set(component.productionOrderId, current);
	}

	const ordersWithComponents = orders.map((order) => ({
		...order,
		components: componentMap.get(order.id) ?? []
	}));

	const createDraftForm = await superValidate(
		{
			orderNumber: '',
			productId: products[0]?.id ?? 0,
			outputQuantity: 1
		},
		createProductionDraftAdapter
	);

	const postForms = await Promise.all(
		ordersWithComponents.map((order) =>
			superValidate(
				{
					productionOrderId: order.id
				},
				postProductionOrderAdapter,
				{
					id: createPostFormId(order.id)
				}
			)
		)
	);

	return {
		products,
		orders: ordersWithComponents,
		createDraftForm,
		postForms
	};
};

export const actions: Actions = {
	createDraft: async (event) => {
		const form = await superValidate(event.request, createProductionDraftAdapter);
		if (!form.valid) {
			return fail(400, { form, action: 'createDraft' });
		}

		try {
			await createProductionDraft({
				orderNumber: form.data.orderNumber,
				productId: form.data.productId,
				outputQuantity: form.data.outputQuantity
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
			...message(form, 'Production draft created')
		};
	},
	post: async (event) => {
		const formData = await event.request.formData();
		const targetProductionOrderId = Number(formData.get('productionOrderId'));
		const form = await superValidate(formData, postProductionOrderAdapter, {
			id: createPostFormId(targetProductionOrderId)
		});

		if (!form.valid) {
			return fail(400, {
				action: 'post',
				targetProductionOrderId,
				postForm: form
			});
		}

		try {
			await postProductionOrder(form.data.productionOrderId);
		} catch (error) {
			const mapped = toActionErrorMessage(error);
			return fail(mapped.status, {
				action: 'post',
				targetProductionOrderId,
				postForm: setFormMessageError(form, mapped.message),
				message: mapped.message
			});
		}

		return {
			action: 'post',
			targetProductionOrderId,
			message: 'Production posted'
		};
	}
};
