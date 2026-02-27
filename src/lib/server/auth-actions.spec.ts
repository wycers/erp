import { describe, expect, it } from 'vitest';
import { APIError } from 'better-auth/api';
import {
	AUTH_CALLBACK_URL,
	AUTH_HOME_ROUTE,
	AUTH_LOGIN_ROUTE,
	readSignInCredentials,
	readSignUpCredentials,
	toAuthActionFailure
} from './auth-actions';

const createFormData = (entries: Record<string, string | undefined>): FormData => {
	const formData = new FormData();

	for (const [key, value] of Object.entries(entries)) {
		if (value !== undefined) {
			formData.set(key, value);
		}
	}

	return formData;
};

const createApiError = (message: string): APIError =>
	Object.assign(Object.create(APIError.prototype), { message }) as APIError;

describe('auth-actions', () => {
	it('exposes stable auth routes', () => {
		expect(AUTH_CALLBACK_URL).toBe('/auth/verification-success');
		expect(AUTH_HOME_ROUTE).toBe('/demo/better-auth');
		expect(AUTH_LOGIN_ROUTE).toBe('/demo/better-auth/login');
	});

	it('reads sign-in credentials from form data', () => {
		const credentials = readSignInCredentials(
			createFormData({
				email: 'hi@example.com',
				password: 'secret'
			})
		);

		expect(credentials).toEqual({
			email: 'hi@example.com',
			password: 'secret'
		});
	});

	it('defaults missing sign-in credentials to empty strings', () => {
		const credentials = readSignInCredentials(createFormData({}));

		expect(credentials).toEqual({
			email: '',
			password: ''
		});
	});

	it('reads sign-up credentials from form data', () => {
		const credentials = readSignUpCredentials(
			createFormData({
				email: 'hi@example.com',
				password: 'secret',
				name: 'Hitomi'
			})
		);

		expect(credentials).toEqual({
			email: 'hi@example.com',
			password: 'secret',
			name: 'Hitomi'
		});
	});

	it('maps API errors to 400 action failures', () => {
		const failure = toAuthActionFailure(createApiError('Invalid credentials'), 'Signin failed');

		expect(failure.status).toBe(400);
		expect(failure.data).toEqual({ message: 'Invalid credentials' });
	});

	it('falls back to default message for empty API error text', () => {
		const failure = toAuthActionFailure(createApiError(''), 'Registration failed');

		expect(failure.status).toBe(400);
		expect(failure.data).toEqual({ message: 'Registration failed' });
	});

	it('maps unexpected errors to 500 action failures', () => {
		const failure = toAuthActionFailure(new Error('boom'), 'Signin failed');

		expect(failure.status).toBe(500);
		expect(failure.data).toEqual({ message: 'Unexpected error' });
	});
});
