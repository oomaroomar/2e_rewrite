"use client";
import { parseAsInteger, useQueryState } from "nuqs";
import { Fragment } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";

export default function CharacterList() {
  const [{ chars: characters }] =
    api.character.getMyCharacters.useSuspenseQuery();
  const [character, setCharacter] = useQueryState("character", parseAsInteger);

  return (
    <ScrollArea>
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          Your Characters
        </h4>
        {characters.map((char) => (
          <Fragment key={char.id}>
            <div
              onClick={() => setCharacter(char.id)}
              className={`text-sm hover:cursor-pointer ${char.id === character ? "text-pink-500" : ""}`}
            >
              {char.name}
            </div>
            <Separator className="my-2" />
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  );

  // <div>{characters.map((character) => character.name)}</div>;
}
