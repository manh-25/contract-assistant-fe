import { 
  AlertTriangle, ShieldAlert, AlertCircle, ChevronRight, 
  Activity, ShieldCheck, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Component Vòng tròn điểm số
const CircularScore = ({ score }: { score: number }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  // Logic màu của vòng tròn: 
  // Nếu nền Card là màu Xanh (Blue), ta nên để vòng tròn màu Trắng hoặc Vàng cam để nổi bật
  let color = "#ffffff"; // Mặc định trắng cho nổi trên nền xanh
  if (score < 50) color = "#fca5a5"; // Đỏ nhạt
  if (score >= 50 && score < 80) color = "#fbbf24"; // Vàng cam

  return (
    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
      <svg className="transform -rotate-90 w-full h-full drop-shadow-md">
        {/* Vòng background mờ đi */}
        <circle cx="40" cy="40" r={radius} stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="transparent" />
        {/* Vòng progress */}
        <circle
          cx="40" cy="40" r={radius} stroke={color} strokeWidth="4" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center text-white">
        <span className="text-xl font-bold tracking-tight">{score}</span>
      </div>
    </div>
  );
};

interface QuickReviewProps {
  riskScore: number;
}

export default function QuickReview({ riskScore }: QuickReviewProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* 1. HERO SECTION */}
      <div className="grid grid-cols-1 gap-4">
        
        {/* === THAY ĐỔI Ở ĐÂY: DÙNG MÀU BRAND BLUE === */}
        {/* Style 1 (Brand Blue): bg-gradient-to-r from-[#496DFF] to-[#3B5BDB] */}
        {/* Style 2 (Deep Ocean): bg-[#10224E] */}
        {/* Style 3 (Purple): bg-gradient-to-r from-[#6366f1] to-[#a855f7] */}
        
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#496DFF] to-[#3B5BDB] text-white shadow-lg p-5 flex items-center justify-between">
           
           {/* Decorative bg: Đổi thành màu trắng mờ để tạo hiệu ứng glass */}
           <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-[80px] opacity-20 pointer-events-none -mr-10 -mt-10"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-30 pointer-events-none -ml-10 -mb-10"></div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Health Score</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Khá an toàn</h2>
              <p className="text-xs text-blue-100 mt-1 max-w-[200px] leading-relaxed font-medium">
                Hợp đồng đạt chuẩn cơ bản, cần lưu ý 2 điểm quan trọng.
              </p>
           </div>
           
           <CircularScore score={riskScore} />
        </div>

        {/* Mini Stat Cards */}
        <div className="grid grid-cols-3 gap-3">
           <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center hover:shadow-md transition-shadow cursor-pointer group">
              <span className="block text-xl font-bold text-red-600 group-hover:scale-110 transition-transform">2</span>
              <span className="text-[10px] uppercase font-bold text-red-400">Nghiêm trọng</span>
           </div>
           <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center hover:shadow-md transition-shadow cursor-pointer group">
              <span className="block text-xl font-bold text-orange-500 group-hover:scale-110 transition-transform">5</span>
              <span className="text-[10px] uppercase font-bold text-orange-400">Cảnh báo</span>
           </div>
           <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center hover:shadow-md transition-shadow cursor-pointer group">
              <span className="block text-xl font-bold text-[#496DFF] group-hover:scale-110 transition-transform">12</span>
              <span className="text-[10px] uppercase font-bold text-blue-400">Đạt chuẩn</span>
           </div>
        </div>
      </div>

      {/* 2. RISK LIST */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            Cần xử lý ngay (2)
          </h4>
        </div>

        <div className="space-y-3">
          {/* Card Lỗi 1 */}
          <div className="group bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-red-200 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                 <AlertCircle className="w-4 h-4 text-red-500" />
                 <h5 className="font-bold text-slate-800 text-sm group-hover:text-red-600 transition-colors">Phạt vi phạm quá cao</h5>
              </div>
              <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded">HIGH</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Điều 3: Phạt 20% là trái với Luật Thương mại (max 8%).
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
               <span className="text-[10px] text-slate-400 font-medium">Trang 1 • Điều 3</span>
               <div className="flex items-center text-[#496DFF] text-xs font-bold hover:underline">
                  Sửa ngay <ChevronRight className="w-3 h-3 ml-1"/>
               </div>
            </div>
          </div>

          {/* Card Lỗi 2 */}
          <div className="group bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4 text-orange-500" />
                 <h5 className="font-bold text-slate-800 text-sm group-hover:text-orange-600 transition-colors">Thiếu cơ quan tài phán</h5>
              </div>
              <span className="bg-orange-100 text-orange-700 text-[10px] font-extrabold px-2 py-0.5 rounded">MED</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Chưa quy định rõ Tòa án hay Trọng tài khi tranh chấp.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
               <span className="text-[10px] text-slate-400 font-medium">Toàn văn bản</span>
               <div className="flex items-center text-[#496DFF] text-xs font-bold hover:underline">
                  Xem gợi ý <ChevronRight className="w-3 h-3 ml-1"/>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GOOD POINTS */}
      <div>
        <h4 className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-3 px-1">
          <ShieldCheck className="w-4 h-4 text-[#496DFF]" />
          Điểm tốt (12)
        </h4>
        
        <div className="bg-white border border-blue-100 rounded-xl p-1 shadow-sm">
           <div className="flex items-center gap-3 p-3 hover:bg-blue-50/50 rounded-lg transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                 <ShieldCheck className="w-4 h-4 text-[#496DFF]" />
              </div>
              <div className="flex-1">
                 <p className="text-sm font-bold text-slate-700 group-hover:text-[#496DFF] transition-colors">Bảo mật thông tin</p>
                 <p className="text-[10px] text-slate-400">Điều 8 • Rất chặt chẽ</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#496DFF]" />
           </div>
           
           <div className="h-[1px] bg-slate-100 mx-3"></div>

           <div className="flex items-center gap-3 p-3 hover:bg-blue-50/50 rounded-lg transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                 <TrendingUp className="w-4 h-4 text-[#496DFF]" />
              </div>
              <div className="flex-1">
                 <p className="text-sm font-bold text-slate-700 group-hover:text-[#496DFF] transition-colors">Điều khoản thanh toán</p>
                 <p className="text-[10px] text-slate-400">Điều 4 • Rõ ràng</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#496DFF]" />
           </div>
        </div>
        
        <div className="text-center mt-3">
          <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-[#496DFF]">
            Xem toàn bộ 12 điểm tốt
          </Button>
        </div>
      </div>

    </div>
  );
}