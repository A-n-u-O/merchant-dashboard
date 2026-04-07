"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ArrowRight,
  ShieldCheck,
  Store,
  Mail,
  Lock,
  Globe,
  Zap,
  Eye,
  EyeOff,
  BarChart3
} from "lucide-react"; import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransactionStore } from "@/store/useTransactionStore";
import { supabase } from "@/lib/supabase";

const marketingSlides = [
  {
    icon: <BarChart3 className="w-12 h-12 text-blue-500" />,
    title: "Track Every Kobo",
    subtitle: "Stop guessing your profits. See exactly where your money is coming from and where it's going—all in one clean dashboard.",
  },
  {
    icon: <Zap className="w-12 h-12 text-amber-500" />,
    title: "Instant Paystack Sync",
    subtitle: "Connect your Paystack account and watch your settlements appear automatically. No more manual spreadsheets.",
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-emerald-500" />,
    title: "Built for Growth",
    subtitle: "Whether you're a side-hustler or a growing startup, our ledger scales with your business volume and security needs.",
  },
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");

  const { setUser, fetchProfile } = useTransactionStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % marketingSlides.length);
    }, 4500); // Slightly slower for better reading
    return () => clearInterval(interval);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        setUser(data.user);
        await fetchProfile();
        const freshProfile = useTransactionStore.getState().profile;
        toast.success(`Welcome back, ${freshProfile.businessName || 'Business Owner'}`);
        router.push("/");
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: data.user.id,
              business_name: businessName,
              merchant_id: `MID-${Math.floor(100000 + Math.random() * 900000)}`,
              tier: "Basic"
            }
          ]);

          if (profileError) throw profileError;

          setUser(data.user);
          await fetchProfile();
          toast.success("Welcome to the Ledger!");
          router.push("/");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      {/* Soft Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative z-10">

        {/* Left: Simplified Form Panel */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isLogin ? "Welcome back" : "Start your ledger"}
            </h1>
            <p className="text-slate-500 mt-2">
              {isLogin ? "Login to manage your business transactions." : "Create an account to track your daily sales and settlements."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 ml-1">Registered Business Name</label>
                <div className="relative group">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                    placeholder="e.g. Anu Ventures"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2 shadow-lg shadow-blue-200"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>{isLogin ? "Sign In" : "Create My Account"} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>

        {/* Right: Informative Marketing Panel */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-slate-900 p-12 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-32 -mt-32" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center max-w-sm"
            >
              <div className="mx-auto mb-8 w-20 h-20 bg-white/5 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/10">
                {marketingSlides[currentSlide].icon}
              </div>

              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                {marketingSlides[currentSlide].title}
              </h2>
              <p className="text-slate-400 leading-relaxed">
                {marketingSlides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2 mt-12">
            {marketingSlides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-blue-500 w-6" : "bg-white/20 w-1.5"}`}
              />
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 w-full text-center">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Trust by Local Merchants</p>
          </div>
        </div>
      </div>
    </div>
  );
}