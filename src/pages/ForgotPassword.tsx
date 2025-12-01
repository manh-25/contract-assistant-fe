import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth(); // Giả sử hook có hàm resetPassword
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = forgotPasswordSchema.safeParse({ email });

    if (!validation.success) {
      toast({
        title: "Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;

      toast({
        title: "Email Sent",
        description: "Check your inbox for password reset instructions.",
      });
      // Có thể navigate về login sau vài giây
    } catch (err: any) {
      toast({
        title: "Request Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-screen bg-[#050A18] overflow-hidden font-sans">
      
      {/* GRID LAYOUT: Giữ nguyên chuẩn */}
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-x-[20px] px-[10px]">
        
        {/* LEFT SIDE: RECOVER */}
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
                RECOVER,
              </h1>
              <p className="text-gray-400 text-xl max-w-lg leading-relaxed font-light">
                Forgot your password? No worries.<br/>
                We'll help you get back into your account securely.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Panel): Cột 9 -> 11 */}
        <div className="col-span-1 lg:col-start-9 lg:col-span-3 flex flex-col justify-end h-full relative z-20 pb-0">
          
          <div className="bg-white w-full h-[92%] rounded-t-[32px] lg:rounded-t-[40px] shadow-2xl p-8 lg:p-10 flex flex-col justify-center">
            
            <div className="w-full space-y-8">
              <div className="space-y-2">
                <h2 className="text-[#050A18] text-4xl font-bold tracking-tight">Reset Password</h2>
                <p className="text-gray-500 text-base">Enter your email to receive instructions.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <Button
                  type="submit"
                  className="w-full h-12 xl:h-14 bg-[#050A18] hover:bg-[#1a2333] text-white rounded-xl text-lg font-bold shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <Button
                  variant="link"
                  className="text-base text-gray-500 hover:text-[#050A18] gap-2"
                  onClick={() => navigate("/login")}
                >
                  ← Back to Log In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;