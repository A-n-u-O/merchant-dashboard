"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Trash2, Hash, CheckCircle2, Clock, AlertCircle, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <span className={`flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${styles[status]}`}>
      {icons[status]} {status.toUpperCase()}
    </span>
  );
};

export const TransactionList = () => {
  const { 
    transactions, 
    deleteTransaction, 
    filters, 
    setSelectedTransaction,
    searchQuery 
  } = useTransactionStore();

  const filteredTransactions = transactions.filter((tx) => {
    const statusMatch = filters.status === "all" || tx.status === filters.status;
    const typeMatch = filters.type === "all" || tx.type === filters.type;
    
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = 
      tx.reference.toLowerCase().includes(searchLower) ||
      tx.category.toLowerCase().includes(searchLower) ||
      tx.description.toLowerCase().includes(searchLower);

    return statusMatch && typeMatch && searchMatch;
  });

  if (transactions.length === 0) {
    return (
      <div className="glass-card p-12 rounded-[2rem] text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Hash className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No records found</h3>
        <p className="text-gray-500 max-w-xs mx-auto text-sm mt-1">Your cloud-synced ledger is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl">
      <div className="p-6 border-b border-gray-100/50 flex items-center justify-between bg-white/30">
        <h2 className="text-lg font-bold text-gray-900">Settlement History</h2>
        <div className="flex items-center gap-2">
          {(filters.status !== "all" || filters.type !== "all" || searchQuery !== "") && (
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
              Filtered
            </span>
          )}
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg uppercase tracking-tight">
            {filteredTransactions.length} Entries
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Ref</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <AnimatePresence mode="popLayout">
              {filteredTransactions.map((tx, index) => (
                <motion.tr 
                  key={tx.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: index * 0.03, ease: "easeOut" }}
                  onClick={() => setSelectedTransaction(tx)} 
                  className="hover:bg-white/60 transition-colors cursor-pointer group"
                >
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
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTransaction(tx.id);
                      }} 
                      className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Inbox className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-sm font-bold text-gray-900">No matches found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};