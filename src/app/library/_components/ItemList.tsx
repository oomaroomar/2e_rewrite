"use client";
import { Fragment } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

export default function ItemList<T extends { id: number; name: string }>({
  items,
  onClick,
  selectedItemId,
  title,
}: {
  items: T[];
  onClick: (item: T) => void;
  selectedItemId: number | null;
  title: string;
}) {
  return (
    <ScrollArea>
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">{title}</h4>
        {items.map((item) => (
          <Fragment key={item.id}>
            <div
              onClick={() => onClick(item)}
              className={`text-sm hover:cursor-pointer ${item.id === selectedItemId ? "text-pink-500" : ""}`}
            >
              {item.name}
            </div>
            <Separator className="my-2" />
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  );

  // <div>{characters.map((character) => character.name)}</div>;
}
