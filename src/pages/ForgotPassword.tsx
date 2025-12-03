
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/components/AuthLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Mail } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await requestPasswordReset(email);
      if (authError) {
        throw authError;
      }
      setIsEmailSent(true);
    } catch (err: unknown) {
      setError((err as Error).message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <AuthLayout title="Kiểm tra Hộp thư" page="forgot-password">
        <div className="text-center space-y-6">
            <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-green-600" />
                </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Đã gửi email đặt lại mật khẩu</h3>
            <p className="text-slate-600">
                Một liên kết để đặt lại mật khẩu của bạn đã được gửi đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến (và thư mục spam) của bạn.
            </p>
            <Button onClick={() => navigate("/login")} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white">Quay lại Đăng nhập</Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Quên Mật khẩu" page="forgot-password">
        <p className="text-slate-600 text-center mb-6">Nhập email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Không thể gửi Email</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-semibold text-slate-700">Email <span className="text-red-500">*</span></Label>
          <Input id="email" type="email" placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-lg" required />
        </div>

        <div className="text-center text-sm pt-2">
            <span className="text-slate-600">Nhớ mật khẩu? </span>
            <span className="font-semibold text-indigo-600 cursor-pointer hover:underline" onClick={() => navigate("/login")}>Đăng nhập</span>
        </div>

        <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-base" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
