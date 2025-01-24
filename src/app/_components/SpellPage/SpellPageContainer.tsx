"use client";
import { useContext, useRef } from "react";
import { api } from "~/trpc/react";
import {
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
import { toast } from "~/hooks/use-toast";
import { useQueryLocalStorage } from "../hooks/useLocalStorage";

export default function SpellPage() {
  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({
    modalRef: searchModalRef,
    toggleKey: "k",
  });
  const [browseMode] = useQueryLocalStorage(
    "browseMode",
    parseAsNumberLiteral(Object.values(browseModes)),
  );
  const { spells: fullDescSpells, appendSpell } = useContext(
    DescriptionListContext,
  )!;
  const [spells] = api.spell.getSpells.useSuspenseQuery();
  const [characters] = api.character.getMyCharacters.useSuspenseQuery();
  const [characterId] = useQueryLocalStorage("character", parseAsInteger);
  const [bookId] = useQueryLocalStorage("book", parseAsInteger);
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
  const character = characters.find((c) => c.id === characterId);
  const book = character?.books.find((bk) => bk.id === bookId);

  const { mutate: learnSpellMutation } = api.character.learnSpell.useMutation({
    onSuccess: (_, v) => {
      void utils.character.getMyCharacters.invalidate();
      const spell = spells.find((sp) => sp.id === v.spellId);
      if (!character || !spell) return;
      toast({
        title: "Spell learned",
        description: `${character.name} learned ${spell.name}`,
      });
    },
  });

  const { mutate: writeSpellMutation } = api.book.writeSpell.useMutation({
    onSuccess: (_, v) => {
      void utils.character.getMyCharacters.invalidate();
      const spell = spells.find((sp) => sp.id === v.spellId);
      if (!book || !spell) return;
      toast({
        title: "Spell written",
        description: `${spell.name} written into ${book.name}`,
      });
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

  const learnedSpells = character?.learnedSpells.map((ls) => ls.spell);

  const bookSpells = book?.spellCopies.map((sc) => sc.spell);

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
