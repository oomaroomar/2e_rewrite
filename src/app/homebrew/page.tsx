"use client";

import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import MultiSelector from "~/components/ui/multipeSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { schools } from "~/types";

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm();
  const onSubmit = (data: unknown) => console.log(data);

  const schoolOptions = schools.map((school) => ({
    value: school,
    label: school,
  }));

  console.log(watch("example")); // watch input value by passing the name of it
  console.log("rerender");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-96 flex-col gap-5 px-10">
        <Controller
          control={control}
          name="schools"
          render={({ field }) => (
            <MultiSelector
              {...field}
              defaultOptions={schoolOptions}
              placeholder="Select your spell's schools"
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
      <Checkbox />
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <div className="p-4">
        <Input defaultValue="test" {...register("example")} />
      </div>
      <input {...register("exampleRequired", { required: true })} />
      {errors.exampleRequired && <span>This field is required</span>}
      <input type="submit" />
    </form>
  );
}
