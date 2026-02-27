import { EntityId } from '$lib/domain/shared/value-objects'
import type { ProductRepository } from '$lib/domain/inventory/repositories/product.repository'
import { type ProductDTO, toProductDTO } from '../dto/product.dto'
import { type Result, ok, err } from '$lib/application/shared/result'

export interface GetProductInput {
	id: string
}

export class GetProductQuery {
	constructor(private readonly productRepo: ProductRepository) {}

	async execute(input: GetProductInput): Promise<Result<ProductDTO, string>> {
		try {
			const entityId = EntityId.create(input.id)
			const product = await this.productRepo.findById(entityId)

			if (!product) {
				return err(`Product with ID "${input.id}" not found`)
			}

			return ok(toProductDTO(product))
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to get product')
		}
	}
}
