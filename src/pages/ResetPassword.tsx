
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/components/AuthLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu và xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    const emailParam = queryParams.get('email');
    
    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      setError("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    if (!email) {
        setError("Không tìm thấy địa chỉ email để đặt lại mật khẩu.");
        return;
    }

    setLoading(true);
    try {
      const { error: authError } = await updatePassword(email, password);
      if (authError) {
        throw authError;
      }
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout title="Thành công" page="reset-password">
        <div className="text-center space-y-6">
            <div className="flex justify-center">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Mật khẩu đã được đặt lại</h3>
            <p className="text-slate-600">
                Mật khẩu của bạn đã được cập nhật thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
            </p>
            <Button onClick={() => navigate("/login")} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white">Đi đến trang Đăng nhập</Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Đặt lại Mật khẩu" page="reset-password">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="font-semibold text-slate-700">Mật khẩu mới <span className="text-red-500">*</span></Label>
            <Input id="password" type="password" placeholder="Nhập mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-lg" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="font-semibold text-slate-700">Xác nhận mật khẩu mới <span className="text-red-500">*</span></Label>
            <Input id="confirmPassword" type="password" placeholder="Nhập lại mật khẩu mới" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-12 rounded-lg" required />
          </div>
        </div>

        <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-base" disabled={loading || !token}>
          {loading ? "Đang cập nhật..." : "Đặt lại Mật khẩu"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
