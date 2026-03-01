import { z } from 'zod'

const currencyEnum = z.enum(['CNY', 'USD', 'EUR', 'JPY'])

export const createProductSchema = z.object({
	sku: z
		.string()
		.min(1, 'SKU is required')
		.regex(/^[A-Za-z0-9]+-[A-Za-z0-9]+(-[A-Za-z0-9]+)*$/, 'SKU must follow pattern: XXX-XXX')
		.transform((v) => v.toUpperCase()),
	name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
	description: z.string().max(1000, 'Description is too long').optional(),
	imageUrl: z.string().optional(),
	unitPrice: z.coerce.number().min(0, 'Price must be positive'),
	currency: currencyEnum.default('CNY'),
	initialStock: z.coerce.number().int().min(0, 'Stock must be non-negative').default(0),
	reorderPoint: z.coerce.number().int().min(0, 'Reorder point must be non-negative').default(10)
})

export const updateProductSchema = z.object({
	name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
	description: z.string().max(1000, 'Description is too long').optional(),
	imageUrl: z.string().optional(),
	unitPrice: z.coerce.number().min(0, 'Price must be positive'),
	reorderPoint: z.coerce.number().int().min(0, 'Reorder point must be non-negative')
})

export const adjustStockSchema = z.object({
	quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
	adjustmentType: z.enum(['add', 'subtract']),
	reason: z.enum(['receipt', 'shipment', 'adjustment', 'return', 'damage']),
	reference: z.string().max(100, 'Reference is too long').optional()
})

export type CreateProductSchema = typeof createProductSchema
export type UpdateProductSchema = typeof updateProductSchema
export type AdjustStockSchema = typeof adjustStockSchema
