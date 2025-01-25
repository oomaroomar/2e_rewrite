"use client";
import { Fragment } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

export default function ItemList<T extends { id: number; name: string }>({
  items,
  onClick,
  selectedItemId,
  title,
  info,
  moreInfo,
}: {
  items: T[];
  onClick: (item: T) => void;
  selectedItemId?: number | null;
  title?: string;
  info?: (item: T) => string | null;
  moreInfo?: () => void;
}) {
  return (
    <ScrollArea>
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">{title}</h4>
        {items.map((item) => (
          <Fragment key={item.id}>
            <div className={`flex justify-between text-sm`}>
              <span
                onClick={() => onClick(item)}
                className={`hover:cursor-pointer hover:text-pink-500 ${item.id === selectedItemId ? "text-pink-500" : ""}`}
              >
                {item.name}
              </span>
              <span onClick={moreInfo}>{info ? info(item) : null}</span>
            </div>
            <Separator className="my-2" />
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  );

  // <div>{characters.map((character) => character.name)}</div>;
}
