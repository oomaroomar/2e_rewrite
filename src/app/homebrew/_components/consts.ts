import { z } from "zod";
import { capitalize } from "~/lib/utils";
import {
  castingClasses,
  schools,
  schoolLabels,
  spheres,
  castingTimes,
  savingThrows,
} from "~/types";

export const fireballText =
  "A fireball is an explosive burst of flame, which detonates with a low roar and delivers damage proportional to the level of the wizard who cast it - 1d6 points of damage for each level of experience of the spellcaster (up to a maximum of 10d6).";

export const schoolOptions = schools.map((school) => ({
  value: school,
  label: capitalize(school),
}));

export const sphereOptions = spheres.map((sphere) => ({
  value: sphere,
  label: capitalize(sphere),
}));

export const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least two characters long.")
    .max(255, "Name cannot exceed 255 characters"),
  level: z
    .number()
    .min(1, "Please select a level")
    .max(9, "Spell must be at most level 9"),
  castingClass: z.enum(castingClasses),
  schools: z
    .object({
      value: z.enum(schools),
      label: z.enum(schoolLabels),
    })
    .array()
    .nonempty("Select at least 1 school"),
  spheres: z
    .object({
      value: z.enum(spheres),
      label: z.enum(spheres),
    })
    .array(),
  somatic: z.boolean().default(true),
  verbal: z.boolean().default(true),
  material: z.boolean().default(true),
  materials: z.string().optional(),
  aoe: z.string(),
  castingTime: z.enum(castingTimes),
  specialCastingTime: z.string().optional(),
  damage: z.string(),
  duration: z.string().min(1, "Please provide a duration"),
  range: z.string().min(1, "Please provide a range"),
  savingThrow: z.enum(savingThrows).default("1/2"),
  specialSavingThrow: z.string().optional(),
  description: z.string().min(5, "Please provide a description"),
});
