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
import type { CorporateServiceOfferingsBlockProps } from "@/types/pagebuilder.types";
import { LabeledInput, LabeledTextarea } from "./HelperComponents";

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
  console.log("servicecardFields:", servicecardFields);

  return (
    <>
      <div className="border-t border-gray-700 pt-4 mt-4 relative">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide">
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
            variant="secondary"
            spacing="sm"
            size="sm"
          >
            + Add Card
          </Button>
        </div>

        {servicecardFields.length > 0 && (
          <div className="space-y-4">
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
                      >
                        Remove
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <LabeledInput
                      label="Image URL"
                      {...register(
                        `content.${blockIndex}.serviceCards.${cardIndex}.src`,
                      )}
                    />
                    <LabeledInput
                      label="Alt Text"
                      {...register(
                        `content.${blockIndex}.serviceCards.${cardIndex}.alt`,
                      )}
                    />
                    <LabeledInput
                      label="Title"
                      {...register(
                        `content.${blockIndex}.serviceCards.${cardIndex}.title`,
                      )}
                    />
                    <Controller
                      control={control}
                      name={`content.${blockIndex}.serviceCards.${cardIndex}.description`}
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
                    <LabeledInput
                      label="Button Link"
                      {...register(
                        `content.${blockIndex}.serviceCards.${cardIndex}.button`,
                      )}
                    />
                    <LabeledInput
                      label="Button Text"
                      {...register(
                        `content.${blockIndex}.serviceCards.${cardIndex}.btnTitle`,
                      )}
                    />
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
