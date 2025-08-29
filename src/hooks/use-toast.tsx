import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function useToast({ title, description, variant}:{title:string,description:string, variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined}) {
  return (
    <Button
      variant={variant}
      onClick={() =>
        toast(title, {
          description,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  )
}

export const Toaster = ({ title, description}:{title:string,description:string}) => toast(title, {
          description,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });