import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileCheck, FileSearch, FolderOpen, ArrowRight } from "lucide-react";
import { Language } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  language: Language;
}

export const Home = ({ language }: HomeProps) => {
  const t = useTranslation(language);
  const navigate = useNavigate();

  const features = [
    {
      icon: FileCheck,
      title: t.quickReviewTitle,
      description: t.quickReviewDesc,
      link: "/quick-review",
      color: "text-risk-safe",
      bg: "bg-risk-safe/10",
    },
    {
      icon: FileSearch,
      title: t.deepAnalysisTitle,
      description: t.deepAnalysisDesc,
      link: "/deep-analysis",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: FolderOpen,
      title: t.templatesTitle,
      description: t.templatesDesc,
      link: "/templates",
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-primary overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
              {t.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4">
              {t.heroSubtitle}
            </p>
            <p className="text-lg text-primary-foreground/80 mb-8">
              {t.heroDescription}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg"
                onClick={() => navigate("/quick-review")}
              >
                {t.getStarted}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg bg-white/10 hover:bg-white/20 text-primary-foreground border-primary-foreground/30"
              >
                {t.learnMore}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {language === "vi" ? "Tính năng chính" : "Key Features"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={idx}
                    className="p-6 hover:shadow-xl transition-all cursor-pointer group"
                    onClick={() => navigate(feature.link)}
                  >
                    <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <div className="flex items-center text-primary font-medium">
                      {language === "vi" ? "Tìm hiểu thêm" : "Learn more"}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t.faqTitle}</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">{t.faqQuestion1}</AccordionTrigger>
                <AccordionContent>{t.faqAnswer1}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">{t.faqQuestion2}</AccordionTrigger>
                <AccordionContent>{t.faqAnswer2}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">{t.faqQuestion3}</AccordionTrigger>
                <AccordionContent>{t.faqAnswer3}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">{t.faqQuestion4}</AccordionTrigger>
                <AccordionContent>{t.faqAnswer4}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">{t.faqQuestion5}</AccordionTrigger>
                <AccordionContent>{t.faqAnswer5}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-br from-primary to-primary-light text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">
              {language === "vi"
                ? "Sẵn sàng bắt đầu?"
                : "Ready to get started?"}
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              {language === "vi"
                ? "Bắt đầu phân tích và tạo hợp đồng chuyên nghiệp ngay hôm nay"
                : "Start analyzing and creating professional contracts today"}
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/quick-review")}
            >
              {t.getStarted}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
