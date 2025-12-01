import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Download, FileText, User, Home, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { jsPDF } from 'jspdf';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// --- NỘI DUNG MOCKUP HỢP ĐỒNG (FULL) ---
const contractTemplateHtml = `
  <p style="text-align:center;"><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br><strong>Độc lập - Tự do - Hạnh phúc</strong></p>
  <h2 style="text-align:center; margin-top: 1.5rem; margin-bottom: 1.5rem;">HỢP ĐỒNG THUÊ CĂN HỘ NHÀ CHUNG CƯ</h2>
  <p>Hôm nay, ngày {{NGAY_KY}} tháng {{THANG_KY}} năm {{NAM_KY}}, tại {{DIA_DIEM_KY}}.</p>
  <p>Chúng tôi gồm:</p>
  <p><strong>BÊN CHO THUÊ (Sau đây gọi tắt là bên A):</strong></p>
  <p>Ông: {{BEN_A_ONG}}</p>
  <p>CMND số: {{BEN_A_CMND_ONG}}</p>
  
  <p><strong>BÊN THUÊ (Sau đây gọi tắt là bên B):</strong></p>
  <p>Ông: {{BEN_B_ONG}}</p>
  <p>CMND số: {{BEN_B_CMND_ONG}}</p>
  
  <p>Hai bên đồng ý thoả thuận việc ký kết Hợp đồng thuê căn hộ chung cư với các nội dung sau:</p>
  
  <p><strong>ĐIỀU 1: CĂN HỘ CHUNG CƯ CHO THUÊ</strong></p>
  <p>Bên A đồng ý cho bên B thuê căn hộ chung cư tại địa chỉ: Căn hộ số {{SO_NHA}}, tầng {{TANG}}, tòa nhà {{TOA_NHA}}, Khu chung cư {{KHU_CHUNG_CU}}.</p>
  <p>- Diện tích sàn căn hộ: {{DIEN_TICH}} m².</p>
  
  <p><strong>ĐIỀU 2: MỤC ĐÍCH THUÊ</strong></p>
  <p>Mục đích thuê là để ở.</p>
  
  <p><strong>ĐIỀU 3: THỜI HẠN THUÊ</strong></p>
  <p>Thời hạn thuê là {{THOI_HAN_THUE}}, kể từ ngày {{NGAY_BAT_DAU}} đến ngày {{NGAY_KET_THUC}}.</p>

  <p><strong>ĐIỀU 4: GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN</strong></p>
  <p>1. Giá thuê: {{GIA_THUE}} VNĐ/tháng.</p>
  <p>2. Tiền đặt cọc: {{TIEN_COC}} VNĐ.</p>
  
  <p><strong>ĐIỀU 5: TRÁCH NHIỆM VÀ QUYỀN CỦA CÁC BÊN</strong></p>
  <p>Quyền và Trách nhiệm của Bên A: Bàn giao căn hộ đúng thời hạn; Bảo đảm quyền sử dụng trọn vẹn của Bên B.</p>
  <p>Quyền và Trách nhiệm của Bên B: Sử dụng căn hộ đúng mục đích; Thanh toán tiền thuê đầy đủ, đúng hạn; Bảo quản, giữ gìn tài sản.</p>

  <p><strong>ĐIỀU 6: PHƯƠNG THỨC GIẢI QUYẾT TRANH CHẤP</strong></p>
  <p>Trong quá trình thực hiện Hợp đồng này, nếu phát sinh tranh chấp, các bên cùng nhau thương lượng giải quyết trên nguyên tắc tôn trọng quyền lợi của nhau; trong trường hợp không thương lượng được thì một trong hai bên có quyền khởi kiện để yêu cầu toà án có thẩm quyền giải quyết theo quy định của pháp luật.</p>

  <p><strong>ĐIỀU 7: CAM ĐOAN CỦA CÁC BÊN</strong></p>
  <p>Bên A và bên B chịu trách nhiệm trước pháp luật về những lời cam đoan sau đây: Những thông tin về nhân thân, về căn hộ nhà chung cư đã ghi trong Hợp đồng này là đúng sự thật.</p>

  <p><strong>ĐIỀU 8: ĐIỀU KHOẢN CUỐI CÙNG</strong></p>
  <p>Hai bên đã hiểu rõ quyền, nghĩa vụ, lợi ích hợp pháp của mình và hậu quả pháp lý của việc giao kết Hợp đồng này.</p>
  
  <div style="page-break-before: always;"></div>
  
  <table style="width: 100%; margin-top: 5rem; text-align: center; font-weight: bold; border: none; border-collapse: collapse;">
    <tr style="border: none;">
      <td style="border: none; padding-bottom: 5rem;">BÊN CHO THUÊ<br/>(Ký và ghi rõ họ tên)</td>
      <td style="border: none; padding-bottom: 5rem;">BÊN THUÊ<br/>(Ký và ghi rõ họ tên)</td>
    </tr>
    <tr style="border: none;">
      <td style="border: none;">{{BEN_A_ONG}}</td>
      <td style="border: none;">{{BEN_B_ONG}}</td>
    </tr>
  </table>
`;

