import type { Actions, PageServerLoad } from './$types';
import { createMaterial, listMaterials, updateMaterial } from '$lib/server/erp/item-master';
import { toErpActionFailure } from '$lib/server/erp/action-error';

const getText = (formData: FormData, key: string): string =>
	formData.get(key)?.toString().trim() ?? '';

export const load: PageServerLoad = async () => {
	const materials = await listMaterials();
	return { materials };
};

export const actions: Actions = {
	create: async (event) => {
		const formData = await event.request.formData();
		try {
			await createMaterial({
				code: getText(formData, 'code'),
				name: getText(formData, 'name'),
				unit: getText(formData, 'unit'),
				imageUrl: getText(formData, 'imageUrl'),
				note: getText(formData, 'note')
			});
		} catch (error) {
			return toErpActionFailure(error);
		}
		return { message: 'Material created' };
	},
	update: async (event) => {
		const formData = await event.request.formData();
		try {
			await updateMaterial({
				id: Number(formData.get('id')),
				code: getText(formData, 'code'),
				name: getText(formData, 'name'),
				unit: getText(formData, 'unit'),
				imageUrl: getText(formData, 'imageUrl'),
				note: getText(formData, 'note'),
				isActive: formData.get('isActive') === 'on'
			});
		} catch (error) {
			return toErpActionFailure(error);
		}
		return { message: 'Material updated' };
	}
};
