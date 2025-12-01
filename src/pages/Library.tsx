import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. IMPORT MAMMOTH
import mammoth from 'mammoth'; 
import { 
  Search, Filter, ChevronDown, FileText, 
  BookOpen, Download, Star, ShieldCheck, Plus, Upload, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Template {
  id: number;
  title: string;
  category: string;
  author: string;
  downloads: string;
  description: string;
  color: string;
  fileName?: string;
  fileContent?: string; // 2. Thêm trường này để lưu nội dung file
}

const Library = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isProcessing, setIsProcessing] = useState(false); // State loading khi đọc file

  // Dữ liệu mẫu (Giữ nguyên hoặc xóa bớt)
  const initialData: Template[] = [
    {
      id: 1, title: "Hợp đồng Lao động", category: "Nhân sự", author: "Agreeme", downloads: "5k+", 
      description: "Mẫu chuẩn bộ luật lao động.", color: "from-blue-400 to-indigo-500",
      fileContent: "<p><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br/>Độc lập - Tự do - Hạnh phúc</p><h3>HỢP ĐỒNG LAO ĐỘNG</h3><p>Hôm nay ngày...</p>"
    }
  ];

  useEffect(() => {
    const savedTemplates = localStorage.getItem('library_templates');
    if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
    } else {
        setTemplates(initialData);
        localStorage.setItem('library_templates', JSON.stringify(initialData));
    }
  }, []);

  // --- 3. HÀM XỬ LÝ UPLOAD VÀ ĐỌC FILE ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsProcessing(true);

      try {
        let extractedHtml = "";

        // Kiểm tra nếu là file .docx thì mới đọc
        if (file.name.endsWith('.docx')) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            extractedHtml = result.value; // Đây là nội dung HTML của file Word
        } else {
            extractedHtml = "<p><i>(Không thể xem trước nội dung file này. Vui lòng tải file .docx để xem chi tiết)</i></p>";
        }

        const newTemplate: Template = {
          id: Date.now(),
          title: file.name.replace(/\.[^/.]+$/, ""),
          category: "Cá nhân",
          author: "Admin",
          downloads: "0",
          description: `File tải lên: ${file.name}`,
          color: "from-emerald-400 to-teal-500",
          fileName: file.name,
          fileContent: extractedHtml // Lưu nội dung vào đây
        };

        const updatedList = [newTemplate, ...templates];
        setTemplates(updatedList);
        localStorage.setItem('library_templates', JSON.stringify(updatedList));
      
      } catch (error) {
        console.error("Lỗi đọc file:", error);
        alert("Có lỗi khi đọc file Word. Hãy đảm bảo file không bị hỏng.");
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const categories = ["Tất cả", "Nhân sự", "Bất động sản", "Thương mại", "Pháp lý", "Cá nhân"];
  const filteredTemplates = templates.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "Tất cả" || item.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans pb-20">
      <div className="bg-gradient-to-r from-indigo-100 via-blue-50 to-white pt-10 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-[#1e1b4b]">Thư viện hợp đồng của bạn</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Tải lên file .DOCX để hệ thống tự động trích xuất nội dung.</p>

          <div className="flex flex-col md:flex-row items-center gap-3 max-w-3xl mx-auto mt-8 bg-white p-2 rounded-xl shadow-lg border border-slate-100">
            {/* ... (Phần Filter và Search giữ nguyên) ... */}
            <div className="relative group w-full md:w-48"><button className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">{selectedCategory}<ChevronDown size={16} className="text-slate-400"/></button><div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">{categories.map(cat => (<div key={cat} onClick={() => setSelectedCategory(cat)} className="px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-[#4F46E5] cursor-pointer first:rounded-t-lg last:rounded-b-lg">{cat}</div>))}</div></div>
            <div className="flex-1 relative w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" /><input type="text" placeholder="Tìm kiếm..." className="w-full pl-10 pr-4 py-3 bg-white text-slate-700 focus:outline-none text-sm placeholder:text-slate-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div>

            {/* Nút Upload đã thêm Loading */}
            <input type="file" ref={fileInputRef} className="hidden" accept=".docx" onChange={handleFileUpload}/>
            <Button onClick={() => fileInputRef.current?.click()} disabled={isProcessing} className="w-full md:w-auto bg-[#4F46E5] hover:bg-blue-700 text-white h-11 px-6 rounded-lg font-semibold gap-2">
                {isProcessing ? <Loader2 className="animate-spin" /> : <Upload size={18} />} 
                {isProcessing ? "Đang xử lý..." : "Upload .DOCX"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* ... (Phần Stats giữ nguyên) ... */}
        
        <div className="mb-6 flex justify-between items-end"><div><h2 className="text-2xl font-bold text-slate-800">All Templates</h2></div></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
                <div key={template.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div className={`h-32 bg-gradient-to-r ${template.color} relative`}><div className="absolute -bottom-6 left-6"><div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center border border-slate-100"><FileText className="text-slate-700" /></div></div></div>
                    <div className="p-6 pt-10 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">{template.category === 'Cá nhân' ? 'MY FILE' : 'TEMPLATE'}</span></div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-[#4F46E5] transition-colors line-clamp-2">{template.title}</h3>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-3 leading-relaxed flex-1">{template.description}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mb-4"><span>By {template.author}</span></div>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                            <div className="flex flex-col"><span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-medium w-fit mb-1">Editable</span><span className="text-xs text-slate-400 flex items-center gap-1"><Download size={12}/> {template.downloads}</span></div>
                            
                            {/* Nút Use chuyển ID sang trang Create */}
                            <Button onClick={() => navigate(`/templates/create?templateId=${template.id}`)} className="bg-[#4F46E5] hover:bg-blue-700 text-white h-9 px-5 rounded-lg text-xs font-bold shadow-blue-200 shadow-md">Use</Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Library;