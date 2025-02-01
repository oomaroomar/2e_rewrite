"use client";

import { api } from "~/trpc/react";
import SpellPageContainer from "~/app/_components/SpellPage/SpellPageContainer";
import { use, type Usable } from "react";

export default function SpellPageCharacterWrapper({
  params,
}: {
  params: Usable<unknown>;
}) {
  const searchParams = use(params);
  const characterId = parseInt((searchParams as { id: string }).id);
  const [character] = api.character.getCharacterById.useSuspenseQuery({
    characterId,
  });
  const characterSpells = character?.learnedSpells.map((sc) => sc.spell);
  const sortedCharacterSpells = characterSpells?.sort((a, b) => {
    if (a.level === b.level) {
      return a.name.localeCompare(b.name);
    }
    return a.level - b.level;
  });

  return <SpellPageContainer specificSpells={sortedCharacterSpells} />;
}
