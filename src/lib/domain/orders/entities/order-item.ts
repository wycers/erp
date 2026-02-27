import { EntityId } from '../../shared/value-objects'
import { Money, type Currency } from '../../inventory/value-objects/money'
import { Quantity } from '../../inventory/value-objects/quantity'

export interface OrderItemProps {
	id: EntityId
	productId: EntityId
	productSku: string
	productName: string
	unitPrice: Money
	quantity: Quantity
}

export interface CreateOrderItemInput {
	productId: string
	productSku: string
	productName: string
	unitPrice: number
	currency?: Currency
	quantity: number
}

export class OrderItem {
	private constructor(private _props: OrderItemProps) {}

	static create(input: CreateOrderItemInput): OrderItem {
		return new OrderItem({
			id: EntityId.generate(),
			productId: EntityId.create(input.productId),
			productSku: input.productSku,
			productName: input.productName,
			unitPrice: Money.create(input.unitPrice, input.currency ?? 'CNY'),
			quantity: Quantity.create(input.quantity)
		})
	}

	static reconstitute(props: {
		id: string
		productId: string
		productSku: string
		productName: string
		unitPrice: number
		currency: Currency
		quantity: number
	}): OrderItem {
		return new OrderItem({
			id: EntityId.create(props.id),
			productId: EntityId.create(props.productId),
			productSku: props.productSku,
			productName: props.productName,
			unitPrice: Money.create(props.unitPrice, props.currency),
			quantity: Quantity.create(props.quantity)
		})
	}

	updateQuantity(newQuantity: number): void {
		this._props.quantity = Quantity.create(newQuantity)
	}

	get lineTotal(): Money {
		return this._props.unitPrice.multiply(this._props.quantity.value)
	}

	get id(): EntityId {
		return this._props.id
	}
	get productId(): EntityId {
		return this._props.productId
	}
	get productSku(): string {
		return this._props.productSku
	}
	get productName(): string {
		return this._props.productName
	}
	get unitPrice(): Money {
		return this._props.unitPrice
	}
	get quantity(): Quantity {
		return this._props.quantity
	}
}
