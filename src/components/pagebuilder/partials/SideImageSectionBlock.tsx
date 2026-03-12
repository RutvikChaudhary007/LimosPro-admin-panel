import {
  Controller,
  //  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardAction,
//   CardBody,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import UploadWithUrlV2 from "@/components/ui/upload-with-url-v2";
import type { SideImageSectionBlockProps } from "@/types/pagebuilder.types";

export function SideImageSectionBlock({
  selectedLanguage,
  blockIndex,
}: SideImageSectionBlockProps) {
  const { register, setValue, control, watch } = useFormContext();

  return (
    <div className="space-y-6">
      <Controller
        name={`content.${selectedLanguage}.${blockIndex}.src` as any}
        control={control}
        render={({ field }) => (
          <UploadWithUrlV2
            value={field.value}
            onChange={field.onChange}
            title="Image"
          />
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field className="col-span-2">
          <FieldLabel
            className="text-base-black gap-0"
            htmlFor={`content.${selectedLanguage}.${blockIndex}.alt`}
          >
            Image Alt Text
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id={`content.${selectedLanguage}.${blockIndex}.alt`}
              type="text"
              placeholder="e.g. Image Alt Text"
              {...register(`content.${selectedLanguage}.${blockIndex}.alt`)}
            />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel
            className="text-base-black gap-0"
            htmlFor={`content.${selectedLanguage}.${blockIndex}.headingTop`}
          >
            Top Heading
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id={`content.${selectedLanguage}.${blockIndex}.headingTop`}
              type="text"
              placeholder="Title 1"
              {...register(
                `content.${selectedLanguage}.${blockIndex}.headingTop`,
              )}
            />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel
            className="text-base-black gap-0"
            htmlFor={`content.${selectedLanguage}.${blockIndex}.headingBottom`}
          >
            Bottom Heading
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id={`content.${selectedLanguage}.${blockIndex}.headingBottom`}
              type="text"
              placeholder="Title 2"
              {...register(
                `content.${selectedLanguage}.${blockIndex}.headingBottom`,
              )}
            />
          </InputGroup>
        </Field>

        <Field className="col-span-2">
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
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id={`content.${selectedLanguage}.${blockIndex}.imageLeft`}
          checked={watch(
            `content.${selectedLanguage}.${blockIndex}.imageLeft` as any,
          )}
          onCheckedChange={(v) =>
            setValue(
              `content.${selectedLanguage}.${blockIndex}.imageLeft` as any,
              v === true,
            )
          }
        />
        <label
          htmlFor={`content.${selectedLanguage}.${blockIndex}.imageLeft`}
          className="text-sm"
        >
          Image on Left?
        </label>
      </div>
      {/* Info Cards Section */}
      {/* <div className="border-t border-border pt-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-bold text-base-black uppercase tracking-wider">
            Info Cards ({infocardFields.length})
          </h4>
          <Button
            type="button"
            onClick={() =>
              appendInfocard({
                src: "",
                alt: "",
                title: "",
                description: "",
              })
            }
            variant="outlinePrimary"
            spacing="sm"
          >
            + Add Card
          </Button>
        </div>

        {infocardFields.length > 0 && (
          <div className="space-y-6">
            {infocardFields.map((field, cardIndex) => (
              <Card key={field.id}>
                <CardBody>
                  <CardHeader>
                    <CardTitle>Card #{cardIndex + 1}</CardTitle>
                    <CardAction>
                      <Button
                        type="button"
                        onClick={() => removeInfocard(cardIndex)}
                        variant="destructive"
                        spacing="sm"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel
                          className="text-base-black gap-0"
                          htmlFor={`content.${blockIndex}.infoCards.${cardIndex}.src`}
                        >
                          Image URL
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`content.${blockIndex}.infoCards.${cardIndex}.src`}
                            type="text"
                            placeholder="https://..."
                            {...register(
                              `content.${blockIndex}.infoCards.${cardIndex}.src`,
                            )}
                          />
                        </InputGroup>
                        <Button
                          type="button"
                          onClick={() =>
                            openMedia((url) =>
                              setValue(
                                `content.${blockIndex}.infoCards.${cardIndex}.src`,
                                url,
                              ),
                            )
                          }
                          variant="linkPrimary"
                          spacing="none"
                          className="mt-1 h-auto text-xs justify-start"
                        >
                          Choose from Media
                        </Button>
                      </Field>

                      <Field>
                        <FieldLabel
                          className="text-base-black gap-0"
                          htmlFor={`content.${blockIndex}.infoCards.${cardIndex}.alt`}
                        >
                          Alt Text
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`content.${blockIndex}.infoCards.${cardIndex}.alt`}
                            type="text"
                            placeholder="Image accessibility text"
                            {...register(
                              `content.${blockIndex}.infoCards.${cardIndex}.alt`,
                            )}
                          />
                        </InputGroup>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel
                        className="text-base-black gap-0"
                        htmlFor={`content.${blockIndex}.infoCards.${cardIndex}.title`}
                      >
                        Title
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id={`content.${blockIndex}.infoCards.${cardIndex}.title`}
                          type="text"
                          placeholder="Card title"
                          {...register(
                            `content.${blockIndex}.infoCards.${cardIndex}.title`,
                          )}
                        />
                      </InputGroup>
                    </Field>

                    <Field>
                      <FieldLabel
                        className="text-base-black gap-0"
                        htmlFor={`content.${blockIndex}.infoCards.${cardIndex}.description`}
                      >
                        Description
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={`content.${blockIndex}.infoCards.${cardIndex}.description`}
                        render={({ field }) => (
                          <TinyEditorRHF
                            id={`content.${blockIndex}.infoCards.${cardIndex}.description`}
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          />
                        )}
                      />
                    </Field>
                  </CardContent>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
}
