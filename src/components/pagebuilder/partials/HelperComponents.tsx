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
