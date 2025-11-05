import type { TIpWhiteListForm } from "@/components/ipWhiteList/IpWhiteListForm"
import type { TIpWhiteList } from "@/components/table/column"

export interface IIpWhiteListFormProps {
  initialData?: TIpWhiteList
  onSubmit: (data: TIpWhiteListForm) => Promise<void>
  disabledFields?: string[]
  type: string
}
