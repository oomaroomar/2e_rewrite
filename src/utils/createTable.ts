import { pgTableCreator } from "drizzle-orm/pg-core";

// Add name in front to use one db for multiple projects
export const createTable = pgTableCreator((name) => `2e_rewrite_${name}`);
