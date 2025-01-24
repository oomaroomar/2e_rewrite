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
  name: z.string().min(1, "Name is required"),
  maxPages: z.number().min(1, "Max pages is required"),
});

export default function CreateBookForm() {
  // const router = useRouter();
  const utils = api.useUtils();
  const [characterId] = useQueryLocalStorage("character", parseAsInteger);
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", maxPages: 100 },
  });
  const { mutate: createBook } = api.book.createBook.useMutation({
    onSuccess: (_, v) => {
      void utils.character.getMyCharacters.invalidate();
      toast({
        title: "Book created",
        description: getRandomBookCreationPhrase(v.name),
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
    createBook({ ...data, characterId: characterId });
    form.reset();
    // router.refresh();
  };

  return (
    <Form {...form}>
      <form
        className="flex place-items-end gap-2 p-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          labelName="Book name"
          placeholder="Spela's third Spellbook"
        />
        <FormField
          control={form.control}
          name="maxPages"
          labelName="Page count"
          placeholder="100"
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
