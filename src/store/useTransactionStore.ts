"use client";

import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export type TransactionStatus = "pending" | "success" | "failed";
export type TransactionType = "credit" | "debit";

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  category: string;
  date: string;
}

interface MerchantProfile {
  businessName: string;
  merchantId: string;
  tier: "Level 1" | "Level 2" | "Kyc Verified";
}

interface TransactionStore {
  // Authentication State
  user: any | null;
  setUser: (user: any) => void;
  signOut: () => Promise<void>;

  // Data State
  transactions: Transaction[];
  isProcessing: boolean;
  filters: {
    status: TransactionStatus | "all";
    type: TransactionType | "all";
  };
  searchQuery: string;
  selectedTransaction: Transaction | null;
  profile: MerchantProfile;
  
  // Cloud Actions
  fetchProfile: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addTransaction: (data: Omit<Transaction, "id" | "reference" | "status" | "date">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // UI Actions
  setFilter: (filterType: "status" | "type", value: string) => void;
  resetFilters: () => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  updateProfile: (data: Partial<MerchantProfile>) => void;
  setSearchQuery: (query: string) => void;
}

const armoredStorage: StateStorage = {
  getItem: (name) => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(name);
      }
    } catch (e) {}
    return null;
  },
  setItem: (name, value) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(name, value);
      }
    } catch (e) {}
  },
  removeItem: (name) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(name);
      }
    } catch (e) {}
  },
};

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      // --- AUTH INITIAL STATE ---
      user: null,
      setUser: (user) => set({ user }),
      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, transactions: [], profile: { businessName: "Merchant Portal", merchantId: "N/A", tier: "Level 1" } });
        window.location.href = "/login";
      },

      // --- DATA INITIAL STATE ---
      transactions: [],
      isProcessing: false,
      filters: { status: "all", type: "all" },
      searchQuery: "",
      selectedTransaction: null,
      profile: {
        businessName: "Merchant Portal",
        merchantId: "MID-XXXXXX",
        tier: "Level 1",
      },

      // --- CLOUD ACTIONS ---

      fetchProfile: async () => {
        const user = get().user;
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('business_name, merchant_id, tier')
          .eq('id', user.id)
          .single();

        if (data && !error) {
          set({
            profile: {
              businessName: data.business_name,
              merchantId: data.merchant_id,
              tier: data.tier,
            }
          });
        }
      },

      fetchTransactions: async () => {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          toast.error("Sync Failed", { description: error.message });
        } else {
          set({ 
            transactions: data.map((tx: any) => ({ ...tx, date: tx.created_at })) 
          });
        }
      },

      addTransaction: async (data) => {
        const reference = `MNP-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
        const tempId = crypto.randomUUID();
        const user = get().user;

        if (!user) {
          toast.error("Authentication required");
          return;
        }

        const newTx: Transaction = { ...data, id: tempId, reference, date: new Date().toISOString(), status: "pending" };
        set((state) => ({ transactions: [newTx, ...state.transactions], isProcessing: true }));

        const settlementPromise = new Promise(async (resolve, reject) => {
          try {
            const { error } = await supabase.from("transactions").insert([
              {
                ...data,
                reference,
                user_id: user.id,
                status: "success",
              },
            ]);

            if (error) throw error;

            set((state) => ({
              transactions: state.transactions.map((tx) =>
                tx.id === tempId ? { ...tx, status: "success" } : tx
              ),
              isProcessing: false,
            }));
            resolve(reference);
          } catch (error: any) {
            set((state) => ({
              transactions: state.transactions.map((tx) =>
                tx.id === tempId ? { ...tx, status: "failed" } : tx
              ),
              isProcessing: false,
            }));
            reject(error);
          }
        });

        // We don't "return" the toast.promise, we just call it.
        toast.promise(settlementPromise, {
          loading: "Authorizing Settlement...",
          success: (ref) => `Settlement ${ref} Finalized`,
          error: (err) => `Failed: ${err.message}`,
        });
      },

      deleteTransaction: async (id) => {
        const { error } = await supabase.from("transactions").delete().eq("id", id);
        
        if (error) {
          toast.error("Delete Failed");
          return;
        }

        set((state) => ({ transactions: state.transactions.filter((tx) => tx.id !== id) }));
        toast.success("Transaction Purged");
      },

      // --- UI ACTIONS ---
      setFilter: (filterType, value) => set((state) => ({ filters: { ...state.filters, [filterType]: value as any } })),
      resetFilters: () => set({ filters: { status: "all", type: "all" } }),
      setSelectedTransaction: (tx) => set({ selectedTransaction: tx }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
    }),
    {
      name: "moniepoint-auth-store",
      storage: createJSONStorage(() => armoredStorage),
      partialize: (state) => ({ profile: state.profile, user: state.user }),
      skipHydration: true,
    }
  )
);