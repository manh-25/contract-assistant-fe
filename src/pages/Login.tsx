import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const GoogleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
});

export const Login = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast({
        title: "Lỗi",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      toast({ title: "Đăng nhập thành công!" });
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Thất bại",
        description: err.message || "Vui lòng kiểm tra lại thông tin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-screen bg-[#050A18] overflow-hidden font-sans">
      
      {/* 
          CẤU HÌNH GRID KHỚP EXTENSION:
          - grid-cols-12: Chuẩn Desktop.
          - gap-x-[20px]: Khớp với "Inner (px) 20" trong ảnh.
          - px-[10px]: Khớp với "Outer (px) 10" trong ảnh (Dù hơi nhỏ).
      */}
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-x-[20px] px-[10px]">
        
        {/* LEFT SIDE: Chiếm 6 cột từ cột 2 */}
        <div className="hidden lg:flex lg:col-start-2 lg:col-span-6 flex-col justify-center text-white relative z-10">
          <div className="absolute top-0 -left-[20%] w-[150%] h-full bg-[radial-gradient(circle_at_30%_50%,_rgba(73,109,255,0.08),_transparent)] pointer-events-none" />
          <div className="relative space-y-12">
            <div className="flex items-center gap-4">
              <div className="border border-white/20 bg-white/5 px-4 py-2 rounded text-xs font-bold tracking-[0.2em] uppercase text-white/90">
                Logo
              </div>
              <span className="text-xl font-bold tracking-[0.15em]">AGREEME</span>
            </div>
            <div className="space-y-6">
              <h1 className="text-8xl xl:text-9xl font-bold tracking-tight text-white leading-none">
                HELLO,
              </h1>
              <p className="text-gray-400 text-xl max-w-lg leading-relaxed font-light">
                Welcome back to AI Contract Analyzer. <br/>
                Your intelligent legal assistant is ready.
              </p>
            </div>
          </div>
        </div>

        {/* 
           RIGHT SIDE (Panel):
           - lg:col-start-9: Bắt đầu tại vạch cột 9.
           - lg:col-span-3: Chiếm 3 cột (9, 10, 11).
           - Kết quả: Cột 12 trống.
        */}
        <div className="col-span-1 lg:col-start-9 lg:col-span-3 flex flex-col justify-end h-full relative z-20 pb-0">
          
          <div className="bg-white w-full h-[92%] rounded-t-[32px] lg:rounded-t-[40px] shadow-2xl p-8 lg:p-10 flex flex-col justify-center">
            
            <div className="w-full space-y-6">
              <div className="space-y-2">
                <h2 className="text-[#050A18] text-4xl font-bold tracking-tight">Log In</h2>
                <p className="text-gray-500 text-base">Welcome back! Please enter details.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#050A18] font-semibold text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 xl:h-14 border-gray-200 bg-gray-50 rounded-xl focus-visible:ring-1 focus-visible:ring-[#050A18] text-base px-4"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#050A18] font-semibold text-base">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 xl:h-14 border-gray-200 bg-gray-50 rounded-xl focus-visible:ring-1 focus-visible:ring-[#050A18] text-base px-4"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" variant="link" className="text-sm font-semibold text-[#496DFF] hover:text-[#3b5bdb] p-0 h-auto" onClick={() => navigate("/forgot-password")}>
                    Forgot Password?
                  </Button>
                </div>

                <Button type="submit" className="w-full h-12 xl:h-14 bg-[#050A18] hover:bg-[#1a2333] text-white rounded-xl text-lg font-bold shadow-lg transition-all" disabled={loading}>
                  {loading ? "Processing..." : "Log In"}
                </Button>
              </form>

              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider"><span className="bg-white px-2 text-gray-400 font-medium">Or continue with</span></div>
              </div>

              <div className="text-center text-base text-gray-500">
                Don't have an account? <span className="text-[#496DFF] font-bold cursor-pointer hover:underline" onClick={() => navigate("/signup")}>Sign Up</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;