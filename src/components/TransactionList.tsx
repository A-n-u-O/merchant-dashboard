"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Calendar, Tag, Trash2, Hash, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

// 1. Status Badge Component for high-trust UI
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
    <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      {icons[status]}
      {status.toUpperCase()}
    </span>
  );
};

export const TransactionList = () => {
  const { transactions, deleteTransaction } = useTransactionStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Hash className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No records found</h3>
        <p className="text-gray-500 max-w-xs mx-auto text-sm">Your merchant ledger is currently empty. Initiate a settlement to see entries here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Transaction Ledger</h2>
          <p className="text-sm text-gray-500">Real-time settlement history</p>
        </div>
        <div className="bg-blue-50 px-3 py-1 rounded-md">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-tight">{transactions.length} Entries</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Ref</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Service/Narrative</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </div>
                  <div className="text-[10px] font-mono text-gray-400 mt-0.5">{tx.reference}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-800">{tx.category}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[150px]">{tx.description}</div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {tx.type === 'credit' ? '+' : '-'} ₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="p-1.5 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};