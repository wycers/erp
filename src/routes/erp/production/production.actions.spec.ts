import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErpValidationError } from '$lib/server/erp/errors';

const productionMocks = vi.hoisted(() => ({
	createProductionDraft: vi.fn(),
	postProductionOrder: vi.fn()
}));

vi.mock('$lib/server/erp/production', () => productionMocks);

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
		request: new Request('http://localhost/erp/production', {
			method: 'POST',
			body: toFormData(entries)
		})
	}) as Parameters<NonNullable<typeof actions.createDraft>>[0];

describe('/erp/production actions', () => {
	beforeEach(() => {
		productionMocks.createProductionDraft.mockReset();
		productionMocks.postProductionOrder.mockReset();
	});

	it('rejects createDraft payload with invalid output quantity', async () => {
		const result = await actions.createDraft(
			createEvent({
				orderNumber: 'MO-001',
				productId: '2',
				outputQuantity: '0'
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(
			(result as { data: { form: { errors: { outputQuantity?: string[] } } } }).data.form.errors
				.outputQuantity?.[0]
		).toBe('Output quantity must be greater than 0');
		expect(productionMocks.createProductionDraft).not.toHaveBeenCalled();
	});

	it('creates production draft with normalized schema data', async () => {
		productionMocks.createProductionDraft.mockResolvedValue({ id: 1 });

		const result = await actions.createDraft(
			createEvent({
				orderNumber: ' MO-001 ',
				productId: '2',
				outputQuantity: '10.5'
			})
		);

		expect(result).toHaveProperty('action', 'createDraft');
		expect(result).toHaveProperty('form.message', 'Production draft created');
		expect(productionMocks.createProductionDraft).toHaveBeenCalledWith({
			orderNumber: 'MO-001',
			productId: 2,
			outputQuantity: 10.5
		});
	});

	it('maps post domain errors to readable messages', async () => {
		productionMocks.postProductionOrder.mockRejectedValue(
			new ErpValidationError('Production order MO-2 is already posted')
		);

		const result = await actions.post(
			createEvent({
				productionOrderId: '2'
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(result).toHaveProperty('data.targetProductionOrderId', 2);
		expect(result).toHaveProperty('data.message', 'Production order MO-2 is already posted');
	});
});
