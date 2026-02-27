import { pgTable, text, integer, decimal, timestamp, varchar, jsonb } from 'drizzle-orm/pg-core'

export const orders = pgTable('orders', {
	id: text('id').primaryKey(),
	orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
	customerId: text('customer_id').notNull(),
	customerName: varchar('customer_name', { length: 255 }).notNull(),
	status: varchar('status', { length: 20 }).notNull().default('draft'),
	shippingAddress: jsonb('shipping_address').notNull(),
	notes: text('notes'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})

export const orderItems = pgTable('order_items', {
	id: text('id').primaryKey(),
	orderId: text('order_id')
		.notNull()
		.references(() => orders.id, { onDelete: 'cascade' }),
	productId: text('product_id').notNull(),
	productSku: varchar('product_sku', { length: 50 }).notNull(),
	productName: varchar('product_name', { length: 255 }).notNull(),
	unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
	currency: varchar('currency', { length: 3 }).notNull().default('CNY'),
	quantity: integer('quantity').notNull()
})

export type OrderRow = typeof orders.$inferSelect
export type NewOrderRow = typeof orders.$inferInsert
export type OrderItemRow = typeof orderItems.$inferSelect
export type NewOrderItemRow = typeof orderItems.$inferInsert
