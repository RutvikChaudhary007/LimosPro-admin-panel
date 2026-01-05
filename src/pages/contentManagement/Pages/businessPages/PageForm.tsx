import PageTemplateEditor, {
  type MultiLangPageTemplateFormData,
} from "@/components/pagebuilder/PageBuilderBusinessForm";
import type {
  // PageTemplateFormData,
  PageTemplateWithTimestamps,
} from "@/types/pagebuilder.types";

function PageForm({
  initialData,
  onSubmit,
}: {
  initialData?: PageTemplateWithTimestamps;
  onSubmit: (data: MultiLangPageTemplateFormData) => void;
}) {
  return <PageTemplateEditor onSubmit={onSubmit} initialData={initialData} />;
}

export default PageForm;
