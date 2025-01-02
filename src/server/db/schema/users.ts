import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  serial,
  timestamp,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";

import { createTable } from "~/utils/createTable";
import { spells } from "./spells";
import { books } from "./characters";

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }),
  image: varchar("image", { length: 255 }),
});

export const favBooks = createTable(
  "favBooks",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    bookId: integer("bookId")
      .notNull()
      .references(() => books.id),
  },
  (t) => ({ pk: primaryKey({ columns: [t.bookId, t.userId] }) }),
);

export const favBooksRelations = relations(favBooks, ({ one }) => ({
  user: one(users, {
    fields: [favBooks.userId],
    references: [users.id],
  }),
  book: one(books, {
    fields: [favBooks.bookId],
    references: [books.id],
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  createdSpells: many(spells),
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2047 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const images = createTable(
  "image",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    url: varchar("url", { length: 1023 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    imageNameIndex: index("image_name_idx").on(example.name),
  }),
);
export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
