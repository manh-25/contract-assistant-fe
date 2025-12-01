import { useState } from "react";
import { 
  Check, X, ChevronDown, ChevronUp, FileSearch, 
  ArrowRight, Sparkles, Copy 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dữ liệu giả lập cho các vấn đề chuyên sâu
const SCAN_DATA = [
  {
    id: 1,
    clause: "Điều 3. Phạt vi phạm",
    type: "Pháp lý",
    severity: "high", // high, medium, low
    original: "Nếu Bên B chậm tiến độ quá 03 ngày, Bên B sẽ phải chịu phạt 20% tổng giá trị hợp đồng.",
    suggestion: "Nếu Bên B chậm tiến độ quá 03 ngày, Bên B sẽ phải chịu phạt 8% phần nghĩa vụ hợp đồng bị vi phạm.",
    reason: "Luật Thương mại 2005 quy định mức phạt vi phạm không quá 8%.",
  },
  {
    id: 2,
    clause: "Điều 4. Thanh toán",
    type: "Tài chính",
    severity: "medium",
    original: "Thời hạn thanh toán là 15 ngày kể từ ngày nhận được hóa đơn.",
    suggestion: "Thời hạn thanh toán là 15 ngày làm việc kể từ ngày nhận được hóa đơn tài chính hợp lệ.",
    reason: "Cần làm rõ 'ngày làm việc' và 'hóa đơn hợp lệ' để tránh tranh chấp hoãn thanh toán.",
  },
  {
    id: 3,
    clause: "Điều 9. Bất khả kháng",
    type: "Rủi ro",
    severity: "low",
    original: "Hai bên được miễn trách nhiệm trong trường hợp thiên tai, hỏa hoạn.",
    suggestion: "Hai bên được miễn trách nhiệm trong sự kiện bất khả kháng bao gồm nhưng không giới hạn: thiên tai, hỏa hoạn, dịch bệnh, thay đổi chính sách pháp luật...",
    reason: "Mở rộng định nghĩa để bao quát các rủi ro hiện đại (như Covid-19).",
  }
];

export default function DeepScan() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Thống kê */}
      <div className="mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg text-[#496DFF]">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Rà soát chi tiết</h3>
            <p className="text-xs text-slate-500">Tìm thấy <span className="font-bold text-[#496DFF]">3</span> vấn đề cần tối ưu</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-white text-slate-600 border-slate-200">
          AI Model v2.0
        </Badge>
      </div>

      {/* Danh sách các thẻ phân tích */}
      <ScrollArea className="flex-1 -mr-4 pr-4">
        <div className="space-y-4 pb-10">
          {SCAN_DATA.map((item) => (
            <div 
              key={item.id}
              className={`border rounded-xl bg-white transition-all duration-300 overflow-hidden ${
                expandedId === item.id 
                ? "border-[#496DFF] shadow-lg ring-1 ring-blue-100" 
                : "border-slate-100 shadow-sm hover:border-slate-300"
              }`}
            >
              {/* Header Card */}
              <div 
                onClick={() => toggleExpand(item.id)}
                className="p-4 cursor-pointer flex items-center justify-between bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    item.severity === 'high' ? 'bg-red-500' : 
                    item.severity === 'medium' ? 'bg-orange-400' : 'bg-blue-400'
                  }`}></span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{item.clause}</h4>
                    <p className="text-xs text-slate-500">{item.type}</p>
                  </div>
                </div>
                {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>

              {/* Nội dung chi tiết (Expandable) */}
              {expandedId === item.id && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                  
                  {/* Lý do AI đề xuất */}
                  <div className="mb-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-2 items-start">
                    <Sparkles className="w-3.5 h-3.5 text-[#496DFF] mt-0.5 shrink-0" />
                    <span className="leading-relaxed"><strong>AI Insight:</strong> {item.reason}</span>
                  </div>

                  {/* So sánh Diff View */}
                  <div className="space-y-3">
                    {/* Gốc */}
                    <div className="relative pl-3 border-l-2 border-red-200">
                      <p className="text-[10px] uppercase text-red-400 font-bold mb-1">Hiện tại</p>
                      <p className="text-sm text-slate-500 line-through decoration-red-300 decoration-2 decoration-slice bg-red-50/50 p-2 rounded">
                        {item.original}
                      </p>
                    </div>

                    <div className="flex justify-center">
                        <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
                    </div>

                    {/* Đề xuất */}
                    <div className="relative pl-3 border-l-2 border-green-400">
                      <p className="text-[10px] uppercase text-green-600 font-bold mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Đề xuất thay thế
                      </p>
                      <p className="text-sm text-slate-800 bg-green-50 p-2 rounded border border-green-100 font-medium">
                        {item.suggestion}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2 justify-end">
                    <Button variant="outline" size="sm" className="h-8 text-xs text-slate-500">
                       <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                      <X className="w-3 h-3 mr-1" /> Bỏ qua
                    </Button>
                    <Button size="sm" className="h-8 text-xs bg-[#496DFF] hover:bg-blue-600 shadow-blue-200 shadow-md">
                      <Check className="w-3 h-3 mr-1" /> Áp dụng ngay
                    </Button>
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}