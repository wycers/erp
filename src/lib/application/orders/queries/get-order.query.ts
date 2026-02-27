import { EntityId } from '$lib/domain/shared/value-objects'
import type { OrderRepository } from '$lib/domain/orders/repositories/order.repository'
import { type OrderDTO, toOrderDTO } from '../dto/order.dto'
import { type Result, ok, err } from '$lib/application/shared/result'

export interface GetOrderInput {
	id: string
}

export class GetOrderQuery {
	constructor(private readonly orderRepo: OrderRepository) {}

	async execute(input: GetOrderInput): Promise<Result<OrderDTO, string>> {
		try {
			const order = await this.orderRepo.findById(EntityId.create(input.id))

			if (!order) {
				return err(`Order with ID "${input.id}" not found`)
			}

			return ok(toOrderDTO(order))
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to get order')
		}
	}
}
