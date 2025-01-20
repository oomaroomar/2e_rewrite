"use client";
import { parseAsInteger, useQueryState } from "nuqs";
import { api } from "~/trpc/react";
import ItemList from "./ItemList";

export default function CharacterList() {
  const [characters] = api.character.getMyCharacters.useSuspenseQuery();
  const [character] = useQueryState("character", parseAsInteger);
  const [bookId, setBookId] = useQueryState("book", parseAsInteger);

  if (!character) return <div>Select a character to view their books</div>;

  const books = characters.find((c) => c.id === character)?.books;
  const characterName = characters.find((c) => c.id === character)?.name;

  return (
    <ItemList
      items={books ?? []}
      onClick={(book) => setBookId(book.id)}
      selectedItemId={bookId}
      title={`${characterName}'s Books`}
    />
  );
}
