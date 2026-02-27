import type { Actions, PageServerLoad } from './$types';
import {
	createProduct,
	listMaterials,
	listProductBoms,
	listProducts,
	saveFixedBom,
	updateProduct
} from '$lib/server/erp/item-master';
import { toErpActionFailure } from '$lib/server/erp/action-error';
import { parseBomLinesInput } from '$lib/server/erp/line-parser';

const getText = (formData: FormData, key: string): string =>
	formData.get(key)?.toString().trim() ?? '';

export const load: PageServerLoad = async () => {
	const [products, materials, bomByProduct] = await Promise.all([
		listProducts(),
		listMaterials(),
		listProductBoms()
	]);

	return {
		products: products.map((product) => ({
			...product,
			bomLines: bomByProduct.get(product.id) ?? []
		})),
		materials
	};
};

export const actions: Actions = {
	create: async (event) => {
		const formData = await event.request.formData();
		try {
			await createProduct({
				code: getText(formData, 'code'),
				name: getText(formData, 'name'),
				note: getText(formData, 'note')
			});
		} catch (error) {
			return toErpActionFailure(error);
		}
		return { message: 'Product created' };
	},
	update: async (event) => {
		const formData = await event.request.formData();
		try {
			await updateProduct({
				id: Number(formData.get('id')),
				code: getText(formData, 'code'),
				name: getText(formData, 'name'),
				note: getText(formData, 'note'),
				isActive: formData.get('isActive') === 'on'
			});
		} catch (error) {
			return toErpActionFailure(error);
		}
		return { message: 'Product updated' };
	},
	saveBom: async (event) => {
		const formData = await event.request.formData();
		try {
			await saveFixedBom({
				productId: Number(formData.get('productId')),
				lines: parseBomLinesInput(getText(formData, 'lines'))
			});
		} catch (error) {
			return toErpActionFailure(error);
		}
		return { message: 'BOM saved' };
	}
};
