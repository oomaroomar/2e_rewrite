import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Checkbox } from "~/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField as Field,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  labelName: string;
  placeholder?: string;
  description?: string;
  textarea?: boolean;
}) => {
  const { labelName, placeholder, description, textarea, ...rest } = props;
  return (
    <Field
      {...rest}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{labelName}</FormLabel>
          <FormControl>
            {textarea ? (
              <Textarea placeholder={placeholder ?? ""} {...field} />
            ) : (
              <Input placeholder={placeholder ?? ""} {...field} />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const CheckboxField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  labelName: string;
  placeholder?: string;
  description?: string;
}) => {
  return (
    <Field
      control={props.control}
      name={props.name}
      render={({ field }) => {
        return (
          <FormItem className="flex w-2/5 flex-row items-start space-x-3 space-y-0 rounded-md p-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="hover:cursor-pointer">
                {props.labelName}
              </FormLabel>
            </div>
          </FormItem>
        );
      }}
    />
  );
};
