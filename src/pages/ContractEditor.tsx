
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, UserDraft, UserInspection } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { File, Save, Trash2, X, Wand2, Check, Download } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';
import {
  AlertDialog,
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

const RichTextEditor = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  return (
    <div className="w-full flex-1 min-h-0 border rounded-lg bg-white p-4 overflow-y-auto shadow-sm">
      <div 
        contentEditable 
        suppressContentEditableWarning
        className="outline-none prose max-w-none prose-p:my-2 prose-headings:my-4"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
};

const AiPanel = ({ onGenerate, onClose }: { onGenerate: (text: string) => void, onClose: () => void }) => {
    const [prompt, setPrompt] = useState('');
    const handleGenerate = () => {
      const generatedText = `<p><b>Nội dung được tạo bởi AI dựa trên prompt:</b> "${prompt}"</p><p>...</p>`;
      onGenerate(generatedText);
      setPrompt('');
    };
    return (
      <div className="absolute top-0 right-0 h-full w-[400px] bg-white border-l shadow-2xl z-20 flex flex-col p-4 transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2"><Wand2 size={20}/> Trợ lý AI</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X size={20}/></Button>
        </div>
        <div className="flex-1 flex flex-col">
          <p className="text-sm text-slate-600 mb-4">Nhập yêu cầu của bạn để AI có thể giúp bạn soạn thảo.</p>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ví dụ: thêm điều khoản về việc không tiết lộ thông tin..."
            className="w-full flex-1 p-3 border rounded-md resize-none focus:ring-2 focus:ring-indigo-500 outline-none" />
          <Button onClick={handleGenerate} className="mt-4 bg-indigo-600 hover:bg-indigo-700"><Wand2 size={16} className="mr-2"/> Tạo nội dung</Button>
        </div>
      </div>
    );
  }

export const ContractEditor = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const navigate = useNavigate();
  const { user, updateUserProfile, loading } = useAuth();
  const { toast } = useToast();

  const [draft, setDraft] = useState<UserDraft | null>(null);
  const [content, setContent] = useState('');
  const [draftName, setDraftName] = useState('');
  const [isSaveAlertOpen, setIsSaveAlertOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isAiPanelOpen, setAiPanelOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (loading) return;
    const currentDraft = user?.templates.find(t => t.id === draftId);
    if (currentDraft) {
      setDraft(currentDraft);
      setContent(currentDraft.content);
      setDraftName(currentDraft.name);
      setIsReady(true);
    } else {
      navigate('/templates', { replace: true });
    }
  }, [draftId, user?.templates, navigate, loading]);

  const handleSaveDraft = useCallback(async () => {
    if (!user || !draft) return;
    setSaveStatus('saving');
    const updatedDraft: UserDraft = { ...draft, name: draftName, content, lastSaved: new Date().toISOString() };
    const updatedTemplates = user.templates.map(t => t.id === draft.id ? updatedDraft : t);
    const { error } = await updateUserProfile({ templates: updatedTemplates });
    if (!error) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('idle');
      toast({ title: "Lỗi", description: "Không thể lưu bản nháp.", variant: 'destructive' });
    }
  }, [user, draft, draftName, content, updateUserProfile, toast]);

  // FULLY IMPLEMENTED SAVE TO INSPECTIONS FUNCTION
  const handleSaveToInspections = async (deleteDraft: boolean) => {
    if (!user || !draft) return;
    const newInspection: UserInspection = {
        id: `insp_${Date.now()}`,
        name: draftName,
        content: content,
        score: -1,
        createdAt: new Date().toISOString(),
    };
    const updatedInspections = [...user.inspections, newInspection];
    const updatedTemplates = deleteDraft 
      ? user.templates.filter(t => t.id !== draft.id) 
      : user.templates;

    const { error } = await updateUserProfile({ inspections: updatedInspections, templates: updatedTemplates });
    
    setIsSaveAlertOpen(false);

    if (!error) {
        toast({ title: "Thành công!", description: `"${draftName}" đã được lưu vào mục Inspections.` });
        navigate('/inspections');
    } else {
        toast({ title: "Lỗi", description: "Không thể lưu vào Inspections.", variant: "destructive" });
    }
  }

  // FULLY IMPLEMENTED DELETE DRAFT FUNCTION
  const handleDeleteDraft = async () => {
      if (!user || !draft || !window.confirm(`Bạn có chắc muốn xóa vĩnh viễn bản nháp "${draftName}"?`)) return;

      const updatedTemplates = user.templates.filter(t => t.id !== draft.id);
      const { error } = await updateUserProfile({ templates: updatedTemplates });

      if (!error) {
        toast({ title: "Đã xóa bản nháp!" });
        navigate('/templates', { replace: true });
      } else {
        toast({ title: "Lỗi", description: "Không thể xóa bản nháp.", variant: "destructive" });
      }
  }
  
  const handleExport = async (format: 'pdf' | 'docx' | 'html' | 'txt') => {
    const name = draftName || 'document';
    const htmlContent = content;

    switch (format) {
      case 'pdf': {
        toast({ title: "Đang xuất PDF...", description: "Vui lòng đợi trong giây lát." });
        try {
            const { default: jsPDF } = await import('jspdf');
            const { default: html2canvas } = await import('html2canvas');

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            tempDiv.style.width = '800px';
            tempDiv.style.padding = '20px';
            tempDiv.style.background = 'white';
            document.body.appendChild(tempDiv);

            const canvas = await html2canvas(tempDiv, { scale: 2 });
            document.body.removeChild(tempDiv);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'px', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / pdfWidth;
            const scaledHeight = canvasHeight / ratio;

            let position = 0;
            let heightLeft = scaledHeight;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - scaledHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`${name}.pdf`);
            toast({ title: "Đã xuất thành công!", description: `Tệp ${name}.pdf đã được tải xuống.` });
        } catch(e) {
            console.error(e);
            toast({ title: "Lỗi", description: "Không thể xuất ra PDF. Hãy chắc chắn bạn đã cài đặt các thư viện jspdf và html2canvas.", variant: "destructive" });
        } 
        break;
      }
      case 'docx': {
        toast({ title: "Đang xuất DOCX...", description: "Vui lòng đợi trong giây lát." });
        try {
            const { default: asBlob } = await import('html-to-docx');
            const blob = await asBlob(htmlContent, {
                title: name,
                header: true,
                footer: true,
                margins: {
                    top: 720,
                    right: 720,
                    bottom: 720,
                    left: 720,
                    header: 360,
                    footer: 360,
                    gutter: 0
                }
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${name}.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast({ title: "Đã xuất thành công!", description: `Tệp ${name}.docx đã được tải xuống.` });
        } catch (e) {
            console.error(e);
            toast({ title: "Lỗi", description: "Không thể xuất ra DOCX. Hãy chắc chắn bạn đã cài đặt thư viện html-to-docx.", variant: "destructive" });
        }
        break;
      }
      case 'html': {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Đã xuất thành công!", description: `Tệp ${name}.html đã được tải xuống.` });
        break;
      }
      case 'txt': {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Đã xuất thành công!", description: `Tệp ${name}.txt đã được tải xuống.` });
        break;
      }
    }
  };

  const handleAiGenerate = (text: string) => {
    setContent(currentContent => `${currentContent}${text}`);
    setAiPanelOpen(false);
    toast({ title: "Đã thêm nội dung AI!" });
  }

  if (!isReady) return <div className="flex h-screen w-full items-center justify-center">Đang tải...</div>;

  return (
    <div className="h-screen bg-gray-100 flex flex-col relative overflow-hidden">
      <header className="bg-white border-b p-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3 w-1/2">
          <Button variant="outline" size="icon" onClick={() => navigate('/templates')} className="h-8 w-8"><X size={16}/></Button>
          <File className="text-indigo-600 shrink-0" />
          <Input value={draftName} onChange={(e) => setDraftName(e.target.value)} className="font-semibold text-lg border-none focus-visible:ring-0 shadow-none p-0 h-auto truncate" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 w-28 pr-2">
            {saveStatus === 'saving' && <span className="text-sm text-slate-500 animate-pulse">Đang lưu...</span>}
            {saveStatus === 'saved' && <span className="text-sm text-green-600 flex items-center gap-1"><Check size={16}/> Đã lưu!</span>}
          </div>
          <Button variant="ghost" size="sm" onClick={handleDeleteDraft} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4 mr-2"/> Xóa</Button>
          <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={saveStatus === 'saving'}><Save className="w-4 h-4 mr-2"/> Lưu nháp</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Xuất</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>PDF (.pdf)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('docx')}>Word (.docx)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('html')}>HTML (.html)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('txt')}>Plain Text (.txt)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsSaveAlertOpen(true)}>Hoàn tất & Lưu</Button>
        </div>
      </header>

      <main className={cn("flex-1 p-4 flex flex-col min-h-0 transition-all duration-300 ease-in-out", isAiPanelOpen ? "mr-[400px]" : "mr-0")}>
        <div className="h-full w-full flex flex-col min-h-0 max-w-4xl mx-auto">
          <h2 className="text-sm font-semibold mb-2 text-gray-600 px-1 shrink-0">NỘI DUNG HỢP ĐỒNG</h2>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </main>

      {isAiPanelOpen && <AiPanel onGenerate={handleAiGenerate} onClose={() => setAiPanelOpen(false)} />}
      {!isAiPanelOpen && (
        <Button onClick={() => setAiPanelOpen(true)} className="absolute bottom-6 right-6 rounded-full h-12 px-5 shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 font-semibold">
          <Wand2 size={18} />
          Mở Trợ lý AI
        </Button>
      )}

      <AlertDialog open={isSaveAlertOpen} onOpenChange={setIsSaveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hoàn tất và lưu vào Inspections?</AlertDialogTitle>
            <AlertDialogDescription>Chọn một trong hai tùy chọn bên dưới:</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2 mt-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => handleSaveToInspections(true)}>
                <h4 className="font-semibold">Chuyển vào Inspections</h4>
                <p className="text-sm text-gray-600">Lưu tài liệu và xóa bản nháp này.</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => handleSaveToInspections(false)}>
                <h4 className="font-semibold">Lưu một bản sao</h4>
                <p className="text-sm text-gray-600">Giữ lại bản nháp này và tạo một bản sao trong Inspections.</p>
            </div>
          </div>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Hủy</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
