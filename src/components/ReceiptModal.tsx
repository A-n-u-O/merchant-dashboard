"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { X, FileText, Calendar, Hash, Tag, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export const ReceiptModal = () => {
  const { selectedTransaction, setSelectedTransaction } = useTransactionStore();

  if (!selectedTransaction) return null;

  const tx = selectedTransaction;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Receipt Header */}
        <div className="bg-blue-600 p-6 text-white text-center relative">
          <button 
            onClick={() => setSelectedTransaction(null)}
            className="absolute right-4 top-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black">Transaction Receipt</h2>
          <p className="text-blue-100 text-sm mt-1">{tx.reference}</p>
        </div>

        {/* Receipt Body */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
            <p className={`text-4xl font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'}`}>
              ₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-6 space-y-4">
            <DetailRow icon={<Calendar />} label="Date & Time" value={new Date(tx.date).toLocaleString()} />
            <DetailRow icon={<Tag />} label="Service Category" value={tx.category} />
            <DetailRow icon={<Hash />} label="Narrative" value={tx.description} />
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                 Status
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                tx.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                tx.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {tx.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-gray-50 flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-all"
          >
            Download PDF
          </button>
          <button 
            onClick={() => setSelectedTransaction(null)}
            className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex justify-between items-start">
    <div className="flex items-center gap-2 text-gray-400">
      {icon && <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>}
      <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-900 text-right max-w-[60%]">{value}</span>
  </div>
);