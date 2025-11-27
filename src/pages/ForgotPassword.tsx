import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Language } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface ForgotPasswordProps {
  language: Language;
}

const emailSchema = z.object({
  email: z.string().email(),
});

export const ForgotPassword = ({ language }: ForgotPasswordProps) => {
  const t = useTranslation(language);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = emailSchema.safeParse({ email });
      if (!validation.success) {
        toast({
          title: language === "vi" ? "Email không hợp lệ" : "Invalid email",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) {
        toast({
          title: language === "vi" ? "Lỗi" : "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSubmitted(true);
        toast({
          title: t.resetLinkSent,
        });
        
        setTimeout(() => {
          navigate("/login");
        }, 3000);
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
          <CardTitle className="text-3xl font-bold">{t.forgotPasswordTitle}</CardTitle>
          <CardDescription className="text-base">{t.forgotPasswordSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
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
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (language === "vi" ? "Đang gửi..." : "Sending...") : t.sendResetLink}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">{t.resetLinkSent}</p>
            </div>
          )}
          <div className="mt-6 text-center">
            <Button
              variant="link"
              className="p-0 h-auto font-semibold gap-2"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToLogin}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
