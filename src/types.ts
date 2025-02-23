import { z } from "zod";

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
  "illusion",
  "invocation",
  "necromancy",
] as const;
export const schoolLabels = [
  "Abjuration",
  "Alteration",
  "Conjuration",
  "Divination",
  "Enchantment",
  "Illusion",
  "Invocation",
  "Necromancy",
] as const;

export const castingClasses = ["wizard", "cleric"] as const;
export const castingTimes = [
  "special",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;
export const spellLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const savingThrows = ["negate", "none", "1/2", "special"] as const;
export const sources = [
  "PHB",
  "ToM",
  "S&M",
  "CWH",
  "user",
  "Koibu",
  "homebrew",
] as const;
export const dmgOptions = ["damaging", "non-damaging", "any"] as const;
export const components = ["somatic", "verbal", "material"] as const;

export type Sphere = (typeof spheres)[number];
export type School = (typeof schools)[number];
export type CastingClass = (typeof castingClasses)[number];
export type CastingTime = (typeof castingTimes)[number];
export type SpellLevel = (typeof spellLevels)[number];
export type SavingThrow = (typeof savingThrows)[number];
export type Source = (typeof sources)[number];
export type DmgOption = (typeof dmgOptions)[number];
export type SpellComponent = (typeof components)[number];

export const filterSchema = z.object({
  components: z.array(z.enum(components)),
  damaging: z.enum(dmgOptions),
  schools: z.array(z.enum(schools)),
  levels: z.array(z.number().min(1).max(9)),
});

export const spellSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least two characters long.")
    .max(255, "Name cannot exceed 255 characters"),
  level: z
    .number()
    .min(1, "Please select a level")
    .max(9, "Spell must be at most level 9"),
  castingClass: z.enum(castingClasses),
  schools: z.enum(schools).array(),
  spheres: z.enum(spheres).array().optional(),
  somatic: z.boolean().default(true),
  verbal: z.boolean().default(true),
  material: z.boolean().default(true),
  materials: z.string(),
  aoe: z.string(),
  castingTime: z.string(),
  damage: z.string(),
  savingThrow: z.string(),
  duration: z.string(),
  range: z.string(),
  description: z.array(z.string()),
  source: z.string(),
});

export type Spell = z.infer<typeof spellSchema> & { id: number };

export type Book = {
  id: number;
  characterId: number;
  maxPages: number | null;
  name: string;
  spellCopies: {
    spell: Spell;
    pages: number | null;
  }[];
};

export const browseModes = {
  all: 0,
  learned: 1,
  book: 2,
} as const;

export type BrowseMode = (typeof browseModes)[keyof typeof browseModes];

export const batchSpellsSchema = spellSchema
  .omit({ source: true })
  .extend({ source: z.enum(sources) })
  .array();

export const preBatchSpellSchema = spellSchema
  .omit({ source: true, description: true })
  .extend({ source: z.enum(sources), description: z.string() })
  .array();

export const specFilters = {
  alteration: [
    "conjuration",
    "divination",
    "enchantment",
    "illusion",
    "invocation",
    "alteration",
  ],
  abjuration: [
    "conjuration",
    "divination",
    "enchantment",
    "invocation",
    "necromancy",
    "abjuration",
  ],
  conjuration: [
    "abjuration",
    "alteration",
    "enchantment",
    "illusion",
    "necromancy",
    "conjuration",
  ],
  divination: [
    "abjuration",
    "alteration",
    "enchantment",
    "illusion",
    "invocation",
    "necromancy",
    "divination",
  ],
  enchantment: [
    "abjuration",
    "alteration",
    "conjuration",
    "divination",
    "illusion",
    "enchantment",
  ],
  invocation: [
    "abjuration",
    "alteration",
    "divination",
    "illusion",
    "necromancy",
    "invocation",
  ],
  illusion: [
    "alteration",
    "conjuration",
    "divination",
    "enchantment",
    "illusion",
  ],
  necromancy: [
    "abjuration",
    "alteration",
    "conjuration",
    "divination",
    "invocation",
    "necromancy",
  ],
  "": [],
} as const;
