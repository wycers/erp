import type { PageServerLoad } from './$types';
import { listInventoryOverview } from '$lib/server/erp/inventory-query';

export const load: PageServerLoad = async () => {
	return {
		rows: await listInventoryOverview()
	};
};
