import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";

// Components & Layouts
import { Navigation } from "./components/Navigation";
import { Language } from "./components/LanguageSwitcher";
import DashboardLayout from "./layouts/DashboardLayout"; 

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DeepAnalysis from "./pages/DeepAnalysis";
import Templates from "./pages/Templates";
import Inspections from "./pages/Inspections"; // Import trang mới
import CreateContract from "./pages/CreateContract";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Library from "./pages/Library";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => {
  const [language, setLanguage] = useState<Language>("vi");

  // Layout cho trang Public (Có Navbar ngang ở trên)
  const PublicLayout = () => (
    <>
      <Navigation language={language} onLanguageChange={setLanguage} />
      <Outlet />
    </>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            <Routes>
              
              {/* --- 1. PUBLIC ROUTES (Home, About...) --- */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home language={language} />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile language={language} />} />
              </Route>

              {/* --- 2. AUTH ROUTES (Login, Signup...) --- */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* --- 3. APP DASHBOARD (SafetyCulture Style) --- */}
              {/* Sử dụng DashboardLayout: Sidebar trắng bên trái */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard language={language} />} />
                
                {/* Trang phân tích chi tiết (Upload -> AI) */}
                <Route path="/deep-analysis" element={<DeepAnalysis />} />
                
                {/* Trang upload nhanh (giữ lại nếu cần, hoặc bỏ nếu đã gộp)
                <Route path="/quick-review" element={<QuickReview language={language} />} /> */}
                
                {/* Trang danh sách mẫu */}
                <Route path="/templates" element={<Templates />} />
                <Route path="/library" element={<Library />} />
                {/* Trang danh sách hợp đồng (MỚI) */}
                <Route path="/inspections" element={<Inspections />} />
                
                <Route path="/create/:templateId?" element={<CreateContract language={language} />} />
                <Route path="/templates/create" element={<CreateContract />} />
                <Route path="/settings" element={<Settings language={language} />} />
              </Route>

              {/* --- 404 Page --- */}
              <Route path="*" element={<NotFound />} />
              
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;