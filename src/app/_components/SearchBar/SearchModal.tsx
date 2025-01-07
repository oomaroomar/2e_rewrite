import { Magnifier } from "~/svgs";
import {
  type FormEvent,
  type RefObject,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import Fuse from "fuse.js";
import SearchResult from "./SearchResult";
import { type Spell } from "~/types";

interface SearchModalProps {
  modalRef: RefObject<HTMLDivElement>;
  setClosed: () => void;
  spells: Spell[];
  appendFullDescSpell: (s: Spell) => void;
}

export default function SearchModal({
  modalRef,
  setClosed,
  spells,
  appendFullDescSpell,
}: SearchModalProps) {
  const [searchPattern, setSearchPattern] = useState<string>("");
  const [, startTransition] = useTransition();

  const handleEscPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (searchPattern === "") {
          setClosed();
        } else {
          setSearchPattern("");
        }
      }
    },
    [setClosed, setSearchPattern, searchPattern],
  );

  const handleEnter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const topResult = fuse.search(searchPattern)[0];
    if (topResult) {
      appendFullDescSpell(topResult.item);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscPress);
    return () => {
      document.removeEventListener("keydown", handleEscPress);
    };
  }, [handleEscPress]);

  const fuse = new Fuse(spells, {
    keys: ["name"],
    minMatchCharLength: 2,
    threshold: 0.4,
  });

  return (
    <div className="p-12vh absolute left-0 top-28 z-40 mx-auto hidden max-h-96 w-full flex-col lg:flex">
      <div
        ref={modalRef}
        className="mx-auto my-0 flex w-full max-w-3xl flex-col rounded-lg bg-white shadow-2xl shadow-black"
      >
        <header className="relative flex items-center px-4 py-0">
          <form
            onSubmit={handleEnter}
            className="flex flex-auto appearance-none items-center"
          >
            <label>
              <Magnifier />
            </label>
            <input
              onChange={(e) =>
                startTransition(() => setSearchPattern(e.target.value))
              }
              value={searchPattern}
              autoFocus={true}
              className="ml-3 mr-4 flex h-14 w-full appearance-none outline-none"
              type="search"
              placeholder="Search spells"
              spellCheck="false"
              autoCapitalize="false"
              autoCorrect="false"
              autoComplete="off"
            />
          </form>
          <button>Cancel</button>
        </header>
        <div className="flex flex-auto overflow-auto px-2">
          <div className="longlist w-full pb-6">
            {fuse.search(searchPattern).map((spell) => {
              if (spell === undefined) {
                return null;
              } else {
                return (
                  <SearchResult
                    key={spell.item.id}
                    appendFullDescSpell={appendFullDescSpell}
                    spell={spell.item}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
