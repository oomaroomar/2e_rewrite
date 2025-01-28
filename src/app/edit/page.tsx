"use client";

import { api } from "~/trpc/react";
import SearchModal from "../_components/SearchBar/SearchModal";
import { useState } from "react";
import { SpellResult } from "../_components/SearchBar/SearchResult";
import {
  type CastingTime,
  type SavingThrow,
  castingTimes,
  savingThrows,
  schoolLabels,
  schools,
  spheres,
  type Spell,
} from "~/types";
import MutateSpellForm from "../homebrew/_components/MutateSpellForm";
import { toast } from "~/hooks/use-toast";

export default function EditPage() {
  const [spells] = api.spell.getSpells.useSuspenseQuery();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const utils = api.useUtils();
  const editSpell = api.spell.editSpell.useMutation({
    onSuccess: (_, v) => {
      void utils.spell.getSpells.invalidate();
      toast({
        title: "Spell updated",
        description: v.spell.name + " updated",
        className: `border-${v.spell.schools[0]}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div>
      {!isOpen && selectedSpell && (
        <MutateSpellForm
          mutation={(sp) =>
            editSpell.mutate({ spellId: selectedSpell.id, spell: sp })
          }
          defaultValues={{
            ...selectedSpell,
            description: selectedSpell.description.reduce((acc, d) => {
              return acc + d + "\n\n";
            }, ""),
            schools: [
              {
                value: selectedSpell.schools[0]!,
                label:
                  schoolLabels[schools.indexOf(selectedSpell.schools[0]!)]!,
              },
              ...selectedSpell.schools.slice(1).map((s) => ({
                value: s,
                label: schoolLabels[schools.indexOf(s)]!,
              })),
            ],
            spheres:
              selectedSpell.spheres?.map((s) => ({
                value: s,
                label: spheres[spheres.indexOf(s)]!,
              })) ?? [],
            castingTime: castingTimes.find(
              (ct) => ct === selectedSpell.castingTime,
            )
              ? (selectedSpell.castingTime as CastingTime)
              : "special",
            savingThrow: savingThrows.find(
              (st) => st === selectedSpell.savingThrow,
            )
              ? (selectedSpell.savingThrow as SavingThrow)
              : "special",
            specialCastingTime: selectedSpell.castingTime,
            specialSavingThrow: selectedSpell.savingThrow,
          }}
        />
      )}
      {isOpen && (
        <SearchModal
          searchKey="name"
          searchables={spells}
          isOpen={false}
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
