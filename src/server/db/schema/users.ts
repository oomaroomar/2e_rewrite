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
import { books, characters } from "./characters";

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

export const favCharacters = createTable(
  "favCharacters",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    charId: integer("charId")
      .notNull()
      .references(() => characters.id),
  },
  (t) => ({ pk: primaryKey({ columns: [t.charId, t.userId] }) }),
);

export const favCharactersRelations = relations(favCharacters, ({ one }) => ({
  user: one(users, {
    fields: [favCharacters.charId],
    references: [users.id],
  }),
  character: one(characters, {
    fields: [favCharacters.charId],
    references: [characters.id],
  }),
}));

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
  favCharacters: many(characters),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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
