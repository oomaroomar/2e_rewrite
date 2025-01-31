"use client";
import { parseAsInteger } from "nuqs";
import { api } from "~/trpc/react";
import { useQueryLocalStorage } from "~/app/_components/hooks/useLocalStorage";

import { ScrollArea } from "~/components/ui/scroll-area";
import BookItem from "./BookItem";

export default function CharacterList() {
  const [characters] = api.character.getMyCharacters.useSuspenseQuery();
  const [characterId] = useQueryLocalStorage("character", parseAsInteger);

  if (!characterId) return <div>Select a character to view their books</div>;

  const books = characters.find((c) => c.id === characterId)?.books;

  const characterName = characters.find((c) => c.id === characterId)?.name;

  return (
    <ScrollArea>
      <div className="p-4">
        <h4 className="mb-4 flex justify-between text-sm font-medium leading-none">
          <span>{`${characterName}'s Books`}</span> <span>pages left</span>
        </h4>
        {(books ?? []).map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </div>
    </ScrollArea>
  );
}
