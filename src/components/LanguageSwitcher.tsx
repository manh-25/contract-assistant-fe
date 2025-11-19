import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useState } from "react";

export type Language = "vi" | "en";

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSwitcher = ({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) => {
  return (
    <div className="flex items-center gap-2 bg-card rounded-lg p-1 border border-border">
      <Button
        variant={currentLanguage === "vi" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("vi")}
        className="text-sm"
      >
        <Globe className="w-4 h-4 mr-1" />
        Tiếng Việt
      </Button>
      <Button
        variant={currentLanguage === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("en")}
        className="text-sm"
      >
        <Globe className="w-4 h-4 mr-1" />
        English
      </Button>
    </div>
  );
};
