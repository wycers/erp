import { Order } from '$lib/domain/orders/entities/order'
import type { OrderRepository } from '$lib/domain/orders/repositories/order.repository'
import type { AddressProps } from '$lib/domain/orders/value-objects/address'
import { type Result, ok, err } from '$lib/application/shared/result'

export interface CreateOrderInput {
	customerId: string
	customerName: string
	shippingAddress: AddressProps
	notes?: string
}

export class CreateOrderCommand {
	constructor(private readonly orderRepo: OrderRepository) {}

	async execute(input: CreateOrderInput): Promise<Result<string, string>> {
		try {
			const order = Order.create({
				customerId: input.customerId,
				customerName: input.customerName,
				shippingAddress: input.shippingAddress,
				notes: input.notes
			})

			await this.orderRepo.save(order)

			return ok(order.id.value)
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to create order')
		}
	}
}
