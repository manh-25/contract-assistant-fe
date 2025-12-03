
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, List, Search, FileText, Star, Briefcase, Building, Home, Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { useAuth, UserDraft } from '@/contexts/AuthContext';
import { templateLibrary, ContractTemplate } from '@/data/template-library';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// --- Main Component ---
export const Library = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  const [layout, setLayout] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [previewingTemplate, setPreviewingTemplate] = useState<ContractTemplate | null>(null);

  // --- Dynamic Categories from Library ---
  const categories = useMemo(() => {
    const allCats = templateLibrary.map(t => t.category);
    const uniqueCats = [...new Set(allCats)];
    return [
      { id: 'all', name: 'Tất cả' },
      ...uniqueCats.map(cat => ({ id: cat, name: cat }))
    ];
  }, []);

  // --- Filtering Logic ---
  const filteredTemplates = templateLibrary.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- Handlers ---
  const handleUseTemplate = async () => {
    if (!previewingTemplate || !user) return;

    const newDraft: UserDraft = {
      id: `draft_${Date.now()}`,
      originalTemplateId: previewingTemplate.id,
      name: `Bản nháp - ${previewingTemplate.name}`,
      content: previewingTemplate.content,
      lastSaved: new Date().toISOString(),
    };

    const updatedTemplates = [...user.templates, newDraft];
    const result = await updateUserProfile({ templates: updatedTemplates });

    if (!result.error) {
      setPreviewingTemplate(null); // Close the modal
      navigate(`/templates/edit/${newDraft.id}`); // Navigate to the new editor
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    switch(categoryName) {
        case 'Kinh doanh': return Briefcase;
        case 'Bất động sản': return Home;
        case 'Nhân sự': return Users;
        case 'Pháp lý': return Briefcase; // Or another suitable icon
        default: return FileText;
    }
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto font-sans">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Template Library</h1>
        <p className="text-lg text-gray-500 mt-2">Bắt đầu với các mẫu hợp đồng được tạo sẵn bởi Agreeme</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            placeholder="Tìm kiếm mẫu hợp đồng..." 
            className="pl-10 h-11" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <Button variant={layout === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setLayout('grid')}><LayoutGrid /></Button>
          <Button variant={layout === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setLayout('list')}><List /></Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
          
        {/* Sidebar - Categories */}
        <div className="w-full md:w-56 space-y-2">
            {categories.map(cat => (
              <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      activeCategory === cat.id ? "bg-[#4f46e5]/10 text-[#4f46e5]" : "hover:bg-gray-100 text-gray-600"
                  )}
              >
                  {cat.id === 'all' ? <LayoutGrid size={18} /> : React.createElement(getCategoryIcon(cat.name), { size: 18 })}
                  {cat.name}
              </button>
            ))}
        </div>

        {/* Template Grid/List */}
        <div className="flex-1">
          <div className={cn(
            "grid gap-5",
            layout === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}>
            {filteredTemplates.map((template) => {
              const Icon = getCategoryIcon(template.category);
              return (
                <div 
                  key={template.id}
                  className={cn(
                    "bg-white border rounded-lg overflow-hidden transition-all hover:shadow-md flex flex-col",
                    layout === 'list' && 'flex-row'
                  )}
                >
                  <div className={cn("p-5 border-b flex-grow", layout === 'list' && 'border-b-0 border-r w-2/3')}>
                     <div className='flex items-start gap-4'>
                        <div className='w-12 h-12 bg-[#4f46e5]/10 text-[#4f46e5] rounded-lg flex items-center justify-center shrink-0'>
                            <Icon size={24} />
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-gray-800 truncate">{template.name}</h3>
                           <p className="text-sm text-gray-500 mt-1">{template.category}</p>
                        </div>
                     </div>
                     <p className="text-sm text-gray-600 mt-4 h-12 line-clamp-2">{template.description}</p>
                  </div>
                   <div className={cn("p-4 bg-gray-50/70 border-t mt-auto", layout === 'list' && 'border-t-0 pl-0 w-1/3 flex items-center')}>
                     <Button onClick={() => setPreviewingTemplate(template)} className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white">
                        Sử dụng mẫu
                     </Button>
                   </div>
                </div>
              );
            })}
          </div>
           {filteredTemplates.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
                <FileText className="mx-auto text-gray-400" size={40} />
                <h3 className="mt-4 text-lg font-semibold text-gray-700">Không tìm thấy mẫu nào</h3>
                <p className="mt-1 text-sm text-gray-500">Hãy thử tìm kiếm với từ khóa khác hoặc chọn một danh mục khác.</p>
            </div>
           )}
        </div>
      </div>

      {/* Preview Modal */}
       <Dialog open={!!previewingTemplate} onOpenChange={(isOpen) => !isOpen && setPreviewingTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{previewingTemplate?.name}</DialogTitle>
            <DialogDescription>{previewingTemplate?.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[50vh] overflow-y-auto p-4 bg-gray-50 rounded-md border">
            <div dangerouslySetInnerHTML={{ __html: previewingTemplate?.content || '' }} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Hủy</Button>
            </DialogClose>
            <Button onClick={handleUseTemplate} className="bg-[#4f46e5] hover:bg-[#4338ca]">
              Sử dụng mẫu này
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};
