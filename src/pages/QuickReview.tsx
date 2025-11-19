import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { Language } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface QuickReviewProps {
  language: Language;
}

export const QuickReview = ({ language }: QuickReviewProps) => {
  const t = useTranslation(language);
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setResults({
        riskLevel: "caution",
        issues: [
          { level: "danger", text: "Điều khoản thanh toán không rõ ràng về thời hạn" },
          { level: "caution", text: "Phạt vi phạm hợp đồng cao hơn mức thông thường" },
          { level: "safe", text: "Điều khoản bảo mật thông tin đầy đủ" },
        ],
      });
      setIsAnalyzing(false);
      toast({
        title: language === "vi" ? "Phân tích hoàn tất" : "Analysis complete",
        description: language === "vi" ? "Đã phát hiện 2 vấn đề cần lưu ý" : "Found 2 issues to review",
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.quickReview}</h1>
        <p className="text-muted-foreground mb-8">{t.quickReviewDesc}</p>

        <Card className="p-8 shadow-lg">
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
            <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t.uploadContract}</h3>
            <p className="text-muted-foreground mb-4">{t.dragAndDrop}</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild className="cursor-pointer">
                <span>{t.upload}</span>
              </Button>
            </label>
            <p className="text-sm text-muted-foreground mt-4">{t.supportedFormats}</p>
          </div>
        </Card>

        {isAnalyzing && (
          <Card className="mt-6 p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-lg font-medium">{t.analyzing}</span>
            </div>
          </Card>
        )}

        {results && !isAnalyzing && (
          <Card className="mt-6 p-6">
            <h2 className="text-2xl font-bold mb-4">{t.reviewResults}</h2>
            <div className="space-y-4">
              {results.issues.map((issue: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-l-4 ${
                    issue.level === "danger"
                      ? "bg-risk-danger/10 border-risk-danger"
                      : issue.level === "caution"
                      ? "bg-risk-caution/10 border-risk-caution"
                      : "bg-risk-safe/10 border-risk-safe"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {issue.level === "danger" ? (
                      <AlertTriangle className="w-5 h-5 text-risk-danger mt-0.5" />
                    ) : issue.level === "caution" ? (
                      <AlertTriangle className="w-5 h-5 text-risk-caution mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-risk-safe mt-0.5" />
                    )}
                    <p className="flex-1">{issue.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuickReview;
