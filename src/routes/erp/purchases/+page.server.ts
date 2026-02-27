import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { materialSku, purchaseOrder, purchaseOrderLine } from '$lib/server/db/schema';
import { toErpActionFailure } from '$lib/server/erp/action-error';
import { parsePurchaseLinesInput } from '$lib/server/erp/line-parser';
import { toNumber } from '$lib/server/erp/math';
import { createPurchaseDraft, postPurchaseOrder } from '$lib/server/erp/purchase';

const getText = (formData: FormData, key: string): string =>
	formData.get(key)?.toString().trim() ?? '';

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

	return {
		materials,
		orders: orders.map((order) => ({
			...order,
			lines: lineMap.get(order.id) ?? []
		}))
	};
};

export const actions: Actions = {
	createDraft: async (event) => {
		const formData = await event.request.formData();
		try {
			await createPurchaseDraft({
				orderNumber: getText(formData, 'orderNumber'),
				freightAmount: toNumber(getText(formData, 'freightAmount')),
				lines: parsePurchaseLinesInput(getText(formData, 'lines'))
			});
		} catch (error) {
			return toErpActionFailure(error);
		}
		return { message: 'Purchase draft created' };
	},
	post: async (event) => {
		const formData = await event.request.formData();
		try {
			await postPurchaseOrder(Number(formData.get('purchaseOrderId')));
		} catch (error) {
			return toErpActionFailure(error);
		}
		return { message: 'Purchase posted' };
	}
};
