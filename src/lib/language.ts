// Language configuration
export const SUPPORTED_LANGUAGES = {
  en: { code: "en", name: "English", flag: "🇬🇧", dir: "ltr" },
  ar: { code: "ar", name: "Arabic", flag: "🇸🇦", dir: "rtl" },
  es: { code: "es", name: "Spanish", flag: "🇪🇸", dir: "ltr" },
  fr: { code: "fr", name: "French", flag: "🇫🇷", dir: "ltr" },
  nl: { code: "nl", name: "Dutch", flag: "🇳🇱", dir: "ltr" },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

export const LANGUAGE_CODES: LanguageCode[] = ["en", "ar", "es", "fr", "nl"];

export const DEFAULT_LANGUAGE: LanguageCode = "en";

// Helper function to get localized content with fallback
export function getLocalizedContent<T>(
  content: Record<LanguageCode, T> | undefined,
  language: LanguageCode,
  fallbackLanguage: LanguageCode = DEFAULT_LANGUAGE,
): T | undefined {
  if (!content) return undefined;
  return (
    content[language] || content[fallbackLanguage] || content[DEFAULT_LANGUAGE]
  );
}

// Check if all required languages have content
export function validateLanguageCompleteness(
  content: Record<string, any>,
  requiredLanguages: LanguageCode[],
  requiredFields: string[],
): { valid: boolean; missing?: { language: LanguageCode; field: string }[] } {
  const missing: { language: LanguageCode; field: string }[] = [];

  for (const lang of requiredLanguages) {
    for (const field of requiredFields) {
      const value = content[field]?.[lang];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        missing.push({ language: lang, field });
      }
    }
  }

  return missing.length > 0 ? { valid: false, missing } : { valid: true };
}

// Get completion status for a language
export function getLanguageCompletionStatus(
  content: Record<string, any>,
  language: LanguageCode,
  requiredFields: string[],
): "complete" | "partial" | "empty" {
  let filledCount = 0;
  let totalCount = 0;

  for (const field of requiredFields) {
    totalCount++;
    const value = content[field]?.[language];
    if (value && (typeof value !== "string" || value.trim() !== "")) {
      filledCount++;
    }
  }

  if (filledCount === 0) return "empty";
  if (filledCount === totalCount) return "complete";
  return "partial";
}
