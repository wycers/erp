import { asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	finishedProduct,
	inventoryBalance,
	inventoryItem,
	inventoryMovement,
	materialSku,
	productionOrder,
	purchaseOrder,
	salesShipment
} from '$lib/server/db/schema';
import { ErpValidationError } from './errors';
import { toNumber } from './math';

export type InventoryOverviewRow = {
	inventoryItemId: number;
	kind: 'MATERIAL' | 'PRODUCT';
	entityId: number;
	code: string;
	name: string;
	note: string | null;
	imageUrl: string | null;
	quantity: number;
	averageCost: number;
};

export const listInventoryOverview = async (): Promise<InventoryOverviewRow[]> => {
	const materialRows = await db
		.select({
			inventoryItemId: materialSku.inventoryItemId,
			entityId: materialSku.id,
			code: materialSku.code,
			name: materialSku.name,
			note: materialSku.note,
			imageUrl: materialSku.imageUrl,
			quantity: inventoryBalance.quantity,
			averageCost: inventoryBalance.averageCost
		})
		.from(materialSku)
		.innerJoin(inventoryItem, eq(inventoryItem.id, materialSku.inventoryItemId))
		.leftJoin(inventoryBalance, eq(inventoryBalance.inventoryItemId, materialSku.inventoryItemId))
		.orderBy(asc(materialSku.code));

	const productRows = await db
		.select({
			inventoryItemId: finishedProduct.inventoryItemId,
			entityId: finishedProduct.id,
			code: finishedProduct.code,
			name: finishedProduct.name,
			note: finishedProduct.note,
			imageUrl: sql<string | null>`null`,
			quantity: inventoryBalance.quantity,
			averageCost: inventoryBalance.averageCost
		})
		.from(finishedProduct)
		.innerJoin(inventoryItem, eq(inventoryItem.id, finishedProduct.inventoryItemId))
		.leftJoin(
			inventoryBalance,
			eq(inventoryBalance.inventoryItemId, finishedProduct.inventoryItemId)
		)
		.orderBy(asc(finishedProduct.code));

	const rows: InventoryOverviewRow[] = [
		...materialRows.map((row) => ({
			inventoryItemId: Number(row.inventoryItemId),
			kind: 'MATERIAL' as const,
			entityId: Number(row.entityId),
			code: row.code,
			name: row.name,
			note: row.note,
			imageUrl: row.imageUrl,
			quantity: toNumber(row.quantity),
			averageCost: toNumber(row.averageCost)
		})),
		...productRows.map((row) => ({
			inventoryItemId: Number(row.inventoryItemId),
			kind: 'PRODUCT' as const,
			entityId: Number(row.entityId),
			code: row.code,
			name: row.name,
			note: row.note,
			imageUrl: row.imageUrl,
			quantity: toNumber(row.quantity),
			averageCost: toNumber(row.averageCost)
		}))
	];

	return rows.sort((a, b) => a.code.localeCompare(b.code));
};

