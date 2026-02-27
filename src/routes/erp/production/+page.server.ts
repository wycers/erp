import { asc, desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import {
	finishedProduct,
	materialSku,
	productionOrder,
	productionOrderComponent
} from '$lib/server/db/schema';
import { toErpActionFailure } from '$lib/server/erp/action-error';
import { toNumber } from '$lib/server/erp/math';
import { createProductionDraft, postProductionOrder } from '$lib/server/erp/production';

const getText = (formData: FormData, key: string): string =>
	formData.get(key)?.toString().trim() ?? '';

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

	return {
		products,
		orders: orders.map((order) => ({
			...order,
			components: componentMap.get(order.id) ?? []
		}))
	};
};

export const actions: Actions = {
	createDraft: async (event) => {
		const formData = await event.request.formData();
		try {
			await createProductionDraft({
				orderNumber: getText(formData, 'orderNumber'),
				productId: Number(formData.get('productId')),
				outputQuantity: toNumber(getText(formData, 'outputQuantity'))
			});
		} catch (error) {
			return toErpActionFailure(error);
		}
		return { message: 'Production draft created' };
	},
	post: async (event) => {
		const formData = await event.request.formData();
		try {
			await postProductionOrder(Number(formData.get('productionOrderId')));
		} catch (error) {
			return toErpActionFailure(error);
		}
		return { message: 'Production posted' };
	}
};
