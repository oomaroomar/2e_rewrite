import { Magnifier } from "~/svgs";
import { type FormEvent, type RefObject, useState, useTransition } from "react";
import Fuse, { type IFuseOptions } from "fuse.js";
import { useEscapeKey } from "~/hooks/useEscapeKey";

interface SearchModalProps<T extends { id: number | string }> {
  modalRef: RefObject<HTMLDivElement>;
  setClosed: () => void;
  searchables: T[];
  handleSelect: (s: T) => void;
  searchKey?: string;
  SearchItem: React.ComponentType<{
    item: T;
    onSelect: (item: T) => void;
  }>;
  fuseOptions?: IFuseOptions<T>;
}

export default function SearchModal<T extends { id: number | string }>({
  modalRef,
  setClosed,
  searchables,
  handleSelect,
  searchKey,
  SearchItem,
  fuseOptions,
}: SearchModalProps<T>) {
  const [searchPattern, setSearchPattern] = useState<string>("");
  const [, startTransition] = useTransition();

  useEscapeKey({
    onEscape: setClosed,
    onEscapeWithCondition: () => setSearchPattern(""),
    condition: searchPattern === "",
  });

  const handleEnter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const topResult = fuse.search(searchPattern)[0];
    if (topResult) {
      handleSelect(topResult.item);
    }
  };

  const fuse = new Fuse<T>(
    searchables,
    fuseOptions ?? {
      keys: [searchKey ?? "id"],
      minMatchCharLength: 2,
      threshold: 0.4,
    },
  );

  console.log(searchables);

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
            {fuseOptions?.minMatchCharLength === 0 && searchPattern.length === 0
              ? searchables.map((item) => (
                  <SearchItem
                    key={item.id}
                    item={item}
                    onSelect={handleSelect}
                  />
                ))
              : fuse.search(searchPattern).map((result) => {
                  if (result === undefined) {
                    return null;
                  }
                  return (
                    <SearchItem
                      key={result.item.id}
                      item={result.item}
                      onSelect={handleSelect}
                    />
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}
