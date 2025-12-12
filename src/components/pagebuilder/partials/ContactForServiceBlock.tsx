import { Controller, useFormContext } from "react-hook-form";
import { LabeledInput, LabeledTextarea } from "./HelperComponents";

interface ContactForServiceBlockProps {
  blockIndex: number;
}

export function ContactForServiceBlock({
  blockIndex,
}: ContactForServiceBlockProps) {
  const { register, control } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name={`content.${blockIndex}.textRich`}
        render={({ field }) => (
          <LabeledTextarea
            label="Rich Text (HTML)"
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
          />
        )}
      />
      <LabeledInput
        label="Button Link"
        {...register(`content.${blockIndex}.btn`)}
      />
      <LabeledInput
        label="Button Text"
        {...register(`content.${blockIndex}.btnTitle`)}
      />
    </>
  );
}
