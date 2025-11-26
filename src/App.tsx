import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Language } from "./components/LanguageSwitcher";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import QuickReview from "./pages/QuickReview";
import DeepAnalysis from "./pages/DeepAnalysis";
import Templates from "./pages/Templates";
import CreateContract from "./pages/CreateContract";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [language, setLanguage] = useState<Language>("vi");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation language={language} onLanguageChange={setLanguage} />
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route path="/dashboard" element={<Dashboard language={language} />} />
            <Route path="/quick-review" element={<QuickReview language={language} />} />
            <Route path="/deep-analysis" element={<DeepAnalysis language={language} />} />
            <Route path="/templates" element={<Templates language={language} />} />
            <Route path="/create" element={<CreateContract language={language} />} />
            <Route path="/login" element={<Login language={language} />} />
            <Route path="/signup" element={<Signup language={language} />} />
            <Route path="/forgot-password" element={<ForgotPassword language={language} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
