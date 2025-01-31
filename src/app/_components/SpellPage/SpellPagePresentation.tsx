import { type RefObject } from "react";
import { type Spell } from "~/types";
import { BigSpellCard, SmallSpellCard } from "../SpellCard";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import Placeholder from "../Placeholder";
import { SearchBar } from "../SearchBar/SearchBar";

interface SpellPagePresentationProps {
  spells: Spell[];
  fullDescSpells: Spell[];
  isSearchOpen: boolean;
  searchModalRef: RefObject<HTMLInputElement>;
  allSpells: Spell[];
  appendFullDescSpell: (spell: Spell) => void;
  setSearchOpen: (open: boolean) => void;
  learnSpell?: (spell: Spell) => void;
  writeSpell?: (spell: Spell, pages: number) => void;
}

export default function SpellPagePresentation({
  spells,
  fullDescSpells,
  appendFullDescSpell,
  setSearchOpen,
  learnSpell,
  writeSpell,
}: SpellPagePresentationProps) {
  return (
    <div className="grid h-full w-full grid-rows-[auto,1fr]">
      <SearchBar openSearch={() => setSearchOpen(true)} />
      <ResizablePanelGroup className="w-full" direction="horizontal">
        <ResizablePanel
          style={{ overflow: "auto" }}
          className="hidden overflow-auto pb-8 md:flex"
          defaultSize={50}
        >
          <div className="flex flex-col gap-4 p-4">
            {fullDescSpells.length > 0 ? (
              fullDescSpells.map((spell, i) => (
                <BigSpellCard
                  writeSpell={writeSpell}
                  learnSpell={learnSpell}
                  key={i}
                  spell={spell}
                />
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
          <div className="flex flex-wrap gap-4 p-4">
            {spells.map((spell, i) => (
              <SmallSpellCard
                onClick={() => appendFullDescSpell(spell)}
                key={i}
                spell={spell}
              />
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
