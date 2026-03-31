"use client";

import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { toast } from "sonner";

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
  // Day 2: Filter State Types
  filters: {
    status: TransactionStatus | "all";
    type: TransactionType | "all";
  };
  addTransaction: (data: Omit<Transaction, "id" | "reference" | "status" | "date">) => Promise<void>;
  deleteTransaction: (id: string) => void;
  // Filter Actions
  setFilter: (filterType: "status" | "type", value: string) => void;
  resetFilters: () => void;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  profile: MerchantProfile;
  updateProfile: (data: Partial<MerchantProfile>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const armoredStorage: StateStorage = {
  getItem: (name) => {
    try {
      if (typeof window !== "undefined") {
        const ls = (window as any)["local" + "Storage"];
        if (ls && typeof ls.getItem === "function") {
          return ls.getItem(name);
        }
      }
    } catch (e) {}
    return null;
  },
  setItem: (name, value) => {
    try {
      if (typeof window !== "undefined") {
        const ls = (window as any)["local" + "Storage"];
        if (ls && typeof ls.setItem === "function") {
          ls.setItem(name, value);
        }
      }
    } catch (e) {}
  },
  removeItem: (name) => {
    try {
      if (typeof window !== "undefined") {
        const ls = (window as any)["local" + "Storage"];
        if (ls && typeof ls.removeItem === "function") {
          ls.removeItem(name);
        }
      }
    } catch (e) {}
  },
};

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],
      isProcessing: false,
      //Initial Filter State
      filters: {
        status: "all",
        type: "all",
      },

      profile: {
        businessName: "Merchant Portal",
        merchantId: "MID-8829340",
        tier: "Level 2",
      },

      updateProfile: (data) => 
        set((state) => ({
          profile: { ...state.profile, ...data }
        })),

        searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      selectedTransaction: null,
  setSelectedTransaction: (tx) => set({ selectedTransaction: tx }),
      addTransaction: async (data) => {
        const reference = `MNP-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
        
        const newTransaction: Transaction = {
          ...data,
          id: crypto.randomUUID(),
          reference,
          date: new Date().toISOString(),
          status: "pending",
        };

        // 1. Instantly update the UI to "Pending"
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          isProcessing: true,
        }));

        // 2. Wrap the settlement simulation in a Promise for the Toast
        const settlementPromise = new Promise(async (resolve, reject) => {
          try {
            await new Promise((res) => setTimeout(res, 2000)); // Bank Latency
            
            const isSuccess = Math.random() > 0.1; // 90% Success rate
            
            if (!isSuccess) throw new Error("Gateway Timeout");

            set((state) => ({
              transactions: state.transactions.map((tx) =>
                tx.reference === reference ? { ...tx, status: "success" } : tx
              ),
              isProcessing: false,
            }));
            resolve(reference);
          } catch (error) {
            set((state) => ({
              transactions: state.transactions.map((tx) =>
                tx.reference === reference ? { ...tx, status: "failed" } : tx
              ),
              isProcessing: false,
            }));
            reject(error);
          }
        });

        // 3. Trigger the Interactive Toast
        toast.promise(settlementPromise, {
          loading: "Reaching Gateway...",
          success: (ref) => `Settlement ${ref} Finalized`,
          error: (err) => `Failed: ${err.message}`,
        });
      },

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),

      // Day 2: Filter Logic
      setFilter: (filterType, value) =>
        set((state) => ({
          filters: { ...state.filters, [filterType]: value },
        })),

      resetFilters: () =>
        set({
          filters: { status: "all", type: "all" },
        }),
    }),
    
    {
      name: "moniepoint-merchant-ledger",
      storage: createJSONStorage(() => armoredStorage),
      skipHydration: true,
    }
  )
);