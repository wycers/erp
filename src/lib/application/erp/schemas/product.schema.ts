import { z } from 'zod';
import { booleanFromFormData, optionalText, positiveIdFromFormData, requiredText } from './common';

export const createProductFormSchema = z.object({
	code: requiredText('Code', 100),
	name: requiredText('Name', 255),
	unit: requiredText('Unit', 50),
	note: optionalText('Note', 2000)
});

export const updateProductFormSchema = createProductFormSchema.extend({
	id: positiveIdFromFormData('Product ID'),
	isActive: booleanFromFormData
});

export const saveProductBomFormSchema = z.object({
	productId: positiveIdFromFormData('Product ID'),
	lines: requiredText('BOM lines', 20000)
});

export type CreateProductFormSchema = typeof createProductFormSchema;
export type UpdateProductFormSchema = typeof updateProductFormSchema;
export type SaveProductBomFormSchema = typeof saveProductBomFormSchema;
