import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Language } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

interface SignupProps {
  language: Language;
}

// Schema: Username bắt buộc, Email optional
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email().optional().or(z.literal("")), // Cho phép chuỗi rỗng hoặc email hợp lệ
  password: z.string().min(6),
});

export const Signup = ({ language }: SignupProps) => {
  const t = useTranslation(language);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, user } = useAuth();

  const [username, setUsername] = useState(""); // Đổi từ fullName -> username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: t.passwordMismatch, variant: "destructive" });
      return;
    }

    // Validate theo schema mới
    const validation = signupSchema.safeParse({ username, email, password });
    if (!validation.success) {
      toast({
        title: language === "vi" ? "Lỗi xác thực" : "Validation error",
        description: language === "vi" 
          ? "Vui lòng kiểm tra lại thông tin (Username tối thiểu 3 ký tự)" 
          : "Please check your information (Username min 3 chars)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password, username);
      if (error) {
        toast({
          title: language === "vi" ? "Đăng ký thất bại" : "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: language === "vi" ? "Đăng ký thành công" : "Sign up successful",
          description:
            language === "vi"
              ? "Bạn có thể đăng nhập ngay."
              : "You can sign in now.",
        });
        navigate("/login");
      }
    } catch (err: any) {
      toast({
        title: language === "vi" ? "Lỗi" : "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1A1C4B] flex items-center justify-center p-4 lg:p-8 overflow-hidden font-sans">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col text-white space-y-8 pl-8">
          <div className="flex items-center gap-4">
            <div className="bg-white text-[#1A1C4B] px-3 py-2 rounded-lg font-bold text-xs tracking-widest">
              LOGO
            </div>
            <span className="text-2xl font-bold tracking-wide">AGREEME</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-7xl font-extrabold tracking-tight">JOIN US,</h1>
            <p className="text-gray-300 text-lg max-w-md leading-relaxed">
              Create an account to start your journey.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex justify-center lg:justify-end w-full">
          <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-md shadow-2xl min-h-[600px] flex flex-col justify-center">
            
            <div className="mb-6">
              <h2 className="text-[#496DFF] text-4xl font-bold mb-2">Sign Up</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field (thay cho FullName) */}
              <div className="space-y-1">
                <Label
                  htmlFor="username"
                  className="text-gray-600 font-medium flex items-center"
                >
                  <span className="text-red-500 mr-1">*</span>
                  {language === "vi" ? "Tên đăng nhập" : "Username"}
                </Label>
                <Input
                  id="username"
                  placeholder={
                    language === "vi" ? "Nhập tên đăng nhập" : "Create a username"
                  }
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 border-blue-200 bg-blue-50/30 rounded-xl focus-visible:ring-[#496DFF]"
                  required
                />
              </div>

              {/* Email Field (Optional) */}
              <div className="space-y-1">
                <Label
                  htmlFor="email"
                  className="text-gray-600 font-medium flex items-center"
                >
                  {t.email} <span className="text-gray-400 text-xs ml-1 font-normal">(Optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-blue-200 bg-blue-50/30 rounded-xl focus-visible:ring-[#496DFF]"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label
                  htmlFor="password"
                  className="text-gray-600 font-medium flex items-center"
                >
                  <span className="text-red-500 mr-1">*</span> {t.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-blue-200 bg-blue-50/30 rounded-xl focus-visible:ring-[#496DFF]"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-600 font-medium flex items-center"
                >
                  <span className="text-red-500 mr-1">*</span> {t.confirmPassword}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t.confirmPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 border-blue-200 bg-blue-50/30 rounded-xl focus-visible:ring-[#496DFF]"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 bg-[#496DFF] hover:bg-[#3b5bdb] text-white rounded-full text-md font-semibold shadow-md mt-4"
                disabled={loading}
              >
                {loading
                  ? language === "vi"
                    ? "Đang đăng ký..."
                    : "Signing up..."
                  : t.signUpButton}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-500">
              {t.alreadyHaveAccount}{" "}
              <span
                className="text-[#496DFF] font-bold cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                {t.signIn}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;