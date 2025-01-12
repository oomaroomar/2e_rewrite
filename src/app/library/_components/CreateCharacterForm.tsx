"use client";

import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import { FormField } from "~/app/homebrew/_components/FormField";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function CreateCharacterForm() {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });
  const { mutate: createCharacter } = api.character.createCharacter.useMutation(
    {
      onSuccess: async () => {
        await utils.character.getMyCharacters.invalidate();
      },
    },
  );

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!session?.user) {
      alert("You must be logged in to create a character");
      return;
    }
    createCharacter(data);
    form.reset();
    router.refresh();
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
          labelName="Create a new character"
          placeholder="Gandalf the Grey"
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
