import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner"; // Highly recommended for Fintech UIs

export type TransactionStatus = 'pending' | 'success' | 'failed';
export type TransactionType = 'credit' | 'debit';

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

type State = {
  transactions: Transaction[];
  isProcessing: boolean; // UI should show a spinner when this is true
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  
  // Note: We now accept an Omit type because the Store generates the metadata
  addTransaction: (data: Omit<Transaction, "id" | "reference" | "status" | "date">) => Promise<void>;
  deleteTransaction: (id: string) => void;
};

export const useTransactionStore = create<State>()(
  persist(
    (set) => ({
      transactions: [],
      isProcessing: false,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addTransaction: async (data) => {
        // 1. Generate Fintech Metadata
        const reference = `MNP-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
        const newTransaction: Transaction = {
          ...data,
          id: crypto.randomUUID(),
          reference,
          date: new Date().toISOString(),
          status: 'pending', // Always start as pending
        };

        // 2. Optimistic Update (Show in ledger immediately)
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          isProcessing: true,
        }));

        try {
          // 3. Simulate Bank Latency (2 seconds)
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // 4. Simulate Success/Failure Logic (e.g., 10% failure rate)
          if (Math.random() < 0.1) {
            throw new Error("Insufficient Funds / Network Timeout");
          }

          // 5. Success State Update
          set((state) => ({
            transactions: state.transactions.map((tx) =>
              tx.reference === reference ? { ...tx, status: 'success' } : tx
            ),
            isProcessing: false,
          }));
          
          toast.success(`Settlement Confirmed: ${reference}`);
        } catch (error: any) {
          // 6. Failed State Update
          set((state) => ({
            transactions: state.transactions.map((tx) =>
              tx.reference === reference ? { ...tx, status: 'failed' } : tx
            ),
            isProcessing: false,
          }));
          
          toast.error(error.message || "Transaction Failed");
        }
      },

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),
    }),
    {
      name: 'merchant-ledger-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        return () => state?.setHasHydrated(true);
      },
    }
  )
);