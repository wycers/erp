import { eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	finishedProduct,
	materialSku,
	productionOrder,
	purchaseOrder,
	salesShipment
} from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [materialRow] = await db.select({ count: sql<number>`count(*)` }).from(materialSku);
	const [productRow] = await db.select({ count: sql<number>`count(*)` }).from(finishedProduct);
	const [purchaseDraftRow] = await db
		.select({ count: sql<number>`count(*)` })
		.from(purchaseOrder)
		.where(eq(purchaseOrder.status, 'DRAFT'));
	const [productionDraftRow] = await db
		.select({ count: sql<number>`count(*)` })
		.from(productionOrder)
		.where(eq(productionOrder.status, 'DRAFT'));
	const [salesDraftRow] = await db
		.select({ count: sql<number>`count(*)` })
		.from(salesShipment)
		.where(eq(salesShipment.status, 'DRAFT'));

	return {
		materialCount: Number(materialRow.count),
		productCount: Number(productRow.count),
		purchaseDraftCount: Number(purchaseDraftRow.count),
		productionDraftCount: Number(productionDraftRow.count),
		salesDraftCount: Number(salesDraftRow.count)
	};
};
