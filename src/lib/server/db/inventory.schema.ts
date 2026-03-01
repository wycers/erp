import { pgTable, text, integer, decimal, timestamp, varchar } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
	id: text('id').primaryKey(),
	sku: varchar('sku', { length: 50 }).notNull().unique(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	imageUrl: text('image_url'),
	unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
	currency: varchar('currency', { length: 3 }).notNull().default('CNY'),
	stockQuantity: integer('stock_quantity').notNull().default(0),
	reorderPoint: integer('reorder_point').notNull().default(10),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})

export type ProductRow = typeof products.$inferSelect
export type NewProductRow = typeof products.$inferInsert
