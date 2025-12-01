import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileCheck, FileSearch, FolderOpen, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Language } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface HomeProps {
  language: Language;
}

export default function Home({ language }: HomeProps) {
  const t = useTranslation(language);
  const navigate = useNavigate();

  const features = [
    {
      icon: FileCheck,
      title: t.quickReviewTitle,
      description: t.quickReviewDesc,
      link: "/quick-review",
    },
    {
      icon: FileSearch,
      title: t.deepAnalysisTitle,
      description: t.deepAnalysisDesc,
      link: "/deep-analysis",
    },
    {
      icon: FolderOpen,
      title: t.templatesTitle,
      description: t.templatesDesc,
      link: "/templates",
    },
  ];

  return (
    // MAIN CONTAINER: Áp dụng chuẩn Grid 12 cột như bạn đã cài đặt extension
    // gap-x-[20px]: Khoảng cách cột
    // px-[10px]: Lề ngoài
    <div className="w-full min-h-screen bg-white font-sans text-[#050A18] pt-24 pb-12 overflow-x-hidden">
      <div className="container mx-auto max-w-[1920px] grid grid-cols-4 md:grid-cols-12 gap-x-[20px] px-[10px]">

        {/* =======================
            1. HERO SECTION
            - Căn giữa: Bắt đầu từ cột 2 (Desktop), chiếm 10 cột.
            ======================= */}
        <section className="col-span-4 md:col-start-2 md:col-span-10 py-16 md:py-28 text-center relative">
          {/* Background Grid Decoration */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 flex flex-col items-center"
          >
            {/* Tagline nhỏ */}
            <div className="inline-flex items-center rounded-full border border-[#496DFF]/20 bg-[#496DFF]/5 px-3 py-1 text-sm font-medium text-[#496DFF]">
              <span className="flex h-2 w-2 rounded-full bg-[#496DFF] mr-2 animate-pulse"></span>
              AI-Powered Legal Assistant
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-[#050A18]">
              {t.heroTitle} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#050A18] to-[#496DFF]">
                AGREEME
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-500 max-w-3xl leading-relaxed font-light">
              {t.heroSubtitle}. {t.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto"> 
              <Button
                size="lg"
                className="h-14 px-8 bg-[#050A18] hover:bg-[#1a2333] text-white font-bold rounded-full text-lg shadow-xl transition-transform hover:-translate-y-1" 
                onClick={() => navigate("/quick-review")}
              >
                {t.getStarted} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 border-gray-200 text-[#050A18] hover:bg-gray-50 font-medium rounded-full text-lg"
                onClick={() => navigate("/about")}
              >
                {t.learnMore}
              </Button>
            </div>
          </motion.div>
        </section>


        {/* =======================
            2. FEATURES SECTION
            - Layout chuẩn Grid: 3 Card, mỗi card chiếm đúng 4 cột (md:col-span-4).
            ======================= */}
        <section className="col-span-4 md:col-span-12 py-20">
          <div className="text-center mb-16 md:col-start-3 md:col-span-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#050A18]">
              {language === "vi" ? "Tính năng vượt trội" : "Everything you need"}
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
               Powerful AI tools designed to make your contract workflow seamless, secure, and smart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-[20px] gap-y-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  // QUAN TRỌNG: Mỗi card chiếm 4 cột trên Desktop (12/3 = 4)
                  className="col-span-1 md:col-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card
                    className="h-full p-8 border border-gray-100 bg-white hover:border-[#496DFF]/20 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-[32px] flex flex-col"
                    onClick={() => navigate(feature.link)}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-[#050A18] transition-colors duration-300">
                      <Icon className="w-7 h-7 text-[#050A18] group-hover:text-white transition-colors duration-300" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-[#050A18]">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 mb-8 leading-relaxed flex-grow">
                      {feature.description}
                    </p>

                    <div className="flex items-center text-[#496DFF] font-bold text-sm group-hover:translate-x-2 transition-transform duration-300">
                      {language === "vi" ? "Khám phá" : "Explore"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>


        {/* =======================
            3. FAQ SECTION
            - Căn giữa: Bắt đầu từ cột 3, chiếm 8 cột (md:col-start-3 md:col-span-8).
            - Giúp nội dung không bị quá rộng, dễ đọc.
            ======================= */}
        <section className="col-span-4 md:col-start-3 md:col-span-8 py-20">
          <div className="text-center mb-12">
             <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-[#496DFF] mb-6">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <h2 className="text-3xl md:text-4xl font-bold text-[#050A18]">
              {t.faqTitle}
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <AccordionItem
                key={item}
                value={`item-${item}`}
                className="border border-gray-200/60 rounded-2xl px-6 bg-gray-50/50 data-[state=open]:bg-white data-[state=open]:shadow-lg data-[state=open]:border-[#496DFF]/20 transition-all duration-300"
              >
                <AccordionTrigger className="text-lg font-semibold text-[#050A18] hover:text-[#496DFF] py-6 text-left hover:no-underline">
                  {t[`faqQuestion${item}`]}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-base pb-6 leading-relaxed">
                  {t[`faqAnswer${item}`]}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>


        {/* =======================
            4. CTA SECTION (Bottom Box)
            - Bắt đầu từ cột 2, chiếm 10 cột.
            - Màu Navy #050A18 để đồng bộ với trang Login.
            ======================= */}
        <section className="col-span-4 md:col-start-2 md:col-span-10 py-12 pb-24">
          <div className="bg-[#050A18] rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#496DFF] opacity-20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#496DFF] opacity-10 rounded-full blur-[80px] -ml-20 -mb-20"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center justify-center p-4 mb-8 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                 <Zap className="w-8 h-8 text-[#496DFF]" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                {language === "vi" ? "Sẵn sàng tối ưu hóa?" : "Ready to optimize workflow?"}
              </h2>
              
              <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed font-light">
                {language === "vi"
                  ? "Tham gia cùng hàng ngàn chuyên gia pháp lý đang sử dụng AGREEME."
                  : "Join thousands of legal professionals using AGREEME to analyze contracts faster."}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto">
                <Button 
                    size="lg" 
                    className="bg-white text-[#050A18] hover:bg-gray-100 h-14 px-10 rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105"
                    onClick={() => navigate("/quick-review")}
                >
                  {t.getStarted}
                </Button>
                <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10 h-14 px-10 rounded-full font-medium text-lg"
                    onClick={() => navigate("/signup")}
                >
                  {language === "vi" ? "Tạo tài khoản" : "Create Account"}
                </Button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}