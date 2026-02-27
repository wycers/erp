import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { AUTH_HOME_ROUTE } from '$lib/server/auth-actions';

export const load: PageServerLoad = async () => {
	throw redirect(302, AUTH_HOME_ROUTE);
};
