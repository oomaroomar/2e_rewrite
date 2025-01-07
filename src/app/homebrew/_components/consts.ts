import { z } from "zod";
import { capitalize } from "~/utils";
import {
  schools,
  schoolLabels,
  spheres,
  castingTimes,
  savingThrows,
  spellSchema,
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

export const formSchema = spellSchema
  .omit({
    source: true,
    castingTime: true,
    savingThrow: true,
    schools: true,
    spheres: true,
    materials: true,
  })
  .extend({
    castingTime: z.enum(castingTimes),
    specialCastingTime: z.string().optional(),
    savingThrow: z.enum(savingThrows).default("1/2"),
    specialSavingThrow: z.string().optional(),
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
      .array()
      .optional(),
    materials: z.string().optional(),
  });
