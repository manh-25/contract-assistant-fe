import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, FileSearch, FileCheck, FolderOpen, PenTool } from "lucide-react";
import { Language, LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/lib/translations";

interface NavigationProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navigation = ({ language, onLanguageChange }: NavigationProps) => {
  const location = useLocation();
  const t = useTranslation(language);
  
  const links = [
    { to: "/", label: t.home, icon: FileText },
    { to: "/dashboard", label: t.dashboard, icon: FileText },
    { to: "/quick-review", label: t.quickReview, icon: FileCheck },
    { to: "/deep-analysis", label: t.deepAnalysis, icon: FileSearch },
    { to: "/templates", label: t.templates, icon: FolderOpen },
    { to: "/create", label: t.createContract, icon: PenTool },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary border-b border-primary-light shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1" />
          
          <Link to="/" className="flex items-center gap-2 text-primary-foreground font-bold text-xl">
            <FileText className="w-6 h-6" />
            AGREEME
          </Link>
          
          <div className="flex-1 flex justify-end gap-2">
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                      "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-light",
                      isActive && "bg-primary-light text-primary-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
            
            <LanguageSwitcher 
              currentLanguage={language} 
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
