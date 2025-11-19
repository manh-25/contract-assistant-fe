import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import { Language } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { useNavigate } from "react-router-dom";

interface TemplatesProps {
  language: Language;
}

const templates = [
  {
    id: "1",
    name: "Hợp đồng thuê nhà",
    nameEn: "Rental Agreement",
    description: "Template chuẩn cho hợp đồng thuê nhà ở",
    descriptionEn: "Standard template for residential rental agreement",
    category: "Bất động sản",
    categoryEn: "Real Estate",
  },
  {
    id: "2",
    name: "Hợp đồng lao động",
    nameEn: "Employment Contract",
    description: "Hợp đồng lao động theo quy định pháp luật Việt Nam",
    descriptionEn: "Employment contract according to Vietnamese labor law",
    category: "Nhân sự",
    categoryEn: "HR",
  },
  {
    id: "3",
    name: "Hợp đồng mua bán",
    nameEn: "Sales Agreement",
    description: "Template cho các giao dịch mua bán hàng hóa",
    descriptionEn: "Template for goods sales transactions",
    category: "Thương mại",
    categoryEn: "Commercial",
  },
  {
    id: "4",
    name: "Hợp đồng dịch vụ",
    nameEn: "Service Agreement",
    description: "Hợp đồng cung cấp dịch vụ chuyên nghiệp",
    descriptionEn: "Professional service provision contract",
    category: "Dịch vụ",
    categoryEn: "Services",
  },
];

export const Templates = ({ language }: TemplatesProps) => {
  const t = useTranslation(language);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.templates}</h1>
        <p className="text-muted-foreground mb-8">{t.templatesDesc}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="p-6 hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">
                    {language === "vi" ? template.name : template.nameEn}
                  </h3>
                  <p className="text-sm text-primary mb-2">
                    {language === "vi" ? template.category : template.categoryEn}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "vi" ? template.description : template.descriptionEn}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      {t.viewTemplate}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/create?template=${template.id}`)}
                    >
                      {t.useTemplate}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