export const getInventoryItemDetail = async (inventoryItemId: number) => {
	const [material] = await db
		.select({
			inventoryItemId: materialSku.inventoryItemId,
			entityId: materialSku.id,
			code: materialSku.code,
			name: materialSku.name,
			note: materialSku.note,
			imageUrl: materialSku.imageUrl,
			quantity: inventoryBalance.quantity,
			averageCost: inventoryBalance.averageCost
		})
		.from(materialSku)
		.innerJoin(inventoryItem, eq(inventoryItem.id, materialSku.inventoryItemId))
		.leftJoin(inventoryBalance, eq(inventoryBalance.inventoryItemId, materialSku.inventoryItemId))
		.where(eq(materialSku.inventoryItemId, inventoryItemId))
		.limit(1);

	if (material) {
		return {
			inventoryItemId: Number(material.inventoryItemId),
			kind: 'MATERIAL' as const,
			entityId: Number(material.entityId),
			code: material.code,
			name: material.name,
			note: material.note,
			imageUrl: material.imageUrl,
			quantity: toNumber(material.quantity),
			averageCost: toNumber(material.averageCost)
		};
	}

	const [product] = await db
		.select({
			inventoryItemId: finishedProduct.inventoryItemId,
			entityId: finishedProduct.id,
			code: finishedProduct.code,
			name: finishedProduct.name,
			note: finishedProduct.note,
			imageUrl: sql<string | null>`null`,
			quantity: inventoryBalance.quantity,
			averageCost: inventoryBalance.averageCost
		})
		.from(finishedProduct)
		.innerJoin(inventoryItem, eq(inventoryItem.id, finishedProduct.inventoryItemId))
		.leftJoin(
			inventoryBalance,
			eq(inventoryBalance.inventoryItemId, finishedProduct.inventoryItemId)
		)
		.where(eq(finishedProduct.inventoryItemId, inventoryItemId))
		.limit(1);

	if (product) {
		return {
			inventoryItemId: Number(product.inventoryItemId),
			kind: 'PRODUCT' as const,
			entityId: Number(product.entityId),
			code: product.code,
			name: product.name,
			note: product.note,
			imageUrl: product.imageUrl,
			quantity: toNumber(product.quantity),
			averageCost: toNumber(product.averageCost)
		};
	}

	throw new ErpValidationError(`Inventory item ${inventoryItemId} does not exist`);
};

export const listInventoryMovements = async (inventoryItemId: number) => {
	const movements = await db
		.select()
		.from(inventoryMovement)
		.where(eq(inventoryMovement.inventoryItemId, inventoryItemId))
		.orderBy(desc(inventoryMovement.createdAt), desc(inventoryMovement.id));

	const purchaseIds = [
		...new Set(movements.filter((m) => m.sourceType === 'PURCHASE').map((m) => m.sourceId))
	];
	const productionIds = [
		...new Set(
			movements
				.filter(
					(m) => m.sourceType === 'PRODUCTION_CONSUME' || m.sourceType === 'PRODUCTION_OUTPUT'
				)
				.map((m) => m.sourceId)
		)
	];
	const salesIds = [
		...new Set(movements.filter((m) => m.sourceType === 'SALES').map((m) => m.sourceId))
	];

	const purchaseMap = new Map<number, string>();
	if (purchaseIds.length > 0) {
		const rows = await db
			.select({ id: purchaseOrder.id, number: purchaseOrder.orderNumber })
			.from(purchaseOrder)
			.where(inArray(purchaseOrder.id, purchaseIds));
		for (const row of rows) {
			purchaseMap.set(row.id, row.number);
		}
	}

	const productionMap = new Map<number, string>();
	if (productionIds.length > 0) {
		const rows = await db
			.select({ id: productionOrder.id, number: productionOrder.orderNumber })
			.from(productionOrder)
			.where(inArray(productionOrder.id, productionIds));
		for (const row of rows) {
			productionMap.set(row.id, row.number);
		}
	}

	const salesMap = new Map<number, string>();
	if (salesIds.length > 0) {
		const rows = await db
			.select({ id: salesShipment.id, number: salesShipment.shipmentNumber })
			.from(salesShipment)
			.where(inArray(salesShipment.id, salesIds));
		for (const row of rows) {
			salesMap.set(row.id, row.number);
		}
	}

	return movements.map((movement) => {
		const sourceNumber =
			movement.sourceType === 'PURCHASE'
				? purchaseMap.get(movement.sourceId)
				: movement.sourceType === 'SALES'
					? salesMap.get(movement.sourceId)
					: productionMap.get(movement.sourceId);

		return {
			id: movement.id,
			direction: movement.direction,
			sourceType: movement.sourceType,
			sourceId: movement.sourceId,
			sourceLineId: movement.sourceLineId,
			sourceNumber: sourceNumber ?? String(movement.sourceId),
			quantity: toNumber(movement.quantity),
			unitCost: toNumber(movement.unitCost),
			totalCost: toNumber(movement.totalCost),
			balanceQuantity: toNumber(movement.balanceQuantity),
			balanceAverageCost: toNumber(movement.balanceAverageCost),
			createdAt: movement.createdAt
		};
	});
};
