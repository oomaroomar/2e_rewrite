import { Label } from "@radix-ui/react-label";
import { NotebookPen } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

export default function WriteSpellDialog({
  writeSpell,
}: {
  writeSpell: (pages: number) => void;
}) {
  const [pages, setPages] = useState(0);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <NotebookPen className="hover:stroke-pink-500" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write Spell</DialogTitle>
          <DialogDescription>
            Write spell into currently seleted book
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="pages"
              type="number"
              onChange={(e) => setPages(Number(e.target.value))}
              value={pages}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() => writeSpell(pages)}
          >
            <span className="sr-only">Write spell confirm button</span>
            <NotebookPen className="hover:stroke-pink-500" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
