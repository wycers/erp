import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import {
	AUTH_CALLBACK_URL,
	AUTH_HOME_ROUTE,
	readSignInCredentials,
	readSignUpCredentials,
	toAuthActionFailure
} from '$lib/server/auth-actions';

const executeAuthAction = async (action: () => Promise<unknown>, fallbackMessage: string) => {
	try {
		await action();
	} catch (error) {
		return toAuthActionFailure(error, fallbackMessage);
	}

	throw redirect(302, AUTH_HOME_ROUTE);
};

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		throw redirect(302, AUTH_HOME_ROUTE);
	}
	return {};
};

export const actions: Actions = {
	signInEmail: async (event) => {
		const credentials = readSignInCredentials(await event.request.formData());

		return executeAuthAction(
			() =>
				auth.api.signInEmail({
					body: {
						...credentials,
						callbackURL: AUTH_CALLBACK_URL
					}
				}),
			'Signin failed'
		);
	},
	signUpEmail: async (event) => {
		const credentials = readSignUpCredentials(await event.request.formData());

		return executeAuthAction(
			() =>
				auth.api.signUpEmail({
					body: {
						...credentials,
						callbackURL: AUTH_CALLBACK_URL
					}
				}),
			'Registration failed'
		);
	}
};
