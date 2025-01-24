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
import { capitalize, getComponentsArray, isInteractiveElement } from "~/utils";
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
      <Column level="first" />
      <Column level="second" />
      <Column level="third" />
      <Column level="fourth" />
      <Column level="fifth" />
      <Column level="sixth" />
      <Column level="seventh" />
      <Column level="eighth" />
      <Column level="ninth" />
    </div>
  );
}

type ColumnProps = {
  level:
    | "first"
    | "second"
    | "third"
    | "fourth"
    | "fifth"
    | "sixth"
    | "seventh"
    | "eighth"
    | "ninth";
};

function getLevelColor(level: ColumnProps["level"]) {
  switch (level) {
    case "first":
      return "common";
    case "second":
      return "common";
    case "third":
      return "rare";
    case "fourth":
      return "rare";
    case "fifth":
      return "rare";
    case "sixth":
      return "epic";
    case "seventh":
      return "epic";
    case "eighth":
      return "epic";
    case "ninth":
      return "legendary";
  }
}

function Column({ level }: ColumnProps) {
  return (
    <div className={`rounded-lg p-2 shadow-md shadow-${getLevelColor(level)}`}>
      <h3 className="text-lg font-medium">{capitalize(level)} level spells</h3>
      <PreparedSpellTable level={level} />
    </div>
  );
}

function PreparedSpellTable({ level }: ColumnProps) {
  const [characterId] = useQueryLocalStorage("character", parseAsInteger);
  const [spells, setSpells] = useLocalStorage<Array<SpellWithDndId>>(
    `preparedSpells-${characterId}-${level}`,
    [],
  );
  const searchModalRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useModal({ modalRef: searchModalRef });
  const [count, setCount] = useLocalStorage("count", 0);
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
