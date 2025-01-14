"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createSwapy, type SlotItemMapArray, type Swapy, utils } from "swapy";
import useModal from "~/app/_components/hooks/useModal";
import SearchModal from "~/app/_components/SearchBar/SearchModal";
import { SpellResult } from "~/app/_components/SearchBar/SearchResult";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { type Spell } from "~/types";

type Item = {
  id: string;
  title: string;
};
let id = 0;

export default function PreparedSpellSwappy() {
  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({ modalRef: searchModalRef });
  const [spells] = api.spell.getSpells.useSuspenseQuery();
  // const [items, setItems] = useState<Spell[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(items, "id"),
  );
  const slottedItems = useMemo(
    () => utils.toSlottedItems(items, "id", slotItemMap),
    [items, slotItemMap],
  );

  const swapyRef = useRef<Swapy | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      utils.dynamicSwapy(
        swapyRef.current,
        items,
        "id",
        slotItemMap,
        setSlotItemMap,
      ),
    [items],
  );

  useEffect(() => {
    swapyRef.current = createSwapy(containerRef.current!, {
      manualSwap: true,
    });

    swapyRef.current.onSwap((event) => {
      console.log("swap", event);
      setSlotItemMap(event.newSlotItemMap.asArray);
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  // function handleSelect(spell: Spell) {
  //   setPreparedSpells([...preparedSpells, spell]);
  //   setSearchOpen(false);
  // }

  return (
    <div ref={containerRef}>
      <div>
        {slottedItems.map(({ slotId, itemId, item }) => (
          <div key={slotId} data-swapy-slot={slotId}>
            {item && (
              <div data-swapy-item={itemId} key={itemId}>
                <span>{item.title}</span>
                <span
                  className="delete"
                  data-swapy-no-drag
                  onClick={() => {
                    setItems(items.filter((i) => i.id !== item.id));
                  }}
                >
                  del
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        className="item item--add"
        onClick={() => {
          const randSpell: Spell = spells[
            Math.floor(Math.random() * spells.length)
          ] as Spell;
          // const newItem: Spell = { ...randSpell, id };
          const newItem: Item = { id: `${id}`, title: `${id}` };
          setItems([...items, newItem]);
          id++;
        }}
      >
        +
      </div>
      {/* <Button className="mt-1" onClick={() => setSearchOpen(true)}>
        Prepare a spell
      </Button>
      {isSearchOpen && (
        <SearchModal
          searchables={spells}
          modalRef={searchModalRef}
          setClosed={() => setSearchOpen(false)}
          handleSelect={handleSelect}
          fuseOptions={{
            keys: ["name"],
            threshold: 0.6,
            minMatchCharLength: 0,
          }}
          SearchItem={({ item, onSelect }) => (
            <SpellResult spell={item} onClick={onSelect} />
          )}
        />
      )} */}
    </div>
  );
}
