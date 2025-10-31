import { MetricCard } from "../../../components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-8 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value="$45,231.89"
        percentage="5.2%"
        headerClass="px-[5px]"
        wrapperClass="border-0"
        valueClass="text-3xl"
      />
      <MetricCard
        title="Total Revenue"
        value="$45,231.89"
        percentage="5.2%"
        headerClass="px-[5px]"
        wrapperClass="border-0"
        valueClass="text-3xl"
      />
      <MetricCard
        title="Total Revenue"
        value="$45,231.89"
        percentage="5.2%"
        headerClass="px-[5px]"
        wrapperClass="border-0"
        valueClass="text-3xl"
      />
      <MetricCard
        title="Total Revenue"
        value="$45,231.89"
        percentage="5.2%"
        headerClass="px-[5px]"
        wrapperClass="border-0"
        valueClass="text-3xl"
      />
    </div>
  )
}
