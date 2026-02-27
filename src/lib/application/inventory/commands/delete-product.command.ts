import { EntityId } from '$lib/domain/shared/value-objects'
import type { ProductRepository } from '$lib/domain/inventory/repositories/product.repository'
import { type Result, ok, err } from '$lib/application/shared/result'

export interface DeleteProductInput {
	id: string
}

export class DeleteProductCommand {
	constructor(private readonly productRepo: ProductRepository) {}

	async execute(input: DeleteProductInput): Promise<Result<void, string>> {
		try {
			const entityId = EntityId.create(input.id)
			const product = await this.productRepo.findById(entityId)

			if (!product) {
				return err(`Product with ID "${input.id}" not found`)
			}

			await this.productRepo.delete(entityId)

			return ok(undefined)
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to delete product')
		}
	}
}
