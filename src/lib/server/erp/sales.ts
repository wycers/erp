import { and, asc, eq, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { finishedProduct, salesShipment, salesShipmentLine } from '$lib/server/db/schema';
import { calculateGrossMargin } from './costing';
import { ErpValidationError } from './errors';
import { postOutboundMovement } from './inventory-ledger';
import { assertNonNegative, assertPositive, round2, toDbNumeric, toNumber } from './math';

export type SalesLineInput = {
	productId: number;
	quantity: number;
	sellingUnitPrice: number;
};

export const createSalesDraft = async (input: {
	shipmentNumber: string;
	lines: SalesLineInput[];
}) => {
	if (!input.shipmentNumber.trim()) {
		throw new ErpValidationError('Shipment number is required');
	}

	if (input.lines.length === 0) {
		throw new ErpValidationError('Sales shipment requires at least one line');
	}

	for (const line of input.lines) {
		assertPositive('quantity', line.quantity);
		assertNonNegative('sellingUnitPrice', line.sellingUnitPrice);
	}

	return db.transaction(async (tx) => {
		const productIds = [...new Set(input.lines.map((line) => line.productId))];
		const products = await tx
			.select({ id: finishedProduct.id })
			.from(finishedProduct)
			.where(and(inArray(finishedProduct.id, productIds), eq(finishedProduct.isActive, true)));

		if (products.length !== productIds.length) {
			throw new ErpValidationError('Sales contains product that is missing or inactive');
		}

		const [header] = await tx
			.insert(salesShipment)
			.values({
				shipmentNumber: input.shipmentNumber.trim()
			})
			.returning();

		await tx.insert(salesShipmentLine).values(
			input.lines.map((line, index) => {
				const quantity = round2(line.quantity);
				const sellingUnitPrice = round2(line.sellingUnitPrice);
				const revenue = round2(quantity * sellingUnitPrice);
				return {
					salesShipmentId: header.id,
					lineNo: index + 1,
					productId: line.productId,
					quantity: toDbNumeric(quantity),
					sellingUnitPrice: toDbNumeric(sellingUnitPrice),
					revenue: toDbNumeric(revenue)
				};
			})
		);

		return header;
	});
};

export const postSalesShipment = async (salesShipmentId: number) =>
	db.transaction(async (tx) => {
		const [header] = await tx
			.select()
			.from(salesShipment)
			.where(eq(salesShipment.id, salesShipmentId))
			.limit(1);

		if (!header) {
			throw new ErpValidationError(`Sales shipment ${salesShipmentId} does not exist`);
		}

		if (header.status === 'POSTED') {
			throw new ErpValidationError(`Sales shipment ${header.shipmentNumber} is already posted`);
		}

		const lines = await tx
			.select({
				id: salesShipmentLine.id,
				lineNo: salesShipmentLine.lineNo,
				quantity: salesShipmentLine.quantity,
				sellingUnitPrice: salesShipmentLine.sellingUnitPrice,
				productInventoryItemId: finishedProduct.inventoryItemId
			})
			.from(salesShipmentLine)
			.innerJoin(finishedProduct, eq(finishedProduct.id, salesShipmentLine.productId))
			.where(eq(salesShipmentLine.salesShipmentId, salesShipmentId))
			.orderBy(asc(salesShipmentLine.lineNo));

		if (lines.length === 0) {
			throw new ErpValidationError('Sales shipment requires at least one line to post');
		}

		for (const line of lines) {
			const quantity = toNumber(line.quantity);
			const sellingUnitPrice = toNumber(line.sellingUnitPrice);
			const revenue = round2(quantity * sellingUnitPrice);

			const outbound = await postOutboundMovement(tx, {
				inventoryItemId: line.productInventoryItemId,
				quantity,
				source: {
					type: 'SALES',
					id: salesShipmentId,
					lineId: line.id
				}
			});

			const cogsTotal = round2(outbound.totalCost);
			const grossProfit = round2(revenue - cogsTotal);
			const grossMargin = calculateGrossMargin(revenue, grossProfit);

			await tx
				.update(salesShipmentLine)
				.set({
					revenue: toDbNumeric(revenue),
					cogsUnitCost: toDbNumeric(outbound.unitCost),
					cogsTotal: toDbNumeric(cogsTotal),
					grossProfit: toDbNumeric(grossProfit),
					grossMargin: toDbNumeric(grossMargin, 4)
				})
				.where(eq(salesShipmentLine.id, line.id));
		}

		const [posted] = await tx
			.update(salesShipment)
			.set({
				status: 'POSTED',
				postedAt: new Date(),
				updatedAt: new Date()
			})
			.where(eq(salesShipment.id, salesShipmentId))
			.returning();

		return posted;
	});
