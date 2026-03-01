import type { Product } from '$lib/domain/inventory/entities/product'
import type { Currency } from '$lib/domain/inventory/value-objects/money'

export interface ProductDTO {
	id: string
	sku: string
	name: string
	description?: string
	imageUrl?: string
	unitPrice: number
	currency: Currency
	stockQuantity: number
	reorderPoint: number
	isLowStock: boolean
	createdAt: string
	updatedAt: string
}

export function toProductDTO(product: Product): ProductDTO {
	return {
		id: product.id.value,
		sku: product.sku.value,
		name: product.name,
		description: product.description,
		imageUrl: product.imageUrl,
		unitPrice: product.unitPrice.amount,
		currency: product.unitPrice.currency,
		stockQuantity: product.stockQuantity.value,
		reorderPoint: product.reorderPoint.value,
		isLowStock: product.isLowStock(),
		createdAt: product.audit.createdAt.toISOString(),
		updatedAt: product.audit.updatedAt.toISOString()
	}
}

export interface ProductListDTO {
	products: ProductDTO[]
	total: number
	limit: number
	offset: number
}
