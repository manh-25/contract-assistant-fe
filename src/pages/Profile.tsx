import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/lib/translations"; // Đảm bảo đường dẫn này đúng trong dự án của bạn
import { Language } from "@/components/LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, FileSearch, PenTool, Camera, 
  PenTool as EditIcon, Save, X, ChevronRight, TrendingUp 
} from "lucide-react";
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
  
  // State
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Auth Check
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  // Fetch Data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
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

  // Save Profile
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
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: t.profileUpdated || "Success", description: t.profileUpdatedDesc });
      setIsEditing(false);
    }
  };

  // Avatar Upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newAvatar = reader.result as string;
        setProfile({ ...profile, avatar: newAvatar });
        await supabase.from("profiles").update({ avatar_url: newAvatar }).eq("id", user.id);
        toast({ title: t.avatarUpdated });
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock Data
  const stats = [
    { label: t.totalContracts, value: "12", icon: FileText, color: "text-[#496DFF]", bg: "bg-blue-50" },
    { label: t.reviewsCompleted, value: "8", icon: FileSearch, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: t.contractsCreated, value: "4", icon: PenTool, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const recentContracts = [
    { name: language === "vi" ? "Hợp đồng thuê nhà" : "House Rental Agreement", date: "2024-03-15", status: "safe" },
    { name: language === "vi" ? "Hợp đồng lao động" : "Employment Contract", date: "2024-03-10", status: "caution" },
    { name: language === "vi" ? "Hợp đồng mua bán" : "Sales Agreement", date: "2024-03-05", status: "safe" },
  ];

  if (loading || loadingProfile) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 font-sans text-slate-900">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#1A1C4B]">
            {language === "vi" ? `Xin chào, ${profile.fullName || "User"}` : `Welcome back, ${profile.fullName || "User"}`}
          </h1>
          <p className="text-slate-500 mt-1">
            {language === "vi" ? "Tổng quan tài khoản và hoạt động của bạn" : "Account overview and recent activity"}
          </p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-slate-100 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#1A1C4B]">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Grid: Left (Profile) - Right (Activity) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: User Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-slate-100 shadow-sm h-full">
              <CardHeader className="border-b border-slate-50 pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-[#1A1C4B]">{t.profileTab || "Profile"}</CardTitle>
                  {!isEditing ? (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-[#496DFF] hover:bg-blue-50">
                      <EditIcon className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-red-500 hover:bg-red-50">
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage src={profile.avatar} className="object-cover"/>
                      <AvatarFallback className="text-4xl bg-[#1A1C4B] text-white">
                        {profile.fullName.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div 
                        className="absolute bottom-0 right-0 bg-[#496DFF] p-2 rounded-full cursor-pointer hover:bg-blue-600 transition shadow-md text-white"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>

                {/* Info Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.fullName}</Label>
                    <Input
                      disabled={!isEditing}
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className={`h-10 ${!isEditing ? "bg-slate-50 border-transparent text-[#1A1C4B] font-semibold" : "bg-white border-blue-200"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.email}</Label>
                    <Input
                      disabled
                      value={profile.email}
                      className="h-10 bg-slate-50 border-transparent text-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.phone}</Label>
                    <Input
                      disabled={!isEditing}
                      value={profile.phone}
                      placeholder={isEditing ? "+84..." : "Not provided"}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className={`h-10 ${!isEditing ? "bg-slate-50 border-transparent text-[#1A1C4B] font-semibold" : "bg-white border-blue-200"}`}
                    />
                  </div>
                  
                  {isEditing && (
                    <Button onClick={handleProfileSave} className="w-full bg-[#496DFF] hover:bg-[#3b5bdb] mt-4">
                      <Save className="w-4 h-4 mr-2" /> {t.saveChanges}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Recent Activity / Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-100 shadow-sm h-full">
              <CardHeader className="border-b border-slate-50 pb-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-[#1A1C4B] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#496DFF]" />
                    {t.recentContracts}
                  </CardTitle>
                </div>
                <Button variant="ghost" onClick={() => navigate("/quick-review")} className="text-[#496DFF] hover:bg-blue-50">
                  {t.viewAll} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                {recentContracts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400">{t.noContracts}</p>
                    <Button onClick={() => navigate("/quick-review")} variant="link" className="text-[#496DFF]">Create one now</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentContracts.map((contract, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group cursor-pointer"
                        onClick={() => navigate("/templates")}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-[#496DFF] group-hover:text-white transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1A1C4B]">{contract.name}</p>
                            <p className="text-sm text-slate-500">{contract.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                              contract.status === "safe" ? "bg-emerald-100 text-emerald-600" : 
                              contract.status === "caution" ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"
                            }`}>
                            {t[contract.status as keyof typeof t]}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#496DFF]" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;