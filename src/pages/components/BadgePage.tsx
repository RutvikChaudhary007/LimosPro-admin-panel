import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

function BadgePage() {
  return (
    <div className="flex gap-2 bg-pink-200 p-2">
      <Badge>
        <TrendingUp /> <span>5.2%</span>
      </Badge>
      <Badge variant={"secondary"}>
        <TrendingUp /> <span>5.2%</span>
      </Badge>
      <Badge variant={"black"}>
        <TrendingUp /> <span>5.2%</span>
      </Badge>
      <Badge variant={"white"}>
        <TrendingUp /> <span>5.2%</span>
      </Badge>
    </div>
  )
}

export default BadgePage
