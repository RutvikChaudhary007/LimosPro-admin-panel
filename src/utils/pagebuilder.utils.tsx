import type {
  PageTemplateFormData,
  PageTemplateWithTimestamps,
} from "@/types/pagebuilder.types";
import { styledLog } from "@/utils/styledLog";

/**
 * Generate a unique ID
 */
export const uid = () => Math.random().toString(36).slice(2, 9);

/**
 * Format date and time to readable string
 */
export const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Transform form data for submission
 * Strips out timestamp fields (createdAt, updatedAt) that shouldn't be submitted
 */
export function transformData(
  data: Partial<PageTemplateWithTimestamps>,
): Partial<PageTemplateFormData> | undefined {
  if (!data) return undefined;
  styledLog(data, "transformData input:", "info");

  // Destructure to remove timestamp fields
  const { createdAt, updatedAt, ...formData } = data;

  styledLog(formData, "transformData output (timestamps removed):", "success");
  return formData;
}

/**
 * Get default initial data for a JSON-LD item type
 */
export const getDefaultJsonLdItem = (type: string) => {
  const base = {
    "@context": "https://schema.org",
    name: "",
    description: "",
    url: "",
    image: "",
  };

  switch (type) {
    case "Organization":
      return {
        type: "Organization",
        data: {
          ...base,
          "@type": "Organization",
          logo: "",
          sameAs: [],
          contactPoint: [],
        },
      };
    case "LocalBusiness":
      return {
        type: "LocalBusiness",
        data: {
          ...base,
          "@type": "LocalBusiness",
          address: {
            "@type": "PostalAddress",
            streetAddress: "",
            addressLocality: "",
            addressRegion: "",
            postalCode: "",
            addressCountry: "",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 0,
            longitude: 0,
          },
          openingHours: "",
          telephone: "",
          priceRange: "",
        },
      };
    case "FAQPage":
      return {
        type: "FAQPage",
        data: {
          ...base,
          "@type": "FAQPage",
          renderHtml: false,
          mainEntity: [],
        },
      };
    case "BreadcrumbList":
      return {
        type: "BreadcrumbList",
        data: {
          ...base,
          "@type": "BreadcrumbList",
          itemListElement: [],
        },
      };
    case "Article":
      return {
        type: "Article",
        data: {
          ...base,
          "@type": "Article",
          headline: "",
          datePublished: new Date().toISOString(),
          author: {
            "@type": "Person",
            name: "",
          },
          publisher: {
            "@type": "Organization",
            name: "",
          },
        },
      };
    case "BlogPosting":
      return {
        type: "BlogPosting",
        data: {
          ...base,
          "@type": "BlogPosting",
          headline: "",
          datePublished: new Date().toISOString(),
          author: {
            "@type": "Person",
            name: "",
          },
          publisher: {
            "@type": "Organization",
            name: "",
          },
        },
      };
    default:
      return null;
  }
};
