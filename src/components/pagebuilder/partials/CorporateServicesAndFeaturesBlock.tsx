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
import { SelectDropDown } from "@/components/ui/select";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import type { CorporateServicesAndFeaturesBlockProps } from "@/types/pagebuilder.types";

export function CorporateServicesAndFeaturesBlock({
  blockIndex,
  openMedia,
}: CorporateServicesAndFeaturesBlockProps) {
  const { register, setValue, control } = useFormContext();

  const {
    fields: infocardFields,
    append: appendInfocard,
    remove: removeInfocard,
  } = useFieldArray({
    name: `content.${blockIndex}.infoCards` as const,
  });

  return (
    <div className="space-y-6">
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
                height: 60,
                width: 60,
                orientation: "horizontal",
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <Field>
                        <FieldLabel
                          className="text-base-black gap-0"
                          htmlFor={`content.${blockIndex}.infoCards.${cardIndex}.height`}
                        >
                          Height (px)
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`content.${blockIndex}.infoCards.${cardIndex}.height`}
                            type="number"
                            {...register(
                              `content.${blockIndex}.infoCards.${cardIndex}.height`,
                              { valueAsNumber: true },
                            )}
                          />
                        </InputGroup>
                      </Field>

                      <Field>
                        <FieldLabel
                          className="text-base-black gap-0"
                          htmlFor={`content.${blockIndex}.infoCards.${cardIndex}.width`}
                        >
                          Width (px)
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`content.${blockIndex}.infoCards.${cardIndex}.width`}
                            type="number"
                            {...register(
                              `content.${blockIndex}.infoCards.${cardIndex}.width`,
                              { valueAsNumber: true },
                            )}
                          />
                        </InputGroup>
                      </Field>

                      <Field>
                        <FieldLabel
                          className="text-base-black gap-0"
                          htmlFor={`content.${blockIndex}.infoCards.${cardIndex}.orientation`}
                        >
                          Orientation
                        </FieldLabel>
                        <Controller
                          control={control}
                          name={`content.${blockIndex}.infoCards.${cardIndex}.orientation`}
                          render={({ field }) => (
                            <SelectDropDown
                              id={`content.${blockIndex}.infoCards.${cardIndex}.orientation`}
                              placeholder="Select orientation"
                              classname="w-full"
                              items={[
                                { value: "horizontal", label: "Horizontal" },
                                { value: "vertical", label: "Vertical" },
                              ]}
                              value={field.value}
                              setSelectedItem={field.onChange}
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
    </div>
  );
}
