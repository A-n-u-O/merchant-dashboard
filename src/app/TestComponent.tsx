"use client";
import { useTransactionStore } from "@/store/useTransactionStore";

export default function TestComponent() {
  const { transactions, addTransaction } = useTransactionStore();

  const handleAddDummy = () => {
    // Note: We ONLY pass the business data. 
    // The Store generates the ID, Date, Reference, and Status.
    addTransaction({
      type: "credit", // Changed from "income"
      category: "Web Transfer", // Matches our Chart categories
      amount: 5000.50,
      description: "Sandbox Test Transaction",
    });
  };

  return (
    <div className="mt-4 p-6 bg-zinc-900 rounded-3xl border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-emerald-500 font-mono font-bold text-sm">ZUSTAND_STORE_DEBUG</h3>
        <button
          className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-500 transition-colors"
          onClick={handleAddDummy}
        >
          EXECUTE_DUMMY_CREDIT
        </button>
      </div>

      <pre className="mt-4 p-4 bg-black text-emerald-400 text-[10px] rounded-xl overflow-auto max-h-60 border border-zinc-800 font-mono">
        {transactions.length > 0 
          ? JSON.stringify(transactions, null, 2) 
          : "// No transactions in ledger"}
      </pre>
    </div>
  );
}