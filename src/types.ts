/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}

// Spell stuff below

export const spheres = [
  "All",
  "Animal",
  "Astral",
  "Chaos",
  "Charm",
  "Combat",
  "Creation",
  "Divination",
  "Elemental",
  "Guardian",
  "Healing",
  "Law",
  "Necromantic",
  "Numbers",
  "Plant",
  "Protection",
  "Summoning",
  "Sun",
  "Time",
  "Thought",
  "Travelers",
  "War",
  "Wards",
  "Weather",
  "Air",
  "Earth",
  "Fire",
  "Water",
] as const;

export const schools = [
  "abjuration",
  "alteration",
  "conjuration",
  "divination",
  "enchantment",
  "invocation",
  "illusion",
  "necromancy",
] as const;

export const castingClasses = ["wizard", "cleric"] as const;
export const spellLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const savingThrows = ["negate", "none", "1/2", "special"] as const;
export const sources = ["PHB", "ToM", "S&M", "CWH", "user", "Koibu"] as const;

export type Sphere = (typeof spheres)[number];
export type School = (typeof schools)[number];
export type CastingClass = (typeof castingClasses)[number];
export type SpellLevel = (typeof spellLevels)[number];
export type SavingThrow = (typeof savingThrows)[number];
export type Source = (typeof sources)[number];
