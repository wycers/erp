import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as authSchema from './db/auth.schema';

type AuthOptionsInput = {
	baseURL: string;
	secret: string;
	db: unknown;
};

export const createAuthOptions = ({ baseURL, secret, db }: AuthOptionsInput) => ({
	baseURL,
	secret,
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: authSchema
	}),
	emailAndPassword: { enabled: true }
});
