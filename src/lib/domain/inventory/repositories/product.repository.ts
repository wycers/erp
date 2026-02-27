import type { Product } from '../entities/product'
import type { EntityId } from '../../shared/value-objects'
import type { SKU } from '../value-objects/sku'

export interface ProductListOptions {
	limit?: number
	offset?: number
	lowStockOnly?: boolean
	searchTerm?: string
}

export interface ProductListResult {
	products: Product[]
	total: number
}

export interface ProductRepository {
	findById(id: EntityId): Promise<Product | null>
	findBySku(sku: SKU): Promise<Product | null>
	findAll(options?: ProductListOptions): Promise<ProductListResult>
	save(product: Product): Promise<void>
	delete(id: EntityId): Promise<void>
	exists(sku: SKU): Promise<boolean>
}
