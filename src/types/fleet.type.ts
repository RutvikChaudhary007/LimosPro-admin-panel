import type { TPartner } from "./partner/partner.type";

export type TFleetData = {
  id: string;
};
export interface IFleetFormProps {
  initialData?: TFleetData[];
  isPartnerFetching?: boolean;
  isRegionFetching?: boolean;
  partnerData?: TPartner;
  RegionData?: unknown;
  onSubmit: (data: TFleetData) => Promise<void>;
  disabledFields?: string[];
  type: string;
}
