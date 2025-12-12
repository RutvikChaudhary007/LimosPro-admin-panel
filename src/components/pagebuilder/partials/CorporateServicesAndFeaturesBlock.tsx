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
import { SelectDropDown } from "@/components/ui/select";
import type { CorporateServicesAndFeaturesBlockProps } from "@/types/pagebuilder.types";
import { LabeledInput, LabeledTextarea } from "./HelperComponents";

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
    <>
      <div className="border-t border-gray-700 pt-4 mt-4 relative">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide">
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
            variant="secondary"
            spacing="sm"
            size="sm"
          >
            + Add Card
          </Button>
        </div>
        {infocardFields.length > 0 && (
          <div className="space-y-4">
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
                      >
                        Remove
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <LabeledInput
                      label="Image URL"
                      {...register(
                        `content.${blockIndex}.infoCards.${cardIndex}.src`,
                      )}
                    />
                    <LabeledInput
                      label="Alt Text"
                      {...register(
                        `content.${blockIndex}.infoCards.${cardIndex}.alt`,
                      )}
                    />
                    <LabeledInput
                      label="Title"
                      {...register(
                        `content.${blockIndex}.infoCards.${cardIndex}.title`,
                      )}
                    />
                    <Controller
                      control={control}
                      name={`content.${blockIndex}.infoCards.${cardIndex}.description`}
                      render={({ field }) => (
                        <LabeledTextarea
                          label="Description"
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      )}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <LabeledInput
                        label="Height (px)"
                        type="number"
                        {...register(
                          `content.${blockIndex}.infoCards.${cardIndex}.height`,
                          {
                            valueAsNumber: true,
                          },
                        )}
                      />
                      <LabeledInput
                        label="Width (px)"
                        type="number"
                        {...register(
                          `content.${blockIndex}.infoCards.${cardIndex}.width`,
                          {
                            valueAsNumber: true,
                          },
                        )}
                      />
                    </div>
                    <div className="block text-sm">
                      <div className="text-xs text-gray-400 mb-1.5 tracking-wide">
                        Orientation
                      </div>

                      <Controller
                        control={control}
                        name={`content.${blockIndex}.infoCards.${cardIndex}.orientation`}
                        render={({ field }) => (
                          <SelectDropDown
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
                    </div>

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
                      variant="outlinePrimary"
                      spacing="sm"
                    >
                      Choose Image
                    </Button>
                  </CardContent>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
