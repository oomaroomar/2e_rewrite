"use client";

import {
  schools,
  filterSchema,
  type School,
  type DmgOption,
  type SpellComponent,
  spellLevels,
  specFilters,
} from "~/types";
import { BorderedSearchBarBtn } from "./SearchBarBtn";
import { LevelFilterButton, SchoolFilterButton } from "./FilterButton";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsJson,
  useQueryState,
} from "nuqs";
import { Button } from "~/components/ui/button";
import { useRef } from "react";
import SearchModal from "./SearchModal";
import { SpecializationResult } from "./SearchResult";
import useModal from "../hooks/useModal";
import { Switch } from "~/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export function SearchBar({ openSearch }: { openSearch: () => void }) {
  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({ modalRef: searchModalRef });
  const [showLearnedOnly, setShowLearnedOnly] = useQueryState(
    "learnedOnly",
    parseAsBoolean,
  );
  const [character] = useQueryState("character", parseAsInteger);
  const [filters, setFilters] = useQueryState(
    "filters",
    // eslint-disable-next-line @typescript-eslint/unbound-method
    parseAsJson(filterSchema.parse).withDefault({
      levels: [],
      schools: [...schools],
      damaging: "any",
      components: [],
    }),
  );

  async function toggleLevel(level: number) {
    await setFilters((old) => {
      if (old.levels.includes(level)) {
        return { ...old, levels: old.levels.filter((l) => l !== level) };
      } else {
        return { ...old, levels: [...old.levels, level] };
      }
    });
  }

  async function toggleSchool(school: School) {
    await setFilters((old) => {
      if (old.schools.includes(school)) {
        return { ...old, schools: old.schools.filter((s) => s !== school) };
      } else {
        return { ...old, schools: [...old.schools, school] };
      }
    });
  }
  async function setSchools(schools: School[]) {
    await setFilters((old) => ({ ...old, schools }));
  }
  async function toggleComponent(component: SpellComponent) {
    await setFilters((old) => {
      if (old.components.includes(component)) {
        return {
          ...old,
          components: old.components.filter((c) => c !== component),
        };
      } else {
        return { ...old, components: [...old.components, component] };
      }
    });
  }
  async function setDamaging(damaging: DmgOption) {
    await setFilters((old) => ({ ...old, damaging }));
  }

  return (
    <nav className="hidden w-full items-center gap-x-4 border-b border-black px-2 py-2 text-xl md:flex">
      <BorderedSearchBarBtn
        text="Quick search..."
        text2="Ctrl + K"
        onClick={openSearch}
      />
      <BorderedSearchBarBtn
        text="Specialization"
        onClick={() => setSearchOpen(true)}
      />
      <ul className="flex gap-x-1">
        {schools.map((school) => (
          <SchoolFilterButton
            pressed={!filters.schools.includes(school)}
            school={school}
            onClick={() => toggleSchool(school)}
            key={school}
          />
        ))}
      </ul>
      <ul className="flex gap-x-1">
        {spellLevels.map((level) => (
          <LevelFilterButton
            pressed={filters.levels.includes(level)}
            key={level}
            onClick={() => toggleLevel(level)}
          >
            {level}
          </LevelFilterButton>
        ))}
      </ul>
      {character && (
        <div className="flex items-center gap-x-2">
          <h4 className="text-sm">Toggle between learned only/all</h4>
          <Switch
            checked={showLearnedOnly ?? false}
            onCheckedChange={setShowLearnedOnly}
          />
        </div>
      )}
      <Button
        onClick={() =>
          setFilters({
            levels: [],
            schools: [...schools],
            damaging: "any",
            components: [],
          })
        }
      >
        Reset filters
      </Button>
      {/* <div>additional filters</div> */}
      {isSearchOpen && (
        <SearchModal
          searchables={[...schools.map((s) => ({ id: s }))]}
          modalRef={searchModalRef}
          setClosed={() => setSearchOpen(false)}
          handleSelect={(sc) => setSchools([...specFilters[sc.id]])}
          fuseOptions={{
            keys: ["id"],
            threshold: 0.6,
            minMatchCharLength: 0,
          }}
          SearchItem={({ item, onSelect }) => (
            <SpecializationResult school={item} setSchoolFilters={onSelect} />
          )}
        />
      )}
    </nav>
  );
}
