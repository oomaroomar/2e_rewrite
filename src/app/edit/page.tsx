"use client";

import { api } from "~/trpc/react";
import SearchModal from "../_components/SearchBar/SearchModal";
import { useState } from "react";
import { SpellResult } from "../_components/SearchBar/SearchResult";
import { Button } from "~/components/ui/button";
import { type Spell } from "~/types";

export default function EditPage() {
  const [spells] = api.spell.getSpells.useSuspenseQuery();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

  return (
    <div>
      {isOpen && (
        <SearchModal
          searchKey="name"
          searchables={spells}
          isOpen={isOpen}
          setClosed={() => setIsOpen(false)}
          SearchItem={({ item, onSelect }) => (
            <SpellResult spell={item} onClick={onSelect} />
          )}
          handleSelect={(spell) => {
            setIsOpen(false);
            setSelectedSpell(spell);
          }}
        />
      )}
    </div>
  );
}
