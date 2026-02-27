export type OrderStatusValue =
	| 'draft'
	| 'pending'
	| 'confirmed'
	| 'processing'
	| 'shipped'
	| 'delivered'
	| 'cancelled'

const VALID_TRANSITIONS: Record<OrderStatusValue, OrderStatusValue[]> = {
	draft: ['pending', 'cancelled'],
	pending: ['confirmed', 'cancelled'],
	confirmed: ['processing', 'cancelled'],
	processing: ['shipped', 'cancelled'],
	shipped: ['delivered'],
	delivered: [],
	cancelled: []
}

export class OrderStatus {
	private constructor(private readonly _value: OrderStatusValue) {}

	static create(value: OrderStatusValue): OrderStatus {
		return new OrderStatus(value)
	}

	static draft(): OrderStatus {
		return new OrderStatus('draft')
	}

	static pending(): OrderStatus {
		return new OrderStatus('pending')
	}

	get value(): OrderStatusValue {
		return this._value
	}

	canTransitionTo(newStatus: OrderStatusValue): boolean {
		return VALID_TRANSITIONS[this._value].includes(newStatus)
	}

	transitionTo(newStatus: OrderStatusValue): OrderStatus {
		if (!this.canTransitionTo(newStatus)) {
			throw new Error(`Cannot transition from "${this._value}" to "${newStatus}"`)
		}
		return new OrderStatus(newStatus)
	}

	isDraft(): boolean {
		return this._value === 'draft'
	}

	isPending(): boolean {
		return this._value === 'pending'
	}

	isConfirmed(): boolean {
		return this._value === 'confirmed'
	}

	isCancelled(): boolean {
		return this._value === 'cancelled'
	}

	isCompleted(): boolean {
		return this._value === 'delivered'
	}

	isActive(): boolean {
		return !this.isCancelled() && !this.isCompleted()
	}

	equals(other: OrderStatus): boolean {
		return this._value === other._value
	}

	toString(): string {
		return this._value
	}
}
