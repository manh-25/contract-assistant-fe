import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, FileText, Search, Settings, LogOut, FolderOpen, 
  Bell, HelpCircle,
  Library
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Danh sách Menu
  const menuItems = [
    { icon: LayoutDashboard, label: "Home", path: "/dashboard" },
    { icon: Search, label: "Analysis", path: "/deep-analysis" }, 
    { icon: FileText, label: "Templates", path: "/templates" },
    { icon: FolderOpen, label: "Inspections", path: "/inspections" },
    { icon: Library, label: "Library", path: "/library"}, 
    { icon: Settings, label: "Actions", path: "/settings" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside className="w-64 h-full bg-white flex flex-col border-r border-gray-200 shadow-sm shrink-0 z-20">
      
      {/* 1. Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="flex items-center gap-3 font-bold text-xl text-[#1e1b4b] tracking-tight">
          <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center text-white text-sm shadow-md shadow-indigo-200">
              A
          </div>
          Agreeme
        </div>
      </div>

      {/* 2. Menu Items */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          // Logic Active:
          const isActive = item.path === "/dashboard" 
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.path);
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-[#EEF2FF] text-[#4F46E5]" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#4F46E5] rounded-r-full"></div>
              )}

              <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-[#4F46E5]" : "text-slate-400 group-hover:text-slate-600")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* 3. Footer Sidebar */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
           <HelpCircle className="w-5 h-5 text-slate-400" /> Help
        </div>
        
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer mt-2 group transition-colors">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-[#4F46E5] text-white text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-[#4F46E5] transition-colors">
              {user?.user_metadata?.full_name || "Admin"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || "admin@gmail.com"}</p>
          </div>
          <LogOut 
            className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" 
            onClick={handleSignOut}
          />
        </div>
      </div>
    </aside>
  );
}