import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CloudUpload, Loader2, FileText, Save, RotateCcw, 
  CheckCircle, Bot, AlertTriangle, Shield, TrendingUp, DraftingCompass, MessageSquare, HardDriveDownload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { DeepAnalysisView } from '@/components/DeepAnalysisView';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth, UserInspection, ContractAnalysisData } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const mockAnalysis: ContractAnalysisData = {
  contract: {
    title: "Hợp đồng Dịch vụ Marketing Dài Hạn",
    clauses: [
      {
        id: "clause-1",
        title: "Điều 1: Phạm vi công việc",
        content: "Bên B sẽ cung cấp các dịch vụ quảng cáo trên các nền tảng mạng xã hội, bao gồm nhưng không giới hạn ở Facebook, Instagram và TikTok. Các chiến dịch sẽ được thực hiện theo kế hoạch chi tiết được hai bên thống nhất hàng tháng.",
        risk: "safe",
        suggestion: "Điều khoản rõ ràng, không có rủi ro đáng kể."
      },
      {
        id: "clause-2",
        title: "Điều 2: Thời hạn hợp đồng",
        content: "Hợp đồng có hiệu lực 24 tháng kể từ ngày ký. Hợp đồng sẽ tự động gia hạn thêm 12 tháng nếu không có bên nào thông báo chấm dứt bằng văn bản trước 30 ngày.",
        risk: "caution",
        suggestion: "Điều khoản tự động gia hạn có thể gây bất lợi, đặc biệt với thời hạn dài. Nên thay đổi thành 'khi hết hạn, hai bên sẽ cùng xem xét ký kết hợp đồng mới' hoặc yêu cầu thông báo trước 60 ngày."
      },
      {
        id: "clause-3",
        title: "Điều 3: Phí dịch vụ và thanh toán",
        content: "Phí dịch vụ là 50.000.000 VNĐ/tháng, thanh toán vào ngày 05 hàng tháng. Lãi suất trả chậm là 1% mỗi ngày.",
        risk: "danger",
        suggestion: "Lãi suất trả chậm 1%/ngày (tương đương 365%/năm) là quá cao và có thể vi phạm quy định của pháp luật về lãi suất. Nên đàm phán giảm xuống mức hợp lý, ví dụ 0.05%/ngày."
      },
      {
        id: "clause-4",
        title: "Điều 4: Quyền sở hữu trí tuệ",
        content: "Mọi sản phẩm sáng tạo (hình ảnh, video, nội dung) do Bên B tạo ra trong quá trình thực hiện hợp đồng thuộc sở hữu của Bên A sau khi đã thanh toán đầy đủ.",
        risk: "safe",
        suggestion: "Điều khoản tiêu chuẩn, không có vấn đề."
      },
      {
        id: "clause-5",
        title: "Điều 5: Bảo mật thông tin",
        content: "Bên B cam kết không tiết lộ bất kỳ thông tin nào của Bên A cho bên thứ ba trong và sau khi hợp đồng kết thúc. Nghĩa vụ bảo mật có hiệu lực vô thời hạn.",
        risk: "caution",
        suggestion: "Hiệu lực 'vô thời hạn' có thể khó thực thi. Nên giới hạn trong một khoảng thời gian hợp lý, ví dụ 5 năm sau khi chấm dứt hợp đồng."
      },
      {
        id: "clause-6",
        title: "Điều 6: Báo cáo và đánh giá",
        content: "Bên B phải gửi báo cáo hiệu quả chiến dịch hàng tuần cho Bên A qua email. Một cuộc họp đánh giá sẽ được tổ chức vào cuối mỗi tháng.",
        risk: "safe",
        suggestion: "Điều khoản rõ ràng, đảm bảo tính minh bạch."
      },
      {
        id: "clause-7",
        title: "Điều 7: Chấm dứt hợp đồng trước thời hạn",
        content: "Một trong hai bên có quyền chấm dứt hợp đồng nếu bên kia vi phạm nghiêm trọng các điều khoản và không khắc phục trong vòng 15 ngày kể từ ngày nhận được thông báo.",
        risk: "safe",
        suggestion: "Thời gian 15 ngày là hợp lý để khắc phục vi phạm."
      },
      {
        id: "clause-8",
        title: "Điều 8: Bồi thường thiệt hại",
        content: "Nếu Bên B không đạt được KPI đã cam kết, Bên B sẽ phải bồi thường 100% phí dịch vụ của tháng đó. Ngoài ra không có chế tài nào khác.",
        risk: "danger",
        suggestion: "Điều khoản bồi thường chỉ giới hạn ở phí dịch vụ có thể không đủ để bù đắp thiệt hại kinh doanh thực tế. Nên bổ sung các điều khoản về bồi thường thiệt hại gián tiếp hoặc mất lợi nhuận."
      },
      {
        id: "clause-9",
        title: "Điều 9: Bất khả kháng",
        content: "Các trường hợp như thiên tai, chiến tranh, dịch bệnh được xem là bất khả kháng. Không bên nào phải chịu trách nhiệm nếu không thể thực hiện nghĩa vụ do sự kiện bất khả kháng.",
        risk: "safe",
        suggestion: "Điều khoản tiêu chuẩn về bất khả kháng."
      },
      {
        id: "clause-10",
        title: "Điều 10: Giải quyết tranh chấp",
        content: "Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng. Nếu không thành, vụ việc sẽ được đưa ra Tòa án Nhân dân có thẩm quyền tại TP. Hồ Chí Minh.",
        risk: "safe",
        suggestion: "Phương thức giải quyết tranh chấp rõ ràng."
      },
      {
        id: "clause-11",
        title: "Điều 11: Thay đổi nội dung công việc",
        content: "Bất kỳ yêu cầu thay đổi nào về phạm vi công việc phải được Bên A gửi bằng văn bản. Bên B sẽ phản hồi về chi phí phát sinh trong vòng 3 ngày làm việc.",
        risk: "safe",
        suggestion: "Quy trình quản lý thay đổi rõ ràng."
      },
      {
        id: "clause-12",
        title: "Điều 12: Cam kết về nhân sự",
        content: "Bên B đảm bảo rằng đội ngũ thực hiện dự án có đủ năng lực và kinh nghiệm. Bên A có quyền yêu cầu thay đổi nhân sự nếu không hài lòng về hiệu suất làm việc.",
        risk: "caution",
        suggestion: "Quyền 'yêu cầu thay đổi nhân sự' nên được định nghĩa rõ ràng hơn về tiêu chí, tránh lạm dụng. Ví dụ: 'khi nhân sự không đáp ứng được yêu cầu công việc đã thống nhất'."
      },
      {
        id: "clause-13",
        title: "Điều 13: Phạt vi phạm",
        content: "Bất kỳ vi phạm nào không được khắc phục đúng hạn sẽ bị phạt 8% giá trị hợp đồng cho mỗi lần vi phạm.",
        risk: "safe",
        suggestion: "Mức phạt hợp lý, có tính răn đe."
      },
       {
        id: "clause-14",
        title: "Điều 14: Hiệu lực",
        content: "Hợp đồng được lập thành 02 bản, mỗi bên giữ 01 bản và có giá trị pháp lý như nhau. Hợp đồng có hiệu lực kể từ ngày ký.",
        risk: "safe",
        suggestion: "Điều khoản tiêu chuẩn."
      }
    ],
    fullContent: `<h2 class='text-2xl font-bold text-center text-gray-900 mb-8'>Hợp đồng Dịch vụ Marketing Dài Hạn</h2><p><b>Điều 1: Phạm vi công việc</b></p><p>Bên B sẽ cung cấp các dịch vụ quảng cáo trên các nền tảng mạng xã hội, bao gồm nhưng không giới hạn ở Facebook, Instagram và TikTok. Các chiến dịch sẽ được thực hiện theo kế hoạch chi tiết được hai bên thống nhất hàng tháng.</p><p><b>Điều 2: Thời hạn hợp đồng</b></p><p>Hợp đồng có hiệu lực 24 tháng kể từ ngày ký. Hợp đồng sẽ tự động gia hạn thêm 12 tháng nếu không có bên nào thông báo chấm dứt bằng văn bản trước 30 ngày.</p><p><b>Điều 3: Phí dịch vụ và thanh toán</b></p><p>Phí dịch vụ là 50.000.000 VNĐ/tháng, thanh toán vào ngày 05 hàng tháng. Lãi suất trả chậm là 1% mỗi ngày.</p><p><b>Điều 4: Quyền sở hữu trí tuệ</b></p><p>Mọi sản phẩm sáng tạo (hình ảnh, video, nội dung) do Bên B tạo ra trong quá trình thực hiện hợp đồng thuộc sở hữu của Bên A sau khi đã thanh toán đầy đủ.</p><p><b>Điều 5: Bảo mật thông tin</b></p><p>Bên B cam kết không tiết lộ bất kỳ thông tin nào của Bên A cho bên thứ ba trong và sau khi hợp đồng kết thúc. Nghĩa vụ bảo mật có hiệu lực vô thời hạn.</p><p><b>Điều 6: Báo cáo và đánh giá</b></p><p>Bên B phải gửi báo cáo hiệu quả chiến dịch hàng tuần cho Bên A qua email. Một cuộc họp đánh giá sẽ được tổ chức vào cuối mỗi tháng.</p><p><b>Điều 7: Chấm dứt hợp đồng trước thời hạn</b></p><p>Một trong hai bên có quyền chấm dứt hợp đồng nếu bên kia vi phạm nghiêm trọng các điều khoản và không khắc phục trong vòng 15 ngày kể từ ngày nhận được thông báo.</p><p><b>Điều 8: Bồi thường thiệt hại</b></p><p>Nếu Bên B không đạt được KPI đã cam kết, Bên B sẽ phải bồi thường 100% phí dịch vụ của tháng đó. Ngoài ra không có chế tài nào khác.</p><p><b>Điều 9: Bất khả kháng</b></p><p>Các trường hợp như thiên tai, chiến tranh, dịch bệnh được xem là bất khả kháng. Không bên nào phải chịu trách nhiệm nếu không thể thực hiện nghĩa vụ do sự kiện bất khả kháng.</p><p><b>Điều 10: Giải quyết tranh chấp</b></p><p>Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng. Nếu không thành, vụ việc sẽ được đưa ra Tòa án Nhân dân có thẩm quyền tại TP. Hồ Chí Minh.</p><p><b>Điều 11: Thay đổi nội dung công việc</b></p><p>Bất kỳ yêu cầu thay đổi nào về phạm vi công việc phải được Bên A gửi bằng văn bản. Bên B sẽ phản hồi về chi phí phát sinh trong vòng 3 ngày làm việc.</p><p><b>Điều 12: Cam kết về nhân sự</b></p><p>Bên B đảm bảo rằng đội ngũ thực hiện dự án có đủ năng lực và kinh nghiệm. Bên A có quyền yêu cầu thay đổi nhân sự nếu không hài lòng về hiệu suất làm việc.</p><p><b>Điều 13: Phạt vi phạm</b></p><p>Bất kỳ vi phạm nào không được khắc phục đúng hạn sẽ bị phạt 8% giá trị hợp đồng cho mỗi lần vi phạm.</p><p><b>Điều 14: Hiệu lực</b></p><p>Hợp đồng được lập thành 02 bản, mỗi bên giữ 01 bản và có giá trị pháp lý như nhau. Hợp đồng có hiệu lực kể từ ngày ký.</p>`
  },
  summary: {
    score: 72, 
    status: "Khá an toàn",
    description: "Hợp đồng đạt chuẩn cơ bản.",
    risks: [
      { level: "danger", count: 2 },
      { level: "caution", count: 3 },
      { level: "safe", count: 9 },
    ]
  }
};

