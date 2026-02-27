import { and, eq, inArray, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	finishedProduct,
	inventoryBalance,
	inventoryItem,
	materialSku,
	productBom,
	productBomLine
} from '$lib/server/db/schema';
import { ErpValidationError } from './errors';
import { assertPositive, round2, toDbNumeric } from './math';

export type BomLineInput = {
	materialSkuId: number;
	quantityPerUnit: number;
};

export const listMaterials = async () =>
	db.select().from(materialSku).orderBy(asc(materialSku.code), asc(materialSku.id));

export const listProducts = async () =>
	db.select().from(finishedProduct).orderBy(asc(finishedProduct.code), asc(finishedProduct.id));

export const createMaterial = async (input: {
	code: string;
	name: string;
	imageUrl?: string;
	note?: string;
}) => {
	if (!input.code.trim() || !input.name.trim()) {
		throw new ErpValidationError('Material code and name are required');
	}

	return db.transaction(async (tx) => {
		const [item] = await tx
			.insert(inventoryItem)
			.values({
				kind: 'MATERIAL'
			})
			.returning();

		const [material] = await tx
			.insert(materialSku)
			.values({
				inventoryItemId: item.id,
				code: input.code.trim(),
				name: input.name.trim(),
				imageUrl: input.imageUrl?.trim() || null,
				note: input.note?.trim() || null
			})
			.returning();

		await tx.insert(inventoryBalance).values({
			inventoryItemId: item.id,
			quantity: '0.00',
			averageCost: '0.00'
		});

		return material;
	});
};

export const updateMaterial = async (input: {
	id: number;
	code: string;
	name: string;
	imageUrl?: string;
	note?: string;
	isActive: boolean;
}) => {
	if (!input.code.trim() || !input.name.trim()) {
		throw new ErpValidationError('Material code and name are required');
	}

	const [updated] = await db
		.update(materialSku)
		.set({
			code: input.code.trim(),
			name: input.name.trim(),
			imageUrl: input.imageUrl?.trim() || null,
			note: input.note?.trim() || null,
			isActive: input.isActive,
			updatedAt: new Date()
		})
		.where(eq(materialSku.id, input.id))
		.returning();

	if (!updated) {
		throw new ErpValidationError(`Material ${input.id} does not exist`);
	}

	return updated;
};

export const createProduct = async (input: { code: string; name: string; note?: string }) => {
	if (!input.code.trim() || !input.name.trim()) {
		throw new ErpValidationError('Product code and name are required');
	}

	return db.transaction(async (tx) => {
		const [item] = await tx
			.insert(inventoryItem)
			.values({
				kind: 'PRODUCT'
			})
			.returning();

		const [product] = await tx
			.insert(finishedProduct)
			.values({
				inventoryItemId: item.id,
				code: input.code.trim(),
				name: input.name.trim(),
				note: input.note?.trim() || null
			})
			.returning();

		await tx.insert(inventoryBalance).values({
			inventoryItemId: item.id,
			quantity: '0.00',
			averageCost: '0.00'
		});

		return product;
	});
};

export const updateProduct = async (input: {
	id: number;
	code: string;
	name: string;
	note?: string;
	isActive: boolean;
}) => {
	if (!input.code.trim() || !input.name.trim()) {
		throw new ErpValidationError('Product code and name are required');
	}

	const [updated] = await db
		.update(finishedProduct)
		.set({
			code: input.code.trim(),
			name: input.name.trim(),
			note: input.note?.trim() || null,
			isActive: input.isActive,
			updatedAt: new Date()
		})
		.where(eq(finishedProduct.id, input.id))
		.returning();

	if (!updated) {
		throw new ErpValidationError(`Product ${input.id} does not exist`);
	}

	return updated;
};

export const listProductBoms = async () => {
	const rows = await db
		.select({
			productId: productBom.productId,
			bomId: productBom.id,
			materialSkuId: productBomLine.materialSkuId,
			lineNo: productBomLine.lineNo,
			quantityPerUnit: productBomLine.quantityPerUnit
		})
		.from(productBom)
		.leftJoin(productBomLine, eq(productBomLine.bomId, productBom.id))
		.orderBy(asc(productBom.productId), asc(productBomLine.lineNo));

	const byProduct = new Map<number, BomLineInput[]>();

	for (const row of rows) {
		if (!row.materialSkuId || !row.quantityPerUnit) {
			continue;
		}
		const current = byProduct.get(row.productId) ?? [];
		current.push({
			materialSkuId: row.materialSkuId,
			quantityPerUnit: Number(row.quantityPerUnit)
		});
		byProduct.set(row.productId, current);
	}

	return byProduct;
};

export const saveFixedBom = async (input: { productId: number; lines: BomLineInput[] }) => {
	if (input.lines.length === 0) {
		throw new ErpValidationError('BOM requires at least one material line');
	}

	for (const line of input.lines) {
		assertPositive('BOM quantity', line.quantityPerUnit);
	}

	const dedupedMaterialIds = [...new Set(input.lines.map((line) => line.materialSkuId))];
	if (dedupedMaterialIds.length !== input.lines.length) {
		throw new ErpValidationError('BOM cannot contain duplicate material SKU lines');
	}

	return db.transaction(async (tx) => {
		const [product] = await tx
			.select()
			.from(finishedProduct)
			.where(eq(finishedProduct.id, input.productId))
			.limit(1);

		if (!product) {
			throw new ErpValidationError(`Product ${input.productId} does not exist`);
		}

		const materials = await tx
			.select({ id: materialSku.id })
			.from(materialSku)
			.where(and(inArray(materialSku.id, dedupedMaterialIds), eq(materialSku.isActive, true)));

		if (materials.length !== dedupedMaterialIds.length) {
			throw new ErpValidationError('BOM contains material SKU that is missing or inactive');
		}

		const [existingBom] = await tx
			.select()
			.from(productBom)
			.where(eq(productBom.productId, input.productId))
			.limit(1);

		const now = new Date();
		const bomId =
			existingBom?.id ??
			(
				await tx
					.insert(productBom)
					.values({
						productId: input.productId,
						isActive: true
					})
					.returning()
			)[0].id;

		if (existingBom) {
			await tx
				.update(productBom)
				.set({
					isActive: true,
					updatedAt: now
				})
				.where(eq(productBom.id, bomId));
		}

		await tx.delete(productBomLine).where(eq(productBomLine.bomId, bomId));
		await tx.insert(productBomLine).values(
			input.lines.map((line, index) => ({
				bomId,
				lineNo: index + 1,
				materialSkuId: line.materialSkuId,
				quantityPerUnit: toDbNumeric(round2(line.quantityPerUnit))
			}))
		);
	});
};
