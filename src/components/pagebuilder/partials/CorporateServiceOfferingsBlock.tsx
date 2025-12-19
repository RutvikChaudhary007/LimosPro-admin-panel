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
import type { CorporateServiceOfferingsBlockProps } from "@/types/pagebuilder.types";

export function CorporateServiceOfferingsBlock({
  blockIndex,
  openMedia,
}: CorporateServiceOfferingsBlockProps) {
  const { register, setValue, control } = useFormContext();

  const {
    fields: servicecardFields,
    append: appendServicecard,
    remove: removeServicecard,
  } = useFieldArray({
    name: `content.${blockIndex}.serviceCards` as const,
  });

  return (
    <div className="space-y-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel
                          className="text-base-black gap-0"
                          htmlFor={`content.${blockIndex}.serviceCards.${cardIndex}.src`}
                        >
                          Image URL
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`content.${blockIndex}.serviceCards.${cardIndex}.src`}
                            type="text"
                            placeholder="https://..."
                            {...register(
                              `content.${blockIndex}.serviceCards.${cardIndex}.src`,
                            )}
                          />
                        </InputGroup>
                        <Button
                          type="button"
                          onClick={() =>
                            openMedia((url) =>
                              setValue(
                                `content.${blockIndex}.serviceCards.${cardIndex}.src`,
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
                          htmlFor={`content.${blockIndex}.serviceCards.${cardIndex}.alt`}
                        >
                          Alt Text
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`content.${blockIndex}.serviceCards.${cardIndex}.alt`}
                            type="text"
                            placeholder="Image accessibility text"
                            {...register(
                              `content.${blockIndex}.serviceCards.${cardIndex}.alt`,
                            )}
                          />
                        </InputGroup>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel
                        className="text-base-black gap-0"
                        htmlFor={`content.${blockIndex}.serviceCards.${cardIndex}.title`}
                      >
                        Title
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id={`content.${blockIndex}.serviceCards.${cardIndex}.title`}
                          type="text"
                          placeholder="Card title"
                          {...register(
                            `content.${blockIndex}.serviceCards.${cardIndex}.title`,
                          )}
                        />
                      </InputGroup>
                    </Field>

                    <Field>
                      <FieldLabel
                        className="text-base-black gap-0"
                        htmlFor={`content.${blockIndex}.serviceCards.${cardIndex}.description`}
                      >
                        Description
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={`content.${blockIndex}.serviceCards.${cardIndex}.description`}
                        render={({ field }) => (
                          <TinyEditorRHF
                            id={`content.${blockIndex}.serviceCards.${cardIndex}.description`}
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
                          htmlFor={`content.${blockIndex}.serviceCards.${cardIndex}.button`}
                        >
                          Button Link
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`content.${blockIndex}.serviceCards.${cardIndex}.button`}
                            type="text"
                            placeholder="/services/..."
                            {...register(
                              `content.${blockIndex}.serviceCards.${cardIndex}.button`,
                            )}
                          />
                        </InputGroup>
                      </Field>

                      <Field>
                        <FieldLabel
                          className="text-base-black gap-0"
                          htmlFor={`content.${blockIndex}.serviceCards.${cardIndex}.btnTitle`}
                        >
                          Button Text
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`content.${blockIndex}.serviceCards.${cardIndex}.btnTitle`}
                            type="text"
                            placeholder="e.g. Learn More"
                            {...register(
                              `content.${blockIndex}.serviceCards.${cardIndex}.btnTitle`,
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
