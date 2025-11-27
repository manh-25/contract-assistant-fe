import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Language } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface LoginProps {
  language: Language;
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const Login = ({ language }: LoginProps) => {
  const t = useTranslation(language);
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        toast({
          title: language === "vi" ? "Lỗi xác thực" : "Validation error",
          description: language === "vi" ? "Vui lòng kiểm tra email và mật khẩu" : "Please check your email and password",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await signIn(email, password);

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
    } catch (error: any) {
      toast({
        title: language === "vi" ? "Lỗi" : "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">{t.loginTitle}</CardTitle>
          <CardDescription className="text-base">{t.loginSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (language === "vi" ? "Đang đăng nhập..." : "Logging in...") : t.loginButton}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={() => navigate("/forgot-password")}
            >
              {t.forgotPassword}
            </Button>
          </div>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t.noAccount} </span>
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => navigate("/signup")}
            >
              {t.signUp}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
