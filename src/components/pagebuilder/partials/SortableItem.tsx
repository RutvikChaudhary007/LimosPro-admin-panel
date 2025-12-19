import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";

export function SortableItem({ id, children }: any) {
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
      className={`group bg-base-white rounded border border-base-light-gray shadow-base-sm transition-all duration-200 ${
        isDragging
          ? "shadow-base-md border-base-primary ring-1 ring-base-primary/20 opacity-50"
          : "hover:border-base-black"
      }`}
    >
      <div className="flex min-h-[100px]">
        {/* Grip Handle */}
        <div
          {...attributes}
          {...listeners}
          className="w-10 flex items-center justify-center border-r border-base-light-gray cursor-grab active:cursor-grabbing group-hover:bg-base-gray/10 transition-colors"
          title="Drag to reorder"
        >
          <IconGripVertical className="w-5 h-5 text-base-gray group-hover:text-base-black transition-colors" />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-0 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
