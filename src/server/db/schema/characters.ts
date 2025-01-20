import {
  index,
  integer,
  primaryKey,
  serial,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createTable } from "~/utils/createTable";
import { users } from "./users";
import { spells } from "./spells";
import { relations, sql } from "drizzle-orm";

export const characters = createTable(
  "character",
  {
    id: serial("id").primaryKey(),
    level: smallint("level").default(1),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (character) => ({
    characterUserIndex: index("character_user_index").on(character.userId),
  }),
);
export const characterRelations = relations(characters, ({ many }) => ({
  learnedSpells: many(learnedSpells),
  books: many(books),
}));

export const learnedSpells = createTable(
  "learned_spell",
  {
    spellId: integer("spellId")
      .references(() => spells.id, { onDelete: "cascade" }) // Deleting spells will probably be made impossible or admin only
      .notNull(),
    charId: integer("charId")
      .references(() => characters.id, { onDelete: "cascade" })
      .notNull(),
    lastFail: smallint("lastFail"),
    learnLvl: smallint("learnLevel"),
    // Updating table without userId:
    //  get learnedSpell with spellId & charId,
    //  get userId from character table,
    //  check if user ids match, if so, allow editing
    // Updating table with userId:
    //  get learnedSpell with spellId & charId,
    //  check if userIds match, if so allow editing
    // saves 1 look up from user table
    userId: varchar("userId", { length: 255 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (ls) => ({
    pk: primaryKey({ columns: [ls.charId, ls.spellId] }),
  }),
);

export const learnedSpellsRelations = relations(learnedSpells, ({ one }) => ({
  character: one(characters, {
    fields: [learnedSpells.charId],
    references: [characters.id],
  }),
  spell: one(spells, {
    fields: [learnedSpells.spellId],
    references: [spells.id],
  }),
}));

export const spellCopy = createTable(
  "spellCopy",
  {
    spellId: integer("spellId")
      .notNull()
      .references(() => spells.id, { onDelete: "cascade" }),
    bookId: integer("bookId")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    pages: integer("pages"),
  },
  (sc) => ({
    compoundKey: primaryKey({
      columns: [sc.spellId, sc.bookId],
    }),
  }),
);

export const spellCopyRelations = relations(spellCopy, ({ one }) => ({
  book: one(books, {
    fields: [spellCopy.bookId],
    references: [books.id],
  }),
  spell: one(spells, {
    fields: [spellCopy.spellId],
    references: [spells.id],
  }),
}));

export const books = createTable(
  "book",
  {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    characterId: integer("characterId")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    maxPages: integer("maxPages").$default(() => 100),
    name: varchar("name", { length: 255 }).notNull(),
  },
  (book) => ({
    bookUserIndex: index("book_user_index").on(book.userId),
    bookCharacterIndex: index("book_character_index").on(book.characterId),
  }),
);

export const bookRelations = relations(books, ({ one, many }) => ({
  owner: one(characters, {
    fields: [books.characterId],
    references: [characters.id],
  }),
  spellCopies: many(spellCopy),
}));
