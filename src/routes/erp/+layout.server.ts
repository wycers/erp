import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { AUTH_LOGIN_ROUTE } from '$lib/server/auth-actions';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, AUTH_LOGIN_ROUTE);
	}

	return {
		user: event.locals.user
	};
};
