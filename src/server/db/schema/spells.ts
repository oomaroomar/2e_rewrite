import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  serial,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  sources,
  castingClasses,
  savingThrows,
  schools,
  spheres,
} from "~/types";
import { createTable } from "~/utils/createTable";
import { users } from "./users";

export const castingClassEnum = pgEnum("castingClass", castingClasses);
export const schoolEnum = pgEnum("school", schools);
export const savingThrowEnum = pgEnum("savingThrow", savingThrows);
export const sourceEnum = pgEnum("source", sources);
export const sphereEnum = pgEnum("sphere", spheres);

export const spells = createTable(
  "spell",
  {
    id: serial("id").primaryKey(),
    level: smallint("level").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    schools: schoolEnum("schools")
      .array()
      .notNull()
      .default(sql`ARRAY[]::school[]`),
    castingClass: castingClassEnum("castingClass").notNull(),
    verbal: boolean("verbal").notNull().default(false),
    somatic: boolean("somatic").notNull().default(false),
    material: boolean("material").notNull().default(false),
    materials: text("materials").notNull().default(""),
    range: text("range").notNull().default(""),
    aoe: text("aoe").notNull().default(""),
    castingTime: text("castingTime").notNull().default(""),
    duration: text("duration").notNull().default(""),
    savingThrow: text("savingThrow").notNull().default(""),
    damage: text("damage").notNull().default(""),
    description: text("description").array().notNull().default([]),
    source: sourceEnum("source").notNull().default("homebrew"),
    spheres: sphereEnum("spheres")
      .array()
      .notNull()
      .default(sql`ARRAY[]::sphere[]`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    creatorId: varchar("creatorId", { length: 255 }).references(
      () => users.id,
      { onDelete: "no action" },
    ),
  },
  (spell) => ({
    nameIndex: index("name_idx").on(spell.name),
    levelIndex: index("level_idx").on(spell.level),
    classIndex: index("class_idx").on(spell.castingClass),
  }),
);

export const spellRelations = relations(spells, ({ one }) => ({
  creator: one(users, {
    fields: [spells.creatorId],
    references: [users.id],
  }),
}));
