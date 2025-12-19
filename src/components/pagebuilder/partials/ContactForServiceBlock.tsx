import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";

interface ContactForServiceBlockProps {
  blockIndex: number;
}

export function ContactForServiceBlock({
  blockIndex,
}: ContactForServiceBlockProps) {
  const { register, control } = useFormContext();

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel
          className="text-base-black gap-0"
          htmlFor={`content.${blockIndex}.textRich`}
        >
          Description
        </FieldLabel>
        <Controller
          control={control}
          name={`content.${blockIndex}.textRich`}
          render={({ field }) => (
            <TinyEditorRHF
              id={`content.${blockIndex}.textRich`}
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel
            className="text-base-black gap-0"
            htmlFor={`content.${blockIndex}.btn`}
          >
            Button Link
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id={`content.${blockIndex}.btn`}
              type="text"
              placeholder="e.g. /contact"
              {...register(`content.${blockIndex}.btn`)}
            />
          </InputGroup>
        </Field>

        <Field>
          <FieldLabel
            className="text-base-black gap-0"
            htmlFor={`content.${blockIndex}.btnTitle`}
          >
            Button Text
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id={`content.${blockIndex}.btnTitle`}
              type="text"
              placeholder="e.g. Contact Us"
              {...register(`content.${blockIndex}.btnTitle`)}
            />
          </InputGroup>
        </Field>
      </div>
    </div>
  );
}
