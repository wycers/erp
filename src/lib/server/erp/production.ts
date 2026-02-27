import { and, asc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	finishedProduct,
	materialSku,
	productBom,
	productBomLine,
	productionOrder,
	productionOrderComponent
} from '$lib/server/db/schema';
import { ErpValidationError } from './errors';
import { postInboundMovement, postOutboundMovement } from './inventory-ledger';
import { assertPositive, round2, toDbNumeric, toNumber } from './math';

export const createProductionDraft = async (input: {
	orderNumber: string;
	productId: number;
	outputQuantity: number;
}) => {
	if (!input.orderNumber.trim()) {
		throw new ErpValidationError('Production order number is required');
	}
	assertPositive('outputQuantity', input.outputQuantity);

	const [product] = await db
		.select({ id: finishedProduct.id, isActive: finishedProduct.isActive })
		.from(finishedProduct)
		.where(eq(finishedProduct.id, input.productId))
		.limit(1);

	if (!product || !product.isActive) {
		throw new ErpValidationError('Production product is missing or inactive');
	}

	const [order] = await db
		.insert(productionOrder)
		.values({
			orderNumber: input.orderNumber.trim(),
			productId: input.productId,
			outputQuantity: toDbNumeric(round2(input.outputQuantity))
		})
		.returning();

	return order;
};

export const postProductionOrder = async (productionOrderId: number) =>
	db.transaction(async (tx) => {
		const [order] = await tx
			.select({
				id: productionOrder.id,
				orderNumber: productionOrder.orderNumber,
				status: productionOrder.status,
				productId: productionOrder.productId,
				outputQuantity: productionOrder.outputQuantity,
				productInventoryItemId: finishedProduct.inventoryItemId
			})
			.from(productionOrder)
			.innerJoin(finishedProduct, eq(finishedProduct.id, productionOrder.productId))
			.where(eq(productionOrder.id, productionOrderId))
			.limit(1);

		if (!order) {
			throw new ErpValidationError(`Production order ${productionOrderId} does not exist`);
		}

		if (order.status === 'POSTED') {
			throw new ErpValidationError(`Production order ${order.orderNumber} is already posted`);
		}

		const bomLines = await tx
			.select({
				id: productBomLine.id,
				lineNo: productBomLine.lineNo,
				materialSkuId: productBomLine.materialSkuId,
				quantityPerUnit: productBomLine.quantityPerUnit,
				materialInventoryItemId: materialSku.inventoryItemId
			})
			.from(productBom)
			.innerJoin(productBomLine, eq(productBomLine.bomId, productBom.id))
			.innerJoin(materialSku, eq(materialSku.id, productBomLine.materialSkuId))
			.where(and(eq(productBom.productId, order.productId), eq(productBom.isActive, true)))
			.orderBy(asc(productBomLine.lineNo));

		if (bomLines.length === 0) {
			throw new ErpValidationError('Cannot post production without active BOM lines');
		}

		await tx
			.delete(productionOrderComponent)
			.where(eq(productionOrderComponent.productionOrderId, productionOrderId));

		const outputQuantity = toNumber(order.outputQuantity);
		assertPositive('outputQuantity', outputQuantity);

		let totalConsumedCost = 0;
		const consumedComponents: {
			lineNo: number;
			materialSkuId: number;
			requiredQuantity: number;
			unitCost: number;
			totalCost: number;
		}[] = [];

		for (const bomLine of bomLines) {
			const requiredQuantity = round2(toNumber(bomLine.quantityPerUnit) * outputQuantity);
			assertPositive('requiredQuantity', requiredQuantity);

			const outbound = await postOutboundMovement(tx, {
				inventoryItemId: bomLine.materialInventoryItemId,
				quantity: requiredQuantity,
				source: {
					type: 'PRODUCTION_CONSUME',
					id: productionOrderId,
					lineId: bomLine.id
				}
			});

			totalConsumedCost = round2(totalConsumedCost + outbound.totalCost);
			consumedComponents.push({
				lineNo: bomLine.lineNo,
				materialSkuId: bomLine.materialSkuId,
				requiredQuantity,
				unitCost: outbound.unitCost,
				totalCost: outbound.totalCost
			});
		}

		const finishedUnitCost = round2(totalConsumedCost / outputQuantity);
		await postInboundMovement(tx, {
			inventoryItemId: order.productInventoryItemId,
			quantity: outputQuantity,
			unitCost: finishedUnitCost,
			source: {
				type: 'PRODUCTION_OUTPUT',
				id: productionOrderId
			}
		});

		await tx.insert(productionOrderComponent).values(
			consumedComponents.map((component) => {
				return {
					productionOrderId,
					lineNo: component.lineNo,
					materialSkuId: component.materialSkuId,
					requiredQuantity: toDbNumeric(component.requiredQuantity),
					unitCost: toDbNumeric(component.unitCost),
					totalCost: toDbNumeric(component.totalCost)
				};
			})
		);

		const [posted] = await tx
			.update(productionOrder)
			.set({
				status: 'POSTED',
				totalConsumedCost: toDbNumeric(totalConsumedCost),
				unitCost: toDbNumeric(finishedUnitCost),
				postedAt: new Date(),
				updatedAt: new Date()
			})
			.where(eq(productionOrder.id, productionOrderId))
			.returning();

		return posted;
	});
