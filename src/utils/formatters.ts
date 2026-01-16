/**
 * Utility function to format cell/field values with fallback handling
 * @param value - The value to display
 * @param fallback - The fallback text (default: "N/A")
 * @returns Formatted string value
 */
export const formatFieldValue = (
  value: any,
  fallback: string = "N/A",
): string => {
  // Handle null, undefined, empty string, or whitespace-only strings
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return fallback;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : fallback;
  }

  // Handle objects (convert to empty check)
  if (typeof value === "object") {
    return Object.keys(value).length > 0 ? String(value) : fallback;
  }

  return String(value);
};

/**
 * Format currency values with fallback
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  currency: string = "$",
): string => {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(numValue) ? "N/A" : `${currency}${numValue.toFixed(2)}`;
};

/**
 * Format date values with fallback
 */
export const formatDateField = (
  value: string | Date | null | undefined,
  fallback: string = "N/A",
): string => {
  if (!value) return fallback;
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return fallback;
  }
};
