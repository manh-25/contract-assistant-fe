import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, AlertTriangle, FileText, CheckCircle2, XCircle, Lightbulb, Shield, ArrowRight } from "lucide-react";
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
  const [dragActive, setDragActive] = useState(false);

  // Mock data
  const clauses: Clause[] = [
    {
      id: "1",
      text: "Bên A cam kết thanh toán toàn bộ số tiền trong vòng 30 ngày kể từ ngày ký hợp đồng.",
      riskLevel: "safe",
      analysis: "Điều khoản thanh toán rõ ràng với thời hạn cụ thể. Không có vấn đề pháp lý.",
      suggestions: ["Có thể bổ sung điều khoản về hình thức thanh toán (chuyển khoản/tiền mặt)"],
    },
    {
      id: "2",
      text: "Mọi tranh chấp phát sinh sẽ được giải quyết tại Tòa án có thẩm quyền tại Hà Nội.",
      riskLevel: "caution",
      analysis: "Địa điểm giải quyết tranh chấp có thể không thuận lợi cho một bên nếu họ ở xa.",
      suggestions: [
        "Xem xét thêm phương án trọng tài thương mại",
        "Thỏa thuận địa điểm thuận lợi cho cả hai bên",
      ],
    },
    {
      id: "3",
      text: "Bên vi phạm phải bồi thường 100% giá trị hợp đồng và các chi phí phát sinh.",
      riskLevel: "danger",
      analysis: "Mức phạt quá cao và không rõ ràng về 'các chi phí phát sinh'. Có thể bị coi là điều khoản bất hợp lý theo luật dân sự.",
      suggestions: [
        "Giảm mức phạt xuống tối đa 8% giá trị phần nghĩa vụ bị vi phạm (theo Luật Thương mại)",
        "Định nghĩa rõ ràng 'chi phí phát sinh'",
        "Thêm điều khoản miễn trừ trách nhiệm trong trường hợp bất khả kháng",
      ],
    },
  ];

  const selectedClauseData = clauses.find((c) => c.id === selectedClause);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setHasDocument(true);
      // Mặc định chọn điều khoản đầu tiên khi có file
      if (clauses.length > 0) setSelectedClause(clauses[0].id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHasDocument(true);
      if (clauses.length > 0) setSelectedClause(clauses[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 font-sans text-slate-900">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1C4B]">
            {t.deepAnalysis}
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            {t.deepAnalysisDesc}
          </p>
        </div>

        {!hasDocument ? (
          /* Upload Section */
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 shadow-lg border-0 bg-white">
              <div 
                className={`p-12 text-center border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out ${
                  dragActive 
                    ? "border-[#496DFF] bg-blue-50/50" 
                    : "border-slate-200 hover:border-[#496DFF]/50 hover:bg-slate-50/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <UploadCloud className="w-16 h-16 mx-auto text-slate-400 mb-6" />
                
                <h3 className="text-xl font-bold text-[#1A1C4B] mb-2">
                  {t.uploadContract || "Upload your contract"}
                </h3>
                <p className="text-slate-500 mb-6">
                  {t.dragAndDrop || "Drag and drop your file here, or click to browse."}
                </p>
                
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="deep-file-upload"
                />
                <label htmlFor="deep-file-upload">
                  <Button 
                    className="bg-[#496DFF] hover:bg-[#3b5bdb] text-white rounded-full px-8 font-semibold shadow-md cursor-pointer"
                    asChild
                  >
                    <span>{t.upload || "Choose File"}</span>
                  </Button>
                </label>
                
                <p className="text-sm text-slate-400 mt-6">
                  {t.supportedFormats || "Supported: PDF, DOC, DOCX (Max 10MB)"}
                </p>
              </div>
            </Card>
          </div>
        ) : (
          /* Analysis View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in-50 duration-500">
            
            {/* Left Column: Clause List (4 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between mb-2 px-1">
                <h2 className="text-xl font-bold text-[#1A1C4B]">
                  {language === "vi" ? "Danh sách điều khoản" : "Clauses List"}
                </h2>
                <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm">
                  {clauses.length} {language === "vi" ? "điều khoản" : "items"}
                </span>
              </div>
              
              <div className="space-y-3">
                {clauses.map((clause) => (
                  <Card 
                    key={clause.id}
                    onClick={() => setSelectedClause(clause.id)}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 border-y-0 border-r-0",
                      selectedClause === clause.id 
                        ? "bg-white shadow-md scale-[1.02]" 
                        : "bg-white/60 hover:bg-white text-slate-600",
                      clause.riskLevel === "safe" ? "border-l-emerald-500" :
                      clause.riskLevel === "caution" ? "border-l-amber-500" :
                      "border-l-red-500"
                    )}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                           {clause.riskLevel === "danger" ? <XCircle className="w-5 h-5 text-red-500" /> :
                            clause.riskLevel === "caution" ? <AlertTriangle className="w-5 h-5 text-amber-500" /> :
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        </div>
                        <p className={cn(
                          "text-sm leading-relaxed line-clamp-3",
                          selectedClause === clause.id ? "text-slate-900 font-medium" : "text-slate-500"
                        )}>
                          {clause.text}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column: Detail View (8 cols) */}
            <div className="lg:col-span-7">
              <div className="sticky top-28 space-y-6">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h2 className="text-xl font-bold text-[#1A1C4B]">
                    {language === "vi" ? "Chi tiết phân tích" : "Analysis Details"}
                  </h2>
                </div>

                <Card className="shadow-xl border-0 overflow-hidden bg-white">
                  {!selectedClauseData ? (
                    <div className="text-center py-20 px-6">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 mb-2">
                        {t.selectClause || "Select a clause"}
                      </h3>
                      <p className="text-slate-500 max-w-xs mx-auto">
                        {language === "vi" 
                          ? "Chọn một điều khoản từ danh sách bên trái để xem chi tiết phân tích AI."
                          : "Select a clause from the list on the left to view AI analysis details."}
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Detail Header with Status */}
                      <div className={cn(
                        "p-6 border-b",
                        selectedClauseData.riskLevel === "safe" ? "bg-emerald-50 border-emerald-100" :
                        selectedClauseData.riskLevel === "caution" ? "bg-amber-50 border-amber-100" :
                        "bg-red-50 border-red-100"
                      )}>
                        <div className="flex items-center justify-between mb-4">
                          <span className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider",
                            selectedClauseData.riskLevel === "safe" ? "bg-white text-emerald-600 shadow-sm" :
                            selectedClauseData.riskLevel === "caution" ? "bg-white text-amber-600 shadow-sm" :
                            "bg-white text-red-600 shadow-sm"
                          )}>
                            {selectedClauseData.riskLevel === "safe" && <><CheckCircle2 className="w-4 h-4" /> {t.safe}</>}
                            {selectedClauseData.riskLevel === "caution" && <><AlertTriangle className="w-4 h-4" /> {t.caution}</>}
                            {selectedClauseData.riskLevel === "danger" && <><XCircle className="w-4 h-4" /> {t.danger}</>}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 italic leading-relaxed font-serif border-l-4 border-slate-300 pl-4 py-1">
                          "{selectedClauseData.text}"
                        </h3>
                      </div>

                      <div className="p-8 space-y-8">
                        {/* AI Analysis */}
                        <div>
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4" /> 
                            {language === "vi" ? "Phân tích rủi ro" : "Risk Analysis"}
                          </h4>
                          <p className="text-slate-700 leading-relaxed text-lg">
                            {selectedClauseData.analysis}
                          </p>
                        </div>

                        {/* Suggestions */}
                        {selectedClauseData.suggestions && (
                          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                            <h4 className="text-sm font-bold text-[#496DFF] uppercase tracking-wider mb-4 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              {t.suggestions}
                            </h4>
                            <ul className="space-y-3">
                              {selectedClauseData.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="flex gap-3 text-slate-700 group">
                                  <ArrowRight className="w-5 h-5 text-[#496DFF] shrink-0 mt-0.5 transition-transform group-hover:translate-x-1" />
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="pt-4 flex justify-end">
                          <Button className="bg-[#496DFF] hover:bg-[#3b5bdb] text-white shadow-lg shadow-blue-200 font-semibold px-6">
                            {t.modifyContract || "Apply Suggestion"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepAnalysis;