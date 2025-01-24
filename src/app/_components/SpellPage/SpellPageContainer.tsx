"use client";
import { useContext, useRef } from "react";
import { api } from "~/trpc/react";
import { parseAsJson, useQueryState } from "nuqs";
import { filterSchema, type Spell } from "~/types";
import useModal from "~/app/_components/hooks/useModal";
import { filterSpells } from "./utils";
import SpellPagePresentation from "./SpellPagePresentation";
import { DescriptionListContext } from "../contexts/FullDescSpells";

export default function SpellPage({
  learnSpell,
  writeSpell,
  specificSpells,
}: {
  learnSpell?: (sp: Spell) => void;
  writeSpell?: (sp: Spell) => void;
  specificSpells?: Spell[];
}) {
  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({
    modalRef: searchModalRef,
    toggleKey: "k",
  });

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

  const finalSpells = specificSpells ?? spells;

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
      learnSpell={learnSpell}
      writeSpell={writeSpell}
    />
  );
}
