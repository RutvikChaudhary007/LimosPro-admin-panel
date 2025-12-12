import { ChevronUp, MoveDown, MoveUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardBody,
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
    <Card>
      <CardBody className="overflow-hidden">
        <CardHeader className={`border-b ${expanded ? "!pb-2" : "!pb-1"}`}>
          <CardTitle>
            <span className="text-sm font-medium text-base-gray mr-2">
              #{String(index + 1).padStart(2, "0")}
            </span>
            {block.type
              .replace(/([A-Z])/g, " $1")
              .replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </CardTitle>
          <CardAction className="flex items-center gap-2">
            <Button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="Move Up"
            >
              <MoveUp />
            </Button>
            <Button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="Move Down"
            >
              <MoveDown />
            </Button>
            <Button
              type="button"
              onClick={() => setExpanded(!expanded)}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip={expanded ? "Collapse" : "Expand"}
            >
              <ChevronUp
                className={`transition-all ${expanded ? "" : "-rotate-180"}`}
              />
            </Button>
            <Button
              type="button"
              onClick={onRemove}
              variant="outlineNavBtnDestructive"
              size="xl"
              spacing="lg"
              tooltip="Delete Block"
            >
              <Trash2 />
            </Button>
          </CardAction>
        </CardHeader>

        {expanded && (
          <CardContent className="space-y-4">{children}</CardContent>
        )}
      </CardBody>
    </Card>
  );
}
