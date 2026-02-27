import { betterAuth } from 'better-auth/minimal';
import { db } from './db/cli';
import { createAuthOptions } from './auth.config';

const { BETTER_AUTH_SECRET, BETTER_AUTH_URL, ORIGIN } = process.env;

if (!BETTER_AUTH_SECRET) {
	throw new Error('BETTER_AUTH_SECRET is not set');
}

const baseURL = BETTER_AUTH_URL ?? ORIGIN;

if (!baseURL) {
	throw new Error('BETTER_AUTH_URL or ORIGIN must be set');
}

export const auth = betterAuth(
	createAuthOptions({
		baseURL,
		secret: BETTER_AUTH_SECRET,
		db
	})
);
