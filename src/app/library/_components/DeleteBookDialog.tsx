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
import { type Book } from "~/types";

export default function DeleteBookDialog({
  book,
  closeDialog,
  deleteBook,
}: {
  book: Book;
  closeDialog: () => void;
  deleteBook: (bookId: number) => void;
}) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input === book.name) {
      deleteBook(book.id);
      closeDialog();
    }
  }

  return (
    <DialogContent className="rounded-none border-red-600">
      <DialogHeader>
        <DialogTitle>Delete {book.name}</DialogTitle>
      </DialogHeader>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <Label>Type &quot;{book.name}&quot; to confirm</Label>
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
