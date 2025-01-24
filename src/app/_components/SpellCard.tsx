import { Brain, NotebookPen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { type Spell } from "~/types";

interface SmallSpellCardProps {
  spell: Spell;
  onClick: () => void;
}

interface BigSpellCardProps {
  spell: Spell;
  learnSpell?: (spell: Spell) => void;
  writeSpell?: (spell: Spell) => void;
}

export function SmallSpellCard({ spell, onClick }: SmallSpellCardProps) {
  return (
    <div
      onClick={onClick}
      className={`container flex w-72 flex-col gap-2 rounded-md border border-t-8 p-2 border-${spell.schools[0]} bg-white hover:cursor-pointer hover:shadow-md hover:shadow-${spell.schools[0]}`}
    >
      <div className="flex justify-between px-2 py-1">
        <span className="text-lg font-semibold">{spell.name}</span>
        <span className="font-semibold">
          {"(" + spell.level.toString() + ")"}
        </span>
      </div>
      <div className="col-span-2 px-2">
        <span className="font-semibold">
          {spell.somatic ? "S " : ""}
          {spell.verbal ? "V " : ""}
          {spell.material ? "M: " : ""}
        </span>
        <span>{spell.materials}</span>
      </div>
      <div className="p-2 pt-0">
        <span className="font-semibold">Damage: </span>
        <span>{spell.damage}</span>
      </div>
      <div className="p-2 pt-0">
        <span className="font-semibold">Duration: </span>
        <span>{spell.duration}</span>
      </div>
    </div>
  );
}

export function BigSpellCard({
  spell,
  learnSpell,
  writeSpell,
}: BigSpellCardProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-y-2 rounded-lg border-2 border-t-[6px] p-6 border-${spell.schools[0]} bg-white text-black shadow-${spell.schools[0]}`}
    >
      <div className={`col-span-2 flex justify-between`}>
        <div className="col-span-7 text-lg font-semibold">{spell.name}</div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hover:cursor-pointer">
                  {writeSpell ? (
                    <span
                      className="font-semibold"
                      onClick={() => writeSpell(spell)}
                    >
                      <NotebookPen className="hover:stroke-pink-500" />
                    </span>
                  ) : null}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Write spell into currently seleted book
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hover:cursor-pointer">
                  {learnSpell ? (
                    <span
                      className="font-semibold"
                      onClick={() => learnSpell(spell)}
                    >
                      <Brain className="hover:stroke-pink-500" />
                    </span>
                  ) : null}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Click for currently selected character to learn this spell
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="col-span-2">
        <span className="font-semibold">
          {spell.somatic ? "S " : ""} {spell.verbal ? "V " : ""}
          {spell.material ? "M: " : ""}
        </span>
        {spell.materials}
      </div>
      <div className="">
        <span className="font-semibold">Damage:</span> {spell.damage}
      </div>
      <div className="">
        <span className="font-semibold">Duration:</span> {spell.duration}
      </div>
      <div className="">
        <span className="font-semibold">AoE:</span> {spell.aoe}
      </div>
      <div className="">
        <span className="font-semibold">Range:</span> {spell.range}
      </div>
      <div className="">
        <span className="font-semibold">Casting Time:</span> {spell.castingTime}
      </div>
      <div className="">
        <span className="font-semibold">Save:</span> {spell.savingThrow}
      </div>
      {spell.castingClass === "cleric" ? (
        <div className="">
          <span className="font-semibold">Spheres:</span>
          {spell.spheres?.map((sphere, i) =>
            i === spell.spheres!.length - 1 ? (
              <span key={sphere}>{sphere} </span>
            ) : (
              <span key={sphere}>{sphere}, </span>
            ),
          )}
        </div>
      ) : null}
      {/* Add scroll bar by adding max-h-80 and overflow-auto */}
      <div className="col-span-2 pt-0 text-lg">
        <span className="font-semibold">Description: </span>
        {spell.description.map((paragraph, i) => (
          <p className="mb-4" key={i}>
            {paragraph}
          </p>
        ))}
      </div>
      <div className="pb-2 pt-0">
        <span className="font-semibold">School:</span> {spell.schools[0]}
      </div>
      <div className="pb-2 pt-0">
        <span className="font-semibold">Source:</span> {spell.source}
      </div>
    </div>
  );
}
