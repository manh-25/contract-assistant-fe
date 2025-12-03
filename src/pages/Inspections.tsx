
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, MoreHorizontal, FileText, Trash2, Eye, ShieldCheck, ShieldAlert, AlertTriangle, ScanSearch, FileUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, UserInspection } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';


export const Inspections = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile, loading } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingInspection, setViewingInspection] = useState<UserInspection | null>(null);
  const [deletingInspection, setDeletingInspection] = useState<UserInspection | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleActionClick = (inspection: UserInspection) => {
    if (inspection.score > -1 && inspection.analysisData) {
      // Navigate to DeepAnalysis page with the analysis data
      navigate('/deep-analysis', { 
        state: { 
          analysisData: inspection.analysisData, 
          fileName: inspection.name 
        } 
      });
    } else {
      // Open the file viewer dialog
      setViewingInspection(inspection);
    }
  };
  
  const handleNewAnalysis = () => {
    const savedAnalysis = localStorage.getItem('current_analysis');
    if (savedAnalysis) {
      setIsConfirmOpen(true);
    } else {
      navigate('/deep-analysis');
    }
  };

  const confirmNavigation = () => {
    localStorage.removeItem('current_analysis');
    localStorage.removeItem('current_analysis_filename');
    navigate('/deep-analysis');
    setIsConfirmOpen(false);
  };

  const handleDelete = async () => {
    if (!user || !deletingInspection) return;

    const updatedInspections = user.inspections.filter(i => i.id !== deletingInspection.id);
    const { error } = await updateUserProfile({ inspections: updatedInspections });

    if (!error) {
      toast({ title: "Đã xóa thành công!" });
      setDeletingInspection(null);
    } else {
      toast({ title: "Lỗi", description: "Không thể xóa.", variant: "destructive" });
    }
  };

  const getScoreDisplay = (score: number) => {
    if (score < 0) {
      return <span className="font-medium text-slate-500 flex items-center gap-2"><ShieldAlert size={16}/>Chưa phân tích</span>;
    }
    const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-600';
    return <span className={cn('font-bold flex items-center gap-2', scoreColor)}><ShieldCheck size={16}/>{score}%</span>;
  };
  
  if (loading) {
      return <div className="p-6 text-center">Đang tải dữ liệu...</div>;
  }

  const sortedInspections = user?.inspections.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];

  const filteredInspections = sortedInspections.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-6 max-w-[1400px] mx-auto font-sans text-slate-700">
        
        <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-2xl font-bold text-gray-800">Lịch sử phân tích</h1>
              <p className="text-gray-500 text-sm mt-1">Xem lại và quản lý các hợp đồng đã được phân tích.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/library')} variant="outline" className="gap-2">
                <FileUp size={16} /> Tạo hợp đồng từ mẫu
            </Button>
            <Button onClick={handleNewAnalysis} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <Plus size={16} /> Phân tích tài liệu mới
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 bg-white p-2 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                  placeholder="Tìm kiếm theo tên..." 
                  className="pl-9 border-none shadow-none focus-visible:ring-0 bg-transparent h-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200/80">
                  <tr>
                      <th className="px-6 py-4 font-semibold text-slate-600">Tên hợp đồng</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 w-40">Điểm rủi ro</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 w-40">Ngày tạo</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 w-24 text-right">Hành động</th>
                  </tr>
              </thead>
              {filteredInspections.length > 0 && (
                <tbody className="divide-y divide-slate-100">
                    {filteredInspections.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                                <a onClick={() => handleActionClick(item)} className="flex items-center gap-3 cursor-pointer">
                                    <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText size={16} />
                                    </div>
                                    <span className="font-medium text-slate-800 hover:text-indigo-600">{item.name}</span>
                                </a>
                            </td>
                            <td className="px-6 py-4 text-slate-500">{getScoreDisplay(item.score)}</td>
                            <td className="px-6 py-4 text-slate-500">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: vi })}</td>
                            <td className="px-6 py-4 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 data-[state=open]:bg-slate-100">
                                            <MoreHorizontal size={18} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleActionClick(item)}>
                                            <Eye className="mr-2 h-4 w-4" /> {item.score > -1 ? 'Xem lại phân tích' : 'Xem nội dung'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setDeletingInspection(item)} className="text-red-500 focus:text-red-500">
                                            <Trash2 className="mr-2 h-4 w-4" /> Xóa
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
              )}
          </table>
          {filteredInspections.length === 0 && (
             <div className="p-16 text-center text-slate-500">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Search size={32} className="text-slate-400"/></div>
                <h3 className="font-semibold text-lg">Không có phân tích nào</h3>
                <p className="text-sm mt-1 mb-4">Các hợp đồng bạn phân tích sẽ được lưu trữ tại đây để tiện cho việc tra cứu.</p>
                 <Button onClick={handleNewAnalysis} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <Plus size={16}/> Phân tích ngay
                </Button>
              </div>
          )}
        </div>
      </div>

      {/* View (unscored) Inspection Content Dialog */}
      <Dialog open={!!viewingInspection} onOpenChange={() => setViewingInspection(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewingInspection?.name}</DialogTitle>
            <DialogDescription>Tài liệu này chưa được phân tích. Bạn chỉ có thể xem nội dung hoặc bắt đầu phân tích nó.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[70vh] overflow-y-auto p-4 bg-gray-50 rounded-md border prose max-w-none">
             <div dangerouslySetInnerHTML={{ __html: viewingInspection?.content || '' }} />
          </div>
          <DialogFooter className="sm:justify-between gap-2">
             <Button 
                onClick={() => {
                  // Here we can pass the content to the analysis page if we enhance it to accept content directly
                  // For now, it just navigates, and the user has to re-upload.
                  navigate('/deep-analysis');
                  setViewingInspection(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <ScanSearch size={16}/> Phân tích tài liệu này
              </Button>
            <Button type="button" variant="outline" onClick={() => setViewingInspection(null)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingInspection} onOpenChange={() => setDeletingInspection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/> Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa <strong>"{deletingInspection?.name}"</strong>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingInspection(null)}>Hủy</Button>
            <Button variant="destructive" onClick={handleDelete}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Phân tích chưa được lưu</AlertDialogTitle>
            <AlertDialogDescription>Có một phân tích đang thực hiện chưa được lưu. Bạn có muốn hủy bỏ và bắt đầu phân tích mới không?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ở lại</AlertDialogCancel>
            <AlertDialogAction onClick={confirmNavigation}>Hủy bỏ & Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Inspections; 
