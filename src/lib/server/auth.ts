import { betterAuth } from 'better-auth/minimal';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from './db';
import { createAuthOptions } from './auth.config';

if (!env.BETTER_AUTH_SECRET) {
	throw new Error('BETTER_AUTH_SECRET is not set');
}

const baseURL = env.BETTER_AUTH_URL ?? env.ORIGIN;

if (!baseURL) {
	throw new Error('BETTER_AUTH_URL or ORIGIN must be set');
}

export const auth = betterAuth({
	...createAuthOptions({
		baseURL,
		secret: env.BETTER_AUTH_SECRET,
		db
	}),
	plugins: [sveltekitCookies(getRequestEvent)]
});
