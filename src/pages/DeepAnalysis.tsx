import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, AlertTriangle } from "lucide-react";
import { Language } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { cn } from "@/lib/utils";

interface DeepAnalysisProps {
  language: Language;
}

interface Clause {
  id: string;
  text: string;
  riskLevel: "safe" | "caution" | "danger";
  analysis?: string;
  suggestions?: string[];
}

export const DeepAnalysis = ({ language }: DeepAnalysisProps) => {
  const t = useTranslation(language);
  const [selectedClause, setSelectedClause] = useState<string | null>(null);
  const [hasDocument, setHasDocument] = useState(false);

  // Mock data
  const clauses: Clause[] = [
    {
      id: "1",
      text: "Bên A cam kết thanh toán toàn bộ số tiền trong vòng 30 ngày kể từ ngày ký hợp đồng.",
      riskLevel: "safe",
      analysis: "Điều khoản thanh toán rõ ràng với thời hạn cụ thể. Không có vấn đề pháp lý.",
      suggestions: ["Có thể bổ sung điều khoản về hình thức thanh toán"],
    },
    {
      id: "2",
      text: "Mọi tranh chấp phát sinh sẽ được giải quyết tại Tòa án có thẩm quyền tại Hà Nội.",
      riskLevel: "caution",
      analysis: "Địa điểm giải quyết tranh chấp có thể không thuận lợi cho một bên nếu họ ở xa.",
      suggestions: [
        "Xem xét thêm phương án trọng tài",
        "Thỏa thuận địa điểm thuận lợi cho cả hai bên",
      ],
    },
    {
      id: "3",
      text: "Bên vi phạm phải bồi thường 100% giá trị hợp đồng và các chi phí phát sinh.",
      riskLevel: "danger",
      analysis: "Mức phạt quá cao và không rõ ràng về 'các chi phí phát sinh'. Có thể bị coi là điều khoản bất hợp lý.",
      suggestions: [
        "Giảm mức phạt xuống 20-30% giá trị hợp đồng",
        "Định nghĩa rõ ràng 'chi phí phát sinh'",
        "Thêm điều khoản giảm nhẹ trong trường hợp bất khả kháng",
      ],
    },
  ];

  const selectedClauseData = clauses.find((c) => c.id === selectedClause);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHasDocument(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.deepAnalysis}</h1>
        <p className="text-muted-foreground mb-8">{t.deepAnalysisDesc}</p>

        {!hasDocument ? (
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
                id="deep-file-upload"
              />
              <label htmlFor="deep-file-upload">
                <Button asChild className="cursor-pointer">
                  <span>{t.upload}</span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground mt-4">{t.supportedFormats}</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Hợp đồng mẫu</h2>
                <div className="space-y-4">
                  {clauses.map((clause) => (
                    <div
                      key={clause.id}
                      onClick={() => setSelectedClause(clause.id)}
                      className={cn(
                        "p-4 rounded-lg border-l-4 cursor-pointer transition-all",
                        selectedClause === clause.id && "ring-2 ring-primary",
                        clause.riskLevel === "safe" &&
                          "bg-risk-safe/10 border-risk-safe hover:bg-risk-safe/20",
                        clause.riskLevel === "caution" &&
                          "bg-risk-caution/10 border-risk-caution hover:bg-risk-caution/20",
                        clause.riskLevel === "danger" &&
                          "bg-risk-danger/10 border-risk-danger hover:bg-risk-danger/20"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{clause.text}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6 shadow-lg sticky top-24">
                {!selectedClauseData ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t.selectClause}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold mb-2">{t.riskLevel}</h3>
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                          selectedClauseData.riskLevel === "safe" &&
                            "bg-risk-safe/20 text-risk-safe",
                          selectedClauseData.riskLevel === "caution" &&
                            "bg-risk-caution/20 text-risk-caution",
                          selectedClauseData.riskLevel === "danger" &&
                            "bg-risk-danger/20 text-risk-danger"
                        )}
                      >
                        {selectedClauseData.riskLevel === "safe" && t.safe}
                        {selectedClauseData.riskLevel === "caution" && t.caution}
                        {selectedClauseData.riskLevel === "danger" && t.danger}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-2">Phân tích</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedClauseData.analysis}
                      </p>
                    </div>

                    {selectedClauseData.suggestions && (
                      <div>
                        <h3 className="text-lg font-bold mb-2">{t.suggestions}</h3>
                        <ul className="space-y-2">
                          {selectedClauseData.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                              <span className="text-primary">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button className="w-full mt-4">{t.modifyContract}</Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepAnalysis;
