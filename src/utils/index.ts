import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Spell } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  if (str.length < 1) return "";
  return str[0]!.toUpperCase() + str.slice(1, str.length);
}

export function getComponentsArray(spell: Spell) {
  const components = [];
  if (spell.verbal) components.push("verbal");
  if (spell.somatic) components.push("somatic");
  if (spell.material) components.push("material");
  return components;
}

export function isSubset<T>(arr1: T[], arr2: T[]) {
  return arr1.every((elem) => arr2.includes(elem));
}
