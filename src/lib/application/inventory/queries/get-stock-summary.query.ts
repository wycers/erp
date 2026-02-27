import {
	StockLevelService,
	type StockLevelSummary
} from '$lib/domain/inventory/services/stock-level.service'
import type { ProductRepository } from '$lib/domain/inventory/repositories/product.repository'
import { type Result, ok, err } from '$lib/application/shared/result'

export class GetStockSummaryQuery {
	constructor(private readonly productRepo: ProductRepository) {}

	async execute(): Promise<Result<StockLevelSummary, string>> {
		try {
			const stockLevelService = new StockLevelService(this.productRepo)
			const summary = await stockLevelService.getSummary()
			return ok(summary)
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to get stock summary')
		}
	}
}
