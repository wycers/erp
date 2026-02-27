import type { OrderRepository } from '$lib/domain/orders/repositories/order.repository'
import type { OrderStatusValue } from '$lib/domain/orders/value-objects/order-status'
import { type OrderListDTO, toOrderDTO } from '../dto/order.dto'
import { type Result, ok, err } from '$lib/application/shared/result'

export interface ListOrdersInput {
	limit?: number
	offset?: number
	status?: OrderStatusValue
	customerId?: string
	searchTerm?: string
}

export class ListOrdersQuery {
	constructor(private readonly orderRepo: OrderRepository) {}

	async execute(input: ListOrdersInput = {}): Promise<Result<OrderListDTO, string>> {
		try {
			const { limit = 20, offset = 0, status, customerId, searchTerm } = input

			const result = await this.orderRepo.findAll({
				limit,
				offset,
				status,
				customerId,
				searchTerm
			})

			return ok({
				orders: result.orders.map(toOrderDTO),
				total: result.total,
				limit,
				offset
			})
		} catch (error) {
			if (error instanceof Error) {
				return err(error.message)
			}
			return err('Failed to list orders')
		}
	}
}
