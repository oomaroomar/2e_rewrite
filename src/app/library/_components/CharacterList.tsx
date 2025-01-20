"use client";
import { parseAsInteger, useQueryState } from "nuqs";
import { api } from "~/trpc/react";
import ItemList from "./ItemList";

export default function CharacterList() {
  const [characters] = api.character.getMyCharacters.useSuspenseQuery();
  const [character, setCharacter] = useQueryState("character", parseAsInteger);
  const [, setBookId] = useQueryState("book", parseAsInteger);

  return (
    <ItemList
      items={characters}
      onClick={async (character) => {
        await setCharacter(character.id);
        await setBookId(null);
      }}
      selectedItemId={character}
      title="Your Characters"
    />
  );

  // <div>{characters.map((character) => character.name)}</div>;
}
