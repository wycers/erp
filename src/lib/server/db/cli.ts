import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const { DATABASE_URL, NODE_ENV } = process.env;

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const db =
	NODE_ENV === 'production'
		? drizzleNeon(neon(DATABASE_URL), { schema })
		: drizzlePg(postgres(DATABASE_URL), { schema });
