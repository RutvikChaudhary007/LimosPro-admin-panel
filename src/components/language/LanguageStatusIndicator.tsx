import { Badge } from "@/components/ui/badge";
import {
  getLanguageCompletionStatus,
  type LanguageCode,
  SUPPORTED_LANGUAGES,
} from "@/lib/language";

interface LanguageStatusIndicatorProps {
  content: Record<string, any>;
  requiredFields: string[];
  availableLanguages?: LanguageCode[];
}

export default function LanguageStatusIndicator({
  content,
  requiredFields,
  availableLanguages = ["en", "ar", "es", "fr"],
}: LanguageStatusIndicatorProps) {
  const getVariant = (
    status: "complete" | "partial" | "empty",
  ): "default" | "secondary" | "destructive" | "outline" | "success" => {
    switch (status) {
      case "complete":
        return "success";
      case "partial":
        return "secondary";
      case "empty":
        return "outline";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <span className="text-xs font-semibold text-gray-600 mr-2">
        Content Status:
      </span>
      {availableLanguages.map((langCode) => {
        const lang = SUPPORTED_LANGUAGES[langCode];
        const status = getLanguageCompletionStatus(
          content,
          langCode,
          requiredFields,
        );
        const variant = getVariant(status);

        return (
          <Badge
            key={langCode}
            variant={variant}
            className="flex items-center gap-1.5"
          >
            <span>{lang.flag}</span>
            <span className="text-xs font-medium">{lang.name}</span>
            <span className="text-xs">•</span>
            <span className="text-xs capitalize">{status}</span>
          </Badge>
        );
      })}
    </div>
  );
}
