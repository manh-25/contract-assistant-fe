
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { AuthLayout } from "@/components/AuthLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const signupSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string(),
  securityAnswer: z.string().min(1, "Vui lòng nhập câu trả lời bảo mật"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu và xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
});

const securityQuestions = [
  "Tên thời con gái của mẹ bạn là gì?",
  "Tên của thú cưng đầu tiên của bạn là gì?",
  "Thành phố bạn sinh ra ở đâu?",
  "Cuốn sách yêu thích của bạn là gì?",
];

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    securityAnswer: "",
    selectedQuestion: securityQuestions[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError(null);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = signupSchema.safeParse({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      securityAnswer: formData.securityAnswer,
    });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await signUp(formData.email, formData.password, { 
        username: formData.username,
        securityQuestion: formData.selectedQuestion,
        securityAnswer: formData.securityAnswer,
      });
      
      if (authError) throw authError;
      
      toast({ 
        title: "Tạo tài khoản thành công!", 
        description: "Vui lòng kiểm tra email để xác thực tài khoản."
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng ký" page="signup">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Lỗi đăng ký</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="font-semibold text-gray-700">Tên đăng nhập <span className="text-red-500">*</span></Label>
            <Input id="username" placeholder="Nhập tên đăng nhập" value={formData.username} onChange={handleChange} className="h-12 rounded-lg" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="font-semibold text-gray-700">Email <span className="text-red-500">*</span></Label>
            <Input id="email" type="email" placeholder="Nhập email" value={formData.email} onChange={handleChange} className="h-12 rounded-lg" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="font-semibold text-gray-700">Mật khẩu <span className="text-red-500">*</span></Label>
            <Input id="password" type="password" placeholder="Nhập mật khẩu" value={formData.password} onChange={handleChange} className="h-12 rounded-lg" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="font-semibold text-gray-700">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
            <Input id="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" value={formData.confirmPassword} onChange={handleChange} className="h-12 rounded-lg" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="selectedQuestion" className="font-semibold text-gray-700">Câu hỏi bảo mật <span className="text-red-500">*</span></Label>
            <select id="selectedQuestion" value={formData.selectedQuestion} onChange={handleChange} className="flex h-12 w-full rounded-lg border bg-white px-3 py-2 text-sm" required>
              {securityQuestions.map((q) => (<option key={q} value={q}>{q}</option>))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="securityAnswer" className="font-semibold text-gray-700">Câu trả lời <span className="text-red-500">*</span></Label>
            <Input id="securityAnswer" type="text" placeholder="Nhập câu trả lời" value={formData.securityAnswer} onChange={handleChange} className="h-12 rounded-lg" required />
          </div>
        </div>

        <div className="text-sm pt-2">
          <span className="text-gray-600">Đã có tài khoản? </span>
          <span className="font-semibold text-[#4f46e5] cursor-pointer hover:underline" onClick={() => navigate("/login")}>Đăng nhập</span>
        </div>

        <Button type="submit" className="w-full h-12 bg-[#4f46e5] hover:bg-[#3b5bdb] text-white rounded-lg font-bold text-base" disabled={loading}>
          {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Signup;