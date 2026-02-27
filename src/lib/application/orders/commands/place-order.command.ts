import { EntityId } from '$lib/domain/shared/value-objects'
import type { OrderRepository } from '$lib/domain/orders/repositories/order.repository'
import { type Result, ok, err } from '$lib/application/shared/result'

export interface PlaceOrderInput {
	orderId: string
}

export class PlaceOrderCommand {
	constructor(private readonly orderRepo: OrderRepository) {}

	async execute(input: PlaceOrderInput): Promise<Result<string, string>> {
		try {
			const order = await this.orderRepo.findById(EntityId.create(input.orderId))
			if (!order) {
				return err(`Order with ID "${input.orderId}" not found`)
			}

			order.place()
			await this.orderRepo.save(order)

			return ok(order.orderNumber)
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to place order')
		}
	}
}
