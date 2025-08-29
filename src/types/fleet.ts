export type TFleetData = {
    id: string,
}
export interface IFleetFormProps {
    initialData?: TFleetData[];
    onSubmit: (data:TFleetData)=> Promise<TFleetData>;
    disabledFields?: string[];
    type: string;
}