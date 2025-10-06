import type { TFaqForm } from "@/components/faq/FaqForm";
import type { TFaqs } from "@/components/table/column";


export interface IFaqFormProps  {
    initialData?: TFaqs, 
    onSubmit: (data: TFaqForm)=> Promise<void>, 
    disabledFields?: string[], 
    type: string,
}