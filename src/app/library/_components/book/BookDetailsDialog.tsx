import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import { Fragment } from "react";
import { Separator } from "~/components/ui/separator";
import { type Book } from "~/types";
import { copyBookUrl, getPagesLeft } from "~/utils";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";

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

  return (
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
