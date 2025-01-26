"use client";
import { parseAsInteger, useQueryState } from "nuqs";
import { api } from "~/trpc/react";
import ItemList from "./ItemListFork";
import { useQueryLocalStorage } from "~/app/_components/hooks/useLocalStorage";

export default function CharacterList() {
  const [characters] = api.character.getMyCharacters.useSuspenseQuery();
  const [characterId, setCharacter] = useQueryLocalStorage(
    "character",
    parseAsInteger,
  );
  const [, setBookId] = useQueryState("book", parseAsInteger);

  console.log(characters);

  return (
    <ItemList
      items={characters}
      onClick={async (character) => {
        if (character.id === characterId) return;
        await Promise.all([
          setCharacter(() => character.id),
          setBookId(() => null),
        ]);
      }}
      selectedItemId={characterId}
      title="Your Characters"
    />
  );

  // <div>{characters.map((character) => character.name)}</div>;
}
