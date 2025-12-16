import { PageHeader } from "@/components/layouts/PageHeader";
import { FAQList } from "./components/faq-list";
import categoriesData from "./data/categories.json";
import faqsData from "./data/faqs.json";

export default function FAQsPage() {
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Frequently Asked Questions"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Faqs" }]}
      />
      <FAQList faqs={faqsData} categories={categoriesData} />
    </div>
  );
}
