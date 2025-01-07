import { useCallback, useEffect, useRef } from "react";
import { Toggle } from "~/components/ui/toggle";
import { School } from "~/types";
import { capitalize } from "~/utils";

interface FilterButtonProps {
  name: string;
  options: ReadonlyArray<string>;
  show: boolean;
  toggle: (b: boolean) => void;
  update: (s: string) => void;
}

export default function FilterButton({
  name,
  toggle,
  options,
  show,
  update,
}: FilterButtonProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        toggle(false);
      }
    },
    [toggle],
  );

  const checkClickOutside = useCallback(
    (e: MouseEvent) => {
      if (show && !ref?.current?.contains(e.target as Node)) {
        toggle(false);
      }
    },
    [show, ref, toggle],
  );

  useEffect(() => {
    document.addEventListener("mousedown", checkClickOutside);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("mousedown", checkClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [show, toggle, handleKeyPress, ref, checkClickOutside]);

  return (
    <div ref={ref}>
      <button
        onClick={() => toggle(!show)}
        className="hidden w-24 place-items-center rounded-md py-1.5 pl-2 pr-3 text-center text-[12px] leading-6 text-slate-400 shadow-sm ring-1 ring-slate-900/10 hover:ring-slate-300 lg:flex"
      >
        {name}
      </button>
      {show ? (
        <div className="absolute z-50 mt-2 grid w-24 grid-cols-1 rounded-xl border border-pink-400 bg-white">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => update(option)}
              className="block w-full py-3 text-sm first:rounded-t-xl last:rounded-b-xl hover:bg-pink-200"
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

interface ExistingFiltersProps {
  onClick: () => void;
  show: boolean;
  children: React.ReactNode;
}

export function ExistingFilters({
  onClick,
  show,
  children,
}: ExistingFiltersProps) {
  return (
    <button
      className={`${show ? "flex" : "hidden"} place-items-center rounded-full border border-zinc-200 bg-white p-2 py-0 text-sm font-light`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function LevelFilterButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return <Toggle onClick={onClick}>{children}</Toggle>;
}

export function SchoolFilterButton({
  onClick,
  school,
}: {
  onClick: () => void;
  school: School;
}) {
  return (
    <Toggle
      onClick={onClick}
      className={`bg-${school} data-[state=on]:bg-white`}
    >
      {capitalize(school)}
    </Toggle>
  );
}
