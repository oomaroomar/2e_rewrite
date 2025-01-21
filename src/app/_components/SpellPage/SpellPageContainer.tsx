"use client";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsJson,
  parseAsNumberLiteral,
  useQueryState,
} from "nuqs";
import { browseModes, filterSchema, type Spell } from "~/types";
import useModal from "~/app/_components/hooks/useModal";
import { filterSpells } from "./utils";
import SpellPagePresentation from "./SpellPagePresentation";
import { DescriptionListContext } from "../contexts/FullDescSpells";

export default function SpellPage() {
  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({
    modalRef: searchModalRef,
    toggleKey: "k",
  });
  const [browseMode] = useQueryState(
    "browseMode",
    parseAsNumberLiteral(Object.values(browseModes)),
  );
  const { spells: fullDescSpells, appendSpell } = useContext(
    DescriptionListContext,
  )!;
  const [spells] = api.spell.getSpells.useSuspenseQuery();
  const [characters] = api.character.getMyCharacters.useSuspenseQuery();
  const [characterId] = useQueryState("character", parseAsInteger);
  const [bookId] = useQueryState("book", parseAsInteger);
  const [filters] = useQueryState(
    "filters",
    // eslint-disable-next-line @typescript-eslint/unbound-method
    parseAsJson(filterSchema.parse).withDefault({
      levels: [],
      schools: [],
      damaging: "any",
      components: [],
    }),
  );

  const utils = api.useUtils();
  const { mutate: learnSpellMutation } = api.character.learnSpell.useMutation({
    onSuccess: async () => {
      await utils.character.getMyCharacters.invalidate();
      alert("Spell learned");
    },
  });

  const { mutate: writeSpellMutation } = api.book.writeSpell.useMutation({
    onSuccess: async () => {
      await utils.character.getMyCharacters.invalidate();
      alert("Spell written down");
    },
  });

  const learnSpell = (spell: Spell) => {
    if (characterId) {
      learnSpellMutation({ spellId: spell.id, characterId: characterId });
    }
  };

  const writeSpell = (spell: Spell) => {
    if (characterId && bookId) {
      writeSpellMutation({ spellId: spell.id, bookId: bookId });
    }
  };

  const learnedSpells = characters
    .find((c) => c.id === characterId)
    ?.learnedSpells.map((ls) => ls.spell);

  const bookSpells = characters
    .find((c) => c.id === characterId)
    ?.books.find((b) => b.id === bookId)
    ?.spellCopies.map((sc) => sc.spell);

  let finalSpells: Spell[] = spells;
  if (browseMode === browseModes.learned) {
    finalSpells = learnedSpells ?? [];
  } else if (browseMode === browseModes.book) {
    finalSpells = bookSpells ?? [];
  }

  const filteredSpells = finalSpells.filter((spell) =>
    filterSpells(spell, filters),
  );

  return (
    <SpellPagePresentation
      spells={filteredSpells}
      fullDescSpells={fullDescSpells}
      isSearchOpen={isSearchOpen}
      searchModalRef={searchModalRef}
      allSpells={finalSpells}
      appendFullDescSpell={(spell) => appendSpell(spell)}
      setSearchOpen={setSearchOpen}
      learnSpell={characterId ? learnSpell : undefined}
      writeSpell={characterId && bookId ? writeSpell : undefined}
    />
  );
}
