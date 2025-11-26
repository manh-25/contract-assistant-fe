import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/translations";
import { Language } from "@/components/LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Settings } from "lucide-react";

interface ProfileProps {
  language: Language;
}

const Profile = ({ language }: ProfileProps) => {
  const t = useTranslation(language);
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    fullName: "Nguyễn Văn A",
    email: "user@example.com",
    phone: "+84 123 456 789",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileSave = () => {
    toast({
      title: t.profileUpdated || "Cập nhật thông tin thành công",
      description: t.profileUpdatedDesc || "Thông tin cá nhân đã được cập nhật",
    });
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: t.passwordMismatch,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: t.passwordChanged || "Đổi mật khẩu thành công",
      description: t.passwordChangedDesc || "Mật khẩu của bạn đã được cập nhật",
    });
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t.profileTitle || "Thông tin cá nhân"}</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {t.profileTab || "Hồ sơ"}
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {t.passwordTab || "Mật khẩu"}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t.settingsTab || "Cài đặt"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t.personalInfo || "Thông tin cá nhân"}</CardTitle>
                <CardDescription>
                  {t.personalInfoDesc || "Cập nhật thông tin cá nhân của bạn"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t.fullName || "Họ và tên"}</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phone || "Số điện thoại"}</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <Button onClick={handleProfileSave} className="w-full">
                  {t.saveChanges || "Lưu thay đổi"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>{t.changePassword || "Đổi mật khẩu"}</CardTitle>
                <CardDescription>
                  {t.changePasswordDesc || "Cập nhật mật khẩu của bạn"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t.currentPassword || "Mật khẩu hiện tại"}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t.newPassword || "Mật khẩu mới"}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                </div>
                <Button onClick={handlePasswordChange} className="w-full">
                  {t.updatePassword || "Cập nhật mật khẩu"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t.accountSettings || "Cài đặt tài khoản"}</CardTitle>
                <CardDescription>
                  {t.accountSettingsDesc || "Quản lý cài đặt tài khoản của bạn"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{t.emailNotifications || "Thông báo email"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t.emailNotificationsDesc || "Nhận thông báo qua email"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      {t.manage || "Quản lý"}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{t.twoFactorAuth || "Xác thực hai yếu tố"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t.twoFactorAuthDesc || "Tăng cường bảo mật tài khoản"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      {t.enable || "Bật"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/50">
                    <div>
                      <h3 className="font-medium text-destructive">{t.deleteAccount || "Xóa tài khoản"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t.deleteAccountDesc || "Xóa vĩnh viễn tài khoản của bạn"}
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      {t.delete}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
