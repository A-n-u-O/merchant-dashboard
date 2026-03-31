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

        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          isProcessing: true,
        }));

        try {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          if (Math.random() < 0.1) throw new Error("Gateway Timeout");

          set((state) => ({
            transactions: state.transactions.map((tx) =>
              tx.reference === reference ? { ...tx, status: "success" } : tx
            ),
            isProcessing: false,
          }));

          toast.success("Settlement Successful", { description: reference });
        } catch (error: any) {
          set((state) => ({
            transactions: state.transactions.map((tx) =>
              tx.reference === reference ? { ...tx, status: "failed" } : tx
            ),
            isProcessing: false,
          }));

          toast.error("Settlement Failed", { description: error.message });
        }
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