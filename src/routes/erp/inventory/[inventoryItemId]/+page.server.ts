import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getInventoryItemDetail, listInventoryMovements } from '$lib/server/erp/inventory-query';

export const load: PageServerLoad = async ({ params }) => {
	const inventoryItemId = Number(params.inventoryItemId);
	if (!Number.isInteger(inventoryItemId) || inventoryItemId <= 0) {
		throw error(400, 'Invalid inventory item id');
	}

	try {
		const [item, movements] = await Promise.all([
			getInventoryItemDetail(inventoryItemId),
			listInventoryMovements(inventoryItemId)
		]);
		return { item, movements };
	} catch (err) {
		throw error(404, (err as Error).message);
	}
};
