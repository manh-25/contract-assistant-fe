import React, { useState, useRef, useEffect } from 'react';
import { 
  CloudUpload, Loader2, AlertCircle, Scale, 
  FileText, Send, Save, RotateCcw, ChevronRight, 
  BookOpen, Sparkles, CheckCircle, Bot, AlertTriangle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DeepAnalysis = () => {
  // --- STATE QUẢN LÝ ---
  const [fileName, setFileName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // State lưu / chưa lưu
  const [isSaved, setIsSaved] = useState(false);                 // đã lưu xong chưa
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // đang có thay đổi chưa lưu

  // State Dialog Xác nhận
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // State Drag & Drop
  const [isDragging, setIsDragging] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'quick-review' | 'deep-analysis' | 'chat'>('quick-review');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. PERSISTENCE ---
  useEffect(() => {
    const savedState = localStorage.getItem('contract_analysis_state');
    const savedName = localStorage.getItem('contract_filename');
    if (savedState === 'done' && savedName) {
      setFileName(savedName);
      setShowResult(true);

      // Khi load lại trạng thái cũ, cho là đang có kết quả phân tích nhưng chưa lưu
      setIsSaved(false);
      setHasUnsavedChanges(true);
    }
  }, []);

  // --- 2. XỬ LÝ FILE ---
  const processFile = (file: File) => {
    setFileName(file.name);
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);

      localStorage.setItem('contract_analysis_state', 'done');
      localStorage.setItem('contract_filename', file.name);

      // File mới phân tích -> coi như có thay đổi cần lưu
      setIsSaved(false);
      setHasUnsavedChanges(true);
    }, 2000);
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { 
    e.preventDefault(); 
    setIsDragging(true); 
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { 
    e.preventDefault(); 
    setIsDragging(false); 
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  // --- 3. ĐÁNH DẤU "ĐANG CHỈNH SỬA" ---
  // Sau này bạn chỉ cần gọi hàm này trong onChange editor, sửa điều khoản, thêm note,...
  const markAsEdited = () => {
    setHasUnsavedChanges(true);
    setIsSaved(false);
  };

  // --- 4. XỬ LÝ LƯU (SAVE) ---
  const handleSave = () => {
    if (!fileName) return; // không có file thì thôi

    const existingData = localStorage.getItem('saved_contracts');
    let contracts = existingData ? JSON.parse(existingData) : [];
    
    const newContract = {
      id: Date.now(),
      name: fileName,
      type: "Contract Analysis", 
      score: 72,
      timestamp: new Date().toISOString(), 
      status: "In Progress",
      docNumber: `DOC-${Math.floor(1000 + Math.random() * 9000)}`
    };

    contracts.unshift(newContract);
    localStorage.setItem('saved_contracts', JSON.stringify(contracts));

    // cập nhật trạng thái nút
    setIsSaved(true);
    setHasUnsavedChanges(false);
  };

  // --- 5. XỬ LÝ RESET (TẢI FILE KHÁC) ---
  const handleResetClick = () => {
    if (!showResult) return;

    if (hasUnsavedChanges) {
      // còn thay đổi chưa lưu -> hỏi popup
      setIsConfirmOpen(true);
    } else {
      // không có thay đổi chưa lưu -> reset luôn
      confirmReset(false);
    }
  };

  const confirmReset = (shouldSave: boolean) => {
    if (shouldSave) {
      handleSave(); // sẽ set isSaved=true & hasUnsavedChanges=false
    }

    // sau khi lưu / không lưu -> reset để tải file mới
    setFileName("");
    setShowResult(false);
    setActiveTab('quick-review');
    localStorage.removeItem('contract_analysis_state');
    localStorage.removeItem('contract_filename');
    if (fileInputRef.current) fileInputRef.current.value = "";

    setIsSaved(false);
    setHasUnsavedChanges(false);
    setIsConfirmOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-[#F1F5F9] font-sans">
      <Sidebar />

      <div className="flex-1 flex relative overflow-hidden">
        <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-100/50 relative">
            
            {showResult && (
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm flex-shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 border border-red-100">
                      <FileText size={20}/>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">{fileName}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Sẵn sàng chỉnh sửa</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                      onClick={handleResetClick}
                      variant="ghost"
                      className="h-9 text-slate-500 hover:text-red-600 hover:bg-red-50 gap-2 text-xs font-medium"
                    >
                      <RotateCcw size={14}/> Tải file khác
                    </Button>

                    <div className="h-6 w-px bg-slate-200"></div>

                    {/* Nút lưu / đã lưu */}
                    <Button
                      className={
                        "h-9 gap-2 px-5 text-xs font-semibold rounded-lg shadow-md " +
                        (isSaved && !hasUnsavedChanges
                          ? "bg-slate-100 text-slate-500 hover:bg-slate-200 shadow-none"
                          : "bg-[#4F46E5] hover:bg-blue-700 text-white shadow-blue-200")
                      }
                      onClick={() => {
                        handleSave();
                        alert("Đã lưu thành công!");
                      }}
                      disabled={isSaved && !hasUnsavedChanges} // có thể bỏ disabled nếu muốn cho phép lưu lại
                    >
                      {isSaved && !hasUnsavedChanges ? (
                        <>
                          <CheckCircle size={14} /> Đã lưu
                        </>
                      ) : (
                        <>
                          <Save size={14} /> Lưu tài liệu
                        </>
                      )}
                    </Button>
                </div>
            </div>
            )}

            <div className="flex-1 overflow-y-auto p-8 flex justify-center custom-scrollbar scroll-smooth">
                {!showResult ? (
                    <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                        <div 
                            onClick={triggerUpload} 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`w-full max-w-2xl h-[360px] bg-white border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group relative overflow-hidden ${isDragging ? 'border-[#4F46E5] bg-indigo-50/30 scale-105' : 'border-slate-300 hover:border-[#4F46E5] hover:bg-blue-50/20 hover:shadow-xl'}`}
                        >
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                            />
                            {isAnalyzing ? (
                            <div className="flex flex-col items-center z-10">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                  <Loader2 className="w-16 h-16 text-[#4F46E5] animate-spin relative z-10" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mt-6">AI đang đọc hợp đồng...</h3>
                                <p className="text-slate-400 mt-2">Vui lòng đợi trong giây lát</p>
                            </div>
                            ) : (
                            <div className="flex flex-col items-center text-center z-10">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-sm border ${isDragging ? 'bg-indigo-100 scale-110' : 'bg-slate-50 border-slate-100 group-hover:scale-110 group-hover:rotate-3'}`}>
                                    <CloudUpload className={`w-10 h-10 ${isDragging ? 'text-[#4F46E5]' : 'text-slate-400 group-hover:text-[#4F46E5]'}`} />
                                </div>
                                <h3 className="text-xl font-bold text-[#050A18]">
                                  {isDragging ? "Thả file vào đây" : "Tải lên hợp đồng cần phân tích"}
                                </h3>
                                <p className="text-slate-400 mt-2 text-sm">Hỗ trợ PDF, DOCX (Tối đa 20MB)</p>
                                <Button className="mt-8 bg-[#4F46E5] hover:bg-blue-700 text-white px-8 h-11 rounded-xl font-semibold shadow-lg transition-all hover:shadow-blue-500/20 pointer-events-none">
                                  Chọn tệp tin
                                </Button>
                            </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-[800px] space-y-8 pb-20 animate-in slide-in-from-bottom-8 duration-500">
                        {/* PAGE 1 */}
                        <div className="bg-white min-h-[1050px] shadow-lg border border-slate-200 p-12 relative group">
                          <div className="absolute top-4 right-4 text-[10px] text-slate-300 font-mono">
                            Page 1 of 3
                          </div>
                          <div className="space-y-6 text-justify text-slate-800 font-serif leading-relaxed text-[15px]">
                            <div className="text-center font-bold mb-10">
                              <p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                              <p className="border-b border-slate-300 inline-block pb-1 mb-1">
                                Độc lập - Tự do - Hạnh phúc
                              </p>
                              <h2 className="text-2xl mt-8 uppercase">HỢP ĐỒNG CUNG ỨNG DỊCH VỤ</h2>
                              <p className="text-sm font-normal italic mt-2 text-slate-500">
                                Số: 01/2024/HĐ-DV
                              </p>
                            </div>

                            <p>
                              <strong>BÊN A: CÔNG TY CỔ PHẦN AGREE</strong><br/>
                              Địa chỉ: Hà Nội.<br/>
                              Đại diện: Ông Nguyễn Văn A
                            </p>

                            <p>
                              <strong>BÊN B: CÔNG TY TNHH GIẢI PHÁP SỐ</strong><br/>
                              Địa chỉ: TP. Hồ Chí Minh.<br/>
                              Đại diện: Bà Trần Thị B
                            </p>

                            <p>
                              <strong>ĐIỀU 1. NỘI DUNG CÔNG VIỆC</strong><br/>
                              Bên B đồng ý cung cấp dịch vụ tư vấn chuyển đổi số cho Bên A...
                            </p>

                            <div
                              className={`p-3 -mx-3 rounded-lg border transition-all duration-300 ${
                                activeTab === 'deep-analysis'
                                  ? 'bg-red-50 border-red-200 ring-1 ring-red-100'
                                  : 'bg-transparent border-transparent'
                              }`}
                            >
                              <p><strong>ĐIỀU 3. PHẠT VI PHẠM</strong></p>
                              <p
                                className={
                                  activeTab === 'deep-analysis'
                                    ? 'text-red-800 bg-red-100/50 inline'
                                    : ''
                                }
                              >
                                "Nếu Bên B chậm tiến độ quá 03 ngày, Bên B sẽ phải chịu phạt 20% tổng giá trị hợp đồng..."
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* PAGE 2 */}
                        <div className="bg-white min-h-[1050px] shadow-lg border border-slate-200 p-12 relative group">
                          <div className="absolute top-4 right-4 text-[10px] text-slate-300 font-mono">
                            Page 2 of 3
                          </div>
                          <div className="space-y-6 text-justify text-slate-800 font-serif leading-relaxed text-[15px]">
                            <p>
                              <strong>ĐIỀU 4. THANH TOÁN</strong><br/>
                              Tổng giá trị hợp đồng là: 500.000.000 VNĐ...
                            </p>
                            <p>
                              <strong>ĐIỀU 5. BẢO MẬT</strong><br/>
                              Hai bên cam kết bảo mật thông tin trong quá trình thực hiện...
                            </p>
                            <div className="h-40"></div>
                          </div>
                        </div>

                        {/* PAGE 3 */}
                        <div className="bg-white min-h-[1050px] shadow-lg border border-slate-200 p-12 relative group">
                          <div className="absolute top-4 right-4 text-[10px] text-slate-300 font-mono">
                            Page 3 of 3
                          </div>
                          <div className="space-y-6 text-justify text-slate-800 font-serif leading-relaxed text-[15px]">
                            <div
                              className={`p-3 -mx-3 rounded-lg border transition-all duration-300 ${
                                activeTab === 'deep-analysis'
                                  ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-100'
                                  : 'bg-transparent border-transparent'
                              }`}
                            >
                              <p><strong>ĐIỀU 9. GIẢI QUYẾT TRANH CHẤP</strong></p>
                              <p
                                className={
                                  activeTab === 'deep-analysis'
                                    ? 'text-orange-800 bg-orange-100/50 inline'
                                    : ''
                                }
                              >
                                "Hai bên cam kết giải quyết tranh chấp qua thương lượng..."
                              </p>
                            </div>

                            <div className="grid grid-cols-2 mt-20 gap-10 text-center font-bold">
                              <div>
                                <p className="mb-20">ĐẠI DIỆN BÊN A</p>
                                <p>Nguyễn Văn A</p>
                              </div>
                              <div>
                                <p className="mb-20">ĐẠI DIỆN BÊN B</p>
                                <p>Trần Thị B</p>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* --- CỘT PHẢI: TRỢ LÝ AI --- */}
        <div className={`w-[450px] bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl z-30 transition-all duration-500 ease-in-out transform ${showResult ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute right-0'}`}>
            <div className="flex border-b border-slate-100 bg-white pt-2">
                <button
                  onClick={() => setActiveTab('quick-review')}
                  className={`flex-1 py-4 text-sm font-semibold relative ${
                    activeTab === 'quick-review'
                      ? 'text-[#4F46E5]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Quick Review
                  {activeTab === 'quick-review' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4F46E5]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('deep-analysis')}
                  className={`flex-1 py-4 text-sm font-semibold relative ${
                    activeTab === 'deep-analysis'
                      ? 'text-[#4F46E5]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Deep Analysis
                  {activeTab === 'deep-analysis' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4F46E5]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-4 text-sm font-semibold relative ${
                    activeTab === 'chat'
                      ? 'text-[#4F46E5]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Trợ lý AI
                  {activeTab === 'chat' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4F46E5]" />
                  )}
                </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 relative custom-scrollbar flex flex-col">
                <div className="flex-1">
                    {activeTab === 'quick-review' && (
                        <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="bg-gradient-to-br from-[#4F46E5] to-[#3B5BDB] rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                                <div className="flex items-center justify-between relative z-10">
                                  <div>
                                    <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">
                                      ĐIỂM HỢP ĐỒNG
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">Khá an toàn</h2>
                                    <p className="text-xs opacity-90 max-w-[160px]">
                                      Hợp đồng đạt chuẩn cơ bản.
                                    </p>
                                  </div>
                                  <div className="relative w-20 h-20 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                      <path
                                        className="text-white/20"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                      />
                                      <path
                                        className="text-white drop-shadow-md"
                                        strokeDasharray="72, 100"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                      <span className="text-xl font-bold">72</span>
                                      <span className="text-[8px] uppercase">/100</span>
                                    </div>
                                  </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-red-50 border border-red-100 rounded-2xl p-3 text-center">
                                <span className="text-2xl font-bold text-red-600">1</span>
                                <span className="text-[10px] uppercase font-bold text-red-400 block mt-1">
                                  High Risk
                                </span>
                              </div>
                              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 text-center">
                                <span className="text-2xl font-bold text-orange-600">1</span>
                                <span className="text-[10px] uppercase font-bold text-orange-400 block mt-1">
                                  Warning
                                </span>
                              </div>
                              <div className="bg-green-50 border border-green-100 rounded-2xl p-3 text-center">
                                <span className="text-2xl font-bold text-green-600">12</span>
                                <span className="text-[10px] uppercase font-bold text-green-400 block mt-1">
                                  Good
                                </span>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div
                                onClick={() => setActiveTab('deep-analysis')}
                                className="group bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-red-200 transition-all cursor-pointer relative overflow-hidden"
                              >
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                <div className="pl-2">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm group-hover:text-red-600 transition-colors">
                                      Phạt vi phạm quá mức
                                    </div>
                                    <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                      High
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 mb-3 leading-relaxed line-clamp-2">
                                    Điều 3 quy định mức phạt 20% là trái với Luật Thương mại.
                                  </p>
                                </div>
                              </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'deep-analysis' && (
                        <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                              <div className="bg-red-50 px-4 py-3 border-b border-red-100 font-bold text-red-800 text-sm flex items-center gap-2">
                                <AlertCircle size={16}/> Điều 3: Phạt vi phạm
                              </div>
                              <div className="p-4 space-y-3">
                                <div className="text-xs text-slate-700 italic border p-2 rounded bg-slate-50">
                                  "...chịu phạt <span className="bg-red-100 text-red-700 font-bold">20%</span>..."
                                </div>
                                <div className="text-xs text-green-800 border border-green-100 p-2 rounded bg-green-50 flex gap-2">
                                  <Sparkles size={14}/> 
                                  <span><strong>Kiến nghị:</strong> Sửa thành 8%.</span>
                                </div>
                              </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'chat' && (
                        <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-500">
                          <div className="flex-1 p-4">
                            <div className="flex gap-3 mb-4">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot size={16} className="text-[#4F46E5]"/>
                              </div>
                              <div className="bg-blue-50 p-3 rounded-2xl rounded-tl-none text-sm text-slate-700 max-w-[85%]">
                                Xin chào, tôi là trợ lý AI.
                              </div>
                            </div>
                          </div>
                          <div className="p-4 border-t bg-white sticky bottom-0">
                            <div className="relative">
                              <input
                                placeholder="Hỏi AI..."
                                className="w-full pl-4 pr-10 py-3 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                              />
                              <Send
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F46E5] cursor-pointer hover:scale-110 transition-transform"
                              />
                            </div>
                          </div>
                        </div>
                    )}
                </div>

                {/* --- NOTE DISCLAIMER --- */}
                <div className="py-3 text-center text-[10px] text-slate-400 bg-white border-t border-slate-100 shrink-0 select-none">
                    Agreeme can make mistakes. Check important info.
                </div>
            </div>
        </div>
      </div>

      {/* --- DIALOG XÁC NHẬN (POPUP) --- */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle size={20}/> Lưu thay đổi?
            </DialogTitle>
            <DialogDescription>
              Bạn chưa lưu kết quả phân tích của hợp đồng <strong>"{fileName}"</strong>. 
              Bạn có muốn lưu lại trước khi tải lên tài liệu mới không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Hủy bỏ
            </Button>
            <Button
              variant="destructive"
              className="bg-red-100 text-red-600 hover:bg-red-200 border-none shadow-none"
              onClick={() => confirmReset(false)}
            >
              Không lưu
            </Button>
            <Button
              onClick={() => confirmReset(true)}
              className="bg-[#4F46E5] hover:bg-blue-700"
            >
              Lưu và Tiếp tục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default DeepAnalysis;
