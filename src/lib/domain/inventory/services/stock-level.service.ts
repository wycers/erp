import type { Product } from '../entities/product'
import type { ProductRepository } from '../repositories/product.repository'

export interface StockLevelSummary {
	totalProducts: number
	lowStockProducts: number
	outOfStockProducts: number
	totalStockValue: number
}

export class StockLevelService {
	constructor(private readonly productRepo: ProductRepository) {}

	async getSummary(): Promise<StockLevelSummary> {
		const { products } = await this.productRepo.findAll()

		let lowStockProducts = 0
		let outOfStockProducts = 0
		let totalStockValue = 0

		for (const product of products) {
			if (product.stockQuantity.isZero()) {
				outOfStockProducts++
			} else if (product.isLowStock()) {
				lowStockProducts++
			}
			totalStockValue += product.unitPrice.amount * product.stockQuantity.value
		}

		return {
			totalProducts: products.length,
			lowStockProducts,
			outOfStockProducts,
			totalStockValue
		}
	}

	async getLowStockProducts(): Promise<Product[]> {
		const { products } = await this.productRepo.findAll({ lowStockOnly: true })
		return products
	}
}
