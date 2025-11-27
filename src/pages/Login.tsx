import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Language } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Icon Google
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

interface LoginProps {
  language: Language;
}

// Cập nhật schema để validate username thay vì email
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6),
});

export const Login = ({ language }: LoginProps) => {
  const t = useTranslation(language);
  const navigate = useNavigate();
  const { signIn, user } = useAuth(); // Lưu ý: Hàm signIn cần hỗ trợ nhận username
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = loginSchema.safeParse({ username, password });
    if (!validation.success) {
      toast({
        title: language === "vi" ? "Lỗi xác thực" : "Validation error",
        description:
          language === "vi"
            ? "Vui lòng kiểm tra tên đăng nhập và mật khẩu"
            : "Please check your username and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Gọi hàm signIn với username
      const { error } = await signIn(username, password);
      if (error) {
        toast({
          title: language === "vi" ? "Đăng nhập thất bại" : "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: language === "vi" ? "Đăng nhập thành công" : "Login successful",
        });
        navigate("/");
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
            <h1 className="text-7xl font-extrabold tracking-tight">HELLO,</h1>
            <p className="text-gray-300 text-lg max-w-md leading-relaxed">
              Lorem ipsum dolor sit amet, consect adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex justify-center lg:justify-end w-full">
          <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-md shadow-2xl min-h-[600px] flex flex-col justify-center">
            
            <div className="mb-8">
              <h2 className="text-[#496DFF] text-4xl font-bold mb-2">Log In</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-gray-600 font-medium flex items-center"
                >
                  <span className="text-red-500 mr-1">*</span> 
                  {language === "vi" ? "Tên đăng nhập" : "Username"}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={language === "vi" ? "Nhập tên đăng nhập" : "Enter username"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 border-blue-200 bg-blue-50/30 rounded-xl focus-visible:ring-[#496DFF]"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-600 font-medium flex items-center"
                >
                  <span className="text-red-500 mr-1">*</span> {t.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={language === "vi" ? "Mật khẩu" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-blue-200 bg-blue-50/30 rounded-xl focus-visible:ring-[#496DFF]"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="text-xs text-gray-500 hover:text-[#496DFF] p-0 h-auto"
                  onClick={() => navigate("/forgot-password")}
                >
                  {t.forgotPassword}
                </Button>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 bg-[#496DFF] hover:bg-[#3b5bdb] text-white rounded-full text-md font-semibold shadow-md transition-all hover:shadow-lg"
                disabled={loading}
              >
                {loading
                  ? language === "vi"
                    ? "Đang đăng nhập..."
                    : "Logging in..."
                  : t.loginButton}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-full border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 mt-4"
                onClick={() => {
                  toast({
                    title: "Feature coming soon",
                    description: "Google login is not implemented yet.",
                  });
                }}
              >
                <GoogleIcon />
                Log in with Google
              </Button>
            </form>

            <div className="mt-8 text-center text-xs text-gray-500">
              {t.noAccount}{" "}
              <span
                className="text-[#496DFF] font-bold cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                {t.signUp}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;