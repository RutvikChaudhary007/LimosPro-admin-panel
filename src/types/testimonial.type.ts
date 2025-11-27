export type TTestimonialFormData = {
  name: string;
  message: string;
  customerName?: string;
  content?: string;
  photo: File | string | null;
  rating: number;
  isFeatured: boolean;
};

export interface ITestimonialFormProps {
  initialData?: TTestimonialFormData;
  onSubmit: (data: TTestimonialFormData) => Promise<void>;
  disabledFields?: string[];
  type: string;
}
