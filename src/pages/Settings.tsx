import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/lib/translations";
import { Language } from "@/components/LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";
import { Shield, Bell, Trash2, Lock, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SettingsProps {
  language: Language;
}

const Settings = ({ language }: SettingsProps) => {
  const t = useTranslation(language);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({ title: t.passwordMismatch, variant: "destructive" });
      return;
    }
    if (passwords.new.length < 6) {
      toast({ title: "Password too short", variant: "destructive" });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: passwords.new });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: t.passwordChanged });
      setPasswords({ current: "", new: "", confirm: "" });
      setShowPasswordForm(false);
    }
  };

  if (loading || !user) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 font-sans text-slate-900">
      <div className="container mx-auto px-6 max-w-4xl">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#1A1C4B]">{t.settingsTab}</h1>
          <p className="text-slate-500 mt-1">
            {language === "vi" ? "Quản lý bảo mật và tùy chọn tài khoản" : "Manage security and account preferences"}
          </p>
        </div>

        <div className="space-y-6">
          
          {/* SECURITY SECTION */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#1A1C4B] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#496DFF]" />
                {t.changePassword || "Security"}
              </CardTitle>
              <CardDescription>
                {t.changePasswordDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Password Change Block */}
              {!showPasswordForm ? (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1C4B]">{language === "vi" ? "Mật khẩu" : "Password"}</p>
                      <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setShowPasswordForm(true)} className="border-slate-200 text-[#496DFF] hover:bg-blue-50">
                    {language === "vi" ? "Đổi mật khẩu" : "Change Password"}
                  </Button>
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-xl space-y-4 border border-blue-100">
                  <h4 className="font-semibold text-[#1A1C4B]">{language === "vi" ? "Đặt mật khẩu mới" : "Set new password"}</h4>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>{t.newPassword}</Label>
                      <Input type="password" className="bg-white" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label>{t.confirmPassword}</Label>
                      <Input type="password" className="bg-white" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={() => setShowPasswordForm(false)}>{language === "vi" ? "Hủy" : "Cancel"}</Button>
                    <Button onClick={handlePasswordChange} className="bg-[#496DFF] hover:bg-[#3b5bdb]">{t.updatePassword}</Button>
                  </div>
                </div>
              )}

              {/* 2FA Placeholder */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <Smartphone className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1A1C4B]">{t.twoFactorAuth}</p>
                    <p className="text-xs text-slate-500">{t.twoFactorAuthDesc}</p>
                  </div>
                </div>
                <Switch disabled /> 
              </div>
            </CardContent>
          </Card>

          {/* NOTIFICATIONS SECTION */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#1A1C4B] flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                {t.emailNotifications || "Notifications"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                 <span className="text-slate-600">{language === "vi" ? "Thông báo qua Email" : "Email Notifications"}</span>
                 <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                 <span className="text-slate-600">{language === "vi" ? "Cập nhật sản phẩm" : "Product Updates"}</span>
                 <Switch />
              </div>
            </CardContent>
          </Card>

          {/* DANGER ZONE */}
          <Card className="border-red-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                {t.deleteAccount}
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                  <div>
                    <p className="font-bold text-red-900">{t.deleteAccount}</p>
                    <p className="text-xs text-red-700/70">{t.deleteAccountDesc}</p>
                  </div>
                  <Button variant="destructive" size="sm">{t.delete}</Button>
               </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Settings;