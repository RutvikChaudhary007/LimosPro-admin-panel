import {
  LANGUAGE_CODES,
  type LanguageCode,
  SUPPORTED_LANGUAGES,
} from "@/lib/language";
import { Button } from "../ui/button";

interface LanguageSelectorProps {
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  availableLanguages?: LanguageCode[];
}

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  availableLanguages = LANGUAGE_CODES as LanguageCode[],
}: LanguageSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded border border-gray-200">
      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
        Edit Language:
      </span>
      <div className="flex flex-wrap gap-2">
        {availableLanguages.map((langCode) => {
          const lang = SUPPORTED_LANGUAGES[langCode];
          const isSelected = selectedLanguage === langCode;

          return (
            <Button
              key={langCode}
              type="button"
              onClick={() => onLanguageChange(langCode)}
              variant={isSelected ? "default" : "outline"}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
