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
import type { ServiceSectionBlockProps } from "@/types/pagebuilder.types";
import { LabeledEditor, LabeledInput } from "./HelperComponents";

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
    <>
      <LabeledInput
        label="Service"
        {...register(`content.${blockIndex}.service`)}
      />
      <LabeledInput
        label="Subservice"
        {...register(`content.${blockIndex}.subService`)}
      />

      {/* Info Cards Section */}
      <div className="border-t border-border pt-4 mt-4 relative">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs text-base-gray uppercase tracking-wide">
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
                        <LabeledEditor
                          label="Description"
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      )}
                    />
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
