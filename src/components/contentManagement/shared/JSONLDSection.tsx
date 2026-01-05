import { Plus, Trash2 } from "lucide-react";
import type React from "react";
import { Controller, type UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { getDefaultJsonLdItem } from "@/utils/pagebuilder.utils";

interface JSONLDSectionProps {
  form: UseFormReturn<any>;
  selectedLanguage?: string; // Optional for shared structure
  basePath?: string; // e.g., "jsonLd"
}

export const JSONLDSection: React.FC<JSONLDSectionProps> = ({
  form,
  selectedLanguage,
  basePath = "jsonLd",
}) => {
  const { control } = form;

  const fieldArrayName = selectedLanguage
    ? `${basePath}.${selectedLanguage}`
    : basePath;
  const langTitle = selectedLanguage
    ? `(${selectedLanguage.toUpperCase()})`
    : "(Shared)";

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldArrayName as any,
  } as any);

  const handleAddItem = () => {
    append(getDefaultJsonLdItem("FAQPage"));
  };

  return (
    <Card>
      <CardBody>
        <CardHeader>
          <CardTitle>JSON-LD Schema {langTitle}</CardTitle>
          <CardAction>
            <Button type="button" size="sm" onClick={handleAddItem}>
              <Plus className="w-4 h-4 mr-2" /> Add Schema Item
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
              No JSON-LD schemas added.
            </div>
          )}
          {fields.map((field, index) => (
            <Card key={field.id} className="border-dashed">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold uppercase text-gray-400">
                    Item #{index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <Field>
                  <Controller
                    name={`${fieldArrayName}.${index}` as any}
                    control={control}
                    render={({ field: controllerField }) => (
                      <div className="space-y-2">
                        <Textarea
                          className="font-mono text-xs h-48 bg-gray-50 dark:bg-gray-900"
                          value={
                            typeof controllerField.value === "string"
                              ? controllerField.value
                              : JSON.stringify(controllerField.value, null, 2)
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            try {
                              // Attempt to parse to see if it's valid JSON
                              const parsed = JSON.parse(val);
                              controllerField.onChange(parsed);
                            } catch (err) {
                              // If invalid JSON, keep it as string (shows validation error or just stays as is)
                              controllerField.onChange(val);
                            }
                          }}
                        />
                        {typeof controllerField.value === "string" && (
                          <p className="text-[10px] text-red-500">
                            Invalid JSON format
                          </p>
                        )}
                      </div>
                    )}
                  />
                </Field>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </CardBody>
    </Card>
  );
};
