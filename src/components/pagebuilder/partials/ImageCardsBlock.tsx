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
import type { ImageCardsBlockProps } from "@/types/pagebuilder.types";

export function ImageCardsBlock({
  blockIndex,
  openMedia,
}: ImageCardsBlockProps) {
  const { register, setValue, control } = useFormContext();

  const {
    fields: imagecardFields,
    append: appendImagecard,
    remove: removeImagecard,
  } = useFieldArray({
    name: `content.${blockIndex}.imageCards` as const,
  });

  return (
    <div className="space-y-6">
      <div className="border-t border-border pt-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-bold text-base-black uppercase tracking-wider">
            Image Cards ({imagecardFields.length})
          </h4>
          <Button
            type="button"
            onClick={() =>
              appendImagecard({
                src: "",
                alt: "",
                title: "",
                description: "",
                button: "",
                btnTitle: "",
              })
            }
            variant="outlinePrimary"
            spacing="sm"
          >
            + Add Card
          </Button>
        </div>

        {imagecardFields.length > 0 && (
          <div className="space-y-6">
            {imagecardFields.map((field, cardIndex) => (
              <Card key={field.id}>
                <CardBody>
                  <CardHeader>
                    <CardTitle>Card #{cardIndex + 1}</CardTitle>
                    <CardAction>
                      <Button
                        type="button"
                        onClick={() => removeImagecard(cardIndex)}
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
                          htmlFor={`content.${blockIndex}.imageCards.${cardIndex}.src`}
                        >
                          Image URL
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`content.${blockIndex}.imageCards.${cardIndex}.src`}
                            type="text"
                            placeholder="https://..."
                            {...register(
                              `content.${blockIndex}.imageCards.${cardIndex}.src`,
                            )}
                          />
                        </InputGroup>
                        <Button
                          type="button"
                          onClick={() =>
                            openMedia((url) =>
                              setValue(
                                `content.${blockIndex}.imageCards.${cardIndex}.src`,
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
                          htmlFor={`content.${blockIndex}.imageCards.${cardIndex}.alt`}
                        >
                          Alt Text
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`content.${blockIndex}.imageCards.${cardIndex}.alt`}
                            type="text"
                            placeholder="Image accessibility text"
                            {...register(
                              `content.${blockIndex}.imageCards.${cardIndex}.alt`,
                            )}
                          />
                        </InputGroup>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel
                        className="text-base-black gap-0"
                        htmlFor={`content.${blockIndex}.imageCards.${cardIndex}.title`}
                      >
                        Title
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id={`content.${blockIndex}.imageCards.${cardIndex}.title`}
                          type="text"
                          placeholder="Card title"
                          {...register(
                            `content.${blockIndex}.imageCards.${cardIndex}.title`,
                          )}
                        />
                      </InputGroup>
                    </Field>

                    <Field>
                      <FieldLabel
                        className="text-base-black gap-0"
                        htmlFor={`content.${blockIndex}.imageCards.${cardIndex}.description`}
                      >
                        Description
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={`content.${blockIndex}.imageCards.${cardIndex}.description`}
                        render={({ field }) => (
                          <TinyEditorRHF
                            id={`content.${blockIndex}.imageCards.${cardIndex}.description`}
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
                          htmlFor={`content.${blockIndex}.imageCards.${cardIndex}.button`}
                        >
                          Button Link
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`content.${blockIndex}.imageCards.${cardIndex}.button`}
                            type="text"
                            placeholder="/services/..."
                            {...register(
                              `content.${blockIndex}.imageCards.${cardIndex}.button`,
                            )}
                          />
                        </InputGroup>
                      </Field>

                      <Field>
                        <FieldLabel
                          className="text-base-black gap-0"
                          htmlFor={`content.${blockIndex}.imageCards.${cardIndex}.btnTitle`}
                        >
                          Button Text
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`content.${blockIndex}.imageCards.${cardIndex}.btnTitle`}
                            type="text"
                            placeholder="e.g. Learn More"
                            {...register(
                              `content.${blockIndex}.imageCards.${cardIndex}.btnTitle`,
                            )}
                          />
                        </InputGroup>
                      </Field>
                    </div>
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
