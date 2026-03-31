"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ShieldCheck, Store, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransactionStore } from "@/store/useTransactionStore";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [businessName, setBusinessName] = useState("");

    const { setUser, fetchProfile } = useTransactionStore();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("Attempting Auth for:", email); // Debugging

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                setUser(data.user);
                await fetchProfile();
                router.push("/");
            } else {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;

                if (data.user) {
                    // IMPORTANT: We wait a split second for the Auth user to propagate
                    const { error: pError } = await supabase.from('profiles').insert([
                        {
                            id: data.user.id,
                            business_name: businessName,
                            merchant_id: `MID-${Math.floor(100000 + Math.random() * 900000)}`
                        }
                    ]);
                    if (pError) console.error("Profile DB Error:", pError);

                    setUser(data.user);
                    router.push("/");
                }
            }
        } catch (error: any) {
            console.error("Full Auth Error:", error);
            toast.error(error.message || "Check your credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen premium-gradient flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs to kill the AI look */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md p-10 rounded-[3rem] relative shadow-2xl border-white/40"
            >
                <div className="mb-10 text-center">
                    <div className="relative inline-block">
                        <div className="absolute -inset-1 bg-blue-600 rounded-2xl blur opacity-25"></div>
                        <div className="relative w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                            <ShieldCheck className="text-white w-7 h-7" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter mt-6">
                        {isLogin ? "Portal Access" : "Join the Ledger"}
                    </h1>
                    <p className="text-gray-400 text-sm mt-2 font-medium">
                        Enterprise settlement monitoring.
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-1.5"
                            >
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Business Identity</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-blue-500 rounded-2xl blur opacity-0 group-focus-within:opacity-10 transition duration-500"></div>
                                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        required
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-blue-600 focus:bg-white transition-all duration-300 outline-none" placeholder="e.g. Anu Ventures"
                                        style={{ color: '#111827' }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-blue-600 focus:bg-white transition-all duration-300 outline-none" placeholder="name@company.com"
                                style={{ color: '#111827' }}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-blue-600 focus:bg-white transition-all duration-300 outline-none" placeholder="••••••••"
                                style={{ color: '#111827' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative group h-16"
                    >
                        <div className="absolute -inset-0.5 bg-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative h-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3">
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                <>{isLogin ? "Confirm Identity" : "Launch Ledger"} <ArrowRight className="w-4 h-4" /></>
                            )}
                        </div>
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100/50 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                    >
                        {isLogin ? "Create New Merchant Account" : "Return to Secure Login"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}