import { ChevronUp, MoveDown, MoveUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LayoutBlock({
  block,
  index,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  children,
}: any) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex-1 min-w-0">
      <CardHeader
        className={`border-b border-base-light-gray py-3 px-5 ${expanded ? "pb-3" : "pb-3"}`}
      >
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Badge variant="black">{String(index + 1).padStart(2, "0")}</Badge>
          <span className="uppercase tracking-wider text-base-black/70">
            {block.type
              .replace(/([A-Z])/g, " $1")
              .replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </span>
        </CardTitle>
        <CardAction className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outlineNavBtnBlack"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            size="lg"
            spacing="sm"
            className="w-8"
            tooltip="Move Up"
          >
            <MoveUp />
          </Button>
          <Button
            type="button"
            variant="outlineNavBtnBlack"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            size="lg"
            spacing="sm"
            className="w-8"
            tooltip="Move Down"
          >
            <MoveDown />
          </Button>
          <div className="w-px h-5 bg-base-gray mx-1" />
          <Button
            type="button"
            onClick={() => setExpanded(!expanded)}
            variant="outlineNavBtnBlack"
            size="lg"
            spacing="sm"
            className="w-8"
            tooltip={expanded ? "Collapse" : "Expand"}
          >
            <ChevronUp
              className={`transition-transform duration-200 ${expanded ? "" : "-rotate-180"}`}
            />
          </Button>
          <Button
            type="button"
            onClick={onRemove}
            variant="outlineNavBtnDestructive"
            size="lg"
            spacing="sm"
            className="w-8"
            tooltip="Delete Block"
          >
            <Trash2 />
          </Button>
        </CardAction>
      </CardHeader>

      {expanded && (
        <CardContent className="p-5 space-y-6">{children}</CardContent>
      )}
    </div>
  );
}
