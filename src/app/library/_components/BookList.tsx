"use client";
import { parseAsInteger, useQueryState } from "nuqs";
import { api } from "~/trpc/react";
import ItemList from "./ItemList";
import { useQueryLocalStorage } from "~/app/_components/hooks/useLocalStorage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Fragment, useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";

export default function CharacterList() {
  const [characters] = api.character.getMyCharacters.useSuspenseQuery();
  const [characterId] = useQueryLocalStorage("character", parseAsInteger);
  const [bookId, setBookId] = useQueryState("book", parseAsInteger);
  const [isOpen, setIsOpen] = useState(false);

  if (!characterId) return <div>Select a character to view their books</div>;

  const books = characters.find((c) => c.id === characterId)?.books;
  const book = books?.find((b) => b.id === bookId);
  const characterName = characters.find((c) => c.id === characterId)?.name;

  return (
    <>
      <ItemList
        items={books ?? []}
        onClick={(b) => setBookId(() => b.id)}
        selectedItemId={bookId}
        title={`${characterName}'s Books`}
        info={(b) => {
          const maxPages = b.maxPages;
          if (!maxPages) return null;
          const pagesLeft = b.spellCopies.reduce((acc, curr) => {
            return acc + (curr.pages ?? 0);
          }, 0);
          return `${maxPages - pagesLeft}/${maxPages} pages left`;
        }}
        moreInfo={() => setIsOpen(true)}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Spells in {book?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea>
            <div className="">
              <div className={`grid grid-cols-5 justify-between py-4 text-sm`}>
                <div className="col-span-3">Name</div>
                <div>Pages taken</div>
                <div>Delete</div>
              </div>
              {book?.spellCopies.map((sc) => (
                <Fragment key={sc.spell.id}>
                  <div
                    className={`grid grid-cols-5 justify-between rounded-sm border-l-8 text-sm border-${sc.spell.schools[0]}`}
                  >
                    <div className="col-span-3 flex items-center">
                      <span
                        className={`h-7 pl-2 hover:cursor-pointer hover:text-pink-500`}
                      >
                        {sc.spell.name}
                      </span>
                    </div>
                    <span>{sc.pages}</span>
                    <Button variant="outline" size="icon">
                      <X />
                    </Button>
                  </div>
                  <Separator className="my-2" />
                </Fragment>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
