import type { TAffiliate } from "./affiliate/affiliate.type";

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
