"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "~/components/ui/input";
import MultiSelector, { type Option } from "~/components/ui/multipeSelector";

export default function App() {
  const [value, setValue] = useState<Option[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm();
  const onSubmit = (data: unknown) => console.log(data);

  const OPTIONS: Option[] = [
    { label: "nextjs", value: "Nextjs" },
    { label: "React", value: "react" },
    { label: "Remix", value: "remix" },
    { label: "Vite", value: "vite" },
    { label: "Nuxt", value: "nuxt" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
    { label: "Angular", value: "angular" },
    { label: "Ember", value: "ember" },
    { label: "Gatsby", value: "gatsby" },
    { label: "Astro", value: "astro" },
  ];

  console.log(watch("example")); // watch input value by passing the name of it
  console.log("rerender");

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <div className="flex w-full flex-col gap-5 px-10">
        <p className="text-primary">
          Your selection: {value.map((val) => val.label).join(", ")}
        </p>
        <Controller
          control={control}
          name="test"
          render={({ field }) => (
            <MultiSelector
              {...field}
              defaultOptions={OPTIONS}
              placeholder="Select frameowkrs you like..."
              hidePlaceholderWhenSelected={true}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />
          )}
        />
      </div>
      <div className="p-4">
        <Input defaultValue="test" {...register("example")} />
      </div>
      {/* <input defaultValue="test" {...register("example")} /> */}

      {/* include validation with required or other standard HTML validation rules */}
      <input {...register("exampleRequired", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
}
