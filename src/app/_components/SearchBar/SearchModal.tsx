import {
  type FormEvent,
  type RefObject,
  useState,
  useTransition,
  type KeyboardEvent,
} from "react";
import Fuse, { type IFuseOptions } from "fuse.js";
import { useEscapeKey } from "~/hooks/useEscapeKey";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Search } from "lucide-react";

interface SearchModalProps<T extends { id: number | string }> {
  modalRef: RefObject<HTMLDivElement>;
  setClosed: () => void;
  searchables?: T[];
  handleSelect: (s: T) => void;
  searchKey?: string;
  SearchItem: React.ComponentType<{
    item: T;
    onSelect: (item: T) => void;
  }>;
  fuseOptions?: IFuseOptions<T>;
  emptyMessage?: string;
}

export default function SearchModal<T extends { id: number | string }>({
  modalRef,
  setClosed,
  searchables,
  handleSelect,
  searchKey,
  SearchItem,
  fuseOptions,
  emptyMessage,
}: SearchModalProps<T>) {
  const [searchPattern, setSearchPattern] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [, startTransition] = useTransition();

  useEscapeKey({
    onEscape: setClosed,
    onEscapeWithCondition: () => setSearchPattern(""),
    condition: searchPattern === "",
  });

  // Warning unnecessary because of the new React Compiler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const isEmptySearch =
      fuseOptions?.minMatchCharLength === 0 && searchPattern.length === 0;

    const maxIndex = isEmptySearch
      ? searchables?.length
      : fuse.search(searchPattern).length;
    if (!maxIndex) return;

    if (e.shiftKey && e.key === "Tab") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex - 1));
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < maxIndex - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex - 1));
        break;
      case "Tab":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < maxIndex - 1 ? prev + 1 : 0));
        break;
    }
  };

  const handleEnter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const results = fuse.search(searchPattern);
    if (results[selectedIndex]?.item) {
      handleSelect(results[selectedIndex].item);
    }
  };

  const fuse = new Fuse<T>(
    searchables ?? [],
    fuseOptions ?? {
      keys: [searchKey ?? "id"],
      minMatchCharLength: 2,
      threshold: 0.4,
    },
  );

  return (
    <div className="p-12vh absolute left-0 top-0 z-40 mx-auto hidden h-full w-full flex-col backdrop-blur-sm lg:flex">
      <div
        ref={modalRef}
        className="mx-auto my-0 mt-28 flex w-full max-w-3xl flex-col rounded-lg border border-pink-500 bg-white shadow-md shadow-pink-500 sm:max-h-[40rem] lg:max-h-[68rem]"
      >
        <header className="relative flex items-center px-4 py-0">
          <form
            onSubmit={handleEnter}
            className="flex flex-auto appearance-none items-center"
          >
            <label>
              <Search />
            </label>
            <input
              onChange={(e) => {
                startTransition(() => {
                  setSearchPattern(e.target.value);
                  setSelectedIndex(0); // Reset selection when search changes
                });
              }}
              value={searchPattern}
              autoFocus={true}
              className="ml-3 mr-4 flex h-14 w-full appearance-none outline-none"
              type="search"
              onKeyDown={handleKeyDown}
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
          <ScrollArea className="w-full pb-6">
            {searchables && searchables.length > 0 ? (
              fuseOptions?.minMatchCharLength === 0 &&
              searchPattern.length === 0 ? (
                searchables.map((item, index) => (
                  <div
                    key={item.id}
                    className={`${index === selectedIndex ? "bg-pink-100" : ""}`}
                    tabIndex={0}
                  >
                    <SearchItem item={item} onSelect={handleSelect} />
                  </div>
                ))
              ) : (
                fuse.search(searchPattern).map((result, index) => {
                  if (result === undefined) {
                    return null;
                  }
                  return (
                    <div
                      key={result.item.id}
                      className={`${index === selectedIndex ? "bg-pink-100" : ""}`}
                      tabIndex={0}
                    >
                      <SearchItem item={result.item} onSelect={handleSelect} />
                    </div>
                  );
                })
              )
            ) : (
              <div className="text-center">{emptyMessage}</div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
