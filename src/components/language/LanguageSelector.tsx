import {
  LANGUAGE_CODES,
  type LanguageCode,
  SUPPORTED_LANGUAGES,
} from "@/lib/language";

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
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
        Edit Language:
      </span>
      <div className="flex flex-wrap gap-2">
        {availableLanguages.map((langCode) => {
          const lang = SUPPORTED_LANGUAGES[langCode];
          const isSelected = selectedLanguage === langCode;

          return (
            <button
              key={langCode}
              type="button"
              onClick={() => onLanguageChange(langCode)}
              className={`
                px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-medium transition-all duration-200
                flex items-center gap-2 text-sm sm:text-base
                ${
                  isSelected
                    ? "bg-primary text-white shadow-md transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }
              `}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
