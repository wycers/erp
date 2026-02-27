import {
	boolean,
	integer,
	numeric,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
	index
} from 'drizzle-orm/pg-core';

export const inventoryItemKindEnum = pgEnum('inventory_item_kind', ['MATERIAL', 'PRODUCT']);
export const documentStatusEnum = pgEnum('document_status', ['DRAFT', 'POSTED']);
export const inventoryDirectionEnum = pgEnum('inventory_direction', ['IN', 'OUT']);
export const inventorySourceTypeEnum = pgEnum('inventory_source_type', [
	'PURCHASE',
	'PRODUCTION_CONSUME',
	'PRODUCTION_OUTPUT',
	'SALES'
]);

export const inventoryItem = pgTable('inventory_item', {
	id: serial('id').primaryKey(),
	kind: inventoryItemKindEnum('kind').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const materialSku = pgTable(
	'material_sku',
	{
		id: serial('id').primaryKey(),
		inventoryItemId: integer('inventory_item_id')
			.notNull()
			.references(() => inventoryItem.id, { onDelete: 'cascade' }),
		code: text('code').notNull(),
		name: text('name').notNull(),
		unit: text('unit').notNull(),
		imageUrl: text('image_url'),
		note: text('note'),
		isActive: boolean('is_active').notNull().default(true),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('material_sku_inventory_item_id_unique').on(table.inventoryItemId),
		uniqueIndex('material_sku_code_unique').on(table.code)
	]
);

export const finishedProduct = pgTable(
	'finished_product',
	{
		id: serial('id').primaryKey(),
		inventoryItemId: integer('inventory_item_id')
			.notNull()
			.references(() => inventoryItem.id, { onDelete: 'cascade' }),
		code: text('code').notNull(),
		name: text('name').notNull(),
		unit: text('unit').notNull(),
		note: text('note'),
		isActive: boolean('is_active').notNull().default(true),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('finished_product_inventory_item_id_unique').on(table.inventoryItemId),
		uniqueIndex('finished_product_code_unique').on(table.code)
	]
);

export const productBom = pgTable(
	'product_bom',
	{
		id: serial('id').primaryKey(),
		productId: integer('product_id')
			.notNull()
			.references(() => finishedProduct.id, { onDelete: 'cascade' }),
		isActive: boolean('is_active').notNull().default(true),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('product_bom_product_id_unique').on(table.productId)]
);

export const productBomLine = pgTable(
	'product_bom_line',
	{
		id: serial('id').primaryKey(),
		bomId: integer('bom_id')
			.notNull()
			.references(() => productBom.id, { onDelete: 'cascade' }),
		lineNo: integer('line_no').notNull(),
		materialSkuId: integer('material_sku_id')
			.notNull()
			.references(() => materialSku.id),
		quantityPerUnit: numeric('quantity_per_unit', { precision: 18, scale: 2 }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('product_bom_line_bom_line_no_unique').on(table.bomId, table.lineNo),
		uniqueIndex('product_bom_line_bom_material_unique').on(table.bomId, table.materialSkuId)
	]
);

export const purchaseOrder = pgTable(
	'purchase_order',
	{
		id: serial('id').primaryKey(),
		orderNumber: text('order_number').notNull(),
		freightAmount: numeric('freight_amount', { precision: 18, scale: 2 }).notNull().default('0'),
		status: documentStatusEnum('status').notNull().default('DRAFT'),
		postedAt: timestamp('posted_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('purchase_order_order_number_unique').on(table.orderNumber)]
);

export const purchaseOrderLine = pgTable(
	'purchase_order_line',
	{
		id: serial('id').primaryKey(),
		purchaseOrderId: integer('purchase_order_id')
			.notNull()
			.references(() => purchaseOrder.id, { onDelete: 'cascade' }),
		lineNo: integer('line_no').notNull(),
		materialSkuId: integer('material_sku_id')
			.notNull()
			.references(() => materialSku.id),
		quantity: numeric('quantity', { precision: 18, scale: 2 }).notNull(),
		lineAmount: numeric('line_amount', { precision: 18, scale: 2 }).notNull(),
		unitPrice: numeric('unit_price', { precision: 18, scale: 2 }).notNull().default('0'),
		allocatedFreight: numeric('allocated_freight', { precision: 18, scale: 2 })
			.notNull()
			.default('0'),
		landedUnitCost: numeric('landed_unit_cost', { precision: 18, scale: 2 }).notNull().default('0'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('purchase_order_line_order_line_no_unique').on(table.purchaseOrderId, table.lineNo)
	]
);

export const productionOrder = pgTable(
	'production_order',
	{
		id: serial('id').primaryKey(),
		orderNumber: text('order_number').notNull(),
		productId: integer('product_id')
			.notNull()
			.references(() => finishedProduct.id),
		outputQuantity: numeric('output_quantity', { precision: 18, scale: 2 }).notNull(),
		status: documentStatusEnum('status').notNull().default('DRAFT'),
		totalConsumedCost: numeric('total_consumed_cost', { precision: 18, scale: 2 })
			.notNull()
			.default('0'),
		unitCost: numeric('unit_cost', { precision: 18, scale: 2 }).notNull().default('0'),
		postedAt: timestamp('posted_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('production_order_order_number_unique').on(table.orderNumber)]
);

export const productionOrderComponent = pgTable(
	'production_order_component',
	{
		id: serial('id').primaryKey(),
		productionOrderId: integer('production_order_id')
			.notNull()
			.references(() => productionOrder.id, { onDelete: 'cascade' }),
		lineNo: integer('line_no').notNull(),
		materialSkuId: integer('material_sku_id')
			.notNull()
			.references(() => materialSku.id),
		requiredQuantity: numeric('required_quantity', { precision: 18, scale: 2 }).notNull(),
		unitCost: numeric('unit_cost', { precision: 18, scale: 2 }).notNull().default('0'),
		totalCost: numeric('total_cost', { precision: 18, scale: 2 }).notNull().default('0'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('production_order_component_order_line_no_unique').on(
			table.productionOrderId,
			table.lineNo
		)
	]
);

export const salesShipment = pgTable(
	'sales_shipment',
	{
		id: serial('id').primaryKey(),
		shipmentNumber: text('shipment_number').notNull(),
		status: documentStatusEnum('status').notNull().default('DRAFT'),
		postedAt: timestamp('posted_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('sales_shipment_shipment_number_unique').on(table.shipmentNumber)]
);

export const salesShipmentLine = pgTable(
	'sales_shipment_line',
	{
		id: serial('id').primaryKey(),
		salesShipmentId: integer('sales_shipment_id')
			.notNull()
			.references(() => salesShipment.id, { onDelete: 'cascade' }),
		lineNo: integer('line_no').notNull(),
		productId: integer('product_id')
			.notNull()
			.references(() => finishedProduct.id),
		quantity: numeric('quantity', { precision: 18, scale: 2 }).notNull(),
		sellingUnitPrice: numeric('selling_unit_price', { precision: 18, scale: 2 }).notNull(),
		revenue: numeric('revenue', { precision: 18, scale: 2 }).notNull().default('0'),
		cogsUnitCost: numeric('cogs_unit_cost', { precision: 18, scale: 2 }).notNull().default('0'),
		cogsTotal: numeric('cogs_total', { precision: 18, scale: 2 }).notNull().default('0'),
		grossProfit: numeric('gross_profit', { precision: 18, scale: 2 }).notNull().default('0'),
		grossMargin: numeric('gross_margin', { precision: 10, scale: 4 }).notNull().default('0'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('sales_shipment_line_shipment_line_no_unique').on(table.salesShipmentId, table.lineNo)
	]
);

export const inventoryBalance = pgTable(
	'inventory_balance',
	{
		id: serial('id').primaryKey(),
		inventoryItemId: integer('inventory_item_id')
			.notNull()
			.references(() => inventoryItem.id, { onDelete: 'cascade' }),
		quantity: numeric('quantity', { precision: 18, scale: 2 }).notNull().default('0'),
		averageCost: numeric('average_cost', { precision: 18, scale: 2 }).notNull().default('0'),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('inventory_balance_inventory_item_unique').on(table.inventoryItemId)]
);

export const inventoryMovement = pgTable(
	'inventory_movement',
	{
		id: serial('id').primaryKey(),
		inventoryItemId: integer('inventory_item_id')
			.notNull()
			.references(() => inventoryItem.id, { onDelete: 'cascade' }),
		direction: inventoryDirectionEnum('direction').notNull(),
		sourceType: inventorySourceTypeEnum('source_type').notNull(),
		sourceId: integer('source_id').notNull(),
		sourceLineId: integer('source_line_id'),
		quantity: numeric('quantity', { precision: 18, scale: 2 }).notNull(),
		unitCost: numeric('unit_cost', { precision: 18, scale: 2 }).notNull(),
		totalCost: numeric('total_cost', { precision: 18, scale: 2 }).notNull(),
		balanceQuantity: numeric('balance_quantity', { precision: 18, scale: 2 }).notNull(),
		balanceAverageCost: numeric('balance_average_cost', { precision: 18, scale: 2 }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('inventory_movement_inventory_item_created_at_idx').on(
			table.inventoryItemId,
			table.createdAt
		)
	]
);