const chat = {
  messages: [
    { from: "bot", text: "Chào bạn, tôi có thể giúp gì cho bạn?" },
  ]
};


type SidebarView = 'summary' | 'deep-analysis' | 'chat';

const DeepAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysisData | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeView, setActiveView] = useState<SidebarView>('summary');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // This is the key change: checking for analysis data in location state
    if (location.state?.analysisData) {
      const { analysisData, fileName } = location.state;
      setAnalysisResult(analysisData);
      setFileName(fileName);
      setShowResult(true);
      setHasUnsavedChanges(true); 
      setSaveState('idle');
    } else {
      // Fallback to localStorage for any previously ongoing analysis
      const savedAnalysis = localStorage.getItem('current_analysis');
      const savedName = localStorage.getItem('current_analysis_filename');
      if (savedAnalysis && savedName) {
        setAnalysisResult(JSON.parse(savedAnalysis));
        setFileName(savedName);
        setShowResult(true);
        setHasUnsavedChanges(true);
        setSaveState('idle');
      }
    }
  }, [location.state]);

  const processFile = (file: File) => {
    setFileName(file.name);
    setIsAnalyzing(true);
    setHasUnsavedChanges(false);
    setSaveState('idle');

    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
      setAnalysisResult(mockAnalysis);
      localStorage.setItem('current_analysis', JSON.stringify(mockAnalysis));
      localStorage.setItem('current_analysis_filename', file.name);
      setHasUnsavedChanges(true);
      setActiveView('summary');
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) processFile(e.target.files[0]); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); };

  const handleSave = async () => {
    if (!user || !fileName || !analysisResult) return;
    setSaveState('saving');
    
    const newInspection: UserInspection = {
      id: `insp_${Date.now()}`,
      name: fileName,
      content: analysisResult.contract.fullContent,
      score: analysisResult.summary.score,
      createdAt: new Date().toISOString(),
      analysisData: analysisResult, // Save the full analysis
    };
    
    const updatedInspections = [...user.inspections, newInspection];
    const { error } = await updateUserProfile({ inspections: updatedInspections });
    
    if (!error) {
      setSaveState('saved');
      toast({ title: "Lưu thành công!", description: `"${fileName}" đã được chuyển vào mục Hợp đồng đã hoàn tất.` });
      localStorage.removeItem('current_analysis');
      localStorage.removeItem('current_analysis_filename');
      setHasUnsavedChanges(false);
      setTimeout(() => navigate('/inspections'), 1000);
    } else {
      setSaveState('idle');
      toast({ title: "Lỗi", description: "Không thể lưu phân tích.", variant: "destructive" });
    }
  };

  const handleReset = () => {
    setFileName("");
    setShowResult(false);
    setAnalysisResult(null);
    localStorage.removeItem('current_analysis');
    localStorage.removeItem('current_analysis_filename');
    if (fileInputRef.current) fileInputRef.current.value = "";
    setHasUnsavedChanges(false);
    setSaveState('idle');
  };

  const handleResetClick = () => {
    if (hasUnsavedChanges) {
      setIsConfirmOpen(true);
    } else {
      handleReset();
    }
  };

  const confirmAction = (shouldSave: boolean) => {
    if (shouldSave) {
      handleSave().then(() => {
        // After saving, we don't reset immediately but wait for the navigation
      });
    } else {
      handleReset();
    }
    setIsConfirmOpen(false);
  };

  const renderRiskIcon = (level: string, className = "w-4 h-4") => {
    const RENDER_MAP: { [key: string]: React.ReactNode } = {
      danger: <AlertTriangle className={cn("text-red-500", className)} />,
      caution: <Shield className={cn("text-yellow-500", className)} />,
      safe: <CheckCircle className={cn("text-green-500", className)} />
    };
    return RENDER_MAP[level] || RENDER_MAP['safe'];
  };
  
  const ScoreRing = ({ score }: { score: number }) => {
    const radius = 36; const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    return (
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="transform -rotate-90 w-20 h-20"><circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/20" /><circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="text-white transition-all duration-1000 ease-out" /></svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white"><span className="text-xl font-bold leading-none">{score}</span><span className="text-[9px] opacity-80 font-medium">/100</span></div>
      </div>
    );
  };

  // Renders the main content based on the current analysis result
  const renderSummaryContent = () => {
    if (!analysisResult) return null;
    return (
      <div className='space-y-4'>
        <div className="bg-gradient-to-br from-[#4f46e5] to-[#4338ca] rounded-2xl p-5 text-white shadow-lg flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest font-semibold opacity-70">Điểm hợp đồng</span>
            <h2 className="text-2xl font-bold tracking-tight">{analysisResult.summary.status}</h2>
            <p className="text-xs opacity-90 font-medium max-w-[150px]">{analysisResult.summary.description}</p>
          </div>
          <div className="flex-shrink-0"><ScoreRing score={analysisResult.summary.score} /></div>
        </div>
        <div className='p-4 bg-card rounded-xl border shadow-sm'>
          <div className='flex items-center justify-around text-center'>
            {analysisResult.summary.risks.map(risk => (
              <div key={risk.level} className='flex flex-col items-center gap-1'>
                <div className={cn('text-2xl font-bold', {'text-red-500': risk.level === 'danger', 'text-yellow-500': risk.level === 'caution', 'text-green-500': risk.level === 'safe'})}>{risk.count}</div>
                <div className='text-[10px] text-gray-500 font-medium uppercase tracking-wide'>{risk.level} Risk</div>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-100 h-px my-4"></div>
          <div className='space-y-2'>
            {analysisResult.contract.clauses.map(clause => (<a href={`#${clause.id}`} key={clause.id} className='flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors border border-transparent hover:border-slate-200'>{renderRiskIcon(clause.risk)}<span className='text-xs text-gray-700 font-medium flex-1 truncate'>{clause.title}</span></a>))}
          </div>
        </div>
      </div>
    );
  };

  const renderChatContent = () => (
    <div className="bg-card border rounded-xl p-3 flex flex-col h-full shadow-sm">
      <div className="flex-1 space-y-3 pr-2 -mr-2 overflow-y-auto custom-scrollbar-sm mb-3">
        {chat.messages.map((msg, index) => (<div key={index} className={cn('flex items-end gap-2', { 'justify-end': msg.from === 'user' })}>{msg.from === 'bot' && <div className="w-6 h-6 rounded-full bg-[#eef2ff] flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-[#4f46e5]" /></div>}<div className={cn('max-w-[85%] p-2.5 rounded-xl', { 'bg-gray-100': msg.from === 'bot', 'bg-[#4f46e5] text-primary-foreground': msg.from === 'user' })}><p className="text-xs">{msg.text}</p></div></div>))}
      </div>
      <div className="relative mt-auto pt-2 border-t border-dashed"><input placeholder="Hỏi AI..." className="w-full pr-9 h-9 border rounded-lg bg-gray-50 pl-3 text-xs focus:ring-1 focus:ring-[#4f46e5]/50 outline-none transition-all" /><Button variant="ghost" size="icon" className="absolute right-0.5 top-1/2 -translate-y-1/2 h-8 w-8 text-[#4f46e5]/80 hover:text-[#4f46e5] mt-1"><MessageSquare size={16}/></Button></div>
    </div>
  );

  const TABS: { id: SidebarView; label: string; icon: React.ElementType; }[] = [{ id: 'summary', label: 'Tổng quan', icon: TrendingUp }, { id: 'deep-analysis', label: 'Phân tích sâu', icon: DraftingCompass }, { id: 'chat', label: 'Trò chuyện', icon: Bot }];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 h-screen overflow-hidden" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {!showResult ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".doc,.docx,.pdf" />
          <div className={cn("w-full max-w-2xl h-80 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl text-center transition-all duration-300", isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white')}>
            {isAnalyzing ? (
              <><Loader2 className="h-12 w-12 animate-spin text-indigo-500" /><p className="mt-4 font-semibold text-gray-700">Đang phân tích tài liệu...</p><p className="text-sm text-gray-500">{fileName}</p></>
            ) : (
              <><CloudUpload className="h-12 w-12 text-gray-400" /><p className="mt-4 font-semibold text-gray-700">Kéo & thả hợp đồng của bạn vào đây</p><p className="text-sm text-gray-500">hoặc</p><Button onClick={() => fileInputRef.current?.click()} variant="link" className="text-indigo-600">Tải tệp lên</Button><p className="text-xs text-gray-400 mt-2">Hỗ trợ: DOC, DOCX, PDF</p></>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="h-14 bg-white border-b flex items-center justify-between px-5 flex-shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-3 min-w-0"><FileText size={18} className='text-indigo-600'/><h3 className="font-semibold text-gray-800 text-sm truncate">{fileName}</h3></div>
            <div className="flex items-center gap-2">
              <Button onClick={handleResetClick} variant="ghost" className="h-8 text-gray-600 hover:text-red-600 hover:bg-red-50 gap-1.5 text-xs px-3"><RotateCcw size={13}/> Tải tệp mới</Button>
              <div className="h-5 w-px bg-gray-200"></div>
              <Button onClick={handleSave} className={cn("h-8 gap-2 px-4 text-xs font-semibold rounded-md transition-all w-32", saveState === 'saved' ? "bg-green-500 hover:bg-green-600 cursor-not-allowed" : saveState === 'saving' ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700")} disabled={saveState === 'saving' || saveState === 'saved'}>
                {saveState === 'saving' && <><Loader2 size={14} className="animate-spin"/> Đang lưu...</>}
                {saveState === 'saved' && <><CheckCircle size={14} /> Đã lưu</>}
                {saveState === 'idle' && <><HardDriveDownload size={13} /> Lưu & Hoàn tất</>}
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-[1fr_400px] flex-1 min-h-0">
            <div className="overflow-y-auto p-8 custom-scrollbar bg-gray-100/50">
              <div className="w-full max-w-4xl mx-auto pb-20 font-serif">
                {analysisResult && <div className="bg-white shadow-sm border rounded-xl p-12 text-justify leading-relaxed text-base space-y-6 text-gray-800" dangerouslySetInnerHTML={{ __html: analysisResult.contract.fullContent }}></div>}
              </div>
            </div>
            <div className="border-l flex flex-col bg-white h-full min-h-0">
              <div className="flex items-center border-b p-1.5 flex-shrink-0 bg-white">
                {TABS.map(tab => (<button key={tab.id} onClick={() => setActiveView(tab.id)} className={cn("flex-1 py-2.5 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-colors", { 'bg-[#eef2ff] text-[#4f46e5]': activeView === tab.id, 'text-muted-foreground hover:text-foreground hover:bg-muted/50': activeView !== tab.id })}><tab.icon className={cn("w-4 h-4", activeView === tab.id ? "text-[#4f46e5]" : "text-gray-400")} />{tab.label}</button>))}
              </div>
              <div className="flex-1 min-h-0 relative overflow-hidden bg-slate-50">
                <AnimatePresence mode="wait">
                  <motion.div key={activeView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="h-full w-full">
                    {analysisResult && (
                      <>
                        {activeView === 'summary' && <div className="h-full overflow-y-auto p-4 custom-scrollbar">{renderSummaryContent()}</div>}
                        {activeView === 'deep-analysis' && <div className="h-full overflow-y-auto p-4 custom-scrollbar"><DeepAnalysisView clauses={analysisResult.contract.clauses} /></div>}
                      </>
                    )}
                    {activeView === 'chat' && <div className="h-full w-full p-4 overflow-hidden">{renderChatContent()}</div>}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="p-2 bg-white border-t flex-shrink-0 z-10"><div className="text-center text-[10px] text-muted-foreground/80 select-none">Agreeme có thể mắc lỗi. Hãy kiểm tra lại thông tin quan trọng.</div></div>
            </div>
          </div>
        </>
      )}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Bắt đầu phân tích mới?</AlertDialogTitle><AlertDialogDescription>Bạn có thay đổi chưa được lưu. Bạn có muốn lưu bản phân tích hiện tại trước khi bắt đầu một bản mới không?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={() => confirmAction(false)}>Bỏ qua & Bắt đầu mới</AlertDialogCancel><AlertDialogAction onClick={() => confirmAction(true)}>Lưu & Tiếp tục</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeepAnalysis;