"use client";
import { Fragment, useState } from "react";
import { type Book } from "~/types";
import DeleteBookDialog from "./DeleteBookDialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Dialog } from "~/components/ui/dialog";
import { Copy, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuContent,
} from "~/components/ui/context-menu";
import { ContextMenuTrigger } from "~/components/ui/context-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { getPagesLeft } from "~/utils";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import { useQueryState, parseAsInteger } from "nuqs";

export default function BookItem({ book }: { book: Book }) {
  const utils = api.useUtils();

  const [open, setOpen] = useState(false);

  const [bookId, setBookId] = useQueryState("book", parseAsInteger);
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

  const { mutate: deleteBook } = api.book.deleteBook.useMutation({
    onSuccess: (deletedBook) => {
      void utils.character.getMyCharacters.invalidate();
      toast({
        title: "Book deleted",
        description: `The book ${deletedBook!.name} has been deleted`,
      });
    },
  });

  function copyBookUrl(book: Book) {
    const bookurl = `${window.location.origin}/book/${book.id}`;
    void navigator.clipboard.writeText(bookurl);
    toast({
      title: "Copied to clipboard",
      description: bookurl,
    });
  }
  return (
    <>
      <div className={`flex justify-between text-sm`}>
        <Dialog open={open} onOpenChange={setOpen}>
          <ContextMenu>
            <ContextMenuTrigger>
              <span
                onClick={() => setBookId(() => book.id)}
                className={`hover:cursor-pointer hover:text-pink-500 ${book.id === bookId ? "text-pink-500" : ""}`}
              >
                {book.name}
              </span>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                <span
                  onClick={() => copyBookUrl(book)}
                  className="flex items-center gap-2"
                >
                  <Copy size={16} />
                  Copy book url
                </span>
              </ContextMenuItem>
              <ContextMenuItem>
                <DialogTrigger>
                  <span className="flex items-center gap-2">
                    <Trash2 size={16} />
                    Delete book
                  </span>
                </DialogTrigger>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <DeleteBookDialog
            closeDialog={() => setOpen(false)}
            book={book}
            deleteBook={(bId) => deleteBook({ bookId: bId })}
          />
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <span>{getPagesLeft(book)}</span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex justify-between pr-6">
                <div>
                  <span className="pr-2">Spells in {book.name}</span>{" "}
                  <Button
                    variant="outline"
                    onClick={() => copyBookUrl(book)}
                    size="icon"
                  >
                    <Copy />
                  </Button>
                </div>
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
                      <span>{sc.pages ?? 0}</span>
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
    </>
  );
}
