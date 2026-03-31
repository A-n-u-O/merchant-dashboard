"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Trash2, Hash, CheckCircle2, Clock, AlertCircle, Inbox } from "lucide-react";

const StatusBadge = ({ status }: { status: 'pending' | 'success' | 'failed' }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    failed: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const icons = {
    pending: <Clock className="w-3 h-3 animate-pulse" />,
    success: <CheckCircle2 className="w-3 h-3" />,
    failed: <AlertCircle className="w-3 h-3" />,
  };
  return (
    <span className={`flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {icons[status]} {status.toUpperCase()}
    </span>
  );
};

export const TransactionList = () => {
  // 1. Pull transactions, delete action, AND filters from the store
  const { transactions, deleteTransaction, filters, setSelectedTransaction } = useTransactionStore();

  // 2. DERIVED STATE: Filter the transactions based on current store filters
  const filteredTransactions = transactions.filter((tx) => {
    const statusMatch = filters.status === "all" || tx.status === filters.status;
    const typeMatch = filters.type === "all" || tx.type === filters.type;
    return statusMatch && typeMatch;
  });

  // Handle empty state (no transactions at all)
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Hash className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No records found</h3>
        <p className="text-gray-500 max-w-xs mx-auto text-sm mt-1">Your merchant ledger is currently empty. Initiate a settlement above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <h2 className="text-lg font-bold text-gray-900">Settlement History</h2>
        <div className="flex items-center gap-2">
          {/* Show count of filtered vs total if a filter is active */}
          {(filters.status !== "all" || filters.type !== "all") && (
            <span className="text-[10px] font-bold text-gray-400 uppercase">Filtered</span>
          )}
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-md uppercase tracking-tight">
            {filteredTransactions.length} Entries
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Ref</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Service</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {/* 3. Map over filteredTransactions instead of raw transactions */}
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} onClick={() => setSelectedTransaction(tx)} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">
                      {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 mt-1">{tx.reference}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-800">{tx.category}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px] mt-0.5">{tx.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {tx.type === 'credit' ? '+' : '-'} ₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      deleteTransaction(tx.id)
                    }} className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // Empty state specifically for when filters return nothing
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Inbox className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-sm font-medium">No transactions match these filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div >
  );
};