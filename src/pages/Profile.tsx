import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/lib/translations";
import { Language } from "@/components/LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, TrendingUp, FileText, FileSearch, PenTool, Upload, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
  language: Language;
}

const Profile = ({ language }: ProfileProps) => {
  const t = useTranslation(language);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfile({
          fullName: data.full_name || "",
          email: user.email || "",
          phone: "",
          avatar: data.avatar_url || "",
        });
      }
      setLoadingProfile(false);
    };

    fetchProfile();
  }, [user]);

  const stats = [
    { label: t.totalContracts, value: "12", icon: FileText, color: "text-accent" },
    { label: t.reviewsCompleted, value: "8", icon: FileSearch, color: "text-success" },
    { label: t.contractsCreated, value: "4", icon: PenTool, color: "text-warning" },
  ];

  const recentContracts = [
    {
      name: language === "vi" ? "Hợp đồng thuê nhà" : "House Rental Agreement",
      date: "2024-03-15",
      status: "safe",
    },
    {
      name: language === "vi" ? "Hợp đồng lao động" : "Employment Contract",
      date: "2024-03-10",
      status: "caution",
    },
    {
      name: language === "vi" ? "Hợp đồng mua bán" : "Sales Agreement",
      date: "2024-03-05",
      status: "safe",
    },
  ];

  const handleProfileSave = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.fullName,
        avatar_url: profile.avatar,
      })
      .eq("id", user.id);

    if (error) {
      toast({
        title: language === "vi" ? "Lỗi" : "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t.profileUpdated || "Cập nhật thông tin thành công",
        description: t.profileUpdatedDesc || "Thông tin cá nhân đã được cập nhật",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: t.passwordMismatch,
        variant: "destructive",
      });
      return;
    }

    if (passwords.new.length < 6) {
      toast({
        title: language === "vi" ? "Mật khẩu quá ngắn" : "Password too short",
        description: language === "vi" ? "Mật khẩu phải có ít nhất 6 ký tự" : "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwords.new,
    });

    if (error) {
      toast({
        title: language === "vi" ? "Lỗi" : "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t.passwordChanged || "Đổi mật khẩu thành công",
        description: t.passwordChangedDesc || "Mật khẩu của bạn đã được cập nhật",
      });
      setPasswords({ current: "", new: "", confirm: "" });
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newAvatar = reader.result as string;
        setProfile({ ...profile, avatar: newAvatar });
        
        // Update in database
        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: newAvatar })
          .eq("id", user.id);

        if (error) {
          toast({
            title: language === "vi" ? "Lỗi" : "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: t.avatarUpdated || "Cập nhật ảnh đại diện thành công",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{language === "vi" ? "Đang tải..." : "Loading..."}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t.profileTitle || "Thông tin cá nhân"}</h1>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t.dashboard}
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {t.profileTab || "Hồ sơ"}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t.settingsTab || "Cài đặt"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.label} className="p-6 bg-card/80 backdrop-blur border-border/50 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                          <p className="text-4xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-full bg-primary/10`}>
                          <Icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Recent Contracts */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t.recentContracts}</CardTitle>
                    <Button variant="outline" size="sm">
                      {t.viewAll}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentContracts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t.noContracts}</p>
                  ) : (
                    <div className="space-y-4">
                      {recentContracts.map((contract, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{contract.name}</p>
                              <p className="text-sm text-muted-foreground">{contract.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                contract.status === "safe"
                                  ? "bg-success/20 text-success"
                                  : contract.status === "caution"
                                  ? "bg-warning/20 text-warning"
                                  : "bg-danger/20 text-danger"
                              }`}
                            >
                              {t[contract.status as keyof typeof t]}
                            </span>
                            <Button variant="ghost" size="sm">
                              {t.viewTemplate}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t.personalInfo || "Thông tin cá nhân"}</CardTitle>
                <CardDescription>
                  {t.personalInfoDesc || "Cập nhật thông tin cá nhân của bạn"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-2xl">
                      {profile.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {t.uploadAvatar || "Tải ảnh đại diện"}
                  </Button>
                </div>

                <div className="space-y-4">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Change Password Section */}
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

              {/* Account Settings */}
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
