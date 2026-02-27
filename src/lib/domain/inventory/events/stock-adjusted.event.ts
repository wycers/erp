import { BaseDomainEvent } from '../../shared/events'
import type { EntityId } from '../../shared/value-objects'
import type { Quantity } from '../value-objects/quantity'

export type StockAdjustmentReason = 'receipt' | 'shipment' | 'adjustment' | 'return' | 'damage'

export class StockAdjustedEvent extends BaseDomainEvent {
	readonly eventType = 'inventory.stock_adjusted'

	constructor(
		public readonly productId: EntityId,
		public readonly previousQuantity: Quantity,
		public readonly newQuantity: Quantity,
		public readonly reason: StockAdjustmentReason,
		public readonly reference?: string
	) {
		super()
	}

	get delta(): number {
		return this.newQuantity.value - this.previousQuantity.value
	}
}
