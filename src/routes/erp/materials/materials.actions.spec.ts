import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ErpValidationError } from '$lib/server/erp/errors';

const itemMasterMocks = vi.hoisted(() => ({
	createMaterial: vi.fn(),
	listMaterials: vi.fn(),
	updateMaterial: vi.fn()
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
		request: new Request('http://localhost/erp/materials', {
			method: 'POST',
			body: toFormData(entries)
		})
	}) as Parameters<NonNullable<typeof actions.create>>[0];

describe('/erp/materials actions', () => {
	beforeEach(() => {
		itemMasterMocks.createMaterial.mockReset();
		itemMasterMocks.updateMaterial.mockReset();
		itemMasterMocks.listMaterials.mockReset();
	});

	it('rejects create payloads with missing required fields', async () => {
		const result = await actions.create(
			createEvent({
				code: 'MAT-001',
				name: 'Copper wire',
				unit: '',
				imageUrl: '',
				note: ''
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(
			(result as { data: { form: { errors: { unit?: string[] } } } }).data.form.errors.unit?.[0]
		).toBe('Unit is required');
		expect(itemMasterMocks.createMaterial).not.toHaveBeenCalled();
	});

	it('creates a material when create payload is valid', async () => {
		itemMasterMocks.createMaterial.mockResolvedValue({ id: 1 });

		const result = await actions.create(
			createEvent({
				code: ' MAT-001 ',
				name: ' Copper wire ',
				unit: ' roll ',
				imageUrl: ' https://example.com/material.png ',
				note: '  test note  '
			})
		);

		expect(result).toHaveProperty('form.message', 'Material created');
		expect(itemMasterMocks.createMaterial).toHaveBeenCalledWith({
			code: 'MAT-001',
			name: 'Copper wire',
			unit: 'roll',
			imageUrl: 'https://example.com/material.png',
			note: 'test note'
		});
	});

	it('rejects update payloads with field validation errors and keeps target row id', async () => {
		const result = await actions.update(
			createEvent({
				id: '12',
				code: 'MAT-012',
				name: '',
				unit: 'kg',
				imageUrl: '',
				note: '',
				isActive: 'on'
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(result).toHaveProperty('data.targetMaterialId', 12);
		expect(
			(result as { data: { updateForm: { errors: { name?: string[] } } } }).data.updateForm.errors
				.name?.[0]
		).toBe('Name is required');
		expect(itemMasterMocks.updateMaterial).not.toHaveBeenCalled();
	});

	it('updates material successfully and parses unchecked isActive as false', async () => {
		itemMasterMocks.updateMaterial.mockResolvedValue({ id: 12 });

		const result = await actions.update(
			createEvent({
				id: '12',
				code: ' MAT-012 ',
				name: ' Copper plate ',
				unit: ' pcs ',
				imageUrl: ' ',
				note: ' revised ',
				isActive: undefined
			})
		);

		expect(result).toEqual({
			action: 'update',
			targetMaterialId: 12,
			message: 'Material updated'
		});
		expect(itemMasterMocks.updateMaterial).toHaveBeenCalledWith({
			id: 12,
			code: 'MAT-012',
			name: 'Copper plate',
			unit: 'pcs',
			imageUrl: undefined,
			note: 'revised',
			isActive: false
		});
	});

	it('maps domain errors from update to readable messages', async () => {
		itemMasterMocks.updateMaterial.mockRejectedValue(
			new ErpValidationError('Material 99 does not exist')
		);

		const result = await actions.update(
			createEvent({
				id: '99',
				code: 'MAT-099',
				name: 'Missing material',
				unit: 'pcs',
				imageUrl: '',
				note: '',
				isActive: 'on'
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(result).toHaveProperty('data.message', 'Material 99 does not exist');
		expect(
			(result as { data: { updateForm: { errors: { _errors?: string[] } } } }).data.updateForm
				.errors._errors?.[0]
		).toBe('Material 99 does not exist');
	});

	it('maps duplicate-code errors from update to conflict messages', async () => {
		itemMasterMocks.updateMaterial.mockRejectedValue({ code: '23505' });

		const result = await actions.update(
			createEvent({
				id: '12',
				code: 'MAT-012',
				name: 'Copper plate',
				unit: 'pcs',
				imageUrl: '',
				note: '',
				isActive: 'on'
			})
		);

		expect(result).toHaveProperty('status', 400);
		expect(result).toHaveProperty(
			'data.message',
			'Duplicate key conflict, please use a unique code or number'
		);
	});
});
