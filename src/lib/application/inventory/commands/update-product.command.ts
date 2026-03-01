import { EntityId } from '$lib/domain/shared/value-objects'
import type { ProductRepository } from '$lib/domain/inventory/repositories/product.repository'
import { type Result, ok, err } from '$lib/application/shared/result'

export interface UpdateProductInput {
	id: string
	name?: string
	description?: string
	imageUrl?: string
	unitPrice?: number
	reorderPoint?: number
}

export class UpdateProductCommand {
	constructor(private readonly productRepo: ProductRepository) {}

	async execute(input: UpdateProductInput): Promise<Result<void, string>> {
		try {
			const entityId = EntityId.create(input.id)
			const product = await this.productRepo.findById(entityId)

			if (!product) {
				return err(`Product with ID "${input.id}" not found`)
			}

			product.updateDetails({
				name: input.name,
				description: input.description,
				imageUrl: input.imageUrl,
				unitPrice: input.unitPrice
			})

			if (input.reorderPoint !== undefined) {
				product.setReorderPoint(input.reorderPoint)
			}

			await this.productRepo.save(product)

			return ok(undefined)
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to update product')
		}
	}
}
