import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "~/hooks/use-toast";
import { type Book, type Spell } from "~/types";
import { type Character } from "~/clientTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  if (str.length < 1) return "";
  return str[0]!.toUpperCase() + str.slice(1, str.length);
}

export function getComponentsArray(spell: Spell) {
  const components = [];
  if (spell.somatic) components.push("somatic");
  if (spell.verbal) components.push("verbal");
  if (spell.material) components.push("material");
  return components;
}

export function isSubset<T>(arr1: T[], arr2: T[]) {
  return arr1.every((elem) => arr2.includes(elem));
}

export function getRandomCharacterCreationPhrase() {
  const phrases = [
    "has been born!",
    "has teleported in!",
    "'s invisiblity was dispelled!",
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

export function getRandomBookCreationPhrase(bookName: string) {
  const phrases = [
    `${bookName} has been created!`,
    `The pages of ${bookName} have been bound!`,
    `${bookName}'s cover has been cured!`,
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

export function getRandomSpellCreationPhrase(spellName: string) {
  const phrases = [
    `${spellName} has been created! Hopefully you can afford its components...`,
    `The research of ${spellName} was a success!`,
    `Huzzah, a new spell! ${spellName} has been created!`,
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

export function isInteractiveElement(element: HTMLElement) {
  const interactiveElements = [
    "button",
    "input",
    "textarea",
    "select",
    "option",
  ];

  if (interactiveElements.includes(element.tagName.toLowerCase())) {
    return true;
  }

  return false;
}

export function copyBookUrl(book: Book) {
  const bookurl = `${window.location.origin}/book/${book.id}`;
  void navigator.clipboard.writeText(bookurl);
  toast({
    title: "Copied to clipboard",
    description: bookurl,
  });
}

export function copyCharacterUrl(character: Character) {
  const characterurl = `${window.location.origin}/character/${character.id}`;
  void navigator.clipboard.writeText(characterurl);
  toast({
    title: "Copied to clipboard",
    description: characterurl,
  });
}

export function getPagesLeft(book: Book) {
  if (!book.maxPages) return "unlimited";
  const pagesLeft =
    book.maxPages -
    book.spellCopies.reduce((acc, curr) => {
      return acc + (curr.pages ?? 0);
    }, 0);
  return `${pagesLeft}/${book.maxPages}`;
}
