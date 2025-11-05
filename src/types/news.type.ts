import type { TNewsForm } from "@/components/news/NewsForm"
import type { TNews } from "@/components/table/column"

export interface INewsFormProps {
  initialData?: TNews
  onSubmit: (data: TNewsForm) => Promise<void>
  disabledFields?: string[]
  type: string
}
