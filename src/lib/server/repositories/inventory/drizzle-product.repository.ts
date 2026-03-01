import { eq, like, or, lt, sql } from 'drizzle-orm'
import { db } from '$lib/server/db'
import { products, type ProductRow } from '$lib/server/db/inventory.schema'
import { Product, type ReconstructProductInput } from '$lib/domain/inventory/entities/product'
import type {
	ProductRepository,
	ProductListOptions,
	ProductListResult
} from '$lib/domain/inventory/repositories/product.repository'
import type { EntityId } from '$lib/domain/shared/value-objects'
import type { SKU } from '$lib/domain/inventory/value-objects/sku'
import type { Currency } from '$lib/domain/inventory/value-objects/money'

export class DrizzleProductRepository implements ProductRepository {
	async findById(id: EntityId): Promise<Product | null> {
		const rows = await db.select().from(products).where(eq(products.id, id.value)).limit(1)

		if (rows.length === 0) {
			return null
		}

		return this.toDomain(rows[0])
	}

	async findBySku(sku: SKU): Promise<Product | null> {
		const rows = await db.select().from(products).where(eq(products.sku, sku.value)).limit(1)

		if (rows.length === 0) {
			return null
		}

		return this.toDomain(rows[0])
	}

	async findAll(options: ProductListOptions = {}): Promise<ProductListResult> {
		const { limit = 50, offset = 0, lowStockOnly, searchTerm } = options

		let query = db.select().from(products).$dynamic()

		const conditions = []

		if (lowStockOnly) {
			conditions.push(lt(products.stockQuantity, products.reorderPoint))
		}

		if (searchTerm) {
			const term = `%${searchTerm}%`
			conditions.push(or(like(products.name, term), like(products.sku, term)))
		}

		if (conditions.length > 0) {
			for (const condition of conditions) {
				query = query.where(condition)
			}
		}

		const [rows, countResult] = await Promise.all([
			query.limit(limit).offset(offset),
			db
				.select({ count: sql<number>`count(*)::int` })
				.from(products)
				.then((r) => r[0])
		])

		return {
			products: rows.map((row) => this.toDomain(row)),
			total: countResult?.count ?? 0
		}
	}

	async save(product: Product): Promise<void> {
		const row = this.toPersistence(product)

		await db
			.insert(products)
			.values(row)
			.onConflictDoUpdate({
				target: products.id,
				set: {
					name: row.name,
					description: row.description,
					imageUrl: row.imageUrl,
					unitPrice: row.unitPrice,
					currency: row.currency,
					stockQuantity: row.stockQuantity,
					reorderPoint: row.reorderPoint,
					updatedAt: new Date()
				}
			})
	}

	async delete(id: EntityId): Promise<void> {
		await db.delete(products).where(eq(products.id, id.value))
	}

	async exists(sku: SKU): Promise<boolean> {
		const rows = await db
			.select({ id: products.id })
			.from(products)
			.where(eq(products.sku, sku.value))
			.limit(1)

		return rows.length > 0
	}

	private toDomain(row: ProductRow): Product {
		const input: ReconstructProductInput = {
			id: row.id,
			sku: row.sku,
			name: row.name,
			description: row.description ?? undefined,
			imageUrl: row.imageUrl ?? undefined,
			unitPrice: parseFloat(row.unitPrice),
			currency: row.currency as Currency,
			stockQuantity: row.stockQuantity,
			reorderPoint: row.reorderPoint,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt
		}
		return Product.reconstitute(input)
	}

	private toPersistence(product: Product) {
		return {
			id: product.id.value,
			sku: product.sku.value,
			name: product.name,
			description: product.description ?? null,
			imageUrl: product.imageUrl ?? null,
			unitPrice: product.unitPrice.amount.toString(),
			currency: product.unitPrice.currency,
			stockQuantity: product.stockQuantity.value,
			reorderPoint: product.reorderPoint.value,
			createdAt: product.audit.createdAt,
			updatedAt: product.audit.updatedAt
		}
	}
}
