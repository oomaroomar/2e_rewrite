import { type School, type Spell } from "~/types";
import { capitalize } from "~/utils";

// S might contain extra fields like createdAt, updatedAt, etc.
interface SpellCardProps<S extends Spell> {
  spell: S;
  onClick: (s: S) => void;
}

interface SpecializationResultProps {
  school: { id: School };
  setSchoolFilters: (school: { id: School }) => void;
}

export function SpecializationResult({
  school,
  setSchoolFilters,
}: SpecializationResultProps) {
  return (
    <div
      className="container w-full p-3"
      onClick={() => setSchoolFilters(school)}
    >
      <div
        className={`grid grid-cols-2 gap-y-2 rounded-xl p-4 bg-${school.id} hover:shadow-md hover:shadow-${school.id}`}
      >
        {capitalize(school.id)}
      </div>
    </div>
  );
}

export function SpellResult<S extends Spell>({
  spell,
  onClick,
}: SpellCardProps<S>) {
  return (
    <div className="container w-full p-4" onClick={() => onClick(spell)}>
      <div
        className={`grid grid-cols-2 gap-y-2 rounded-xl border-2 p-2 border-${spell.schools[0]} bg-white hover:shadow-md hover:shadow-${spell.schools[0]}`}
      >
        <div
          className={`col-span-2 grid grid-cols-10 border-${spell.schools[0]} rounded-t-xl text-xl hover:cursor-pointer`}
        >
          <div className="col-span-9 flex w-full justify-between py-1">
            <span className="text-lg font-semibold">{spell.name}</span>
          </div>
        </div>
        <div>
          <span className="font-semibold">Level: </span>
          <span>{spell.level}</span>
        </div>
        <div className="col-span-2">
          <span className="font-semibold">
            {spell.somatic ? "S " : ""}
            {spell.verbal ? "V " : ""}
            {spell.material ? "M: " : ""}
          </span>
          {spell.materials}
        </div>
        <div className="">
          <span className="font-semibold">Damage: </span>
          <span>{spell.damage}</span>
        </div>
        <div className="">
          <span className="font-semibold">Duration: </span>
          <span>{spell.duration}</span>
        </div>
      </div>
    </div>
  );
}
