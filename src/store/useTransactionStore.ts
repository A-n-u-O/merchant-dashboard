"use client";

import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase"; // Make sure you created this file!

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

// THE ARMOR (For local profile persistence)
const armoredStorage: StateStorage = {
  getItem: (name) => {
    try {
      if (typeof window !== "undefined") {
        const ls = (window as any)["local" + "Storage"];
        return ls?.getItem(name) || null;
      }
    } catch (e) {}
    return null;
  },
  setItem: (name, value) => {
    try {
      if (typeof window !== "undefined") {
        const ls = (window as any)["local" + "Storage"];
        ls?.setItem(name, value);
      }
    } catch (e) {}
  },
  removeItem: (name) => {
    try {
      if (typeof window !== "undefined") {
        const ls = (window as any)["local" + "Storage"];
        ls?.removeItem(name);
      }
    } catch (e) {}
  },
};

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      isProcessing: false,
      filters: { status: "all", type: "all" },
      searchQuery: "",
      selectedTransaction: null,
      profile: {
        businessName: "Merchant Portal",
        merchantId: "MID-8829340",
        tier: "Level 2",
      },

      // 1. CLOUD FETCH: Pull data from Supabase
      fetchTransactions: async () => {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          toast.error("Cloud Sync Failed", { description: error.message });
        } else {
          // Map DB columns to our Interface if necessary
          const mapped = data.map((tx: any) => ({
            ...tx,
            date: tx.created_at, // Mapping Postgres column to our frontend name
          }));
          set({ transactions: mapped });
        }
      },

      // 2. CLOUD INSERT: Optimistic Update + DB Sync
      addTransaction: async (data) => {
        const reference = `MNP-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
        const tempId = crypto.randomUUID();
        
        const newTransaction: Transaction = {
          ...data,
          id: tempId,
          reference,
          date: new Date().toISOString(),
          status: "pending",
        };

        // OPTIMISTIC UPDATE: UI feels instant
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          isProcessing: true,
        }));

        const settlementPromise = new Promise(async (resolve, reject) => {
          try {
            // Real Supabase Insert
            const { error } = await supabase.from("transactions").insert([
              {
                amount: data.amount,
                type: data.type,
                category: data.category,
                description: data.description,
                reference: reference,
                status: "success",
              },
            ]);

            if (error) throw error;

            // Update local state to success
            set((state) => ({
              transactions: state.transactions.map((tx) =>
                tx.id === tempId ? { ...tx, status: "success" } : tx
              ),
              isProcessing: false,
            }));
            resolve(reference);
          } catch (error: any) {
            // Rollback or show failure
            set((state) => ({
              transactions: state.transactions.map((tx) =>
                tx.id === tempId ? { ...tx, status: "failed" } : tx
              ),
              isProcessing: false,
            }));
            reject(error);
          }
        });

        toast.promise(settlementPromise, {
          loading: "Authorizing with Gateway...",
          success: (ref) => `Settlement ${ref} Confirmed`,
          error: (err) => `Gateway Error: ${err.message}`,
        });
      },

      // 3. CLOUD DELETE: Remove from DB
      deleteTransaction: async (id) => {
        const { error } = await supabase.from("transactions").delete().eq("id", id);

        if (error) {
          toast.error("Delete Failed", { description: error.message });
        } else {
          set((state) => ({
            transactions: state.transactions.filter((tx) => tx.id !== id),
          }));
          toast.success("Record Purged");
        }
      },

      // UI ACTIONS
      setFilter: (filterType, value) =>
        set((state) => ({ filters: { ...state.filters, [filterType]: value } })),
      resetFilters: () => set({ filters: { status: "all", type: "all" } }),
      setSelectedTransaction: (tx) => set({ selectedTransaction: tx }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
    }),
    {
      name: "moniepoint-merchant-ledger",
      storage: createJSONStorage(() => armoredStorage),
      // Only persist the profile locally, fetch transactions from cloud
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);