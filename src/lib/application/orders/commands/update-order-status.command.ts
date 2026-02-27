import { EntityId } from '$lib/domain/shared/value-objects'
import type { OrderRepository } from '$lib/domain/orders/repositories/order.repository'
import type { OrderStatusValue } from '$lib/domain/orders/value-objects/order-status'
import { type Result, ok, err } from '$lib/application/shared/result'

export interface UpdateOrderStatusInput {
	orderId: string
	action: 'confirm' | 'process' | 'ship' | 'deliver' | 'cancel'
}

export class UpdateOrderStatusCommand {
	constructor(private readonly orderRepo: OrderRepository) {}

	async execute(input: UpdateOrderStatusInput): Promise<Result<OrderStatusValue, string>> {
		try {
			const order = await this.orderRepo.findById(EntityId.create(input.orderId))
			if (!order) {
				return err(`Order with ID "${input.orderId}" not found`)
			}

			switch (input.action) {
				case 'confirm':
					order.confirm()
					break
				case 'process':
					order.startProcessing()
					break
				case 'ship':
					order.ship()
					break
				case 'deliver':
					order.deliver()
					break
				case 'cancel':
					order.cancel()
					break
			}

			await this.orderRepo.save(order)

			return ok(order.status.value)
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to update order status')
		}
	}
}
