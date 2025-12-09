// @ts-nocheck

import type { SetStateAction } from "react";
import { useFetchAllPermissions } from "@/api";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";

type TData = {
  id: string;
  name: string;
};
const MultiSelectComp = ({
  setSelected,
  selected,
}: {
  setSelected: SetStateAction;
  selected: string[];
}) => {
  const { data } = useFetchAllPermissions();
  // if (isFetching) return <Spinner />;
  return (
    <MultiSelect
      usePortal={true}
      values={selected}
      onValuesChange={setSelected}
    >
      <MultiSelectTrigger className="w-full max-w-[400px]">
        <MultiSelectValue
          placeholder="Select frameworks..."
          overflowBehavior={"cutoff"}
        />
      </MultiSelectTrigger>
      <MultiSelectContent>
        {/* Items must be wrapped in a group for proper styling */}
        <MultiSelectGroup>
          {data?.permissions?.length > 0 &&
            data?.permissions?.map((item: TData) => (
              <MultiSelectItem key={item.id} value={item.id}>
                {item.name}
              </MultiSelectItem>
            ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
};

export default MultiSelectComp;
