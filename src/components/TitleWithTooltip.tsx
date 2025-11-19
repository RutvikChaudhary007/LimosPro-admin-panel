import { CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsTruncated } from "@/hooks/useIsTruncated";

export function TitleWithTooltip({ title }: { title: string }) {
  const { ref, isTruncated } = useIsTruncated();

  console.log(isTruncated);

  const titleNode = (
    <CardTitle
      ref={ref as React.RefObject<HTMLDivElement>}
      className="line-clamp-2 cursor-default"
    >
      {title}
    </CardTitle>
  );

  if (!isTruncated) return titleNode;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{titleNode}</TooltipTrigger>
        <TooltipContent side="top">
          <p className="max-w-xs">{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
