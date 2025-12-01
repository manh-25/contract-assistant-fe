import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext"; // Import Context
import { Language } from "./LanguageSwitcher"; 
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuList, 
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { FileText, Search, LayoutTemplate, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavigationProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navigation = ({ language, onLanguageChange }: NavigationProps) => {
  const { user, signOut } = useAuth(); // Lấy hàm signOut từ Context
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // --- HÀM XỬ LÝ LOGOUT (FIX LỖI) ---
  const handleLogout = async () => {
    try {
      await signOut();      // Gọi hàm đăng xuất (Supabase/Firebase...)
      navigate("/login");   // Chuyển hướng về trang đăng nhập ngay lập tức
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/quick-review", label: language === "vi" ? "Review Nhanh" : "Quick Review", icon: FileText },
    { href: "/deep-analysis", label: language === "vi" ? "Phân Tích Sâu" : "Deep Analysis", icon: Search },
    { href: "/templates", label: language === "vi" ? "Mẫu HĐ" : "Templates", icon: LayoutTemplate },
  ];

  const toggleLanguage = () => {
    onLanguageChange(language === "vi" ? "en" : "vi");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-[#050A18]/90 backdrop-blur-md border-white/10 py-4 shadow-lg"
          : "bg-[#050A18] border-transparent py-6"
      )}
    >
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-4 md:grid-cols-12 gap-x-8 items-center">
          
          {/* LOGO */}
          <div className="col-span-2 md:col-span-3 flex items-center justify-start">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-[#496DFF] text-white px-3.5 py-2 rounded-lg text-xs font-bold tracking-[0.15em] uppercase shadow-lg shadow-blue-900/50 group-hover:bg-[#3b5bdb] transition-colors">
                Logo
              </div>
              <span className="text-xl font-bold tracking-wider text-white">
                AGREEME
              </span>
            </Link>
          </div>

          {/* MENU */}
          <div className="hidden md:col-span-6 md:flex justify-center">
            <div className="bg-white/5 p-1 rounded-full border border-white/10">
              <NavigationMenu>
                <NavigationMenuList className="gap-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                      <NavigationMenuItem key={link.href}>
                        <Link to={link.href}>
                          <div
                            className={cn(
                              navigationMenuTriggerStyle(),
                              "h-10 px-6 text-[15px] cursor-pointer gap-2 transition-all rounded-full",
                              isActive 
                                ? "bg-[#496DFF] text-white font-bold shadow-md" 
                                : "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"
                            )}
                          >
                            {isActive && <Icon className="w-4 h-4" />} 
                            {link.label}
                          </div>
                        </Link>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="col-span-2 md:col-span-3 flex items-center justify-end gap-4">
            <div className="hidden sm:block border-r border-white/10 pr-4 mr-1">
               <Button 
                 variant="ghost" 
                 size="sm" 
                 className="text-gray-400 hover:text-white hover:bg-white/10 font-medium"
                 onClick={toggleLanguage}
               >
                 {language === "vi" ? "EN" : "VI"}
               </Button>
            </div>

            {user ? (
              // LOGGED IN DROPDOWN
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-11 w-11 rounded-full hover:bg-white/10 p-0 border border-white/10">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt="User" />
                      <AvatarFallback className="bg-[#496DFF] text-white font-bold">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-[#050A18]">
                        {user.user_metadata?.full_name || "Admin"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                    <LayoutTemplate className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* NÚT LOGOUT ĐÃ SỬA */}
                  <DropdownMenuItem 
                    onClick={handleLogout} // Gọi hàm handleLogout ở trên
                    className="text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                 <Link to="/login" className="hidden lg:block text-sm font-bold text-gray-300 hover:text-white transition-colors">
                   {language === "vi" ? "Đăng nhập" : "Log in"}
                 </Link>
                 <Button 
                    onClick={() => navigate("/signup")}
                    className="bg-[#496DFF] hover:bg-[#3b5bdb] text-white rounded-full px-7 h-11 font-bold text-sm shadow-lg shadow-blue-900/50 transition-transform hover:scale-105"
                 >
                   {language === "vi" ? "Đăng ký" : "Sign Up"}
                 </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};