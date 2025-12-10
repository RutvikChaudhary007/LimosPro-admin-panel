import { Plus, Trash } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BlockField {
  name: string;
  label: string;
  type: "text" | "textarea" | "image" | "richtext" | "array";
  itemFields?: BlockField[];
}

interface BlockDefinition {
  type: string;
  label: string;
  fields: BlockField[];
}

interface BlockEditorProps {
  blockIndex: number;
  blockType: string;
  definition: BlockDefinition;
}

export function BlockEditor({ blockIndex, definition }: BlockEditorProps) {
  const { control } = useFormContext();

  const renderField = (field: BlockField, fieldPath: string) => {
    switch (field.type) {
      case "text":
      case "image": // For now, treat image as text URL. Can upgrade to UploadWithUrl later.
        return (
          <FormField
            key={fieldPath}
            control={control}
            name={fieldPath}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "textarea":
      case "richtext": // Treat richtext as textarea for now
        return (
          <FormField
            key={fieldPath}
            control={control}
            name={fieldPath}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea
                    {...formField}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "array":
        return (
          <ArrayField key={fieldPath} field={field} basePath={fieldPath} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {definition.fields.map((field) =>
        renderField(
          field,
          `layout.contentBlocks.${blockIndex}.content.${field.name}`,
        ),
      )}
    </div>
  );
}

function ArrayField({
  field,
  basePath,
}: {
  field: BlockField;
  basePath: string;
}) {
  const { watch, setValue, register } = useFormContext();
  const items = watch(basePath) || [];

  const handleAddItem = () => {
    const newItem: any = {};
    field.itemFields?.forEach((f) => {
      newItem[f.name] = "";
    });
    setValue(basePath, [...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setValue(basePath, newItems);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FormLabel>{field.label}</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddItem}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((_: any, index: number) => (
          <Card key={`${basePath}.${index}`} className="bg-muted/50">
            <CardContent className="p-4 space-y-4 relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                onClick={() => handleRemoveItem(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
              {field.itemFields?.map((itemField) => (
                <div key={itemField.name}>
                  <FormLabel className="text-xs">{itemField.label}</FormLabel>
                  {itemField.type === "textarea" ? (
                    <Textarea
                      {...register(`${basePath}.${index}.${itemField.name}`)}
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      {...register(`${basePath}.${index}.${itemField.name}`)}
                      className="mt-1"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-2 border border-dashed rounded">
            No items added.
          </div>
        )}
      </div>
    </div>
  );
}
