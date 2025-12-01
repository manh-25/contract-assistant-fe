import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  // Sửa lại kiểu dữ liệu cho hàm signIn (nếu cần)
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  // Cập nhật hàm signUp để nhận thêm fullName
  signUp: (email: string, password: string, metaData?: { fullName: string }) => Promise<{ error: any }>;
  // Thêm hàm resetPassword
  resetPassword: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy session hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Lắng nghe sự thay đổi auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 1. Hàm Đăng nhập
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  // 2. Hàm Đăng ký (Đã cập nhật để lưu Full Name)
  const signUp = async (email: string, password: string, metaData?: { fullName: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metaData?.fullName, // Lưu tên vào user_metadata của Supabase
        },
      },
    });
    return { error };
  };

  // 3. Hàm Quên mật khẩu (Mới thêm)
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // URL này sẽ trỏ về trang đổi mật khẩu của bạn (nếu có)
      redirectTo: window.location.origin + "/reset-password",
    });
    return { error };
  };

  // 4. Hàm Đăng xuất
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};