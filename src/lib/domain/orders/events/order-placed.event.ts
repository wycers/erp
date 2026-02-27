import { BaseDomainEvent } from '../../shared/events'
import type { EntityId } from '../../shared/value-objects'
import type { Money } from '../../inventory/value-objects/money'

export class OrderPlacedEvent extends BaseDomainEvent {
	readonly eventType = 'orders.order_placed'

	constructor(
		public readonly orderId: EntityId,
		public readonly customerId: string,
		public readonly totalAmount: Money,
		public readonly itemCount: number
	) {
		super()
	}
}
