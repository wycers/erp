import type { Order } from '../entities/order'
import type { EntityId } from '../../shared/value-objects'
import type { OrderStatusValue } from '../value-objects/order-status'

export interface OrderListOptions {
	limit?: number
	offset?: number
	status?: OrderStatusValue
	customerId?: string
	searchTerm?: string
}

export interface OrderListResult {
	orders: Order[]
	total: number
}

export interface OrderRepository {
	findById(id: EntityId): Promise<Order | null>
	findByOrderNumber(orderNumber: string): Promise<Order | null>
	findAll(options?: OrderListOptions): Promise<OrderListResult>
	save(order: Order): Promise<void>
	delete(id: EntityId): Promise<void>
}
