import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";
import type React from "react";

interface SortableWrapperProps {
  id: string;
  children: React.ReactNode;
}

export function SortableWrapper({ id, children }: SortableWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white rounded border border-base-gray shadow-base-sm transition-all duration-200 ${
        isDragging
          ? "shadow-base-md border-base-primary ring-1 ring-base-primary/20"
          : "hover:border-base-primary/30"
      }`}
    >
      <div className="flex bg-white rounded overflow-hidden">
        {/* Grip Handle */}
        <div
          {...attributes}
          {...listeners}
          className="w-10 flex items-center justify-center bg-base-gray/5 border-r border-base-gray cursor-grab active:cursor-grabbing hover:bg-base-gray/10 transition-colors"
          title="Drag to reorder"
        >
          <IconGripVertical className="w-5 h-5 text-base-gray/40 group-hover:text-base-primary/50 transition-colors" />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-5">{children}</div>
      </div>
    </div>
  );
}

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import type {
  LabeledEditorProps,
  LabeledTextareaProps,
} from "@/types/pagebuilder.types";
import { Input } from "../../ui/input";

/**
 * Helper component for labeled inputs
 */
export function LabeledInput({ label, ...props }: any) {
  const id = props.name || `input-${Math.random()}`;
  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

/**
 * Helper component for TinyEditor with label
 */
export function LabeledEditor({
  label,
  value,
  onChange,
  onBlur,
  name,
  ...props
}: LabeledEditorProps) {
  const id = name || `editor-${Math.random()}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <TinyEditorRHF
        value={value || ""}
        onChange={(val: any) => {
          onChange(val);
        }}
        onBlur={onBlur}
        name={name}
        {...props}
      />
    </div>
  );
}

/**
 * Helper component for simple textarea
 */
export function LabeledTextarea({
  label,
  value,
  onChange,
  onBlur,
  name,
  ...props
}: LabeledTextareaProps) {
  const id = name || `textarea-${Math.random()}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        rows={4}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        name={name}
        {...props}
      />
    </div>
  );
}
