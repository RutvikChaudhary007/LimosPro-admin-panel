import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";

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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="mb-3">
        {/* Drag Handle - now properly connected via listeners */}
        <Button
          {...listeners}
          type="button"
          variant="outlineNavBtnBlack"
          spacing="sm"
          className="cursor-grab active:cursor-grabbing mb-2"
        >
          <span className="drag-handle">⠿</span>
          Drag to reorder
        </Button>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
