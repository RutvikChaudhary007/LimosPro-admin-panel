import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FeaturesAddonInput } from "@/components/common/FeaturesAddonInput";
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
import UploadWithUrlV2 from "@/components/ui/upload-with-url-v2";
import type { PremiumFleetSectionBlockProps } from "@/types/pagebuilder.types";

export function PremiumFleetSectionBlock({
  selectedLanguage,
  blockIndex,
}: PremiumFleetSectionBlockProps) {
  const { register, control } = useFormContext();

  const {
    fields: servicecardFields,
    append: appendServicecard,
    remove: removeServicecard,
  } = useFieldArray({
    name: `content.${selectedLanguage}.${blockIndex}.serviceCards` as const,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <CardHeader className="space-y-3">
            <Field>
              <FieldLabel
                className="text-base-black gap-0"
                htmlFor={`content.${selectedLanguage}.${blockIndex}.headingTop`}
              >
                Top Heading
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
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
                  {...register(
                    `content.${selectedLanguage}.${blockIndex}.headingBottom`,
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
          </CardHeader>
          <CardContent>
            <div className="border-t border-border pt-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-bold text-base-black uppercase tracking-wider">
                  Service Cards ({servicecardFields.length})
                </h4>
                <Button
                  type="button"
                  onClick={() =>
                    appendServicecard({
                      src: "",
                      alt: "",
                      rating: 0,
                      heading: "",
                      title: "",
                      features: [],
                      btnTitle: "",
                      btnLink: "",
                    })
                  }
                  variant="outlinePrimary"
                  spacing="sm"
                >
                  + Add Card
                </Button>
              </div>

              {servicecardFields.length > 0 && (
                <div className="space-y-6">
                  {servicecardFields.map((field, cardIndex) => (
                    <Card key={field.id}>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Card #{cardIndex + 1}</CardTitle>
                          <CardAction>
                            <Button
                              type="button"
                              onClick={() => removeServicecard(cardIndex)}
                              variant="destructive"
                              spacing="sm"
                              size="sm"
                            >
                              Remove
                            </Button>
                          </CardAction>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Controller
                            name={
                              `content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.src` as any
                            }
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
                                htmlFor={`content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.alt`}
                              >
                                Alt Text
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id={`content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.alt`}
                                  type="text"
                                  placeholder="Image accessibility text"
                                  {...register(
                                    `content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.alt`,
                                  )}
                                />
                              </InputGroup>
                            </Field>

                            <Field>
                              <FieldLabel>Heading</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.heading`,
                                  )}
                                />
                              </InputGroup>
                            </Field>

                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor={`content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.title`}
                              >
                                Title
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id={`content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.title`}
                                  type="text"
                                  placeholder="Card title"
                                  {...register(
                                    `content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.title`,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor={`content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.rating`}
                              >
                                Rating
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id={`content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.rating`}
                                  type="number"
                                  placeholder="e.g 3"
                                  {...register(
                                    `content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.rating`,
                                    { valueAsNumber: true },
                                  )}
                                />
                              </InputGroup>
                            </Field>

                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor={`content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.btnTitle`}
                              >
                                Button Text
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id={`content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.btnTitle`}
                                  type="text"
                                  placeholder="e.g. Learn More"
                                  {...register(
                                    `content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.btnTitle`,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor={`content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.btnLink`}
                              >
                                Button Link
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id={`content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.btnLink`}
                                  type="text"
                                  placeholder="e.g. https://upsloper.com/image_name.jpg"
                                  {...register(
                                    `content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.btnLink`,
                                  )}
                                />
                              </InputGroup>
                            </Field>

                            <Field className="col-span-2">
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor={`content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.features`}
                              >
                                Features
                              </FieldLabel>
                              <Controller
                                name={`content.${selectedLanguage}.${blockIndex}.serviceCards.${cardIndex}.features`}
                                control={control}
                                render={({ field }) => (
                                  <FeaturesAddonInput
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                )}
                              />
                            </Field>
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </CardBody>
      </Card>
    </div>
  );
}
