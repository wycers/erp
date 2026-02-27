import { EntityId, AuditInfo } from '../../shared/value-objects'
import type { DomainEvent } from '../../shared/events'
import { SKU } from '../value-objects/sku'
import { Quantity } from '../value-objects/quantity'
import { Money, type Currency } from '../value-objects/money'
import { StockDepletedEvent } from '../events/stock-depleted.event'
import { StockAdjustedEvent, type StockAdjustmentReason } from '../events/stock-adjusted.event'

export interface ProductProps {
	id: EntityId
	sku: SKU
	name: string
	description?: string
	unitPrice: Money
	stockQuantity: Quantity
	reorderPoint: Quantity
	audit: AuditInfo
}

export interface CreateProductInput {
	sku: string
	name: string
	description?: string
	unitPrice: number
	currency?: Currency
	initialStock?: number
	reorderPoint?: number
}

export interface ReconstructProductInput {
	id: string
	sku: string
	name: string
	description?: string
	unitPrice: number
	currency: Currency
	stockQuantity: number
	reorderPoint: number
	createdAt: Date
	updatedAt: Date
}

export class Product {
	private _events: DomainEvent[] = []

	private constructor(private _props: ProductProps) {}

	static create(input: CreateProductInput): Product {
		return new Product({
			id: EntityId.generate(),
			sku: SKU.create(input.sku),
			name: input.name.trim(),
			description: input.description?.trim(),
			unitPrice: Money.create(input.unitPrice, input.currency ?? 'CNY'),
			stockQuantity: Quantity.create(input.initialStock ?? 0),
			reorderPoint: Quantity.create(input.reorderPoint ?? 10),
			audit: AuditInfo.create()
		})
	}

	static reconstitute(input: ReconstructProductInput): Product {
		return new Product({
			id: EntityId.create(input.id),
			sku: SKU.fromString(input.sku),
			name: input.name,
			description: input.description,
			unitPrice: Money.create(input.unitPrice, input.currency),
			stockQuantity: Quantity.create(input.stockQuantity),
			reorderPoint: Quantity.create(input.reorderPoint),
			audit: AuditInfo.reconstitute({
				createdAt: input.createdAt,
				updatedAt: input.updatedAt
			})
		})
	}

	adjustStock(delta: number, reason: StockAdjustmentReason, reference?: string): void {
		const previousQuantity = this._props.stockQuantity
		this._props.stockQuantity = this._props.stockQuantity.add(delta)
		this._props.audit = this._props.audit.markUpdated()

		this._events.push(
			new StockAdjustedEvent(
				this._props.id,
				previousQuantity,
				this._props.stockQuantity,
				reason,
				reference
			)
		)

		if (this._props.stockQuantity.isBelow(this._props.reorderPoint)) {
			this._events.push(
				new StockDepletedEvent(
					this._props.id,
					this._props.sku,
					this._props.stockQuantity,
					this._props.reorderPoint
				)
			)
		}
	}

	updateDetails(input: { name?: string; description?: string; unitPrice?: number }): void {
		if (input.name !== undefined) {
			this._props.name = input.name.trim()
		}
		if (input.description !== undefined) {
			this._props.description = input.description.trim() || undefined
		}
		if (input.unitPrice !== undefined) {
			this._props.unitPrice = Money.create(input.unitPrice, this._props.unitPrice.currency)
		}
		this._props.audit = this._props.audit.markUpdated()
	}

	setReorderPoint(value: number): void {
		this._props.reorderPoint = Quantity.create(value)
		this._props.audit = this._props.audit.markUpdated()
	}

	isLowStock(): boolean {
		return this._props.stockQuantity.isBelow(this._props.reorderPoint)
	}

	pullDomainEvents(): DomainEvent[] {
		const events = [...this._events]
		this._events = []
		return events
	}

	get id(): EntityId {
		return this._props.id
	}
	get sku(): SKU {
		return this._props.sku
	}
	get name(): string {
		return this._props.name
	}
	get description(): string | undefined {
		return this._props.description
	}
	get unitPrice(): Money {
		return this._props.unitPrice
	}
	get stockQuantity(): Quantity {
		return this._props.stockQuantity
	}
	get reorderPoint(): Quantity {
		return this._props.reorderPoint
	}
	get audit(): AuditInfo {
		return this._props.audit
	}
}
