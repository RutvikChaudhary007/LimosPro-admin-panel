import { Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";

export const FaqSectionBlock = ({
  selectedLanguage,
  blockIndex,
}: {
  selectedLanguage: string;
  blockIndex: number;
}) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `content.${selectedLanguage}.${blockIndex}.faqCards`,
  });

  return (
    <Card className="border-dashed">
      <CardBody>
        <CardHeader>
          <CardTitle>FAQ Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel
              htmlFor={`content.${selectedLanguage}.${blockIndex}.heading`}
            >
              Section Heading
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id={`content.${selectedLanguage}.${blockIndex}.heading`}
                placeholder="FAQs or Frequently Asked Questions"
                {...register(
                  `content.${selectedLanguage}.${blockIndex}.heading`,
                )}
              />
            </InputGroup>
          </Field>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold">FAQ Items</h4>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => append({ question: "", answer: "" })}
              >
                + Add FAQ
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="relative bg-gray-50/50">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-base-danger hover:bg-base-danger/10 size-8"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <CardContent className="p-4 space-y-3">
                    <Field>
                      <FieldLabel>Question</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          placeholder="Enter question"
                          {...register(
                            `content.${selectedLanguage}.${blockIndex}.faqCards.${index}.question`,
                          )}
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Answer</FieldLabel>
                      <Textarea
                        placeholder="Enter answer"
                        {...register(
                          `content.${selectedLanguage}.${blockIndex}.faqCards.${index}.answer`,
                        )}
                      />
                    </Field>
                  </CardContent>
                </Card>
              ))}

              {fields.length === 0 && (
                <div className="text-center p-4 border border-dashed rounded text-gray-400 text-xs">
                  No FAQ items added.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </CardBody>
    </Card>
  );
};
