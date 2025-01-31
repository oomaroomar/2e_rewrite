"use client";
import { parseAsInteger, useQueryState } from "nuqs";
import { api } from "~/trpc/react";
import { useQueryLocalStorage } from "~/app/_components/hooks/useLocalStorage";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Fragment, useState } from "react";
import { Separator } from "~/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import DeleteDialog from "../DeleteDialog";
import { toast } from "~/hooks/use-toast";

export default function CharacterList() {
  const [characters] = api.character.getMyCharacters.useSuspenseQuery();
  const [characterId, setCharacterId] = useQueryLocalStorage(
    "character",
    parseAsInteger,
  );
  const [open, setOpen] = useState(false);
  const [character, setCharacter] = useState<
    (typeof characters)[number] | null
  >(null);
  const [dialogVariant, setDialogVariant] = useState<"delete" | "info">("info");
  const utils = api.useUtils();

  const { mutate: deleteCharacter } = api.character.deleteCharacter.useMutation(
    {
      onSuccess: (_, v) => {
        void utils.character.getMyCharacters.invalidate();
        toast({
          title: "Character deleted",
          description: v.characterName,
        });
        setOpen(false);
      },
    },
  );

  return (
    <ScrollArea>
      <div className="p-4">
        <div className="flex justify-between text-sm">
          <span className="mb-4 font-medium leading-none">Your Characters</span>
          <span>Learned spells</span>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          {characters.map((char) => (
            <Fragment key={char.id}>
              <ContextMenu>
                <ContextMenuTrigger className={`flex justify-between text-sm`}>
                  <span
                    onClick={() => setCharacterId(() => char.id)}
                    className={`hover:cursor-pointer hover:text-pink-500 ${char.id === characterId ? "text-pink-500" : ""}`}
                  >
                    {char.name}
                  </span>
                  <span>{char.learnedSpells.length}</span>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <DialogTrigger onClick={() => setDialogVariant("info")}>
                      <span>Character info</span>
                    </DialogTrigger>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <DialogTrigger
                      onClick={() => {
                        setCharacter(char);
                        setDialogVariant("delete");
                      }}
                    >
                      <span>Delete character</span>
                    </DialogTrigger>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              <Separator className="my-2" />
            </Fragment>
          ))}
          {dialogVariant === "info" ? (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Character info</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <span>Character info</span>
              </DialogDescription>
            </DialogContent>
          ) : (
            <DeleteDialog
              item={character!}
              closeDialog={() => setOpen(false)}
              deleteItem={(cId) =>
                deleteCharacter({
                  characterId: cId,
                  characterName: character!.name,
                })
              }
            />
          )}
        </Dialog>
      </div>
    </ScrollArea>
  );
}
