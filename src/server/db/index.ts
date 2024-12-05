// src/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as charSchema from "./schema/characters";
import * as spellSchema from "./schema/spells";
import * as userSchema from "./schema/users";

config({ path: ".env" }); // or .env.local
export const schema = { ...charSchema, ...spellSchema, ...userSchema };

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
