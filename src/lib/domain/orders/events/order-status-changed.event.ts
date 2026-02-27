import { BaseDomainEvent } from '../../shared/events'
import type { EntityId } from '../../shared/value-objects'
import type { OrderStatusValue } from '../value-objects/order-status'

export class OrderStatusChangedEvent extends BaseDomainEvent {
	readonly eventType = 'orders.order_status_changed'

	constructor(
		public readonly orderId: EntityId,
		public readonly previousStatus: OrderStatusValue,
		public readonly newStatus: OrderStatusValue
	) {
		super()
	}
}
