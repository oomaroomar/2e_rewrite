"use client";
import { useForm } from "react-hook-form";
import MultiSelector from "~/components/ui/multipeSelector";
import {
  castingClasses,
  castingTimes,
  savingThrows,
  spellLevels,
  spellSchema,
} from "~/types";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField as Field,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { CheckboxField, FormField } from "./FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { capitalize } from "~/utils";
import { Button } from "~/components/ui/button";
import { formSchema, schoolOptions, sphereOptions } from "./consts";
import { useSession } from "next-auth/react";
import Placeholder from "../../_components/Placeholder";

const inputSpellSchema = spellSchema.omit({ source: true });

export default function MutateSpellForm({
  defaultValues,
  mutation,
}: {
  defaultValues?: z.infer<typeof formSchema>;
  mutation: (sp: z.infer<typeof inputSpellSchema>) => void;
}) {
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      name: "",
      level: 1,
      castingClass: "wizard",
      schools: [],
      spheres: [],
      somatic: true,
      verbal: true,
      material: true,
      materials: "",
      aoe: "",
      castingTime: "1",
      specialCastingTime: "",
      damage: "",
      duration: "",
      range: "",
      savingThrow: "1/2",
      description: "",
    },
  });

  console.log(form.getValues());

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const {
      castingTime,
      specialCastingTime,
      savingThrow,
      specialSavingThrow,
      schools,
      spheres,
      materials,
      description,
      ...rest
    } = values;
    const spell = {
      ...rest,
      schools: schools.map((s) => s.value),
      spheres: spheres?.map((s) => s.value),
      castingTime:
        castingTime === "special" ? specialCastingTime! : castingTime,
      savingThrow:
        savingThrow === "special" ? specialSavingThrow! : savingThrow,
      materials: materials ?? "",
      description: description.split("\n").filter((p) => p !== ""),
    };
    mutation(spell);
  }

  if (!session) {
    return (
      <Placeholder
        className="text-zinc-900"
        text="You need to be signed in to create a spell."
      />
    );
  }

  return (
    <div id="main-container" className="flex justify-center p-4">
      <Form {...form}>
        <form
          className="flex flex-col gap-4 lg:w-1/2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField control={form.control} name="name" labelName="Name" />
          <FormField
            control={form.control}
            name="description"
            labelName="Description"
            textarea
          />
          <Field
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(val) => field.onChange(parseInt(val))}
                    defaultValue={defaultValues?.level?.toString()}
                  >
                    <SelectTrigger className="">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {spellLevels.map((lvl) => (
                        <SelectItem key={lvl} value={lvl.toString()}>
                          {lvl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Field
            control={form.control}
            name="castingClass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(val) => field.onChange(val)}
                    defaultValue={defaultValues?.castingClass}
                  >
                    <SelectTrigger className="">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {castingClasses.map((cc) => (
                        <SelectItem key={cc} value={cc}>
                          {capitalize(cc)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <Field
            control={form.control}
            name="schools"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schools</FormLabel>
                <FormControl>
                  <MultiSelector
                    {...field}
                    defaultOptions={schoolOptions}
                    hidePlaceholderWhenSelected={true}
                    emptyIndicator={
                      <p className="leading-11 text-center text-lg text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Field
            control={form.control}
            name="spheres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spheres</FormLabel>
                <FormControl>
                  <MultiSelector
                    {...field}
                    defaultOptions={sphereOptions}
                    hidePlaceholderWhenSelected={true}
                    className={
                      form.watch("castingClass") === "cleric"
                        ? ""
                        : "cursor-not-allowed"
                    }
                    badgeClassName="bg-zinc-900"
                    disabled={form.watch("castingClass") !== "cleric"}
                    emptyIndicator={
                      <p className="leading-11 text-center text-lg text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField control={form.control} name="aoe" labelName="AoE" />
          <Field
            control={form.control}
            name="castingTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Casting time</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={defaultValues?.castingTime}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {castingTimes.map((ct) => (
                        <SelectItem key={ct} value={ct}>
                          {ct}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialCastingTime"
            disabled={form.watch("castingTime") !== "special"}
            labelName="Special casting time"
            description="If the spell has a casting time that is not in the casting time options above, select special, then describe it here."
          />
          <Field
            control={form.control}
            name="savingThrow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Saving throw</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={defaultValues?.savingThrow}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {savingThrows.map((st) => (
                        <SelectItem key={st} value={st}>
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialSavingThrow"
            disabled={form.watch("savingThrow") !== "special"}
            labelName="Special saving throw"
            description="If the spell has a saving throw that is not in the options above, select special, then describe it here."
          />
          <FormField
            control={form.control}
            name="damage"
            description="If your spell won't do damage leave this empty"
            labelName="Damage"
          />
          <FormField
            control={form.control}
            // defaultValue="Instantaneous"
            name="duration"
            labelName="Duration"
          />
          <FormField
            control={form.control}
            name="range"
            labelName="Range"
            description="If the spell is a self buff its range is 0. If the spell can be placed on something other than the caster, however requires physical contact, its range is touch."
          />
          <div className="">
            <FormLabel>Components </FormLabel>
            <CheckboxField
              labelName="Somatic"
              name="somatic"
              control={form.control}
            />
            <CheckboxField
              labelName="Verbal"
              name="verbal"
              control={form.control}
            />
            <CheckboxField
              labelName="Material"
              name="material"
              control={form.control}
            />
          </div>
          <FormField
            disabled={form.watch("material") === false}
            control={form.control}
            name="materials"
            labelName="Material components"
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
