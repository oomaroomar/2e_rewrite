import { type School, type Spell } from "~/types";
import { capitalize } from "~/utils";

// S might contain extra fields like createdAt, updatedAt, etc.
interface SpellCardProps<S extends Spell> {
  spell: S;
  appendFullDescSpell: (s: S) => void;
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
        className={`grid grid-cols-2 gap-y-2 rounded-xl p-4 bg-${school.id} text-black hover:shadow-md hover:shadow-${school.id}`}
      >
        {capitalize(school.id)}
      </div>
    </div>
  );
}

export function SpellResult<S extends Spell>({
  spell,
  appendFullDescSpell,
}: SpellCardProps<S>) {
  return (
    <div
      className="container w-full p-3"
      onClick={() => appendFullDescSpell(spell)}
    >
      <div
        className={`grid grid-cols-2 gap-y-2 rounded-xl bg-white text-black hover:shadow-md hover:shadow-${spell.schools[0]}`}
      >
        <div
          className={`col-span-2 grid grid-cols-10 bg-${spell.schools[0]} rounded-t-xl text-xl hover:cursor-pointer`}
        >
          <div className="px-2 py-1">
            <b>
              {spell.level}
              {")"}
            </b>
          </div>
          <div className="col-span-9 px-2 py-1">
            <b>{spell.name}</b>
          </div>
        </div>
        <div className="col-span-2 px-2">
          {" "}
          <b>
            {spell.somatic ? "S " : ""}
            {spell.verbal ? "V " : ""}
            {spell.material ? "M: " : ""}
          </b>
          {spell.materials}
        </div>
        <div className="p-2 pt-0">
          {" "}
          <b>Damage: </b> {spell.damage}
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
