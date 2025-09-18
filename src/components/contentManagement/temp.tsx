//@ts-nocheck
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ------------------- Zod Schema -------------------
const fieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  type: z.enum(["text", "number", "date"]),
});

const formSchema = z.object({
  fields: z.array(fieldSchema).min(1, "At least one field required"),
});

type FormValues = z.infer<typeof formSchema>;

// ------------------- Sortable Field Item -------------------
const SortableField: React.FC<{
  id: string;
  index: number;
  field: any;
  remove: (index: number) => void;
  control: any;
}> = ({ id, index, field, remove, control }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid #ddd",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "8px",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Controller
        control={control}
        name={`fields.${index}.label`}
        render={({ field }) => (
          <input
            {...field}
            placeholder="Field Label"
            className="border p-2 rounded"
          />
        )}
      />

      <Controller
        control={control}
        name={`fields.${index}.type`}
        render={({ field }) => (
          <select {...field} className="border p-2 rounded">
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
          </select>
        )}
      />

      <button
        type="button"
        onClick={() => remove(index)}
        className="text-red-600 text-sm"
      >
        Remove
      </button>
    </div>
  );
};
const ContentManagementForm = () => {
    const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fields: [] },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "fields",
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const onSubmit = (data: FormValues) => {
    console.log("Submitted:", data);
    reset();
  };

  return (
     <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-4 space-y-4"
    >
      <h2 className="text-xl font-bold">Dynamic Page Form</h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (active.id !== over?.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id);
            const newIndex = fields.findIndex((f) => f.id === over?.id);
            move(oldIndex, newIndex);
          }
        }}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field, index) => (
            <SortableField
              key={field.id}
              id={field.id}
              index={index}
              field={field}
              remove={remove}
              control={control}
            />
          ))}
        </SortableContext>
      </DndContext>

      {errors.fields && (
        <p className="text-red-600">{errors.fields.message}</p>
      )}

      <button
        type="button"
        onClick={() => append({ label: "", type: "text" })}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Field
      </button>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  )
}

export default ContentManagementForm
