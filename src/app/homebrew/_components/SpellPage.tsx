"use client";
import { BigSpellCard, SmallSpellCard } from "./SpellCard";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { useState } from "react";
import { type Spell } from "~/types";
import Placeholder from "./Placeholder";
import { api } from "~/trpc/react";

export default function SpellPage() {
  const [spells] = api.spell.getSpells.useSuspenseQuery();
  const [fullDescSpells, setFullDescSpells] = useState<Spell[]>([]);

  return (
    <main className="h-full w-screen">
      <ResizablePanelGroup className="w-full" direction="horizontal">
        <ResizablePanel
          style={{ overflow: "auto" }}
          className="overflow-auto pb-8"
          defaultSize={50}
        >
          <div className="flex flex-wrap">
            {fullDescSpells.length > 0 ? (
              fullDescSpells.map((spell, i) => (
                <BigSpellCard key={i} spell={spell} />
              ))
            ) : (
              <Placeholder
                className="mt-36"
                text="Click a spell to view its entire details."
              />
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
                ? spells.map((spell, i) => (
                    <SmallSpellCard
                      onClick={() =>
                        setFullDescSpells((prev) => [spell, ...prev])
                      }
                      key={i}
                      spell={spell}
                    />
                  ))
                : "loading"}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
