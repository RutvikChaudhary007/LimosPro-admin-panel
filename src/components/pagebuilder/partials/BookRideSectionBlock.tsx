import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";

interface ContactForServiceBlockProps {
  blockIndex: number;
  selectedLanguage: string;
}

export function BookRideSectionBlock({
  selectedLanguage,
  blockIndex,
}: ContactForServiceBlockProps) {
  const { register, control } = useFormContext();

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel
          className="text-base-black gap-0"
          htmlFor={`content.${selectedLanguage}.${blockIndex}.heading`}
        >
          Heading
        </FieldLabel>
        <InputGroup>
          <InputGroupInput
            {...register(
              `content.${selectedLanguage}.${blockIndex}.heading` as any,
            )}
          />
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel
          className="text-base-black gap-0"
          htmlFor={`content.${selectedLanguage}.${blockIndex}.description`}
        >
          Description
        </FieldLabel>
        <Controller
          control={control}
          name={`content.${selectedLanguage}.${blockIndex}.description`}
          render={({ field }) => (
            <TinyEditorRHF
              id={`content.${selectedLanguage}.${blockIndex}.description`}
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
            htmlFor={`content.${selectedLanguage}.${blockIndex}.btn`}
          >
            Button Text
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id={`content.${selectedLanguage}.${blockIndex}.btn`}
              type="text"
              placeholder="e.g. Contact Us"
              {...register(`content.${selectedLanguage}.${blockIndex}.btn`)}
            />
          </InputGroup>
        </Field>

        <Field>
          <FieldLabel
            className="text-base-black gap-0"
            htmlFor={`content.${selectedLanguage}.${blockIndex}.btnLink`}
          >
            Button Link
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id={`content.${selectedLanguage}.${blockIndex}.btnLink`}
              type="text"
              placeholder="e.g. /contact"
              {...register(`content.${selectedLanguage}.${blockIndex}.btnLink`)}
            />
          </InputGroup>
        </Field>
      </div>
    </div>
  );
}