const applyPlaceholders = (html: string, data: any): string => {
  let result = html;
  for (const key in data) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, data[key] || '...');
  }
  return result;
};

const CreateContract = () => {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "Hợp đồng thuê căn hộ chung cư", 
    NGAY_KY: new Date().getDate().toString(), THANG_KY: (new Date().getMonth() + 1).toString(), NAM_KY: new Date().getFullYear().toString(),
    DIA_DIEM_KY: "Thanh Hóa", BEN_A_ONG: "Nguyễn Trí Dũng", BEN_A_CMND_ONG: "", BEN_A_BA: "", BEN_A_CMND_BA: "",
    BEN_B_ONG: "", BEN_B_CMND_ONG: "", BEN_B_BA: "", BEN_B_CMND_BA: "",
    SO_NHA: "", TANG: "", TOA_NHA: "", KHU_CHUNG_CU: "", DIEN_TICH: "", DIEN_TICH_CHU: "",
    THOI_HAN_THUE: "", NGAY_BAT_DAU: "", NGAY_KET_THUC: "", GIA_THUE: "", TIEN_COC: ""
  });

  const renderedHtml = useMemo(() => applyPlaceholders(contractTemplateHtml, formData), [formData]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleConfirmSave = () => { /* Logic Lưu */ };
  const handleDownloadPdf = () => { /* Logic Xuất PDF */ };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F8FAFC]">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4 min-w-0">
          <Button variant="ghost" size="sm" onClick={() => navigate('/library')} className="text-slate-500 hover:text-slate-800 gap-2 shrink-0"><ArrowLeft size={18} /> Thư viện</Button>
          <div className="h-6 w-px bg-slate-200 shrink-0"></div>
          <div className="flex items-center gap-2 min-w-0"><FileText size={18} className="text-[#4F46E5] shrink-0"/><span className="font-bold text-slate-800 text-lg truncate">{formData.title}</span></div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button onClick={handleDownloadPdf} variant="outline" className="gap-2 text-slate-600"><Download size={16} /> Xuất PDF</Button>
          <Button onClick={() => setIsConfirmOpen(true)} className="bg-[#4F46E5] hover:bg-blue-700 gap-2 text-white"><Save size={16} /> Lưu</Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
         {/* --- CỘT TRÁI: FORM --- */}
         <div className="w-[400px] shrink-0 bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto shadow-sm z-10 custom-scrollbar">
            <div className="p-6 space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100"><h3 className="font-bold text-[#4F46E5] text-sm uppercase mb-2">Điền thông tin hợp đồng</h3></div>
                <div className="space-y-4">
                    <div className="space-y-2"><Label><User size={14} className="inline mr-2"/>Bên Cho Thuê</Label><Input name="BEN_A_ONG" value={formData.BEN_A_ONG} onChange={handleChange} placeholder="Họ tên Ông..."/><Input name="BEN_A_CMND_ONG" value={formData.BEN_A_CMND_ONG} onChange={handleChange} placeholder="CMND Ông..."/> <Input name="BEN_A_BA" value={formData.BEN_A_BA} onChange={handleChange} placeholder="Họ tên Bà..."/><Input name="BEN_A_CMND_BA" value={formData.BEN_A_CMND_BA} onChange={handleChange} placeholder="CMND Bà..."/></div>
                     <div className="space-y-2"><Label><User size={14} className="inline mr-2"/>Bên Thuê</Label><Input name="BEN_B_ONG" value={formData.BEN_B_ONG} onChange={handleChange} placeholder="Họ tên Ông..."/><Input name="BEN_B_CMND_ONG" value={formData.BEN_B_CMND_ONG} onChange={handleChange} placeholder="CMND Ông..."/></div>
                     <div className="space-y-2"><Label><Home size={14} className="inline mr-2"/>Thông tin căn hộ</Label><Input name="SO_NHA" value={formData.SO_NHA} onChange={handleChange} placeholder="Số nhà..."/><Input name="TANG" value={formData.TANG} onChange={handleChange} placeholder="Tầng..."/><Input name="TOA_NHA" value={formData.TOA_NHA} onChange={handleChange} placeholder="Tòa nhà..."/><Input name="KHU_CHUNG_CU" value={formData.KHU_CHUNG_CU} onChange={handleChange} placeholder="Khu chung cư..."/><Input name="DIEN_TICH" value={formData.DIEN_TICH} onChange={handleChange} placeholder="Diện tích m2..."/></div>
                    <div className="space-y-2"><Label><Calendar size={14} className="inline mr-2"/>Thời gian</Label><Input name="THOI_HAN_THUE" value={formData.THOI_HAN_THUE} onChange={handleChange} placeholder="Thời hạn thuê (VD: 1 năm)"/><div className="grid grid-cols-2 gap-2"><Input name="NGAY_BAT_DAU" type="date" value={formData.NGAY_BAT_DAU} onChange={handleChange} /><Input name="NGAY_KET_THUC" type="date" value={formData.NGAY_KET_THUC} onChange={handleChange} /></div></div>
                    <div className="space-y-2"><Label><DollarSign size={14} className="inline mr-2"/>Tài chính</Label><Input name="GIA_THUE" type="number" value={formData.GIA_THUE} onChange={handleChange} placeholder="Giá thuê/tháng..."/><Input name="TIEN_COC" type="number" value={formData.TIEN_COC} onChange={handleChange} placeholder="Tiền cọc..."/></div>
                </div>
            </div>
         </div>

         {/* --- CỘT PHẢI: PREVIEW (DẠNG CUỘN DỌC) --- */}
         <div className="flex-1 bg-slate-100 p-8 flex justify-center overflow-y-auto custom-scrollbar">
            {/* 
              Div này mô phỏng một trang giấy A4 dài có thể cuộn
              - Bỏ min-h để nó tự co giãn theo nội dung
            */}
            <div id="contract-preview-content" className="bg-white w-full max-w-[800px] shadow-lg border border-slate-200 p-[2cm] md:p-[3cm] relative">
                <div 
                    className="font-serif text-black max-w-none prose-p:my-2 prose-h2:text-center prose-strong:text-black"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }} 
                />
            </div>
         </div>
      </div>
      
      {/* --- DIALOG --- */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle className="flex items-center gap-2"><AlertTriangle className="text-orange-500" size={20}/> Xác nhận lưu</DialogTitle><DialogDescription>Hợp đồng <strong>"{formData.title}"</strong> sẽ được lưu vào <strong>Inspections</strong> với trạng thái "Chưa phân tích".</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Hủy</Button><Button onClick={handleConfirmSave} className="bg-[#4F46E5] hover:bg-blue-700">Đồng ý lưu</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateContract;