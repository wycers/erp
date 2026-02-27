import { EntityId, AuditInfo } from '../../shared/value-objects'
import type { DomainEvent } from '../../shared/events'
import { InvariantViolationError } from '../../shared/errors'
import { Money, type Currency } from '../../inventory/value-objects/money'
import { OrderStatus, type OrderStatusValue } from '../value-objects/order-status'
import { Address, type AddressProps } from '../value-objects/address'
import { OrderItem, type CreateOrderItemInput } from './order-item'
import { OrderPlacedEvent } from '../events/order-placed.event'
import { OrderStatusChangedEvent } from '../events/order-status-changed.event'

export interface OrderProps {
	id: EntityId
	orderNumber: string
	customerId: string
	customerName: string
	status: OrderStatus
	items: OrderItem[]
	shippingAddress: Address
	notes?: string
	audit: AuditInfo
}

export interface CreateOrderInput {
	customerId: string
	customerName: string
	shippingAddress: AddressProps
	notes?: string
}

export class Order {
	private _events: DomainEvent[] = []
	private static orderCounter = 0

	private constructor(private _props: OrderProps) {}

	static create(input: CreateOrderInput): Order {
		const orderNumber = Order.generateOrderNumber()

		return new Order({
			id: EntityId.generate(),
			orderNumber,
			customerId: input.customerId,
			customerName: input.customerName,
			status: OrderStatus.draft(),
			items: [],
			shippingAddress: Address.create(input.shippingAddress),
			notes: input.notes?.trim(),
			audit: AuditInfo.create()
		})
	}

	static reconstitute(props: {
		id: string
		orderNumber: string
		customerId: string
		customerName: string
		status: OrderStatusValue
		items: Array<{
			id: string
			productId: string
			productSku: string
			productName: string
			unitPrice: number
			currency: Currency
			quantity: number
		}>
		shippingAddress: AddressProps
		notes?: string
		createdAt: Date
		updatedAt: Date
	}): Order {
		return new Order({
			id: EntityId.create(props.id),
			orderNumber: props.orderNumber,
			customerId: props.customerId,
			customerName: props.customerName,
			status: OrderStatus.create(props.status),
			items: props.items.map((item) => OrderItem.reconstitute(item)),
			shippingAddress: Address.create(props.shippingAddress),
			notes: props.notes,
			audit: AuditInfo.reconstitute({
				createdAt: props.createdAt,
				updatedAt: props.updatedAt
			})
		})
	}

	private static generateOrderNumber(): string {
		const date = new Date()
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const random = Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, '0')
		return `ORD-${year}${month}${day}-${random}`
	}

	addItem(input: CreateOrderItemInput): void {
		if (!this._props.status.isDraft()) {
			throw new InvariantViolationError('Cannot add items to a non-draft order')
		}

		const existingItem = this._props.items.find(
			(item) => item.productId.value === input.productId
		)

		if (existingItem) {
			existingItem.updateQuantity(existingItem.quantity.value + input.quantity)
		} else {
			this._props.items.push(OrderItem.create(input))
		}

		this._props.audit = this._props.audit.markUpdated()
	}

	removeItem(itemId: EntityId): void {
		if (!this._props.status.isDraft()) {
			throw new InvariantViolationError('Cannot remove items from a non-draft order')
		}

		const index = this._props.items.findIndex((item) => item.id.equals(itemId))
		if (index === -1) {
			throw new InvariantViolationError('Item not found in order')
		}

		this._props.items.splice(index, 1)
		this._props.audit = this._props.audit.markUpdated()
	}

	place(): void {
		if (!this._props.status.isDraft()) {
			throw new InvariantViolationError('Order is not in draft status')
		}

		if (this._props.items.length === 0) {
			throw new InvariantViolationError('Cannot place an order with no items')
		}

		const previousStatus = this._props.status.value
		this._props.status = this._props.status.transitionTo('pending')
		this._props.audit = this._props.audit.markUpdated()

		this._events.push(
			new OrderStatusChangedEvent(this._props.id, previousStatus, 'pending')
		)
		this._events.push(
			new OrderPlacedEvent(
				this._props.id,
				this._props.customerId,
				this.totalAmount,
				this._props.items.length
			)
		)
	}

	confirm(): void {
		this.transitionStatus('confirmed')
	}

	startProcessing(): void {
		this.transitionStatus('processing')
	}

	ship(): void {
		this.transitionStatus('shipped')
	}

	deliver(): void {
		this.transitionStatus('delivered')
	}

	cancel(): void {
		if (!this._props.status.canTransitionTo('cancelled')) {
			throw new InvariantViolationError(
				`Cannot cancel order in "${this._props.status.value}" status`
			)
		}
		this.transitionStatus('cancelled')
	}

	private transitionStatus(newStatus: OrderStatusValue): void {
		const previousStatus = this._props.status.value
		this._props.status = this._props.status.transitionTo(newStatus)
		this._props.audit = this._props.audit.markUpdated()

		this._events.push(
			new OrderStatusChangedEvent(this._props.id, previousStatus, newStatus)
		)
	}

	updateShippingAddress(address: AddressProps): void {
		if (
			!this._props.status.isDraft() &&
			!this._props.status.isPending() &&
			!this._props.status.isConfirmed()
		) {
			throw new InvariantViolationError('Cannot update shipping address at this stage')
		}

		this._props.shippingAddress = Address.create(address)
		this._props.audit = this._props.audit.markUpdated()
	}

	updateNotes(notes: string): void {
		this._props.notes = notes.trim() || undefined
		this._props.audit = this._props.audit.markUpdated()
	}

	get totalAmount(): Money {
		if (this._props.items.length === 0) {
			return Money.zero('CNY')
		}

		return this._props.items.reduce((sum, item) => sum.add(item.lineTotal), Money.zero('CNY'))
	}

	pullDomainEvents(): DomainEvent[] {
		const events = [...this._events]
		this._events = []
		return events
	}

	get id(): EntityId {
		return this._props.id
	}
	get orderNumber(): string {
		return this._props.orderNumber
	}
	get customerId(): string {
		return this._props.customerId
	}
	get customerName(): string {
		return this._props.customerName
	}
	get status(): OrderStatus {
		return this._props.status
	}
	get items(): readonly OrderItem[] {
		return this._props.items
	}
	get shippingAddress(): Address {
		return this._props.shippingAddress
	}
	get notes(): string | undefined {
		return this._props.notes
	}
	get audit(): AuditInfo {
		return this._props.audit
	}
}
