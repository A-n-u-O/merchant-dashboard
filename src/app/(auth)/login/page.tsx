"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ShieldCheck, Store, Mail, Lock, Globe, Zap, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransactionStore } from "@/store/useTransactionStore";
import { supabase } from "@/lib/supabase";

const rightPanelContent = [
  {
    icon: <Globe className="w-12 h-12 text-indigo-500" />,
    title: "Global Settlements",
    subtitle: "Instant cross-border visibility for your merchant accounts",
  },
  {
    icon: <Zap className="w-12 h-12 text-teal-500" />,
    title: "Lightning Fast",
    subtitle: "Real-time ledger updates with bank-grade reliability",
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-violet-500" />,
    title: "Ironclad Security",
    subtitle: "Enterprise-grade protection for every transaction",
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
  
  // Destructure the actions we need from the store
  const { setUser, fetchProfile } = useTransactionStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % rightPanelContent.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // 1. Set the user in global state
        setUser(data.user);
        
        // 2. Force wait for profile data to hit the store
        await fetchProfile();
        
        // 3. Get the fresh name from the store for the toast
        const freshProfile = useTransactionStore.getState().profile;
        // toast.success(`Welcome back, ${freshProfile.businessName || 'Merchant'}`);
        
        router.push("/");
      } else {
        // --- SIGNUP FLOW ---
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        if (data.user) {
          // Create the profile record in Supabase
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: data.user.id,
              business_name: businessName,
              merchant_id: `MID-${Math.floor(100000 + Math.random() * 900000)}`,
              tier: "Level 1"
            }
          ]);
          
          if (profileError) throw profileError;

          setUser(data.user);
          await fetchProfile();
          toast.success("Merchant Account Activated");
          router.push("/");
        }
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      toast.error(error.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen premium-gradient flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[140px] orb pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[700px] h-[700px] bg-teal-400/15 rounded-full blur-[160px] orb pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl gap-12 items-center relative z-10">
        
        {/* Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card w-full max-w-md mx-auto p-10 rounded-[2.5rem] shadow-2xl border border-white/40 bg-white/80 backdrop-blur-xl"
        >
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <ShieldCheck className="text-white w-9 h-9" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 mt-6 uppercase">
              {isLogin ? "Portal Access" : "Join the Ledger"}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Bank-grade settlement monitoring</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="business-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Identity</label>
                  <div className="relative group">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
                      placeholder="e.g. Anu Ventures"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Identifier</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
                  placeholder="name@merchant.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 active:scale-95 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                <>{isLogin ? "Authenticate Ledger" : "Create Merchant Account"} <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 hover:text-indigo-600 transition-colors underline decoration-slate-200"
            >
              {isLogin ? "Need a merchant license? Sign Up" : "Registered Merchant? Log In"}
            </button>
          </div>
        </motion.div>

        {/* Marketing Panel */}
        <div className="hidden lg:flex flex-col items-center justify-center h-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-sm"
            >
              <div className="mx-auto mb-10 w-24 h-24 bg-white/40 backdrop-blur-2xl rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/50">
                {rightPanelContent[currentSlide].icon}
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6 uppercase leading-[0.9]">
                {rightPanelContent[currentSlide].title}
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                {rightPanelContent[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-3 mt-12">
            {rightPanelContent.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? "bg-indigo-600 w-8" : "bg-slate-300 w-2"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}