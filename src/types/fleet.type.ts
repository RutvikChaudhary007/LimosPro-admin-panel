import type { TAffiliate } from "@/components/table/column";

export type TFleetData = {
  id: string;
};
export interface IFleetFormProps {
  initialData?: TFleetData[];
  isAffiliateFetching?: boolean;
  isRegionFetching?: boolean;
  affiliateData?: TAffiliate;
  RegionData?: unknown;
  onSubmit: (data: TFleetData) => Promise<void>;
  disabledFields?: string[];
  type: string;
}
