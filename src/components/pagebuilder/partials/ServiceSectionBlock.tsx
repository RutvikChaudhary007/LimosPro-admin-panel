import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import type { ServiceSectionBlockProps } from "@/types/pagebuilder.types";

export function ServiceSectionBlock({
  blockIndex,
  openMedia,
}: ServiceSectionBlockProps) {
  const { register, setValue, control } = useFormContext();

  // Nested field array for infoCards
  const {
    fields: infocardFields,
    append: appendInfocard,
    remove: removeInfocard,
  } = useFieldArray({
    name: `content.${blockIndex}.infoCards` as const,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel className="text-base-black gap-0">Service</FieldLabel>
          <InputGroup>
            <InputGroupInput
              type="text"
              placeholder="e.g. Corporate Relocation"
              {...register(`content.${blockIndex}.service`)}
            />
          </InputGroup>
        </Field>

        <Field>
          <FieldLabel className="text-base-black gap-0">Subservice</FieldLabel>
          <InputGroup>
            <InputGroupInput
              type="text"
              placeholder="e.g. Office Move"
              {...register(`content.${blockIndex}.subService`)}
            />
          </InputGroup>
        </Field>
      </div>

      {/* Info Cards Section */}
      <div className="border-t border-border pt-6 mt-6">
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
                        <FieldLabel className="text-base-black gap-0">
                          Image URL
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
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
                        <FieldLabel className="text-base-black gap-0">
                          Alt Text
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
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
                      <FieldLabel className="text-base-black gap-0">
                        Title
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          type="text"
                          placeholder="Card title"
                          {...register(
                            `content.${blockIndex}.infoCards.${cardIndex}.title`,
                          )}
                        />
                      </InputGroup>
                    </Field>

                    <Field>
                      <FieldLabel className="text-base-black gap-0">
                        Description
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={`content.${blockIndex}.infoCards.${cardIndex}.description`}
                        render={({ field }) => (
                          <TinyEditorRHF
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
      </div>
    </div>
  );
}
