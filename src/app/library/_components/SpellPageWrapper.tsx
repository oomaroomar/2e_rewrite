"use client";
import { useQueryState, parseAsInteger, parseAsBoolean } from "nuqs";
import SpellPage from "~/app/_components/SpellPage/SpellPageContainer";
import { api } from "~/trpc/react";
import { type Spell } from "~/types";

export default function SpellPageWrapper() {
  const [character, setCharacter] = useQueryState("character", parseAsInteger);
  const [characters] = api.character.getMyCharacters.useSuspenseQuery();
  const [showLearnedOnly] = useQueryState("learnedOnly", parseAsBoolean);

  const utils = api.useUtils();
  const { mutate } = api.character.learnSpell.useMutation({
    onSuccess: async () => {
      await utils.character.getMyCharacters.invalidate();
      alert("Spell learned");
    },
  });
  // console.log(data);
  const learnSpell = (spell: Spell) => {
    if (character) {
      mutate({ spellId: spell.id, characterId: character });
    }
  };
  const learnedSpells = characters
    .find((c) => c.id === character)
    ?.learnedSpells.map((ls) => ls.spell);

  console.log(character, learnedSpells);
  return (
    <SpellPage
      learnSpell={character ? learnSpell : undefined}
      magics={character && showLearnedOnly ? learnedSpells : undefined}
    />
  );
}
