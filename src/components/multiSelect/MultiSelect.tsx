// @ts-nocheck

import type { Dispatch, SetStateAction } from "react";
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

type MultiSelectCompProps = {
  setSelected: Dispatch<SetStateAction<string[]>>;
  selected: string[];
  items?: TData[]; // Optional: if provided, use these items; otherwise fetch from API
  placeholder?: string;
};

const MultiSelectComp = ({
  setSelected,
  selected,
  items,
  placeholder = "Select permissions...",
}: MultiSelectCompProps) => {
  // Only fetch if items are not provided
  const { data } = useFetchAllPermissions({
    enabled: !items,
  });

  const permissions = items ?? data?.permissions ?? [];

  return (
    <MultiSelect
      usePortal={true}
      values={selected}
      onValuesChange={setSelected}
    >
      <MultiSelectTrigger className="w-full">
        <MultiSelectValue
          placeholder={placeholder}
          overflowBehavior={"cutoff"}
        />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectGroup>
          {permissions.length > 0 &&
            permissions.map((item: TData) => (
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
