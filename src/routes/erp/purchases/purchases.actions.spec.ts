import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErpValidationError } from '$lib/server/erp/errors';

const purchaseMocks = vi.hoisted(() => ({
	createPurchaseDraft: vi.fn(),
	postPurchaseOrder: vi.fn()
}));

vi.mock('$lib/server/erp/purchase', () => purchaseMocks);

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
		request: new Request('http://localhost/erp/purchases', {
			method: 'POST',
			body: toFormData(entries)
		})
	}) as Parameters<NonNullable<typeof actions.createDraft>>[0];

describe('/erp/purchases actions', () => {
	beforeEach(() => {
		purchaseMocks.createPurchaseDraft.mockReset();
		purchaseMocks.postPurchaseOrder.mockReset();
	});

	it('rejects createDraft payload with missing lines', async () => {
		const result = await actions.createDraft(
			createEvent({
				orderNumber: 'PO-001',
				freightAmount: '10',
				lines: ''
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(
			(result as { data: { form: { errors: { lines?: string[] } } } }).data.form.errors.lines?.[0]
		).toBe('Purchase lines is required');
		expect(purchaseMocks.createPurchaseDraft).not.toHaveBeenCalled();
	});

	it('creates draft with normalized schema data', async () => {
		purchaseMocks.createPurchaseDraft.mockResolvedValue({ id: 1 });

		const result = await actions.createDraft(
			createEvent({
				orderNumber: ' PO-001 ',
				freightAmount: '12.5',
				lines: '1,2,100'
			})
		);

		expect(result).toHaveProperty('action', 'createDraft');
		expect(result).toHaveProperty('form.message', 'Purchase draft created');
		expect(purchaseMocks.createPurchaseDraft).toHaveBeenCalledWith({
			orderNumber: 'PO-001',
			freightAmount: 12.5,
			lines: [{ materialSkuId: 1, quantity: 2, lineAmount: 100 }]
		});
	});

	it('maps post domain errors to readable messages', async () => {
		purchaseMocks.postPurchaseOrder.mockRejectedValue(
			new ErpValidationError('Purchase order PO-100 is already posted')
		);

		const result = await actions.post(
			createEvent({
				purchaseOrderId: '100'
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(result).toHaveProperty('data.targetPurchaseOrderId', 100);
		expect(result).toHaveProperty('data.message', 'Purchase order PO-100 is already posted');
	});
});
