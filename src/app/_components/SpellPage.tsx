"use client";
import { BigSpellCard, SmallSpellCard } from "./SpellCard";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { useCallback, useEffect, useRef, useState } from "react";
import { filterSchema, type Spell } from "~/types";
import Placeholder from "./Placeholder";
import { api } from "~/trpc/react";
import { SearchBar } from "~/app/_components/SearchBar/SearchBar";
import SearchModal from "~/app/_components/SearchBar/SearchModal";
import useModal from "~/app/_components/hooks/useModal";
import { parseAsJson, useQueryState } from "nuqs";
import { getComponentsArray, isSubset } from "~/utils";
import { SpellResult } from "./SearchBar/SearchResult";

export default function SpellPage() {
  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({ modalRef: searchModalRef });
  const [spells] = api.spell.getSpells.useSuspenseQuery();
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

  // Return true if the spell passes the filter (i.e. should be displayed)
  function filterSpell(spell: Spell) {
    if (filters.levels.length > 0) {
      if (!filters.levels.includes(spell.level)) {
        return false;
      }
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

  function appendFullDescSpell(sp: Spell) {
    setFullDescSpells((prev) => [sp, ...prev]);
  }
  const ctrlK = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey === true) {
        if (event.key === "k") {
          event.preventDefault();
          setSearchOpen(!isSearchOpen);
        }
      }
    },
    [isSearchOpen, setSearchOpen],
  );

  useEffect(() => {
    document.addEventListener("keydown", ctrlK);
    return () => {
      document.removeEventListener("keydown", ctrlK);
    };
  }, [ctrlK]);

  return (
    <div className="grid h-full w-full grid-rows-[auto,1fr]">
      <SearchBar openSearch={() => setSearchOpen(true)} />
      <ResizablePanelGroup className="w-full" direction="horizontal">
        <ResizablePanel
          style={{ overflow: "auto" }}
          className="hidden overflow-auto pb-8 md:flex"
          defaultSize={50}
        >
          <div className="flex flex-col">
            {fullDescSpells.length > 0 ? (
              fullDescSpells.map((spell, i) => (
                <BigSpellCard key={i} spell={spell} />
              ))
            ) : (
              <Placeholder text="Click a spell to view its entire details." />
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle className="mx-1" />
        <ResizablePanel
          style={{ overflow: "auto" }}
          className="overflow-auto pb-8"
          defaultSize={50}
        >
          <div className="flex flex-wrap">
            <div className="flex flex-wrap">
              {spells
                ? spells.map((spell, i) => {
                    if (!filterSpell(spell)) {
                      return null;
                    }
                    return (
                      <SmallSpellCard
                        onClick={() => appendFullDescSpell(spell)}
                        key={i}
                        spell={spell}
                      />
                    );
                  })
                : "loading"}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      {isSearchOpen && (
        <SearchModal
          searchables={spells}
          modalRef={searchModalRef}
          setClosed={() => setSearchOpen(false)}
          handleSelect={(sp) => setFullDescSpells((prev) => [sp, ...prev])}
          searchKey="name"
          SearchItem={({ item, onSelect }) => (
            <SpellResult spell={item} appendFullDescSpell={onSelect} />
          )}
        />
      )}
    </div>
  );
}
