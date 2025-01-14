"use client";
import { CSS } from "@dnd-kit/utilities";

import { useContext, useRef, useState, type PointerEvent } from "react";
import { type Spell } from "~/types";
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Button } from "~/components/ui/button";
import useModal from "~/app/_components/hooks/useModal";
import SearchModal from "~/app/_components/SearchBar/SearchModal";
import { SpellResult } from "~/app/_components/SearchBar/SearchResult";
import { api } from "~/trpc/react";
import { getComponentsArray, isInteractiveElement } from "~/utils";
import { DescriptionListContext } from "~/app/_components/contexts/FullDescSpells";

type SpellWithDndId = Spell & { dndId: number };

class MyPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent: event }: PointerEvent) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          isInteractiveElement(event.target as HTMLElement)
        ) {
          return false;
        }

        return true;
      },
    },
  ];
}

export default function PreparedSpellDnd() {
  return <Column />;
}

function Column() {
  const [spells, setSpells] = useState<Array<SpellWithDndId>>([]);
  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({ modalRef: searchModalRef });
  const [count, setCount] = useState(0);
  const handleSelect = (spell: Spell) => {
    setSpells([...spells, { ...spell, dndId: count }]);
    setCount(count + 1);
  };
  const { appendSpell } = useContext(DescriptionListContext)!;
  function handleCast(spell: SpellWithDndId) {
    appendSpell(spell);
    setSpells(spells.filter((sp) => sp.dndId !== spell.dndId));
  }
  const [allSpells] = api.spell.getSpells.useSuspenseQuery();
  const sensors = useSensors(
    useSensor(MyPointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) return;

    setSpells((spell) => {
      const originalPos = spell.findIndex((s) => s.dndId === active.id);
      const newPos = spell.findIndex((s) => s.dndId === over?.id);

      return arrayMove(spells, originalPos, newPos);
    });
  };
  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCorners}
    >
      <div className="flex flex-col gap-2">
        <SortableContext
          items={spells.map((spell) => spell.dndId)}
          strategy={verticalListSortingStrategy}
        >
          {spells.map((spell) => (
            <PreparedSpell
              key={spell.dndId}
              spell={spell}
              handleCast={handleCast}
            />
          ))}
        </SortableContext>
        <Button onClick={() => setSearchOpen(true)}>Add Spell</Button>
        {isSearchOpen && (
          <SearchModal
            searchables={allSpells}
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
    </DndContext>
  );
}

function PreparedSpell({
  spell,
  handleCast,
}: {
  spell: Spell & { dndId: number };
  handleCast: (sp: SpellWithDndId) => void;
}) {
  const { attributes, listeners, setNodeRef, transition, transform } =
    useSortable({ id: spell.dndId });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  console.log(spell.dndId, spell.name, spell.schools[0], transition, transform);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
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
        onClick={() => {
          console.log(spell);
          handleCast(spell);
        }}
        className="bg-zinc-900 hover:bg-zinc-600"
      >
        Cast
      </Button>
    </div>
  );
}
