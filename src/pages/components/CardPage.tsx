import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
function CardPage() {
  return (
    <div className="flex w-full p-2">
      <Card className="border-base-primary max-w-3xs min-w-3xs gap-0 space-y-1.5 rounded bg-linear-to-r from-[#E4F3FF] to-[#FFF8EF] pt-2.5">
        <CardHeader className="px-2.5">
          <CardAction>
            <Badge>
              <TrendingUp />
              <span>5.2%</span>
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="font-quicksand text-base leading-[100%] font-medium tracking-[0]">
            Total Revenue
          </p>
          <h4 className="font-montserrat text-2xl leading-[100%] font-bold tracking-[0]">
            $45,231.89
          </h4>
        </CardContent>
      </Card>
    </div>
  )
}

export default CardPage
