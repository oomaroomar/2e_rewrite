// "use client";
import { useForm } from "react-hook-form";
import { formSchema } from "../_components/consts";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import { FormField } from "../_components/FormField";
import { Button } from "~/components/ui/button";
import { schools, spheres } from "~/types";
// import { InsertSpell } from "~/server/mutations/spell";

const batchSpellsSchema = formSchema
  .omit({
    castingTime: true,
    specialCastingTime: true,
    savingThrow: true,
    specialSavingThrow: true,
    schools: true,
    spheres: true,
  })
  .extend({
    source: z.string(),
    castingTime: z.string(),
    savingThrow: z.string(),
    schools: z.enum(schools).array(),
    spheres: z.enum(spheres).array().optional(),
  })
  .array();

export default function BatchHomebrew() {
  const form = useForm({ defaultValues: { spellJson: "" } });
  async function onSubmit(values: { spellJson: string }) {
    "use server";
    const parsed = batchSpellsSchema.safeParse(JSON.parse(values.spellJson));
    if (!parsed.success) {
      console.error(parsed.error.errors);
      form.setError("spellJson", {
        type: "validate",
        message: parsed.error.errors[0]!.message,
      });
      return;
    }
    // await InsertSpell();
    console.log(parsed);
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
            labelName="Description"
            textarea
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
