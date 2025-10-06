import type { TOurPartnerForm } from "@/components/OurPartner/OurPartnerForm";

// export type TOurPartnerFormData = {
//     companyName: string,
//     url: string ,
//     photo: File | null,
// }

export interface IOurPartnerFormProps  {
    initialData?: TOurPartnerForm, 
    onSubmit: (data:TOurPartnerForm)=> Promise<void>, 
    disabledFields?: string[], 
    type: string,
}