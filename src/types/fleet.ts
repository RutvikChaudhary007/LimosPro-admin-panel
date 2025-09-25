import type { TAffiliate } from "@/components/table/column";

export type TFleetData = {
    id: string,
}
export interface IFleetFormProps {
    initialData?: TFleetData[];
    isFetching?: boolean;
    affiliateData?: TAffiliate;
    onSubmit: (data:TFleetData)=> Promise<void>;
    disabledFields?: string[];
    type: string;
}