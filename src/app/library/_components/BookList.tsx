"use client";
import { parseAsInteger } from "nuqs";
import { api } from "~/trpc/react";
import ItemList from "./ItemList";
import { useQueryLocalStorage } from "~/app/_components/hooks/useLocalStorage";

export default function CharacterList() {
  const [characters] = api.character.getMyCharacters.useSuspenseQuery();
  const [characterId] = useQueryLocalStorage("character", parseAsInteger);
  const [bookId, setBookId] = useQueryLocalStorage("book", parseAsInteger);

  if (!characterId) return <div>Select a character to view their books</div>;

  const books = characters.find((c) => c.id === characterId)?.books;
  const characterName = characters.find((c) => c.id === characterId)?.name;

  return (
    <ItemList
      items={books ?? []}
      onClick={(book) => setBookId(() => book.id)}
      selectedItemId={bookId}
      title={`${characterName}'s Books`}
    />
  );
}
