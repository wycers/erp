import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErpValidationError } from '$lib/server/erp/errors';

const salesMocks = vi.hoisted(() => ({
	createSalesDraft: vi.fn(),
	postSalesShipment: vi.fn()
}));

vi.mock('$lib/server/erp/sales', () => salesMocks);

import { actions } from './+page.server';

const toFormData = (entries: Record<string, string | undefined>): FormData => {
	const formData = new FormData();
	for (const [key, value] of Object.entries(entries)) {
		if (value !== undefined) {
			formData.set(key, value);
		}
	}
	return formData;
};

const createEvent = (entries: Record<string, string | undefined>) =>
	({
		request: new Request('http://localhost/erp/sales', {
			method: 'POST',
			body: toFormData(entries)
		})
	}) as Parameters<NonNullable<typeof actions.createDraft>>[0];

describe('/erp/sales actions', () => {
	beforeEach(() => {
		salesMocks.createSalesDraft.mockReset();
		salesMocks.postSalesShipment.mockReset();
	});

	it('rejects createDraft payload with missing lines', async () => {
		const result = await actions.createDraft(
			createEvent({
				shipmentNumber: 'SO-001',
				lines: ''
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(
			(result as { data: { form: { errors: { lines?: string[] } } } }).data.form.errors.lines?.[0]
		).toBe('Sales lines is required');
		expect(salesMocks.createSalesDraft).not.toHaveBeenCalled();
	});

	it('creates sales draft with normalized schema data', async () => {
		salesMocks.createSalesDraft.mockResolvedValue({ id: 1 });

		const result = await actions.createDraft(
			createEvent({
				shipmentNumber: ' SO-001 ',
				lines: '2,5,12.6'
			})
		);

		expect(result).toHaveProperty('action', 'createDraft');
		expect(result).toHaveProperty('form.message', 'Sales draft created');
		expect(salesMocks.createSalesDraft).toHaveBeenCalledWith({
			shipmentNumber: 'SO-001',
			lines: [{ productId: 2, quantity: 5, sellingUnitPrice: 12.6 }]
		});
	});

	it('maps post domain errors to readable messages', async () => {
		salesMocks.postSalesShipment.mockRejectedValue(
			new ErpValidationError('Sales shipment SO-1 is already posted')
		);

		const result = await actions.post(
			createEvent({
				salesShipmentId: '1'
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(result).toHaveProperty('data.targetSalesShipmentId', 1);
		expect(result).toHaveProperty('data.message', 'Sales shipment SO-1 is already posted');
	});
});
