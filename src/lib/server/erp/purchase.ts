import { and, asc, eq, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { materialSku, purchaseOrder, purchaseOrderLine } from '$lib/server/db/schema';
import { computePurchaseLineCosts } from './costing';
import { ErpValidationError } from './errors';
import { postInboundMovement } from './inventory-ledger';
import { assertNonNegative, assertPositive, round2, toDbNumeric, toNumber } from './math';

export type PurchaseLineInput = {
	materialSkuId: number;
	quantity: number;
	lineAmount: number;
};

export const createPurchaseDraft = async (input: {
	orderNumber: string;
	freightAmount: number;
	lines: PurchaseLineInput[];
}) => {
	if (!input.orderNumber.trim()) {
		throw new ErpValidationError('Purchase order number is required');
	}

	assertNonNegative('freightAmount', input.freightAmount);
	if (input.lines.length === 0) {
		throw new ErpValidationError('Purchase order requires at least one line');
	}

	for (const line of input.lines) {
		assertPositive('quantity', line.quantity);
		assertNonNegative('lineAmount', line.lineAmount);
	}

	const computedLines = computePurchaseLineCosts(
		input.lines.map((line) => ({
			quantity: round2(line.quantity),
			lineAmount: round2(line.lineAmount)
		})),
		round2(input.freightAmount)
	);

	return db.transaction(async (tx) => {
		const materialIds = [...new Set(input.lines.map((line) => line.materialSkuId))];
		const materials = await tx
			.select({ id: materialSku.id })
			.from(materialSku)
			.where(and(inArray(materialSku.id, materialIds), eq(materialSku.isActive, true)));

		if (materials.length !== materialIds.length) {
			throw new ErpValidationError('Purchase contains material SKU that is missing or inactive');
		}

		const [header] = await tx
			.insert(purchaseOrder)
			.values({
				orderNumber: input.orderNumber.trim(),
				freightAmount: toDbNumeric(round2(input.freightAmount))
			})
			.returning();

		await tx.insert(purchaseOrderLine).values(
			input.lines.map((line, index) => {
				const computed = computedLines[index];
				return {
					purchaseOrderId: header.id,
					lineNo: index + 1,
					materialSkuId: line.materialSkuId,
					quantity: toDbNumeric(computed.quantity),
					lineAmount: toDbNumeric(computed.lineAmount),
					unitPrice: toDbNumeric(computed.unitPrice),
					allocatedFreight: toDbNumeric(computed.allocatedFreight),
					landedUnitCost: toDbNumeric(computed.landedUnitCost)
				};
			})
		);

		return header;
	});
};

export const postPurchaseOrder = async (purchaseOrderId: number) =>
	db.transaction(async (tx) => {
		const [header] = await tx
			.select()
			.from(purchaseOrder)
			.where(eq(purchaseOrder.id, purchaseOrderId))
			.limit(1);

		if (!header) {
			throw new ErpValidationError(`Purchase order ${purchaseOrderId} does not exist`);
		}

		if (header.status === 'POSTED') {
			throw new ErpValidationError(`Purchase order ${header.orderNumber} is already posted`);
		}

		const lines = await tx
			.select({
				id: purchaseOrderLine.id,
				lineNo: purchaseOrderLine.lineNo,
				materialSkuId: purchaseOrderLine.materialSkuId,
				quantity: purchaseOrderLine.quantity,
				lineAmount: purchaseOrderLine.lineAmount,
				inventoryItemId: materialSku.inventoryItemId
			})
			.from(purchaseOrderLine)
			.innerJoin(materialSku, eq(materialSku.id, purchaseOrderLine.materialSkuId))
			.where(eq(purchaseOrderLine.purchaseOrderId, purchaseOrderId))
			.orderBy(asc(purchaseOrderLine.lineNo));

		if (lines.length === 0) {
			throw new ErpValidationError('Purchase order requires at least one line to post');
		}

		const computedLines = computePurchaseLineCosts(
			lines.map((line) => ({
				quantity: toNumber(line.quantity),
				lineAmount: toNumber(line.lineAmount)
			})),
			toNumber(header.freightAmount)
		);

		for (let index = 0; index < lines.length; index += 1) {
			const line = lines[index];
			const computed = computedLines[index];

			await tx
				.update(purchaseOrderLine)
				.set({
					unitPrice: toDbNumeric(computed.unitPrice),
					allocatedFreight: toDbNumeric(computed.allocatedFreight),
					landedUnitCost: toDbNumeric(computed.landedUnitCost)
				})
				.where(eq(purchaseOrderLine.id, line.id));

			await postInboundMovement(tx, {
				inventoryItemId: line.inventoryItemId,
				quantity: computed.quantity,
				unitCost: computed.landedUnitCost,
				source: {
					type: 'PURCHASE',
					id: purchaseOrderId,
					lineId: line.id
				}
			});
		}

		const [posted] = await tx
			.update(purchaseOrder)
			.set({
				status: 'POSTED',
				postedAt: new Date(),
				updatedAt: new Date()
			})
			.where(eq(purchaseOrder.id, purchaseOrderId))
			.returning();

		return posted;
	});
