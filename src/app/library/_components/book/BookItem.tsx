"use client";
import { Fragment, useState } from "react";
import { type Book } from "~/types";
import DeleteDialog from "../DeleteDialog";
import { DialogTrigger } from "~/components/ui/dialog";
import { Dialog } from "~/components/ui/dialog";
import { Copy, Info, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuContent,
} from "~/components/ui/context-menu";
import { ContextMenuTrigger } from "~/components/ui/context-menu";
import { Separator } from "~/components/ui/separator";
import { copyBookUrl, getPagesLeft } from "~/utils";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import { useQueryState, parseAsInteger } from "nuqs";
import BookDetailsDialog from "./BookDetailsDialog";

export default function BookItem({ book }: { book: Book }) {
  const utils = api.useUtils();

  const [open, setOpen] = useState(false);
  const [dialogVariant, setDialogVariant] = useState<"delete" | "details">(
    "details",
  );

  const [bookId, setBookId] = useQueryState("book", parseAsInteger);

  const { mutate: deleteBook } = api.book.deleteBook.useMutation({
    onSuccess: (deletedBook) => {
      void utils.character.getMyCharacters.invalidate();
      toast({
        title: "Book deleted",
        description: `The book ${deletedBook!.name} has been deleted`,
      });
    },
  });

  return (
    <>
      <div className={`flex justify-between text-sm`}>
        <Dialog open={open} onOpenChange={setOpen}>
          <ContextMenu>
            <ContextMenuTrigger className="flex w-full justify-between">
              <span
                onClick={() => setBookId(() => book.id)}
                className={`hover:cursor-pointer hover:text-pink-500 ${book.id === bookId ? "text-pink-500" : ""}`}
              >
                {book.name}
              </span>
              <span>{getPagesLeft(book)}</span>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                <DialogTrigger onClick={() => setDialogVariant("details")}>
                  <span className="flex items-center gap-2">
                    <Info size={16} />
                    Details
                  </span>
                </DialogTrigger>
              </ContextMenuItem>
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
                <DialogTrigger onClick={() => setDialogVariant("delete")}>
                  <span className="flex items-center gap-2">
                    <Trash2 size={16} />
                    Delete book
                  </span>
                </DialogTrigger>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          {dialogVariant === "delete" && (
            <DeleteDialog
              closeDialog={() => setOpen(false)}
              item={book}
              deleteItem={(bId) => deleteBook({ bookId: bId })}
            />
          )}
          {dialogVariant === "details" && <BookDetailsDialog book={book} />}
        </Dialog>
      </div>
      <Separator className="my-2" />
    </>
  );
}
