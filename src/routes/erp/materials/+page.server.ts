import { fail, type ActionFailure } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { createMaterial, listMaterials, updateMaterial } from '$lib/server/erp/item-master';
import { toErpActionFailure } from '$lib/server/erp/action-error';
import { createMaterialFormSchema, updateMaterialFormSchema } from '$lib/application/erp/schemas';

const createMaterialAdapter = zod4(createMaterialFormSchema);
const updateMaterialAdapter = zod4(updateMaterialFormSchema);

const createUpdateFormId = (materialId: number): string => `material-update-${materialId}`;

const toActionErrorMessage = (error: unknown): { status: number; message: string } => {
	const failure = toErpActionFailure(error) as ActionFailure<{ message: string }>;
	return {
		status: failure.status,
		message: failure.data.message
	};
};

export const load: PageServerLoad = async () => {
	const materials = await listMaterials();
	const createForm = await superValidate(createMaterialAdapter);
	const updateForms = await Promise.all(
		materials.map((material) =>
			superValidate(
				{
					id: material.id,
					code: material.code,
					name: material.name,
					unit: material.unit ?? '',
					imageUrl: material.imageUrl ?? '',
					note: material.note ?? '',
					isActive: material.isActive
				},
				updateMaterialAdapter,
				{
					id: createUpdateFormId(material.id)
				}
			)
		)
	);

	return { materials, createForm, updateForms };
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event.request, createMaterialAdapter);
		if (!form.valid) {
			return fail(400, { form, action: 'create' });
		}

		const payload = form.data as z.infer<typeof createMaterialFormSchema>;

		try {
			await createMaterial({
				code: payload.code,
				name: payload.name,
				unit: payload.unit,
				imageUrl: payload.imageUrl,
				note: payload.note
			});
		} catch (error) {
			const mapped = toActionErrorMessage(error);
			return message(form, mapped.message, { status: mapped.status as 400 });
		}

		return message(form, 'Material created');
	},
	update: async (event) => {
		const formData = await event.request.formData();
		const targetMaterialId = Number(formData.get('id'));

		const form = await superValidate(formData, updateMaterialAdapter, {
			id: createUpdateFormId(targetMaterialId)
		});

		if (!form.valid) {
			return fail(400, {
				action: 'update',
				targetMaterialId,
				updateForm: form
			});
		}

		const payload = form.data as z.infer<typeof updateMaterialFormSchema>;

		try {
			await updateMaterial({
				id: payload.id,
				code: payload.code,
				name: payload.name,
				unit: payload.unit,
				imageUrl: payload.imageUrl,
				note: payload.note,
				isActive: payload.isActive
			});
		} catch (error) {
			const mapped = toActionErrorMessage(error);
			form.valid = false;
			form.message = mapped.message;
			form.errors._errors = [mapped.message];
			return fail(mapped.status, {
				action: 'update',
				targetMaterialId,
				updateForm: form,
				message: mapped.message
			});
		}

		return { action: 'update', targetMaterialId, message: 'Material updated' };
	}
};
