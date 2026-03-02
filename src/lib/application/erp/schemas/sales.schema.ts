import { z } from 'zod';
import { positiveIdFromFormData, requiredText } from './common';

export const createSalesDraftFormSchema = z.object({
	shipmentNumber: requiredText('Shipment number', 100),
	lines: requiredText('Sales lines', 20000)
});

export const postSalesShipmentFormSchema = z.object({
	salesShipmentId: positiveIdFromFormData('Sales shipment ID')
});

export type CreateSalesDraftFormSchema = typeof createSalesDraftFormSchema;
export type PostSalesShipmentFormSchema = typeof postSalesShipmentFormSchema;
