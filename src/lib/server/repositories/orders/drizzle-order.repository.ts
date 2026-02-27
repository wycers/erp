import { eq, like, or, sql } from 'drizzle-orm'
import { db } from '$lib/server/db'
import { orders, orderItems, type OrderRow, type OrderItemRow } from '$lib/server/db/orders.schema'
import { Order } from '$lib/domain/orders/entities/order'
import type {
	OrderRepository,
	OrderListOptions,
	OrderListResult
} from '$lib/domain/orders/repositories/order.repository'
import type { EntityId } from '$lib/domain/shared/value-objects'
import type { OrderStatusValue } from '$lib/domain/orders/value-objects/order-status'
import type { AddressProps } from '$lib/domain/orders/value-objects/address'
import type { Currency } from '$lib/domain/inventory/value-objects/money'

export class DrizzleOrderRepository implements OrderRepository {
	async findById(id: EntityId): Promise<Order | null> {
		const rows = await db.select().from(orders).where(eq(orders.id, id.value)).limit(1)

		if (rows.length === 0) {
			return null
		}

		const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id.value))

		return this.toDomain(rows[0], items)
	}

	async findByOrderNumber(orderNumber: string): Promise<Order | null> {
		const rows = await db
			.select()
			.from(orders)
			.where(eq(orders.orderNumber, orderNumber))
			.limit(1)

		if (rows.length === 0) {
			return null
		}

		const items = await db
			.select()
			.from(orderItems)
			.where(eq(orderItems.orderId, rows[0].id))

		return this.toDomain(rows[0], items)
	}

	async findAll(options: OrderListOptions = {}): Promise<OrderListResult> {
		const { limit = 50, offset = 0, status, customerId, searchTerm } = options

		let query = db.select().from(orders).$dynamic()

		if (status) {
			query = query.where(eq(orders.status, status))
		}

		if (customerId) {
			query = query.where(eq(orders.customerId, customerId))
		}

		if (searchTerm) {
			const term = `%${searchTerm}%`
			query = query.where(or(like(orders.orderNumber, term), like(orders.customerName, term)))
		}

		const [rows, countResult] = await Promise.all([
			query.limit(limit).offset(offset).orderBy(orders.createdAt),
			db
				.select({ count: sql<number>`count(*)::int` })
				.from(orders)
				.then((r) => r[0])
		])

		const ordersWithItems = await Promise.all(
			rows.map(async (row) => {
				const items = await db.select().from(orderItems).where(eq(orderItems.orderId, row.id))
				return this.toDomain(row, items)
			})
		)

		return {
			orders: ordersWithItems,
			total: countResult?.count ?? 0
		}
	}

	async save(order: Order): Promise<void> {
		const orderRow = this.toOrderPersistence(order)
		const itemRows = this.toOrderItemsPersistence(order)

		await db.transaction(async (tx) => {
			await tx
				.insert(orders)
				.values(orderRow)
				.onConflictDoUpdate({
					target: orders.id,
					set: {
						status: orderRow.status,
						shippingAddress: orderRow.shippingAddress,
						notes: orderRow.notes,
						updatedAt: new Date()
					}
				})

			await tx.delete(orderItems).where(eq(orderItems.orderId, order.id.value))

			if (itemRows.length > 0) {
				await tx.insert(orderItems).values(itemRows)
			}
		})
	}

	async delete(id: EntityId): Promise<void> {
		await db.delete(orders).where(eq(orders.id, id.value))
	}

	private toDomain(row: OrderRow, items: OrderItemRow[]): Order {
		return Order.reconstitute({
			id: row.id,
			orderNumber: row.orderNumber,
			customerId: row.customerId,
			customerName: row.customerName,
			status: row.status as OrderStatusValue,
			items: items.map((item) => ({
				id: item.id,
				productId: item.productId,
				productSku: item.productSku,
				productName: item.productName,
				unitPrice: parseFloat(item.unitPrice),
				currency: item.currency as Currency,
				quantity: item.quantity
			})),
			shippingAddress: row.shippingAddress as AddressProps,
			notes: row.notes ?? undefined,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt
		})
	}

	private toOrderPersistence(order: Order) {
		return {
			id: order.id.value,
			orderNumber: order.orderNumber,
			customerId: order.customerId,
			customerName: order.customerName,
			status: order.status.value,
			shippingAddress: order.shippingAddress.toJSON(),
			notes: order.notes ?? null,
			createdAt: order.audit.createdAt,
			updatedAt: order.audit.updatedAt
		}
	}

	private toOrderItemsPersistence(order: Order) {
		return order.items.map((item) => ({
			id: item.id.value,
			orderId: order.id.value,
			productId: item.productId.value,
			productSku: item.productSku,
			productName: item.productName,
			unitPrice: item.unitPrice.amount.toString(),
			currency: item.unitPrice.currency,
			quantity: item.quantity.value
		}))
	}
}
