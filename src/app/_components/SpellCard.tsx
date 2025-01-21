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
    <div onClick={onClick} className="container w-72 p-3">
      <div
        className={`grid grid-cols-2 gap-y-2 rounded-lg border border-t-8 border-${spell.schools[0]} bg-white hover:cursor-pointer hover:shadow-md hover:shadow-${spell.schools[0]}`}
      >
        <div className={`col-span-2 grid grid-cols-10 rounded-t-xl`}>
          <div className="px-2 py-1">
            <span className="font-semibold">
              {spell.level.toString() + ")"}
            </span>
          </div>
          <div className="col-span-9 px-2 py-1">
            <span className="font-semibold">{spell.name}</span>
          </div>
        </div>
        <div className="col-span-2 px-2">
          {" "}
          <span className="font-semibold">
            {spell.somatic ? "S " : ""}
            {spell.verbal ? "V " : ""}
            {spell.material ? "M: " : ""}
          </span>
          <span>{spell.materials}</span>
        </div>
        <div className="p-2 pt-0">
          {" "}
          <span className="font-semibold">Damage: </span>
          <span>{spell.damage}</span>
        </div>
        <div className="p-2 pt-0">
          {" "}
          <b>Duration: </b>
          {spell.duration}{" "}
        </div>
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
    <div className="p-4">
      <div
        className={`grid grid-cols-2 gap-y-2 rounded-xl bg-white text-black shadow-md shadow-${spell.schools[0]}`}
      >
        <div
          className={`col-span-2 grid grid-cols-11 bg-${spell.schools[0]} rounded-t-xl text-xl`}
        >
          <div className="px-4 py-1">
            <b>{`${spell.level})`}</b>
          </div>
          <div className="col-span-7 px-4 py-1">
            <b>{spell.name}</b>
          </div>
          <div className="hover:cursor-pointer">
            {writeSpell ? (
              <b onClick={() => writeSpell(spell)}>write spell</b>
            ) : null}
          </div>
          <div className="hover:cursor-pointer">
            {learnSpell ? (
              <b onClick={() => learnSpell(spell)}>learn spell</b>
            ) : null}
          </div>
          <div className="px-4 py-1">
            <b>{spell.castingClass === "cleric" ? "C" : "W"}</b>
          </div>
        </div>
        <div className="col-span-2 px-4">
          {" "}
          <b>
            {spell.somatic ? "S " : ""} {spell.verbal ? "V " : ""}
            {spell.material ? "M: " : ""}
          </b>
          {spell.materials}
        </div>
        <div className="px-4">
          {" "}
          <b>Damage:</b> {spell.damage}
        </div>
        <div className="px-4">
          {" "}
          <b>Duration:</b> {spell.duration}
        </div>
        <div className="px-4">
          {" "}
          <b>AoE:</b> {spell.aoe}
        </div>
        <div className="px-4">
          {" "}
          <b>Range:</b> {spell.range}
        </div>
        <div className="px-4">
          {" "}
          <b>Casting Time:</b> {spell.castingTime}
        </div>
        <div className="px-4">
          {" "}
          <b>Save:</b> {spell.savingThrow}
        </div>
        {spell.castingClass === "cleric" ? (
          <div className="px-4">
            {" "}
            <b>Spheres:</b>{" "}
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
        <div className="col-span-2 p-2 px-4 pt-0 text-lg">
          {" "}
          <b className="text-lg">Description: </b>
          {spell.description.map((paragraph, i) => (
            <p className="mb-4" key={i}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="px-4 pb-2 pt-0">
          {" "}
          <b>School:</b> {spell.schools[0]}
        </div>
        <div className="px-4 pb-2 pt-0">
          {" "}
          <b>Source:</b> {spell.source}
        </div>
      </div>
    </div>
  );
}
