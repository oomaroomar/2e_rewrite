"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function DeleteDialog<T extends { name: string; id: number }>({
  item,
  closeDialog,
  deleteItem,
}: {
  item: T;
  closeDialog: () => void;
  deleteItem: (itemId: number) => void;
}) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input === item.name) {
      deleteItem(item.id);
      closeDialog();
    }
  }

  console.log(item);

  return (
    <DialogContent className="rounded-none border-red-600">
      <DialogHeader>
        <DialogTitle>Delete {item.name}</DialogTitle>
      </DialogHeader>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <Label>Type &quot;{item.name}&quot; to confirm</Label>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="rounded-none border-red-600"
          />
          <Button type="submit">Delete</Button>
        </div>
      </form>
    </DialogContent>
  );
}
