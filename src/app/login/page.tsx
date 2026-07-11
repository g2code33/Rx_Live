"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "fan",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
      
      // Redirect based on role
      const userRole = data.user?.role || 'fan';
      if (userRole === 'admin' || userRole === 'team_owner') {
        router.push("/dashboard");
      } else if (userRole === 'media') {
        router.push("/media");
      } else {
        router.push("/");
      }
      
      router.refresh();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.error("Request timed out. Please try again.");
      } else {
        toast.error(error.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#161B22',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center">
            <div className="w-16 h-16 relative">
              <img src="/rx-live-logo.svg" alt="Rx Live" className="w-full h-full object-contain" />
            </div>
          </Link>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mt-4 text-white">
            {isLogin ? "Welcome Back" : "Join Rx Live"}
          </h1>
          <p className="text-white/40 text-sm mt-2">
            {isLogin ? "Sign in to continue" : "Create your free account"}
          </p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-[2rem] p-8 border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-green transition-colors"
                    placeholder="John Doe"
                    required={!isLogin}
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                    👤
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase().trim() })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-green transition-colors"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-green transition-colors"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "fan", label: "Fan", icon: "🎉" },
                    { id: "media", label: "Media", icon: "📰" },
                    { id: "admin", label: "Admin", icon: "👑" },
                    { id: "team_owner", label: "Team Owner", icon: "🏆" },
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.id })}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                        formData.role === role.id
                          ? "bg-brand-green/10 border-brand-green text-brand-green"
                          : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                      }`}
                      disabled={loading}
                    >
                      <span>{role.icon}</span>
                      <span className="text-xs font-black uppercase tracking-widest">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-green text-black py-4 rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Please wait...</span>
                </>
              ) : (
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand-green font-black uppercase tracking-widest hover:underline disabled:opacity-50"
                disabled={loading}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 glass-light rounded-2xl p-6 border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Quick Login</p>
          <div className="space-y-2 text-xs">
            <button
              onClick={() => setFormData({ email: "admin@rx-live.com", password: "admin123", name: "", role: "admin" })}
              className="w-full text-left p-2 rounded hover:bg-white/5 transition-colors flex justify-between items-center"
            >
              <span className="text-white/60">Admin:</span>
              <span className="text-white/40 font-mono">admin@rx-live.com</span>
            </button>
            <button
              onClick={() => setFormData({ email: "fan@rx-live.com", password: "fan123", name: "", role: "fan" })}
              className="w-full text-left p-2 rounded hover:bg-white/5 transition-colors flex justify-between items-center"
            >
              <span className="text-white/60">Fan:</span>
              <span className="text-white/40 font-mono">fan@rx-live.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
