import { z } from 'zod';
import { booleanFromFormData, optionalText, positiveIdFromFormData, requiredText } from './common';

export const createMaterialFormSchema = z.object({
	code: requiredText('Code', 100),
	name: requiredText('Name', 255),
	unit: requiredText('Unit', 50),
	imageUrl: optionalText('Image URL', 2000),
	note: optionalText('Note', 2000)
});

export const updateMaterialFormSchema = createMaterialFormSchema.extend({
	id: positiveIdFromFormData('Material ID'),
	isActive: booleanFromFormData
});

export type CreateMaterialFormSchema = typeof createMaterialFormSchema;
export type UpdateMaterialFormSchema = typeof updateMaterialFormSchema;
