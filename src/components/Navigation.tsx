import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, FileSearch, FileCheck, FolderOpen, User, LogOut } from "lucide-react";
import { Language, LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";

interface NavigationProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navigation = ({ language, onLanguageChange }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const t = useTranslation(language);
  const { user, signOut } = useAuth();
  
  const links = [
    { to: "/quick-review", label: t.quickReview, icon: FileCheck },
    { to: "/deep-analysis", label: t.deepAnalysis, icon: FileSearch },
    { to: "/templates", label: t.templates, icon: FolderOpen },
    { to: "/profile", label: t.profileTitle || "Hồ sơ", icon: User },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary border-b border-primary-light shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground font-bold text-xl mr-8">
            <FileText className="w-6 h-6" />
            AGREEME
          </Link>
          
          <div className="flex-1 flex items-center justify-between gap-2">
            {user ? (
              <>
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
                
                <div className="flex items-center gap-2">
                  <LanguageSwitcher 
                    currentLanguage={language} 
                    onLanguageChange={onLanguageChange}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-light"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {language === "vi" ? "Đăng xuất" : "Sign Out"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-auto">
                <LanguageSwitcher 
                  currentLanguage={language} 
                  onLanguageChange={onLanguageChange}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-light"
                >
                  {language === "vi" ? "Đăng nhập" : "Sign In"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/signup")}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  {language === "vi" ? "Đăng ký" : "Sign Up"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
