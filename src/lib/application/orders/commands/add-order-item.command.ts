import { EntityId } from '$lib/domain/shared/value-objects'
import type { OrderRepository } from '$lib/domain/orders/repositories/order.repository'
import type { ProductRepository } from '$lib/domain/inventory/repositories/product.repository'
import { type Result, ok, err } from '$lib/application/shared/result'

export interface AddOrderItemInput {
	orderId: string
	productId: string
	quantity: number
}

export class AddOrderItemCommand {
	constructor(
		private readonly orderRepo: OrderRepository,
		private readonly productRepo: ProductRepository
	) {}

	async execute(input: AddOrderItemInput): Promise<Result<void, string>> {
		try {
			const order = await this.orderRepo.findById(EntityId.create(input.orderId))
			if (!order) {
				return err(`Order with ID "${input.orderId}" not found`)
			}

			const product = await this.productRepo.findById(EntityId.create(input.productId))
			if (!product) {
				return err(`Product with ID "${input.productId}" not found`)
			}

			order.addItem({
				productId: product.id.value,
				productSku: product.sku.value,
				productName: product.name,
				unitPrice: product.unitPrice.amount,
				currency: product.unitPrice.currency,
				quantity: input.quantity
			})

			await this.orderRepo.save(order)

			return ok(undefined)
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to add item to order')
		}
	}
}
