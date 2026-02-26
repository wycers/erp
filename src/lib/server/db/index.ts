import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export const db = dev
	? drizzlePg(postgres(env.DATABASE_URL), { schema })
	: drizzleNeon(neon(env.DATABASE_URL), { schema });
