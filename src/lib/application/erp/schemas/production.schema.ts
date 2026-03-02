import { z } from 'zod';
import { positiveIdFromFormData, positiveNumberFromFormData, requiredText } from './common';

export const createProductionDraftFormSchema = z.object({
	orderNumber: requiredText('Order number', 100),
	productId: positiveIdFromFormData('Product ID'),
	outputQuantity: positiveNumberFromFormData('Output quantity')
});

export const postProductionOrderFormSchema = z.object({
	productionOrderId: positiveIdFromFormData('Production order ID')
});

export type CreateProductionDraftFormSchema = typeof createProductionDraftFormSchema;
export type PostProductionOrderFormSchema = typeof postProductionOrderFormSchema;
