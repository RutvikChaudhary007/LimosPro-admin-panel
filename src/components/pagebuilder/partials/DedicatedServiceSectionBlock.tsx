import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { LabeledInput, LabeledTextarea } from "./HelperComponents";

interface DedicatedServiceSectionBlockProps {
  blockIndex: number;
  openMedia: (cb: (url: string) => void) => void;
}

export function DedicatedServiceSectionBlock({
  blockIndex,
  openMedia,
}: DedicatedServiceSectionBlockProps) {
  const { register, setValue, control } = useFormContext();

  return (
    <>
      <LabeledInput
        label="Image URL"
        {...register(`content.${blockIndex}.img`)}
      />
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
      <Button
        type="button"
        onClick={() =>
          openMedia((url) => setValue(`content.${blockIndex}.img`, url))
        }
        variant="outlinePrimary"
        spacing="sm"
      >
        Choose Image
      </Button>
    </>
  );
}
