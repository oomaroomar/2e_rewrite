"use client";
import { CSS } from "@dnd-kit/utilities";

import { useContext, useEffect, useRef, type PointerEvent } from "react";
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
import { parseAsInteger } from "nuqs";
import {
  useLocalStorage,
  useQueryLocalStorage,
} from "~/app/_components/hooks/useLocalStorage";

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
  return (
    <div className="flex flex-wrap gap-6">
      <Column level={1} />
      <Column level={2} />
      <Column level={3} />
      <Column level={4} />
      <Column level={5} />
      <Column level={6} />
      <Column level={7} />
      <Column level={8} />
      <Column level={9} />
    </div>
  );
}

type ColumnProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

function getLevelColor(level: ColumnProps["level"]) {
  switch (level) {
    case 1:
    case 2:
      return "common";
    case 3:
    case 4:
    case 5:
      return "rare";
    case 6:
    case 7:
    case 8:
      return "epic";
    case 9:
      return "legendary";
  }
}

function Column({ level }: ColumnProps) {
  const [characterId] = useQueryLocalStorage("character", parseAsInteger);
  const [spells, setSpells] = useLocalStorage<Array<SpellWithDndId>>(
    `preparedSpells-${characterId}-${level}`,
    [],
  );
  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({ modalRef: searchModalRef });
  const [count, setCount] = useLocalStorage("count", 0);
  const [myCharacters] = api.character.getMyCharacters.useSuspenseQuery();
  const character = myCharacters.find((c) => c.id === characterId);
  const learnedSpells = character?.learnedSpells.map((s) => s.spell);

  const handleSelect = (spell: Spell) => {
    setSpells((prev) => {
      const newVal = [...prev, { ...spell, dndId: count }];
      setCount((prev) => {
        // If someone prepares 9 quadrillion spells, they're an absolute legend
        const c = prev === Number.MAX_SAFE_INTEGER ? 0 : prev + 1;
        return c;
      });
      return newVal;
    });
  };

  useEffect(() => {
    setSpells(() => {
      const preparedSpells = window.localStorage.getItem(
        `preparedSpells-${characterId}-${level}`,
      );
      if (preparedSpells) {
        return JSON.parse(preparedSpells) as SpellWithDndId[];
      }
      return [];
    });
    // No memoization required! Doesn't rerender a million times thanks to the react compiler :)
  }, [characterId, level, setSpells]);

  const { appendSpell } = useContext(DescriptionListContext)!;
  function handleCast(spell: SpellWithDndId) {
    appendSpell(spell);
    setSpells((prev) => prev.filter((sp) => sp.dndId !== spell.dndId));
  }
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
    <div className={`rounded-lg p-2 shadow-md shadow-${getLevelColor(level)}`}>
      <div className="flex justify-between px-2">
        <h3 className="text-lg font-medium">Level {level} spells</h3>
        <span>{spells.length}</span>
      </div>
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCorners}
      >
        <div className="flex max-w-80 flex-col gap-1">
          <div className={`grid grid-cols-4 gap-4 rounded-lg p-2 text-sm`}>
            <div>Name</div>
            <div>Cast time</div>
            <div>Components</div>
          </div>
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
          <Button className="max-w-28" onClick={() => setSearchOpen(true)}>
            Prepare a spell
          </Button>
          {isSearchOpen && (
            <SearchModal
              searchables={learnedSpells
                ?.filter((s) => s.level <= level)
                .sort((a, b) => {
                  if (a.level === b.level) {
                    return a.name.localeCompare(b.name);
                  }
                  return b.level - a.level;
                })}
              emptyMessage="You have not learned any spells of this level or lower"
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
    </div>
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

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`grid grid-cols-4 gap-4 border-b-2 border-l-[12px] p-2 border-${spell.schools[0]} max-w-96 rounded-l-lg`}
    >
      <div className="align-middle">{spell.name}</div>
      <div className="align-middle">{spell.castingTime}</div>
      <div className="align-middle">
        {getComponentsArray(spell)
          .map((c) => c.charAt(0))
          .join(", ")}
      </div>
      <Button
        variant="outline"
        onClick={() => {
          handleCast(spell);
        }}
        className="px-1 py-0"
      >
        Cast
      </Button>
    </div>
  );
}
