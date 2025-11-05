import type { TSettingForm } from "@/components/settings/SettingForm"
import type { TSetting } from "@/components/table/column"

export interface ISettingFormProps {
  initialData?: TSetting
  onSubmit: (data: TSettingForm) => Promise<void>
  disabledFields?: string[]
}
