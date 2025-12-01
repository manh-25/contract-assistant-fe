import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Plus, Search, MoreHorizontal, Edit, Trash2, Play 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Template {
  id: number;
  title: string;
  category: string;
  lastModified: string;
  author: string;
}

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // --- LOAD TEMPLATES (Giả lập lấy từ LocalStorage hoặc API) ---
  useEffect(() => {
    // Dữ liệu mẫu ban đầu (những cái user đã lưu từ Library)
    const initialData = [
      { id: 1, title: "Hợp đồng Lao động", category: "Nhân sự", lastModified: "2 hours ago", author: "Agreeme" },
      { id: 2, title: "Hợp đồng Thuê nhà", category: "Bất động sản", lastModified: "1 day ago", author: "Admin" },
    ];
    
    // Kiểm tra localStorage xem có template nào user mới lưu không
    const savedTemplates = localStorage.getItem('user_templates');
    if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
    } else {
        setTemplates(initialData);
        localStorage.setItem('user_templates', JSON.stringify(initialData));
    }
  }, []);

  // --- HÀM XÓA TEMPLATE ---
  const handleDelete = (id: number) => {
    const newTemplates = templates.filter(t => t.id !== id);
    setTemplates(newTemplates);
    localStorage.setItem('user_templates', JSON.stringify(newTemplates));
  };

  // --- HÀM TẠO MỚI ---
  const handleCreateNew = () => {
    // Chuyển hướng sang trang soạn thảo với mode = 'new'
    navigate('/templates/create?mode=new');
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto font-sans text-slate-700">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-[#1e1b4b]">My Templates</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your custom templates and saved forms.</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-[#4F46E5] hover:bg-blue-700 text-white gap-2">
            <Plus size={18} /> Create Template
        </Button>
      </div>

      {/* TOOLBAR */}
      <div className="flex items-center gap-4 mb-6 bg-white p-2 rounded-lg border border-slate-200">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
                placeholder="Search templates..." 
                className="pl-9 border-none shadow-none focus-visible:ring-0" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* TABLE LIST */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4 font-semibold text-slate-600">Template Name</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 w-40">Category</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 w-40">Author</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 w-40">Last Modified</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 w-20 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {templates.map((template) => (
                    <tr key={template.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 text-[#4F46E5] rounded flex items-center justify-center">
                                    <FileText size={16} />
                                </div>
                                <span className="font-medium text-slate-800 cursor-pointer hover:text-[#4F46E5]" onClick={() => navigate(`/templates/create?id=${template.id}`)}>
                                    {template.title}
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                                {template.category}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{template.author}</td>
                        <td className="px-6 py-4 text-slate-500">{template.lastModified}</td>
                        <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate(`/templates/create?id=${template.id}`)}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(template.id)} className="text-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {templates.length === 0 && (
            <div className="p-10 text-center text-slate-400">No templates found. Create one or get from Library.</div>
        )}
      </div>
    </div>
  );
};

export default Templates;