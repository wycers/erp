import type { ProductRepository } from '$lib/domain/inventory/repositories/product.repository'
import { type ProductListDTO, toProductDTO } from '../dto/product.dto'
import { type Result, ok, err } from '$lib/application/shared/result'

export interface ListProductsInput {
	limit?: number
	offset?: number
	lowStockOnly?: boolean
	searchTerm?: string
}

export class ListProductsQuery {
	constructor(private readonly productRepo: ProductRepository) {}

	async execute(input: ListProductsInput = {}): Promise<Result<ProductListDTO, string>> {
		try {
			const { limit = 20, offset = 0, lowStockOnly, searchTerm } = input

			const result = await this.productRepo.findAll({
				limit,
				offset,
				lowStockOnly,
				searchTerm
			})

			return ok({
				products: result.products.map(toProductDTO),
				total: result.total,
				limit,
				offset
			})
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to list products')
		}
	}
}
