import { useFetchCmsFaqContent } from "@/api";
import { PageHeader } from "@/components/layouts/PageHeader";
import type { TFaqsCmsData } from "@/types/faq-cms.type";
import { FAQList } from "./components/faq-list";
import FaqsCmsFallbackJson from "./data/faqs-cms.json";

export default function FAQsPage() {
  const { data } = useFetchCmsFaqContent();
  const normalized = (data ?? FaqsCmsFallbackJson ?? {}) as TFaqsCmsData;
  const categoryKeys = Object.keys(normalized?.data?.data ?? {});

  const faqs = categoryKeys
    .flatMap((key) => {
      const items = normalized?.data?.data?.[key] ?? [];
      return items.map((item) => ({
        id: String(item?.id ?? ""),
        question: String(item?.question ?? ""),
        answer: String(item?.answer ?? ""),
        category: key,
      }));
    })
    .filter((f) => Boolean(f.id));

  const categories = [
    { name: "All", count: faqs.length },
    ...categoryKeys.map((key) => ({
      name: key,
      count: Number(normalized?.data?.counts?.[key] ?? 0) || 0,
    })),
  ];

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Frequently Asked Questions"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "FAQs" }]}
      />
      <FAQList faqs={faqs} categories={categories} />
    </div>
  );
}
