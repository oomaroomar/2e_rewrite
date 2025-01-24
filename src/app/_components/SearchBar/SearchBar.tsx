"use client";

import {
  schools,
  filterSchema,
  type School,
  type DmgOption,
  type SpellComponent,
  spellLevels,
  specFilters,
  type BrowseMode,
  browseModes,
} from "~/types";
import { LevelFilterButton, SchoolFilterButton } from "./FilterButton";
import {
  parseAsInteger,
  parseAsJson,
  parseAsNumberLiteral,
  useQueryState,
} from "nuqs";
import { Button } from "~/components/ui/button";
import { useRef } from "react";
import SearchModal from "./SearchModal";
import { SpecializationResult } from "./SearchResult";
import useModal from "../hooks/useModal";
import { BookOpen, Brain, Eye, Search } from "lucide-react";
import { TooltipContent } from "~/components/ui/tooltip";
import { TooltipTrigger } from "~/components/ui/tooltip";
import { Tooltip } from "~/components/ui/tooltip";
import { TooltipProvider } from "~/components/ui/tooltip";
import { Toggle } from "~/components/ui/toggle";
import Dropdown from "./Dropdown";
import { useQueryLocalStorage } from "../hooks/useLocalStorage";

export function SearchBar({ openSearch }: { openSearch: () => void }) {
  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({ modalRef: searchModalRef });
  const [browseMode, setBrowseMode] = useQueryLocalStorage<BrowseMode>(
    "browseMode",
    parseAsNumberLiteral(Object.values(browseModes)),
  );
  const [characterId] = useQueryLocalStorage("character", parseAsInteger);
  const [bookId] = useQueryLocalStorage("book", parseAsInteger);
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

  // TODO: add component and damaging filters
  // async function toggleComponent(component: SpellComponent) {
  //   await setFilters((old) => {
  //     if (old.components.includes(component)) {
  //       return {
  //         ...old,
  //         components: old.components.filter((c) => c !== component),
  //       };
  //     } else {
  //       return { ...old, components: [...old.components, component] };
  //     }
  //   });
  // }
  // async function setDamaging(damaging: DmgOption) {
  //   await setFilters((old) => ({ ...old, damaging }));
  // }

  return (
    <nav className="hidden w-full items-center gap-x-3 px-2 py-2 text-xl md:flex">
      <Button variant="outline" className="px-3" onClick={openSearch}>
        <Search />
        <span>Search</span>
        {/* <span>Ctrl + K</span> */}
      </Button>
      <Button
        variant="outline"
        className="px-3"
        onClick={() => setSearchOpen(true)}
      >
        <span>Specialization</span>
      </Button>

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
      <Dropdown>
        {spellLevels.map((level) => (
          <LevelFilterButton
            pressed={filters.levels.includes(level)}
            key={level}
            onClick={() => toggleLevel(level)}
          >
            {level}
          </LevelFilterButton>
        ))}
      </Dropdown>

      {characterId && (
        <div className="flex items-center gap-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  className="px-1 hover:cursor-pointer"
                  onClick={() => setBrowseMode(() => browseModes.all)}
                  pressed={browseMode === browseModes.all}
                >
                  <Eye />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show all spells</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  className="px-1 hover:cursor-pointer data-[state=on]:text-zinc-500"
                  pressed={browseMode === browseModes.learned}
                  onClick={() => setBrowseMode(() => browseModes.learned)}
                >
                  <Brain />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show spells learned by selected character</p>
              </TooltipContent>
            </Tooltip>
            {bookId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle
                    pressed={browseMode === browseModes.book}
                    className="px-1 hover:cursor-pointer"
                    onClick={() => setBrowseMode(() => browseModes.book)}
                  >
                    <BookOpen />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show spells written into selected spellbook</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
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
