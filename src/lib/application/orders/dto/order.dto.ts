import type { Order } from '$lib/domain/orders/entities/order'
import type { OrderItem } from '$lib/domain/orders/entities/order-item'
import type { OrderStatusValue } from '$lib/domain/orders/value-objects/order-status'
import type { Currency } from '$lib/domain/inventory/value-objects/money'

export interface OrderItemDTO {
	id: string
	productId: string
	productSku: string
	productName: string
	unitPrice: number
	currency: Currency
	quantity: number
	lineTotal: number
}

export interface OrderDTO {
	id: string
	orderNumber: string
	customerId: string
	customerName: string
	status: OrderStatusValue
	items: OrderItemDTO[]
	shippingAddress: {
		street: string
		city: string
		province: string
		postalCode: string
		country: string
		contactName?: string
		contactPhone?: string
	}
	notes?: string
	totalAmount: number
	currency: Currency
	itemCount: number
	createdAt: string
	updatedAt: string
}

export function toOrderItemDTO(item: OrderItem): OrderItemDTO {
	return {
		id: item.id.value,
		productId: item.productId.value,
		productSku: item.productSku,
		productName: item.productName,
		unitPrice: item.unitPrice.amount,
		currency: item.unitPrice.currency,
		quantity: item.quantity.value,
		lineTotal: item.lineTotal.amount
	}
}

export function toOrderDTO(order: Order): OrderDTO {
	return {
		id: order.id.value,
		orderNumber: order.orderNumber,
		customerId: order.customerId,
		customerName: order.customerName,
		status: order.status.value,
		items: order.items.map(toOrderItemDTO),
		shippingAddress: order.shippingAddress.toJSON(),
		notes: order.notes,
		totalAmount: order.totalAmount.amount,
		currency: order.totalAmount.currency,
		itemCount: order.items.length,
		createdAt: order.audit.createdAt.toISOString(),
		updatedAt: order.audit.updatedAt.toISOString()
	}
}

export interface OrderListDTO {
	orders: OrderDTO[]
	total: number
	limit: number
	offset: number
}
