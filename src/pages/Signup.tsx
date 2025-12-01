import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Icon Google (Tái sử dụng)
const GoogleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

// Schema Validate: Thêm confirm password
const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const Signup = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth(); // Giả sử hook có hàm signUp
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = signupSchema.safeParse(formData);

    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, { fullName: formData.fullName });
      if (error) throw error;
      
      toast({ title: "Account created successfully! Please check your email." });
      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-screen bg-[#050A18] overflow-hidden font-sans">
      
      {/* GRID LAYOUT: Khớp thông số Login */}
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-x-[20px] px-[10px]">
        
        {/* LEFT SIDE: JOIN US */}
        <div className="hidden lg:flex lg:col-start-2 lg:col-span-6 flex-col justify-center text-white relative z-10">
          <div className="absolute top-0 -left-[20%] w-[150%] h-full bg-[radial-gradient(circle_at_30%_50%,_rgba(73,109,255,0.08),_transparent)] pointer-events-none" />

          <div className="relative space-y-12">
            <div className="flex items-center gap-4">
              <div className="border border-white/20 bg-white/5 px-4 py-2 rounded text-xs font-bold tracking-[0.2em] uppercase text-white/90">
                Logo
              </div>
              <span className="text-xl font-bold tracking-[0.15em]">AGREEME</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-8xl xl:text-9xl font-bold tracking-tight text-white leading-none">
                JOIN US,
              </h1>
              <p className="text-gray-400 text-xl max-w-lg leading-relaxed font-light">
                Create your account to start analyzing contracts <br/>
                with the power of Artificial Intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Panel): Cột 9 -> 11 */}
        <div className="col-span-1 lg:col-start-9 lg:col-span-3 flex flex-col justify-end h-full relative z-20 pb-0">
          
          <div className="bg-white w-full h-[92%] rounded-t-[32px] lg:rounded-t-[40px] shadow-2xl p-8 lg:p-10 flex flex-col justify-center overflow-y-auto custom-scrollbar">
            
            <div className="w-full space-y-6">
              <div className="space-y-2">
                <h2 className="text-[#050A18] text-4xl font-bold tracking-tight">Sign Up</h2>
                <p className="text-gray-500 text-base">Create a new account today.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                   {/* Full Name */}
                   <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[#050A18] font-semibold text-base">
                      User Name
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="h-12 xl:h-14 border-gray-200 bg-gray-50 rounded-xl focus-visible:ring-1 focus-visible:ring-[#050A18] text-base px-4"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#050A18] font-semibold text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12 xl:h-14 border-gray-200 bg-gray-50 rounded-xl focus-visible:ring-1 focus-visible:ring-[#050A18] text-base px-4"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#050A18] font-semibold text-base">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 xl:h-14 border-gray-200 bg-gray-50 rounded-xl focus-visible:ring-1 focus-visible:ring-[#050A18] text-base px-4"
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#050A18] font-semibold text-base">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="h-12 xl:h-14 border-gray-200 bg-gray-50 rounded-xl focus-visible:ring-1 focus-visible:ring-[#050A18] text-base px-4"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 xl:h-14 bg-[#050A18] hover:bg-[#1a2333] text-white rounded-xl text-lg font-bold shadow-lg transition-all mt-2"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              {/* Divider & Google */}
              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider"><span className="bg-white px-2 text-gray-400 font-medium">Or</span></div>
              </div>
              <div className="text-center text-base text-gray-500">
                Already have an account?{" "}
                <span
                  className="text-[#496DFF] font-bold cursor-pointer hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;