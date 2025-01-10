"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { parseAsJson, useQueryState } from "nuqs";
import { filterSchema, type Spell } from "~/types";
import useModal from "~/app/_components/hooks/useModal";
import { filterSpells } from "./utils";
import SpellPagePresentation from "./SpellPagePresentation";

export default function SpellPage({
  magics,
  learnSpell,
}: {
  magics?: Spell[];
  learnSpell?: (spell: Spell) => void;
}) {
  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({ modalRef: searchModalRef });
  const [spells] = magics ? [magics] : api.spell.getSpells.useSuspenseQuery();
  const [fullDescSpells, setFullDescSpells] = useState<Spell[]>([]);
  const [filters, setFilters] = useQueryState(
    "filters",
    // eslint-disable-next-line @typescript-eslint/unbound-method
    parseAsJson(filterSchema.parse).withDefault({
      levels: [],
      schools: [],
      damaging: "any",
      components: [],
    }),
  );

  const appendFullDescSpell = (sp: Spell) => {
    setFullDescSpells((prev) => [sp, ...prev]);
  };

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

  const filteredSpells = spells.filter((spell) => filterSpells(spell, filters));

  return (
    <SpellPagePresentation
      spells={filteredSpells}
      fullDescSpells={fullDescSpells}
      isSearchOpen={isSearchOpen}
      searchModalRef={searchModalRef}
      allSpells={spells}
      appendFullDescSpell={appendFullDescSpell}
      setSearchOpen={setSearchOpen}
      learnSpell={learnSpell}
    />
  );
}
