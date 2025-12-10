import PageTemplateEditor, {
  type PageTemplateFormData,
} from "@/components/pagebuilder.businessForm";

function PageForm({
  initialData,
  onSubmit,
}: {
  initialData?: PageTemplateFormData;
  onSubmit: (data: PageTemplateFormData) => void;
}) {
  return <PageTemplateEditor onSubmit={onSubmit} initialData={initialData} />;
}

export default PageForm;
