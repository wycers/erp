import { EntityId } from '$lib/domain/shared/value-objects'
import type { ProductRepository } from '$lib/domain/inventory/repositories/product.repository'
import type { StockAdjustmentReason } from '$lib/domain/inventory/events/stock-adjusted.event'
import { type Result, ok, err } from '$lib/application/shared/result'

export interface AdjustStockInput {
	productId: string
	delta: number
	reason: StockAdjustmentReason
	reference?: string
}

export class AdjustStockCommand {
	constructor(private readonly productRepo: ProductRepository) {}

	async execute(input: AdjustStockInput): Promise<Result<number, string>> {
		try {
			const entityId = EntityId.create(input.productId)
			const product = await this.productRepo.findById(entityId)

			if (!product) {
				return err(`Product with ID "${input.productId}" not found`)
			}

			product.adjustStock(input.delta, input.reason, input.reference)
			await this.productRepo.save(product)

			return ok(product.stockQuantity.value)
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to adjust stock')
		}
	}
}
