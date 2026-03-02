import { z } from 'zod';

export const requiredText = (field: string, maxLength: number) =>
	z.string().trim().min(1, `${field} is required`).max(maxLength, `${field} is too long`);

export const optionalText = (field: string, maxLength: number) =>
	z
		.string()
		.trim()
		.max(maxLength, `${field} is too long`)
		.transform((value) => (value.length > 0 ? value : undefined))
		.optional();

export const booleanFromFormData = z.preprocess(
	(value) => value === 'on' || value === 'true' || value === true,
	z.boolean()
);

export const positiveIdFromFormData = (field: string) =>
	z.coerce.number().int().positive(`${field} is invalid`);

export const positiveNumberFromFormData = (field: string) =>
	z.coerce
		.number()
		.refine((value) => Number.isFinite(value) && value > 0, `${field} must be greater than 0`);

export const nonNegativeNumberFromFormData = (field: string) =>
	z.coerce
		.number()
		.refine((value) => Number.isFinite(value) && value >= 0, `${field} must be at least 0`);
