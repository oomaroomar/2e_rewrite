import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Copy, Trash2, Pencil, X } from "lucide-react";
import { Fragment, useState } from "react";
import { Separator } from "~/components/ui/separator";
import { type Book } from "~/types";
import { copyBookUrl, getPagesLeft } from "~/utils";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import { Input } from "~/components/ui/input";
import { useEscapeKey } from "~/hooks/useEscapeKey";

export default function BookDetailsDialog({ book }: { book: Book }) {
  const utils = api.useUtils();
  const { mutate: eraseSpell } = api.book.eraseSpell.useMutation({
    onSuccess: (_, v) => {
      void utils.character.getMyCharacters.invalidate();
      toast({
        title: `Spell removed from ${book.name}`,
        description: v.spellName,
      });
    },
  });

  const { mutate: renameBook } = api.book.renameBook.useMutation({
    onSuccess: (_, v) => {
      void utils.character.getMyCharacters.invalidate();
      toast({
        title: `Book renamed to ${v.name}`,
      });
    },
  });

  const [renameBookOpen, setRenameBookOpen] = useState(false);
  const [renameBookName, setRenameBookName] = useState(book.name);

  const handleRenameBook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    renameBook({ bookId: book.id, name: renameBookName });
    setRenameBookOpen(false);
  };

  useEscapeKey({
    onEscape: () => {
      setRenameBookOpen(false);
    },
    condition: renameBookOpen,
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex flex-col gap-2 pr-6">
          <div className="flex w-full items-center gap-2">
            {renameBookOpen ? (
              <form
                className="flex items-center gap-2"
                onSubmit={handleRenameBook}
              >
                <Input
                  value={renameBookName}
                  onChange={(e) => setRenameBookName(e.target.value)}
                />
                {/*For some reason size="icon" didn't work*/}
                <Button className="h-9 w-9" variant="outline" type="submit">
                  <Pencil className="stroke-pink-500" />
                </Button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <span className="pr-2">Spells in {book.name}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setRenameBookOpen(!renameBookOpen);
              }}
            >
              {renameBookOpen ? <X /> : <Pencil />}
            </Button>
            <Button
              variant="outline"
              onClick={() => copyBookUrl(book)}
              size="icon"
            >
              <Copy />
            </Button>
          </div>
          <span className="text-sm font-light">
            Pages left: {getPagesLeft(book)}
          </span>
        </DialogTitle>
      </DialogHeader>
      <ScrollArea>
        <div className="">
          <div className={`grid grid-cols-5 justify-between py-4 text-sm`}>
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
  );
}
