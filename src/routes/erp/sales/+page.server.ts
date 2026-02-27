import { asc, desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { finishedProduct, salesShipment, salesShipmentLine } from '$lib/server/db/schema';
import { toErpActionFailure } from '$lib/server/erp/action-error';
import { parseSalesLinesInput } from '$lib/server/erp/line-parser';
import { createSalesDraft, postSalesShipment } from '$lib/server/erp/sales';

const getText = (formData: FormData, key: string): string =>
	formData.get(key)?.toString().trim() ?? '';

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

	return {
		products,
		shipments: shipments.map((shipment) => ({
			...shipment,
			lines: lineMap.get(shipment.id) ?? []
		}))
	};
};

export const actions: Actions = {
	createDraft: async (event) => {
		const formData = await event.request.formData();
		try {
			await createSalesDraft({
				shipmentNumber: getText(formData, 'shipmentNumber'),
				lines: parseSalesLinesInput(getText(formData, 'lines'))
			});
		} catch (error) {
			return toErpActionFailure(error);
		}
		return { message: 'Sales draft created' };
	},
	post: async (event) => {
		const formData = await event.request.formData();
		try {
			await postSalesShipment(Number(formData.get('salesShipmentId')));
		} catch (error) {
			return toErpActionFailure(error);
		}
		return { message: 'Sales posted' };
	}
};
