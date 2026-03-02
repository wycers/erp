import { z } from 'zod';
import { nonNegativeNumberFromFormData, positiveIdFromFormData, requiredText } from './common';

export const createPurchaseDraftFormSchema = z.object({
	orderNumber: requiredText('Order number', 100),
	freightAmount: nonNegativeNumberFromFormData('Freight amount'),
	lines: requiredText('Purchase lines', 20000)
});

export const postPurchaseOrderFormSchema = z.object({
	purchaseOrderId: positiveIdFromFormData('Purchase order ID')
});

export type CreatePurchaseDraftFormSchema = typeof createPurchaseDraftFormSchema;
export type PostPurchaseOrderFormSchema = typeof postPurchaseOrderFormSchema;
