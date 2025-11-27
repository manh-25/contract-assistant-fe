import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Language, LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User as UserIcon } from "lucide-react";

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
    { to: "/quick-review", label: t.quickReview },
    { to: "/deep-analysis", label: t.deepAnalysis },
    { to: "/templates", label: t.templates },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1A1C4B]/95 backdrop-blur-md border-b border-white/10 shadow-lg transition-all duration-300">
      <div className="container mx-auto px-6">
        <div className="flex items-center h-20 justify-between">
          
          {/* LEFT SIDE: LOGO + NAV LINKS */}
          <div className="flex items-center gap-12">
            <Link
              to="/"
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="bg-white text-[#1A1C4B] px-3 py-2 rounded-lg font-bold text-xs tracking-widest group-hover:bg-blue-50 transition-colors">
                LOGO
              </div>
              <span className="text-white text-xl font-bold tracking-wide">
                AGREEME
              </span>
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-2">
                {links.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-[#496DFF] text-white shadow-md shadow-blue-900/20" 
                          : "text-blue-100/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: LANG + AUTH */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 rounded-full bg-[#496DFF] text-white font-semibold shadow-md hover:bg-[#3b5bdb] flex items-center justify-center transition ring-2 ring-white/20">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white shadow-xl border border-slate-100 rounded-xl p-2"
                >
                  <div className="px-2 py-1.5 text-sm font-semibold text-[#1A1C4B]">
                      {user.email}
                  </div>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer rounded-lg focus:bg-slate-50 text-slate-600 focus:text-[#496DFF]"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    {language === "vi" ? "Hồ sơ" : "Profile"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                    className="cursor-pointer rounded-lg focus:bg-slate-50 text-slate-600 focus:text-[#496DFF]"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {language === "vi" ? "Cài đặt" : "Settings"}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-slate-100" />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer rounded-lg text-red-600 focus:text-red-700 focus:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {language === "vi" ? "Đăng xuất" : "Sign Out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="text-white hover:bg-white/10 rounded-full px-6 font-medium"
                >
                  {language === "vi" ? "Đăng nhập" : "Log In"}
                </Button>

                <Button
                  onClick={() => navigate("/signup")}
                  className="bg-white text-[#1A1C4B] hover:bg-blue-50 shadow-lg shadow-blue-900/20 font-bold rounded-full px-6"
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