import { z } from 'zod'

export const addressSchema = z.object({
	street: z.string().min(1, 'Street address is required').max(255),
	city: z.string().min(1, 'City is required').max(100),
	province: z.string().min(1, 'Province is required').max(100),
	postalCode: z.string().min(1, 'Postal code is required').max(20),
	country: z.string().min(1, 'Country is required').max(100),
	contactName: z.string().max(100).optional(),
	contactPhone: z.string().max(50).optional()
})

export const createOrderSchema = z.object({
	customerName: z.string().min(1, 'Customer name is required').max(255),
	street: z.string().min(1, 'Street address is required').max(255),
	city: z.string().min(1, 'City is required').max(100),
	province: z.string().min(1, 'Province is required').max(100),
	postalCode: z.string().min(1, 'Postal code is required').max(20),
	country: z.string().min(1, 'Country is required').max(100).default('China'),
	contactName: z.string().max(100).optional(),
	contactPhone: z.string().max(50).optional(),
	notes: z.string().max(1000, 'Notes is too long').optional()
})

export const addOrderItemSchema = z.object({
	productId: z.string().min(1, 'Product is required'),
	quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1')
})

export type CreateOrderSchema = typeof createOrderSchema
export type AddOrderItemSchema = typeof addOrderItemSchema
