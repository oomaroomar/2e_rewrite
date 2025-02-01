import { Copy, Pencil, Trash2, X } from "lucide-react";
import { Fragment, useState } from "react";
import { type Character } from "~/clientTypes";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { toast } from "~/hooks/use-toast";
import { useEscapeKey } from "~/hooks/useEscapeKey";
import { api } from "~/trpc/react";
import { copyCharacterUrl } from "~/utils";

export default function CharacterDetailsDialog({
  character,
}: {
  character: Character;
}) {
  const utils = api.useUtils();
  const { mutate: unlearnSpell } = api.character.unlearnSpell.useMutation({
    onSuccess: (_, v) => {
      void utils.character.getMyCharacters.invalidate();
      toast({
        title: `Spell removed from ${character.name}`,
        description: v.spellName,
      });
    },
  });
  const { mutate: renameCharacter } = api.character.renameCharacter.useMutation(
    {
      onSuccess: (_, v) => {
        void utils.character.getMyCharacters.invalidate();
        toast({
          title: `Character renamed to ${v.name}`,
        });
      },
    },
  );

  const [renameCharacterOpen, setRenameCharacterOpen] = useState(false);
  const [renameCharacterName, setRenameCharacterName] = useState(
    character.name,
  );

  const handleRenameCharacter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    renameCharacter({ characterId: character.id, name: renameCharacterName });
    setRenameCharacterOpen(false);
  };

  useEscapeKey({
    onEscape: () => {
      setRenameCharacterOpen(false);
    },
    condition: renameCharacterOpen,
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex flex-col gap-2 pr-6">
          <div className="flex w-full items-center gap-2">
            {renameCharacterOpen ? (
              <form
                className="flex items-center gap-2"
                onSubmit={handleRenameCharacter}
              >
                <Input
                  value={renameCharacterName}
                  onChange={(e) => setRenameCharacterName(e.target.value)}
                />
                <Button size="icon" variant="outline" type="submit">
                  <Pencil className="stroke-pink-500" />
                </Button>
              </form>
            ) : (
              <span className="pr-2">{character.name}</span>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setRenameCharacterOpen(!renameCharacterOpen);
              }}
            >
              {renameCharacterOpen ? <X /> : <Pencil />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                copyCharacterUrl(character);
              }}
            >
              <Copy />
            </Button>
          </div>
          <span className="text-sm font-light">
            Spells known: {character.learnedSpells.length}
          </span>
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[500px] overflow-hidden">
        <div className="">
          <div className={`grid grid-cols-5 justify-between py-4 text-sm`}>
            <div className="col-span-3">Name</div>
            <div>Delete</div>
          </div>
          {character.learnedSpells.map((sc) => (
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
                <Button
                  onClick={() =>
                    unlearnSpell({
                      characterId: character.id,
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
