import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { AUTH_LOGIN_ROUTE } from '$lib/server/auth-actions';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, AUTH_LOGIN_ROUTE);
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		throw redirect(302, AUTH_LOGIN_ROUTE);
	}
};
