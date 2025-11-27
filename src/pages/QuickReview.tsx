import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, FileText, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
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
  const [dragActive, setDragActive] = useState(false);

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
      startAnalysis(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) startAnalysis(file);
  };

  const startAnalysis = (file: File) => {
    setIsAnalyzing(true);
    setResults(null); // Reset old results

    // Simulate analysis delay
    setTimeout(() => {
      setResults({
        summary: language === "vi" 
          ? "Hợp đồng có một số rủi ro cần chú ý trước khi ký kết." 
          : "The contract contains some risks that require attention before signing.",
        score: 85,
        issues: [
          { 
            level: "danger", 
            title: language === "vi" ? "Rủi ro cao" : "High Risk",
            text: language === "vi" ? "Điều khoản thanh toán không rõ ràng về thời hạn" : "Payment terms are unclear regarding deadlines" 
          },
          { 
            level: "caution", 
            title: language === "vi" ? "Cảnh báo" : "Caution",
            text: language === "vi" ? "Phạt vi phạm hợp đồng cao hơn mức thông thường (12%)" : "Penalty for breach is higher than standard (12%)" 
          },
          { 
            level: "safe", 
            title: language === "vi" ? "An toàn" : "Safe",
            text: language === "vi" ? "Điều khoản bảo mật thông tin đầy đủ và chặt chẽ" : "Confidentiality clause is comprehensive" 
          },
        ],
      });
      setIsAnalyzing(false);
      toast({
        title: language === "vi" ? "Phân tích hoàn tất" : "Analysis complete",
        description: language === "vi" ? "Đã tìm thấy các vấn đề trong hợp đồng" : "Issues found in the contract",
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 font-sans text-slate-900">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header Section */}
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1C4B]">
            {t.quickReview}
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            {t.quickReviewDesc}
          </p>
        </div>

        {/* Upload Section */}
        {!results && !isAnalyzing && (
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
                id="file-upload"
              />
              <label htmlFor="file-upload">
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
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <Card className="p-12 text-center border-0 shadow-lg bg-white">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-100 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#496DFF] rounded-full animate-spin border-t-transparent"></div>
                <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#496DFF]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A1C4B] mb-2">{t.analyzing || "Analyzing Contract..."}</h3>
                <p className="text-slate-500 animate-pulse">
                  {language === "vi" ? "AI đang đọc và phân tích các điều khoản..." : "AI is reading and analyzing clauses..."}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Results Section */}
        {results && !isAnalyzing && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
            {/* Score & Summary */}
            <Card className="border-0 shadow-lg bg-white overflow-hidden">
              <div className="bg-[#1A1C4B] p-8 text-white flex flex-col md:flex-row items-center gap-8">
                 <div className="relative">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                      <circle cx="48" cy="48" r="40" stroke="#496DFF" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - results.score / 100)} />
                    </svg>
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                      {results.score}
                    </span>
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2">
                      {language === "vi" ? "Kết quả phân tích" : "Analysis Result"}
                    </h2>
                    <p className="text-blue-100/80 leading-relaxed">
                      {results.summary}
                    </p>
                 </div>
                 <Button 
                    variant="secondary" 
                    onClick={() => { setResults(null); setIsAnalyzing(false); }}
                    className="whitespace-nowrap bg-[#496DFF] text-white hover:bg-[#3b5bdb] border-0"
                 >
                    {language === "vi" ? "Tải lên tệp mới" : "Upload New File"}
                 </Button>
              </div>
            </Card>

            {/* Detailed Issues */}
            <div className="grid gap-4">
              <h3 className="text-xl font-bold text-[#1A1C4B] mt-4 mb-2 px-1">
                {language === "vi" ? "Chi tiết các điều khoản" : "Detailed Clauses"}
              </h3>
              
              {results.issues.map((issue: any, idx: number) => (
                <Card 
                  key={idx} 
                  className={`border-l-8 border-0 shadow-sm hover:shadow-md transition-shadow ${
                    issue.level === "danger" ? "border-l-red-500" :
                    issue.level === "caution" ? "border-l-amber-500" :
                    "border-l-emerald-500"
                  }`}
                >
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`p-3 rounded-full shrink-0 ${
                      issue.level === "danger" ? "bg-red-50 text-red-600" :
                      issue.level === "caution" ? "bg-amber-50 text-amber-600" :
                      "bg-emerald-50 text-emerald-600"
                    }`}>
                      {issue.level === "danger" ? <XCircle className="w-6 h-6" /> :
                       issue.level === "caution" ? <AlertTriangle className="w-6 h-6" /> :
                       <CheckCircle2 className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className={`font-bold mb-1 ${
                        issue.level === "danger" ? "text-red-700" :
                        issue.level === "caution" ? "text-amber-700" :
                        "text-emerald-700"
                      }`}>
                        {issue.title}
                      </h4>
                      <p className="text-slate-600 leading-relaxed">
                        {issue.text}
                      </p>
                    </div>
                    {issue.level !== "safe" && (
                      <Button variant="ghost" size="icon" className="ml-auto text-slate-400 hover:text-[#496DFF]">
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickReview;