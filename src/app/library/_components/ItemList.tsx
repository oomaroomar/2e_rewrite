"use client";
import { Fragment } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { type Book } from "~/types";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import { getPagesLeft } from "~/utils";
export default function ItemList({
  books,
  onClick,
  selectedItemId,
  title,
  info,
}: {
  books: Book[];
  onClick: (item: Book) => void;
  selectedItemId?: number | null;
  title?: string;
  info?: (item: Book) => string | null;
  moreInfo?: (item: Book) => void;
}) {
  const utils = api.useUtils();
  const { mutate: eraseSpell } = api.book.eraseSpell.useMutation({
    onSuccess: (_, v) => {
      void utils.character.getMyCharacters.invalidate();
      toast({
        variant: "destructive",
        title: "Spell removed",
        description: v.spellName,
      });
    },
  });

  return (
    <>
      <ScrollArea>
        <div className="p-4">
          <h4 className="mb-4 flex justify-between text-sm font-medium leading-none">
            <span>{title}</span> <span>pages left</span>
          </h4>
          {books.map((book) => (
            <Fragment key={book.id}>
              <div className={`flex justify-between text-sm`}>
                <span
                  onClick={() => onClick(book)}
                  className={`hover:cursor-pointer hover:text-pink-500 ${book.id === selectedItemId ? "text-pink-500" : ""}`}
                >
                  {book.name}
                </span>
                <Dialog>
                  <DialogTrigger>
                    <span>{info ? info(book) : null}</span>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex justify-between pr-6">
                        <span>Spells in {book.name}</span>{" "}
                        <span>pages left: {getPagesLeft(book)}</span>
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea>
                      <div className="">
                        <div
                          className={`grid grid-cols-5 justify-between py-4 text-sm`}
                        >
                          <div className="col-span-3">Name</div>
                          <div>Pages taken</div>
                          <div>Delete</div>
                        </div>
                        {book.spellCopies.map((sc) => (
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
                              <Button
                                onClick={() =>
                                  eraseSpell({
                                    bookId: book.id,
                                    spellId: sc.spell.id,
                                    spellName: sc.spell.name,
                                  })
                                }
                                variant="outline"
                                size="icon"
                              >
                                <Trash2 />
                              </Button>
                            </div>
                            <Separator className="my-2" />
                          </Fragment>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
              <Separator className="my-2" />
            </Fragment>
          ))}
        </div>
      </ScrollArea>
    </>
  );

  // <div>{characters.map((character) => character.name)}</div>;
}
