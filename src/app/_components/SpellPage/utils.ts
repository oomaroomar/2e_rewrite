import { type Spell } from "~/types";
import { getComponentsArray, isSubset } from "~/utils";
import { type filterSchema } from "~/types";
import { type z } from "zod";

export function filterSpells(
  spell: Spell,
  filters: z.infer<typeof filterSchema>,
) {
  if (filters.levels.length > 0 && !filters.levels.includes(spell.level)) {
    return false;
  }

  if (filters.schools.length > 0) {
    const intersection = filters.schools.filter((x) =>
      spell.schools.includes(x),
    );
    if (intersection.length === 0) {
      return false;
    }
  }

  if (filters.damaging !== "any") {
    if (filters.damaging === "damaging" && spell.damage === "") {
      return false;
    }
    if (filters.damaging === "non-damaging" && spell.damage !== "") {
      return false;
    }
  }

  if (filters.components.length > 0) {
    if (!isSubset(getComponentsArray(spell), filters.components)) {
      return false;
    }
  }

  return true;
}
