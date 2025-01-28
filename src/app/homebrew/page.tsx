"use client";

import { getRandomSpellCreationPhrase } from "~/utils";

import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import MutateSpellForm from "./_components/MutateSpellForm";

export default function Homebrew() {
  const utils = api.useUtils();
  const createSpell = api.spell.createSpell.useMutation({
    onSuccess: (_, v) => {
      void utils.spell.getSpells.invalidate();
      toast({
        title: "Spell created",
        description: getRandomSpellCreationPhrase(v.name),
      });
    },
  });

  return <MutateSpellForm mutation={createSpell.mutate} />;
}
