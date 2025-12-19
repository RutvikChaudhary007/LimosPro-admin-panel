import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";

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
    <div className="space-y-4">
      <Field>
        <FieldLabel className="text-base-black gap-0">Image URL</FieldLabel>
        <InputGroup>
          <InputGroupInput
            type="text"
            placeholder="https://..."
            {...register(`content.${blockIndex}.img`)}
          />
        </InputGroup>
        <Button
          type="button"
          onClick={() =>
            openMedia((url) => setValue(`content.${blockIndex}.img`, url))
          }
          variant="linkPrimary"
          spacing="none"
          className="mt-1 h-auto text-xs justify-start"
        >
          Choose from Media
        </Button>
      </Field>

      <Field>
        <FieldLabel className="text-base-black gap-0">Description</FieldLabel>
        <Controller
          control={control}
          name={`content.${blockIndex}.textRich`}
          render={({ field }) => (
            <TinyEditorRHF
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </Field>
    </div>
  );
}
