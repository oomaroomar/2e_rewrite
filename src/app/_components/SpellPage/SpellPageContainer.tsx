"use client";
import { useContext, useRef } from "react";
import { api } from "~/trpc/react";
import { parseAsJson, useQueryState } from "nuqs";
import { filterSchema, type Spell } from "~/types";
import useModal from "~/app/_components/hooks/useModal";
import { filterSpells } from "./utils";
import SpellPagePresentation from "./SpellPagePresentation";
import { DescriptionListContext } from "../contexts/FullDescSpells";
import SearchModal from "../SearchBar/SearchModal";
import { toast } from "~/hooks/use-toast";
import { SpellResult } from "../SearchBar/SearchResult";

export default function SpellPageContainer({
  learnSpell,
  writeSpell,
  specificSpells,
}: {
  learnSpell?: (sp: Spell) => void;
  writeSpell?: (sp: Spell, pages: number) => void;
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
    <>
      <SpellPagePresentation
        spells={filteredSpells}
        fullDescSpells={fullDescSpells}
        isSearchOpen={isSearchOpen}
        searchModalRef={searchModalRef}
        allSpells={spells}
        appendFullDescSpell={(spell) => appendSpell(spell)}
        setSearchOpen={setSearchOpen}
        learnSpell={learnSpell}
        writeSpell={writeSpell}
      />
      {isSearchOpen && (
        <SearchModal
          searchables={spells}
          modalRef={searchModalRef}
          setClosed={() => setSearchOpen(false)}
          isOpen={isSearchOpen}
          handleSelect={(spell) => {
            appendSpell(spell);
            toast({
              title: "Spell added",
              description: spell.name,
              className: `border-${spell.schools[0]}`,
            });
          }}
          searchKey="name"
          SearchItem={({ item, onSelect }) => (
            <SpellResult spell={item} onClick={onSelect} />
          )}
        />
      )}
    </>
  );
}
