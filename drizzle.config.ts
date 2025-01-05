import { defineConfig } from "drizzle-kit";

import { env } from "~/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["2e_rewrite_*"],
});
