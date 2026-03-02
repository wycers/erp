import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import {
	createProductFormSchema,
	saveProductBomFormSchema,
	updateProductFormSchema
} from '$lib/application/erp/schemas';
import {
	createProduct,
	listMaterials,
	listProductBoms,
	listProducts,
	saveFixedBom,
	updateProduct
} from '$lib/server/erp/item-master';
import { parseBomLinesInput } from '$lib/server/erp/line-parser';
import { setFormMessageError, toActionErrorMessage } from '$lib/server/erp/superforms-action';

const createProductAdapter = zod4(createProductFormSchema);
const updateProductAdapter = zod4(updateProductFormSchema);
const saveProductBomAdapter = zod4(saveProductBomFormSchema);

const createUpdateFormId = (productId: number): string => `product-update-${productId}`;
const createBomFormId = (productId: number): string => `product-bom-${productId}`;

const serializeBomLines = (
	lines: {
		materialSkuId: number;
		quantityPerUnit: number;
	}[]
): string => lines.map((line) => `${line.materialSkuId},${line.quantityPerUnit}`).join('\n');

export const load: PageServerLoad = async () => {
	const [products, materials, bomByProduct] = await Promise.all([
		listProducts(),
		listMaterials(),
		listProductBoms()
	]);

	const productsWithBom = products.map((product) => ({
		...product,
		bomLines: bomByProduct.get(product.id) ?? []
	}));

	const createForm = await superValidate(createProductAdapter);
	const updateForms = await Promise.all(
		productsWithBom.map((product) =>
			superValidate(
				{
					id: product.id,
					code: product.code,
					name: product.name,
					unit: product.unit ?? '',
					note: product.note ?? '',
					isActive: product.isActive
				},
				updateProductAdapter,
				{
					id: createUpdateFormId(product.id)
				}
			)
		)
	);

	const bomForms = await Promise.all(
		productsWithBom.map((product) =>
			superValidate(
				{
					productId: product.id,
					lines: serializeBomLines(product.bomLines)
				},
				saveProductBomAdapter,
				{
					id: createBomFormId(product.id)
				}
			)
		)
	);

	return {
		products: productsWithBom,
		materials,
		createForm,
		updateForms,
		bomForms
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event.request, createProductAdapter);
		if (!form.valid) {
			return fail(400, { form, action: 'create' });
		}

		try {
			await createProduct({
				code: form.data.code,
				name: form.data.name,
				unit: form.data.unit,
				note: form.data.note
			});
		} catch (error) {
			const mapped = toActionErrorMessage(error);
			return fail(mapped.status, {
				action: 'create',
				form: setFormMessageError(form, mapped.message),
				message: mapped.message
			});
		}

		return {
			action: 'create',
			...message(form, 'Product created')
		};
	},
	update: async (event) => {
		const formData = await event.request.formData();
		const targetProductId = Number(formData.get('id'));
		const form = await superValidate(formData, updateProductAdapter, {
			id: createUpdateFormId(targetProductId)
		});

		if (!form.valid) {
			return fail(400, {
				action: 'update',
				targetProductId,
				updateForm: form
			});
		}

		try {
			await updateProduct({
				id: form.data.id,
				code: form.data.code,
				name: form.data.name,
				unit: form.data.unit,
				note: form.data.note,
				isActive: form.data.isActive
			});
		} catch (error) {
			const mapped = toActionErrorMessage(error);
			return fail(mapped.status, {
				action: 'update',
				targetProductId,
				updateForm: setFormMessageError(form, mapped.message),
				message: mapped.message
			});
		}

		return {
			action: 'update',
			targetProductId,
			message: 'Product updated'
		};
	},
	saveBom: async (event) => {
		const formData = await event.request.formData();
		const targetProductId = Number(formData.get('productId'));
		const form = await superValidate(formData, saveProductBomAdapter, {
			id: createBomFormId(targetProductId)
		});

		if (!form.valid) {
			return fail(400, {
				action: 'saveBom',
				targetProductId,
				bomForm: form
			});
		}

		try {
			await saveFixedBom({
				productId: form.data.productId,
				lines: parseBomLinesInput(form.data.lines)
			});
		} catch (error) {
			const mapped = toActionErrorMessage(error);
			return fail(mapped.status, {
				action: 'saveBom',
				targetProductId,
				bomForm: setFormMessageError(form, mapped.message),
				message: mapped.message
			});
		}

		return {
			action: 'saveBom',
			targetProductId,
			message: 'BOM saved'
		};
	}
};
