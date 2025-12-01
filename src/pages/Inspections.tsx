import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, MoreHorizontal, ChevronLeft, ChevronRight, 
  FileText, Trash2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Định nghĩa kiểu dữ liệu
interface Contract {
  id: number;
  name: string;
  type: string;
  score: number;
  timestamp: string;
  status: string;
  docNumber: string;
}

const Inspections = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // --- LOAD DỮ LIỆU ---
  useEffect(() => {
    const savedData = localStorage.getItem('saved_contracts');
    if (savedData) {
      setContracts(JSON.parse(savedData));
    } else {
      // DỮ LIỆU MẪU MỚI (CẬP NHẬT ĐỂ DEMO MÀU XANH/ĐỎ)
      const now = new Date();
      const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000); 

      const mockData = [
        {
          id: 1,
          name: "Thỏa thuận bảo mật thông tin (NDA)",
          type: "Contract Analysis",
          score: 95, // Điểm cao -> Màu xanh
          timestamp: now.toISOString(),
          status: "Completed",
          docNumber: "DOC-9001"
        },
        {
          id: 2,
          name: "TEST 1 - LC.pdf",
          type: "Contract Analysis",
          score: 72, // Điểm TB -> Màu cam
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          status: "In Progress",
          docNumber: "DOC-2500"
        },
        {
          id: 3,
          name: "Hợp đồng thuê nhà xưởng cũ",
          type: "Contract Analysis",
          score: 45, // Điểm thấp -> Màu đỏ
          timestamp: yesterday.toISOString(),
          status: "Completed",
          docNumber: "DOC-3624"
        }
      ];
      
      setContracts(mockData);
      localStorage.setItem('saved_contracts', JSON.stringify(mockData)); // Lưu mẫu vào luôn
    }
  }, []);

  // --- FORMAT THỜI GIAN ---
  const formatDisplayTime = (isoString: string) => {
    if (!isoString) return "";
    
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime(); 
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
        if (diffHours < 1) {
             const diffMinutes = Math.floor(diffMs / (1000 * 60));
             return diffMinutes <= 0 ? "Just now" : `${diffMinutes} mins ago`;
        }
        return `${Math.floor(diffHours)} hours ago`;
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // --- CONTINUE ---
  const handleContinue = (contract: Contract) => {
    localStorage.setItem('contract_analysis_state', 'done');
    localStorage.setItem('contract_filename', contract.name);
    navigate('/deep-analysis');
  };

  const handleDelete = (id: number) => {
    if(confirm("Bạn có chắc muốn xóa bản ghi này?")) {
        const newList = contracts.filter(c => c.id !== id);
        setContracts(newList);
        localStorage.setItem('saved_contracts', JSON.stringify(newList));
    }
  }

  const filteredContracts = contracts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1400px] mx-auto font-sans text-slate-700">
      
      {/* HEADER (ĐÃ XÓA NÚT START INSPECTION) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1e1b4b]">Inspections</h1>
      </div>

      {/* TOOLBAR */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
                placeholder="Search" 
                className="pl-9 bg-white border-slate-300 h-10 rounded-lg" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <button className="flex items-center gap-1 text-[#4F46E5] font-medium text-sm hover:underline">
            <Plus size={16}/> Add filter
        </button>
        <div className="ml-auto text-xs text-slate-500 font-medium">
            1 - {filteredContracts.length} of {filteredContracts.length} results
        </div>
        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20}/></button>
      </div>

      {/* TABLE LIST */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden min-h-[400px]">
        
        {/* Table Header */}
        <div className="flex items-center p-3 bg-gray-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="w-10 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded border-gray-300"/></div>
            <div className="flex-1 px-4">Inspection</div>
            <div className="w-32 text-right pr-8">Doc Number</div>
            <div className="w-24 text-center">Score</div>
            <div className="w-32 text-center">Conducted</div>
            <div className="w-32 text-center">Completed</div>
            <div className="w-10"></div>
        </div>

        {/* Table Body */}
        <div>
            {filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => (
                    <div key={contract.id} className="group flex items-center p-4 border-b border-slate-100 hover:bg-blue-50/30 transition-colors last:border-0 h-20">
                        {/* Checkbox */}
                        <div className="w-10 flex justify-center">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"/>
                        </div>

                        {/* Inspection Info */}
                        <div className="flex-1 px-4 flex items-center gap-4">
                            <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0 text-[#4F46E5] font-bold text-xs shadow-sm">
                                DTZ
                            </div>
                            <div>
                                <h3 
                                    className="text-sm font-bold text-slate-800 mb-0.5 cursor-pointer hover:text-[#4F46E5]"
                                    onClick={() => handleContinue(contract)}
                                >
                                    {contract.name}
                                </h3>
                                <p className="text-xs text-slate-500">{contract.type}</p>
                            </div>
                        </div>

                        {/* Doc Number */}
                        <div className="w-32 text-right pr-8 text-xs text-slate-400 font-mono">
                            {contract.docNumber}
                        </div>

                        {/* Score (LOGIC MÀU SẮC) */}
                        <div className="w-24 flex justify-center">
                            <span className={`text-sm font-bold ${
                                contract.score >= 80 ? 'text-green-600' : 
                                (contract.score >= 60 ? 'text-orange-600' : 'text-red-600')
                            }`}>
                                {contract.score}%
                            </span>
                        </div>

                        {/* Conducted Date */}
                        <div className="w-32 text-center text-xs text-slate-500">
                            {formatDisplayTime(contract.timestamp)}
                        </div>

                        {/* Status / Action */}
                        <div className="w-32 flex justify-center">
                            <span 
                                onClick={() => handleContinue(contract)}
                                className="text-xs font-bold text-[#4F46E5] hover:underline cursor-pointer"
                            >
                                {contract.status === 'Completed' ? "View report" : "Continue"}
                            </span>
                        </div>

                        {/* Menu Action */}
                        <div className="w-10 flex justify-center relative">
                             <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 group-hover:block hidden" onClick={() => handleDelete(contract.id)}>
                                <Trash2 size={16} />
                             </button>
                             <button className="text-slate-400 hover:text-slate-600 p-1 group-hover:hidden block">
                                <MoreHorizontal size={18} />
                             </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <FileText size={48} className="mb-4 opacity-20"/>
                    <p>Chưa có hợp đồng nào được lưu.</p>
                </div>
            )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end items-center mt-6 gap-2">
            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 text-slate-500">
                <ChevronLeft size={16} />
            </button>
            <div className="flex items-center">
                <input 
                    type="text" 
                    defaultValue="1" 
                    className="w-8 h-8 border border-slate-200 text-center text-sm rounded hover:border-[#4F46E5] focus:outline-none focus:border-[#4F46E5] mx-2" 
                />
                <span className="text-slate-500 text-sm">/ 1</span>
            </div>
            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 text-slate-500">
                <ChevronRight size={16} />
            </button>
      </div>
    </div>
  );
};

export default Inspections;