"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ShieldCheck, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransactionStore } from "@/store/useTransactionStore";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [businessName, setBusinessName] = useState("");

    const { setUser, fetchProfile } = useTransactionStore();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (isLogin) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                toast.error(error.message);
            } else {
                setUser(data.user);      // 1. Save user to store
                await fetchProfile();    // 2. Pull their Business Name
                router.push("/");        // 3. Go to Dashboard
            }
        } else {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) {
                toast.error(error.message);
            } else if (data.user) {
                // Create their Business Profile in SQL
                await supabase.from('profiles').insert([
                    {
                        id: data.user.id,
                        business_name: businessName,
                        merchant_id: `MID-${Math.floor(Math.random() * 900000)}`
                    }
                ]);
                setUser(data.user);
                router.push("/");
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen premium-gradient flex items-center justify-center p-6">
            <motion.div
                layout
                className="glass-card w-full max-w-md p-8 rounded-[2.5rem] relative overflow-hidden"
            >
                <div className="mb-8 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
                        <ShieldCheck className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
                        {isLogin ? "Welcome Back" : "Start Ledgering"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-2 font-medium">
                        Secure access to your merchant settlements.
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Name</label>
                                <div className="relative mt-1">
                                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        required
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border-none rounded-2xl font-bold outline-none ring-2 ring-transparent focus:ring-blue-600/20 transition-all"
                                        placeholder="e.g. Anuoluwapo Ventures"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-4 bg-gray-50/50 border-none rounded-2xl font-bold outline-none ring-2 ring-transparent focus:ring-blue-600/20 transition-all mt-1"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-4 bg-gray-50/50 border-none rounded-2xl font-bold outline-none ring-2 ring-transparent focus:ring-blue-600/20 transition-all mt-1"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                            <>{isLogin ? "Secure Login" : "Create Merchant Account"} <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        {isLogin ? "New merchant? Create an account" : "Already have an account? Log in"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}