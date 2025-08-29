export type TTestimonialFormData = {
    name: string,
    message: string ,
    photo: File | null,
}

export interface ITestimonialFormProps  {
    initialData?: TTestimonialFormData, 
    onSubmit: (data:TTestimonialFormData)=>Promise<void>, 
    disabledFields?: string[], 
    type: string,
}