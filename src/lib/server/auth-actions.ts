import { fail, type ActionFailure } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';

type ActionMessage = {
	message: string;
};

export type SignInCredentials = {
	email: string;
	password: string;
};

export type SignUpCredentials = SignInCredentials & {
	name: string;
};

export const AUTH_CALLBACK_URL = '/auth/verification-success';
export const AUTH_HOME_ROUTE = '/demo/better-auth';
export const AUTH_LOGIN_ROUTE = '/demo/better-auth/login';

const getTextField = (formData: FormData, key: string): string =>
	formData.get(key)?.toString() ?? '';

export const readSignInCredentials = (formData: FormData): SignInCredentials => ({
	email: getTextField(formData, 'email'),
	password: getTextField(formData, 'password')
});

export const readSignUpCredentials = (formData: FormData): SignUpCredentials => ({
	...readSignInCredentials(formData),
	name: getTextField(formData, 'name')
});

export const toAuthActionFailure = (
	error: unknown,
	fallbackMessage: string
): ActionFailure<ActionMessage> => {
	if (error instanceof APIError) {
		return fail(400, { message: error.message || fallbackMessage });
	}

	console.error('[auth] unexpected action error', error);

	return fail(500, { message: 'Unexpected error' });
};
