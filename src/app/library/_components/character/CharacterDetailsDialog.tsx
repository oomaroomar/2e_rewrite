import { Trash2 } from "lucide-react";
import { Fragment } from "react";
import { type Character } from "~/clientTypes";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

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
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex justify-between pr-6">
          <div>
            <span className="pr-2">
              {character.name} knows {character.learnedSpells.length} spells
            </span>{" "}
          </div>
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
