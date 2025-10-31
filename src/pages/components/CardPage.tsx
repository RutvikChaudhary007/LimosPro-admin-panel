import { MetricCard } from "@/components/ui/card"
import { TrendingDown } from "lucide-react"

function CardPage() {
  return (
    <div className="flex w-full gap-4 p-2">
      <MetricCard title="Total Revenue" value="$45,231.89" percentage="5.2%" />

      <MetricCard title="New Customers" value="1,204" percentage="3.8%" />

      <MetricCard title="Refunds" value="$231.00" percentage="-1.1%" icon={<TrendingDown />} />

      <MetricCard title="Refunds" value="$231.00" percentage="-1.1%" icon={<TrendingDown />} />
    </div>
  )
}

export default CardPage
