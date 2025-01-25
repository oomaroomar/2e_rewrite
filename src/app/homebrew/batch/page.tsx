"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import { FormField } from "../_components/FormField";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";

import { preBatchSpellSchema } from "~/types";

const batchFormSchema = z.object({
  spellJson: z.string().min(5, { message: "Input empty" }),
});

export default function BatchHomebrew() {
  const form = useForm<z.infer<typeof batchFormSchema>>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: { spellJson: "" },
  });
  const createSpells = api.spell.batchCreateSpells.useMutation({
    onSuccess: () => window.alert("Spells created!"),
  });

  async function onSubmit(values: z.infer<typeof batchFormSchema>) {
    const parsed = preBatchSpellSchema.safeParse(JSON.parse(values.spellJson));
    if (!parsed.success) {
      console.error(parsed.error.errors);
      form.setError("spellJson", {
        type: "validate",
        message: parsed.error.errors[0]!.message,
      });
      return;
    }
    const spells = parsed.data.map((spell) => ({
      ...spell,
      description: spell.description.split("\n").filter((line) => line !== ""),
    }));
    createSpells.mutate(spells);
  }
  return (
    <div id="main-container" className="flex justify-center p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col space-y-4 lg:w-2/3"
        >
          <FormField
            control={form.control}
            name="spellJson"
            labelName="Spell list JSON"
            textarea
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
