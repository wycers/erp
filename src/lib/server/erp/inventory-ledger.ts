import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	inventoryBalance,
	inventoryMovement,
	type inventorySourceTypeEnum
} from '$lib/server/db/schema';
import { calculateInboundAverage, calculateOutboundIssue } from './costing';
import { InventoryInsufficientError } from './errors';
import { assertNonNegative, assertPositive, round2, toDbNumeric, toNumber } from './math';

type InventorySourceType = (typeof inventorySourceTypeEnum.enumValues)[number];
type TransactionLike = Pick<typeof db, 'select' | 'insert' | 'update' | 'delete'>;

type SourceReference = {
	type: InventorySourceType;
	id: number;
	lineId?: number;
};

const getOrCreateBalance = async (tx: TransactionLike, inventoryItemId: number) => {
	const [existingBalance] = await tx
		.select()
		.from(inventoryBalance)
		.where(eq(inventoryBalance.inventoryItemId, inventoryItemId))
		.limit(1);

	if (existingBalance) {
		return existingBalance;
	}

	const [createdBalance] = await tx
		.insert(inventoryBalance)
		.values({
			inventoryItemId,
			quantity: '0.00',
			averageCost: '0.00'
		})
		.returning();

	return createdBalance;
};

export const postInboundMovement = async (
	tx: TransactionLike,
	params: {
		inventoryItemId: number;
		quantity: number;
		unitCost: number;
		source: SourceReference;
	}
) => {
	assertPositive('quantity', params.quantity);
	assertNonNegative('unitCost', params.unitCost);

	const balance = await getOrCreateBalance(tx, params.inventoryItemId);
	const currentQuantity = toNumber(balance.quantity);
	const currentAverageCost = toNumber(balance.averageCost);

	const next = calculateInboundAverage(
		currentQuantity,
		currentAverageCost,
		round2(params.quantity),
		round2(params.unitCost)
	);
	const totalCost = round2(params.quantity * params.unitCost);

	await tx
		.update(inventoryBalance)
		.set({
			quantity: toDbNumeric(next.quantity),
			averageCost: toDbNumeric(next.averageCost),
			updatedAt: new Date()
		})
		.where(eq(inventoryBalance.id, balance.id));

	await tx.insert(inventoryMovement).values({
		inventoryItemId: params.inventoryItemId,
		direction: 'IN',
		sourceType: params.source.type,
		sourceId: params.source.id,
		sourceLineId: params.source.lineId,
		quantity: toDbNumeric(params.quantity),
		unitCost: toDbNumeric(params.unitCost),
		totalCost: toDbNumeric(totalCost),
		balanceQuantity: toDbNumeric(next.quantity),
		balanceAverageCost: toDbNumeric(next.averageCost)
	});

	return {
		quantity: next.quantity,
		averageCost: next.averageCost,
		unitCost: round2(params.unitCost),
		totalCost
	};
};

export const postOutboundMovement = async (
	tx: TransactionLike,
	params: {
		inventoryItemId: number;
		quantity: number;
		source: SourceReference;
	}
) => {
	assertPositive('quantity', params.quantity);

	const balance = await getOrCreateBalance(tx, params.inventoryItemId);
	const currentQuantity = toNumber(balance.quantity);
	const currentAverageCost = toNumber(balance.averageCost);

	let next: ReturnType<typeof calculateOutboundIssue>;
	try {
		next = calculateOutboundIssue(currentQuantity, currentAverageCost, round2(params.quantity));
	} catch {
		throw new InventoryInsufficientError(
			`Inventory is insufficient for item ${params.inventoryItemId}; required ${toDbNumeric(params.quantity)}`
		);
	}

	await tx
		.update(inventoryBalance)
		.set({
			quantity: toDbNumeric(next.quantity),
			averageCost: toDbNumeric(next.averageCost),
			updatedAt: new Date()
		})
		.where(eq(inventoryBalance.id, balance.id));

	await tx.insert(inventoryMovement).values({
		inventoryItemId: params.inventoryItemId,
		direction: 'OUT',
		sourceType: params.source.type,
		sourceId: params.source.id,
		sourceLineId: params.source.lineId,
		quantity: toDbNumeric(params.quantity),
		unitCost: toDbNumeric(next.issueUnitCost),
		totalCost: toDbNumeric(next.issueTotalCost),
		balanceQuantity: toDbNumeric(next.quantity),
		balanceAverageCost: toDbNumeric(next.averageCost)
	});

	return {
		quantity: next.quantity,
		averageCost: next.averageCost,
		unitCost: next.issueUnitCost,
		totalCost: next.issueTotalCost
	};
};
