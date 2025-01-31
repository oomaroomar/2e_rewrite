"use client";

import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import { FormField } from "~/app/homebrew/_components/FormField";
import { Button } from "~/components/ui/button";
// import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { parseAsInteger } from "nuqs";
import { toast } from "~/hooks/use-toast";
import { getRandomBookCreationPhrase } from "~/utils";
import { useQueryLocalStorage } from "~/app/_components/hooks/useLocalStorage";

const formSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
});

export default function CreateBookForm() {
  // const router = useRouter();
  const utils = api.useUtils();
  const [characterId] = useQueryLocalStorage("character", parseAsInteger);
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { bookId: "" },
  });
  const { mutate: createBook } = api.book.copyBook.useMutation({
    onSuccess: () => {
      void utils.character.getMyCharacters.invalidate();
      toast({
        title: "Book copied",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!session?.user) {
      alert("You must be logged in to create a character");
      return;
    }
    if (!characterId) {
      alert("You must be on a character page to create a book");
      return;
    }
    let bookId = parseInt(data.bookId);
    if (isNaN(bookId)) {
      const urlSplit = data.bookId.split("/");
      if (urlSplit.length > 0) {
        bookId = parseInt(urlSplit[urlSplit.length - 1]!);
      }
    }
    createBook({ bookId, characterId: characterId });
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        className="flex place-items-end gap-2 p-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="bookId"
          labelName="Book ID or URL"
          placeholder={`${window.location.origin}/book/36`}
        />
        <Button type="submit">Copy</Button>
      </form>
    </Form>
  );
}
