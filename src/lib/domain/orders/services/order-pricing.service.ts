import type { Order } from '../entities/order'
import { Money } from '../../inventory/value-objects/money'

export interface OrderPricingSummary {
	subtotal: Money
	tax: Money
	shipping: Money
	total: Money
}

export class OrderPricingService {
	private readonly taxRate = 0.13
	private readonly freeShippingThreshold = 200
	private readonly standardShippingFee = 15

	calculatePricing(order: Order): OrderPricingSummary {
		const subtotal = order.totalAmount

		const tax = Money.create(
			Math.round(subtotal.amount * this.taxRate * 100) / 100,
			subtotal.currency
		)

		const shippingAmount =
			subtotal.amount >= this.freeShippingThreshold ? 0 : this.standardShippingFee
		const shipping = Money.create(shippingAmount, subtotal.currency)

		const total = subtotal.add(tax).add(shipping)

		return {
			subtotal,
			tax,
			shipping,
			total
		}
	}
}
