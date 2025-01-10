"use client";
import { useQueryState, parseAsInteger } from "nuqs";
import SpellPage from "~/app/_components/SpellPage/SpellPageContainer";
import { api } from "~/trpc/react";

export default function SpellPageWrapper() {
  const [data] = api.character.getMyCharacters.useSuspenseQuery();
  const [character, setCharacter] = useQueryState("character", parseAsInteger);
  console.log(data);

  return (
    <SpellPage
    //   magics={
    //     data.find((d) => d.character.id === character)?.?? undefined
    //   }
    />
  );
}
