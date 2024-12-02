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
    verbal: boolean("verbal").notNull(),
    somatic: boolean("somatic").notNull(),
    material: boolean("material").notNull(),
    materials: text("materials"),
    range: text("range"),
    aoe: text("aoe"),
    castingTime: text("castingTime").notNull(),
    duration: text("castingTime"),
    savingThrow: text("castingTime"),
    damage: text("castingTime"),
    description: text("castingTime").notNull(),
    source: sourceEnum("source"),
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
