"use client";

import { parseAsInteger, parseAsNumberLiteral, useQueryState } from "nuqs";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { browseModes, type Spell } from "~/types";
import { useQueryLocalStorage } from "../hooks/useLocalStorage";
import SpellPageContainer from "./SpellPageContainer";

export default function SpellPageUserWrapper() {
  const [browseMode] = useQueryLocalStorage(
    "browseMode",
    parseAsNumberLiteral(Object.values(browseModes)),
  );
  const [characters] = api.character.getMyCharacters.useSuspenseQuery();
  const [characterId] = useQueryState("character", parseAsInteger);
  const [bookId] = useQueryState("book", parseAsInteger);
  const character = characters.find((c) => c.id === characterId);
  const book = character?.books.find((bk) => bk.id === bookId);
  const utils = api.useUtils();

  const { mutate: learnSpellMutation } = api.character.learnSpell.useMutation({
    onSuccess: (_, v) => {
      void utils.character.getMyCharacters.invalidate();
      if (!character) return;
      toast({
        title: "Spell learned",
        description: `${character.name} learned ${v.spellName}`,
      });
    },
  });

  const { mutate: writeSpellMutation } = api.book.writeSpell.useMutation({
    onSuccess: (_, v) => {
      void utils.character.getMyCharacters.invalidate();
      if (!book) return;
      toast({
        title: "Spell written",
        description: `${v.spellName} written into ${book.name}, taking ${v.pages} pages`,
      });
    },
  });
  const learnSpell = (spell: Spell) => {
    if (characterId) {
      learnSpellMutation({
        spellId: spell.id,
        characterId: characterId,
        spellName: spell.name,
      });
    }
  };

  const writeSpell = (spell: Spell, pages: number) => {
    if (characterId && bookId) {
      writeSpellMutation({
        spellId: spell.id,
        bookId: bookId,
        pages: pages,
        spellName: spell.name,
      });
    }
  };

  const learnedSpells = character?.learnedSpells.map((ls) => ls.spell);

  const bookSpells = book?.spellCopies.map((sc) => sc.spell);

  const specificSpells =
    browseMode === browseModes.learned
      ? learnedSpells
      : browseMode === browseModes.book
        ? bookSpells
        : undefined;

  return (
    <SpellPageContainer
      learnSpell={characterId ? learnSpell : undefined}
      writeSpell={bookId ? writeSpell : undefined}
      specificSpells={specificSpells}
    />
  );
}
