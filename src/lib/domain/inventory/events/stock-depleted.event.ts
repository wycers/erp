import { BaseDomainEvent } from '../../shared/events'
import type { EntityId } from '../../shared/value-objects'
import type { SKU } from '../value-objects/sku'
import type { Quantity } from '../value-objects/quantity'

export class StockDepletedEvent extends BaseDomainEvent {
	readonly eventType = 'inventory.stock_depleted'

	constructor(
		public readonly productId: EntityId,
		public readonly sku: SKU,
		public readonly currentQuantity: Quantity,
		public readonly reorderPoint: Quantity
	) {
		super()
	}
}
