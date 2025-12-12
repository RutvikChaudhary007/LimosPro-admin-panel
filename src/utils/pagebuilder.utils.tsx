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
