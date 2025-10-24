// @ts-nocheck
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"
import useFetchAllPermissions from "@/api/permission.api";
import { Spinner } from "../Spinner";
type TData = {
    id: string;
    name: string;
}
const MultiSelectComp = () => {
    const {data, isFetching} = useFetchAllPermissions();
    if(isFetching) return (<Spinner/>);
  return (
      <MultiSelect usePortal={true}>
      <MultiSelectTrigger className="w-full max-w-[400px]">
        <MultiSelectValue placeholder="Select frameworks..." overflowBehavior={"cutoff"} />
      </MultiSelectTrigger>
      <MultiSelectContent>
        {/* Items must be wrapped in a group for proper styling */}
        <MultiSelectGroup>
            {data?.permissions?.length > 0 && data?.permissions?.map((item:TData) => (
                <MultiSelectItem key={item.id} value={item.id}>{item.name}</MultiSelectItem>
            ))}
          {/* <MultiSelectItem value="next.js">Next.js</MultiSelectItem>
          <MultiSelectItem value="sveltekit">SvelteKit</MultiSelectItem>
          <MultiSelectItem value="nuxt.js">Nuxt.js</MultiSelectItem>
          <MultiSelectItem value="remix">Remix</MultiSelectItem>
          <MultiSelectItem value="astro">Astro</MultiSelectItem>
          <MultiSelectItem value="vue">Vue.js</MultiSelectItem>
          <MultiSelectItem value="react">React</MultiSelectItem> */}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  )
}

export default MultiSelectComp;