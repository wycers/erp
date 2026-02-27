import { fail, type ActionFailure } from '@sveltejs/kit';
import { ErpValidationError, InventoryInsufficientError } from './errors';

type ErrorMessage = { message: string };

export const toErpActionFailure = (error: unknown): ActionFailure<ErrorMessage> => {
	if (error instanceof ErpValidationError || error instanceof InventoryInsufficientError) {
		return fail(400, { message: error.message });
	}

	if (typeof error === 'object' && error !== null && 'code' in error) {
		const code = String((error as { code?: unknown }).code);
		if (code === '23505') {
			return fail(400, { message: 'Duplicate key conflict, please use a unique code or number' });
		}
	}

	console.error(error);
	return fail(500, { message: 'Unexpected server error' });
};
