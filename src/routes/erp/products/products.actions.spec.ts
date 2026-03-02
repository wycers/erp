import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErpValidationError } from '$lib/server/erp/errors';

const itemMasterMocks = vi.hoisted(() => ({
	createProduct: vi.fn(),
	updateProduct: vi.fn(),
	saveFixedBom: vi.fn(),
	listMaterials: vi.fn(),
	listProductBoms: vi.fn(),
	listProducts: vi.fn()
}));

vi.mock('$lib/server/erp/item-master', () => itemMasterMocks);

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
		request: new Request('http://localhost/erp/products', {
			method: 'POST',
			body: toFormData(entries)
		})
	}) as Parameters<NonNullable<typeof actions.create>>[0];

describe('/erp/products actions', () => {
	beforeEach(() => {
		itemMasterMocks.createProduct.mockReset();
		itemMasterMocks.updateProduct.mockReset();
		itemMasterMocks.saveFixedBom.mockReset();
		itemMasterMocks.listMaterials.mockReset();
		itemMasterMocks.listProductBoms.mockReset();
		itemMasterMocks.listProducts.mockReset();
	});

	it('rejects create payloads with missing required fields', async () => {
		const result = await actions.create(
			createEvent({
				code: 'PRD-001',
				name: 'Cotton Shirt',
				unit: '',
				note: ''
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(
			(result as { data: { form: { errors: { unit?: string[] } } } }).data.form.errors.unit?.[0]
		).toBe('Unit is required');
		expect(itemMasterMocks.createProduct).not.toHaveBeenCalled();
	});

	it('creates a product when payload is valid', async () => {
		itemMasterMocks.createProduct.mockResolvedValue({ id: 1 });

		const result = await actions.create(
			createEvent({
				code: ' PRD-001 ',
				name: ' Cotton Shirt ',
				unit: ' pcs ',
				note: '  first batch  '
			})
		);

		expect(result).toHaveProperty('action', 'create');
		expect(result).toHaveProperty('form.message', 'Product created');
		expect(itemMasterMocks.createProduct).toHaveBeenCalledWith({
			code: 'PRD-001',
			name: 'Cotton Shirt',
			unit: 'pcs',
			note: 'first batch'
		});
	});

	it('rejects update payloads with field errors and keeps target row id', async () => {
		const result = await actions.update(
			createEvent({
				id: '12',
				code: 'PRD-012',
				name: '',
				unit: 'pcs',
				note: '',
				isActive: 'on'
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(result).toHaveProperty('data.targetProductId', 12);
		expect(
			(result as { data: { updateForm: { errors: { name?: string[] } } } }).data.updateForm.errors
				.name?.[0]
		).toBe('Name is required');
		expect(itemMasterMocks.updateProduct).not.toHaveBeenCalled();
	});

	it('saves bom lines for a valid payload', async () => {
		itemMasterMocks.saveFixedBom.mockResolvedValue(undefined);

		const result = await actions.saveBom(
			createEvent({
				productId: '3',
				lines: '1,2.5\n2,0.8'
			})
		);

		expect(result).toEqual({
			action: 'saveBom',
			targetProductId: 3,
			message: 'BOM saved'
		});
		expect(itemMasterMocks.saveFixedBom).toHaveBeenCalledWith({
			productId: 3,
			lines: [
				{ materialSkuId: 1, quantityPerUnit: 2.5 },
				{ materialSkuId: 2, quantityPerUnit: 0.8 }
			]
		});
	});

	it('maps bom domain errors to a readable message', async () => {
		itemMasterMocks.saveFixedBom.mockRejectedValue(
			new ErpValidationError('BOM requires at least one material line')
		);

		const result = await actions.saveBom(
			createEvent({
				productId: '3',
				lines: '1,1.0'
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(result).toHaveProperty('data.action', 'saveBom');
		expect(result).toHaveProperty('data.message', 'BOM requires at least one material line');
	});
});
