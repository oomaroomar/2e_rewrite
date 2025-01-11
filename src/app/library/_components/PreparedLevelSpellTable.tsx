"use client";

import { api } from "~/trpc/react";
import { type Spell } from "~/types";
import { getComponentsArray } from "~/utils";
import { createSwapy, type Swapy } from "swapy";
import { useEffect, useRef } from "react";

export default function PreparedLevelSpellTable({
  preparedSpells,
}: {
  preparedSpells?: Spell[];
}) {
  const swapy = useRef<Swapy | null>(null);
  const container = useRef(null);
  const [spells] = api.spell.getSpells.useSuspenseQuery();

  useEffect(() => {
    // If container element is loaded
    if (container.current) {
      swapy.current = createSwapy(container.current);

      // Your event listeners
      swapy.current.onSwap((event) => {
        console.log("swap", event);
      });
    }

    return () => {
      // Destroy the swapy instance on component destroy
      swapy.current?.destroy();
    };
  }, []);
  return (
    <div className="">
      <h3 className="text-lg">Level 1 spells</h3>
      <div>
        {/* Header */}
        <div className="grid grid-cols-3 gap-4">
          <div className="font-semibold">Name</div>
          <div className="font-semibold">Casting Time</div>
          <div className="font-semibold">Components</div>
        </div>

        {/* Body */}
        <div ref={container}>
          {spells.map((spell) => (
            <div data-swapy-slot={spell.id} key={"swappyslot" + spell.id}>
              <div
                data-swapy-item={spell.id}
                key={spell.id}
                className={`grid grid-cols-3 gap-4 bg-${spell.schools[0]}`}
              >
                <div className="">{spell.name}</div>
                <div className="">{spell.castingTime}</div>
                <div>
                  {getComponentsArray(spell)
                    .map((c) => c.charAt(0))
                    .join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
