"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { createSwapy, utils, type Swapy } from "swapy";
import { DescriptionListContext } from "~/app/_components/contexts/FullDescSpells";
import useModal from "~/app/_components/hooks/useModal";
import SearchModal from "~/app/_components/SearchBar/SearchModal";
import { SpellResult } from "~/app/_components/SearchBar/SearchResult";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { type Spell } from "~/types";
import { getComponentsArray } from "~/utils";

// Same spell can be added multiple times so need a swapId to differentiate
type SwapSpell = Spell & { swapId: number };

export default function PreparedSpellSwappy() {
  const [preparedSpells, setPreparedSpells] = useState<SwapSpell[]>([]);
  const [counter, setCounter] = useState(0);

  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({ modalRef: searchModalRef });
  const [spells] = api.spell.getSpells.useSuspenseQuery();

  // Swapy stuff
  const container = useRef<HTMLDivElement>(null);
  const swapy = useRef<Swapy | null>(null);
  const [slotItemMap, setSlotItemMap] = useState(
    utils.initSlotItemMap(preparedSpells, "swapId"),
  );
  const slottedItems = useMemo(
    () => utils.toSlottedItems(preparedSpells, "swapId", slotItemMap),
    [preparedSpells, slotItemMap],
  );

  const { appendSpell } = useContext(DescriptionListContext)!;

  useEffect(
    () =>
      utils.dynamicSwapy(
        swapy.current,
        preparedSpells,
        "swapId",
        slotItemMap,
        setSlotItemMap,
      ),
    [preparedSpells],
  );

  useEffect(() => {
    // If container element is loaded
    if (container.current) {
      swapy.current = createSwapy(container.current, { manualSwap: true });

      swapy.current.onSwap((event) => {
        console.log("swap", event);
        console.log("prepared spells", preparedSpells);
        setSlotItemMap(event.newSlotItemMap.asArray);
      });

      // Your event listeners
    }

    return () => {
      // Destroy the swapy instance on component destroy
      swapy.current?.destroy();
    };
  }, []);

  const handleCast = (spell: SwapSpell) => {
    appendSpell(spell);
    setPreparedSpells(
      preparedSpells.filter((sp) => sp.swapId !== spell.swapId),
    );
  };
  const handleSelect = (spell: Spell) => {
    setPreparedSpells((prev) => [...prev, { ...spell, swapId: counter }]);
    setCounter(counter + 1);
  };

  return (
    <div className="">
      <h3 className="text-lg">Spells prepared: {preparedSpells.length}</h3>
      <div>
        {/* Header */}
        <div className="grid grid-cols-4 gap-4">
          <div className="">Name</div>
          <div className="">Casting Time</div>
          <div className="">Components</div>
        </div>
        <div className="flex flex-col gap-y-1" ref={container}>
          {slottedItems.map(({ slotId, itemId, item: spell }) => {
            if (!spell) return null;
            return (
              <div
                // Keys need to be somewhat convoluted because users can prepare multiple instances of the same spell
                data-swapy-slot={slotId}
                key={`swappyslot-${slotId}-level-{1}`}
              >
                <div
                  data-swapy-item={itemId}
                  key={`${itemId}-level-{1}`}
                  className={`grid grid-cols-4 gap-4 p-2 bg-${spell.schools[0]} rounded-lg`}
                >
                  <div className="">{spell.name}</div>
                  <div className="">{spell.castingTime}</div>
                  <div>
                    {getComponentsArray(spell)
                      .map((c) => c.charAt(0))
                      .join(", ")}
                  </div>
                  <Button
                    data-swapy-no-drag
                    onClick={() => handleCast(spell)}
                    className="bg-zinc-900 hover:bg-zinc-600"
                  >
                    Cast
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <Button className="mt-1" onClick={() => setSearchOpen(true)}>
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
        )}
      </div>
    </div>
  );
}
