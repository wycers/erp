import { Product } from '$lib/domain/inventory/entities/product'
import { SKU } from '$lib/domain/inventory/value-objects/sku'
import type { ProductRepository } from '$lib/domain/inventory/repositories/product.repository'
import type { Currency } from '$lib/domain/inventory/value-objects/money'
import { type Result, ok, err } from '$lib/application/shared/result'

export interface CreateProductInput {
	sku: string
	name: string
	description?: string
	unitPrice: number
	currency?: Currency
	initialStock?: number
	reorderPoint?: number
}

export class CreateProductCommand {
	constructor(private readonly productRepo: ProductRepository) {}

	async execute(input: CreateProductInput): Promise<Result<string, string>> {
		try {
			const sku = SKU.create(input.sku)
			const exists = await this.productRepo.exists(sku)
			if (exists) {
				return err(`Product with SKU "${input.sku}" already exists`)
			}

			const product = Product.create({
				sku: input.sku,
				name: input.name,
				description: input.description,
				unitPrice: input.unitPrice,
				currency: input.currency,
				initialStock: input.initialStock,
				reorderPoint: input.reorderPoint
			})

			await this.productRepo.save(product)

			return ok(product.id.value)
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to create product')
		}
	}
}
