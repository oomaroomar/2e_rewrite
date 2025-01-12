"use client";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { parseAsJson, useQueryState } from "nuqs";
import { filterSchema, type Spell } from "~/types";
import useModal from "~/app/_components/hooks/useModal";
import { filterSpells } from "./utils";
import SpellPagePresentation from "./SpellPagePresentation";
import { DescriptionListContext } from "../contexts/FullDescSpells";

export default function SpellPage({
  magics,
  learnSpell,
}: {
  magics?: Spell[];
  learnSpell?: (spell: Spell) => void;
  defaultShowLearnedOnly?: boolean;
}) {
  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({ modalRef: searchModalRef });
  // const [fullDescSpells, setFullDescSpells] = useState<Spell[]>([]);
  const { spells: fullDescSpells, appendSpell } = useContext(
    DescriptionListContext,
  )!;
  const [spells] = api.spell.getSpells.useSuspenseQuery();
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
  const ctrlK = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
    },
    [isSearchOpen, setSearchOpen],
  );
  useEffect(() => {
    document.addEventListener("keydown", ctrlK);
    return () => document.removeEventListener("keydown", ctrlK);
  }, [ctrlK]);

  const appendFullDescSpell = (sp: Spell) => {
    appendSpell(sp);
  };

  const finalSpells = magics ? magics : spells;
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
      appendFullDescSpell={appendFullDescSpell}
      setSearchOpen={setSearchOpen}
      learnSpell={learnSpell}
    />
  );
}
