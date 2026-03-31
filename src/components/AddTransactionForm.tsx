"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Loader2, PlusCircle, Tag, Hash } from "lucide-react";
import { useState } from "react";

export const AddTransactionForm = () => {
  const { addTransaction, isProcessing } = useTransactionStore();

  const [type, setType] = useState<"credit" | "debit">("credit");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || !description) return alert("Please fill all business fields.");

    await addTransaction({
      type,
      category,
      description,
      amount: parseFloat(amount),
    });

    setCategory("");
    setAmount("");
    setDescription("");
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <PlusCircle className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900">New Settlement</h2>
          <p className="text-sm text-gray-500 font-medium">Initiate a ledger entry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setType("credit")} className={`py-3 rounded-xl border-2 font-bold transition-all ${type === "credit" ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-100 bg-gray-50 text-gray-400"}`}>Credit Inflow</button>
          <button type="button" onClick={() => setType("debit")} className={`py-3 rounded-xl border-2 font-bold transition-all ${type === "debit" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 bg-gray-50 text-gray-400"}`}>Debit Outflow</button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-gray-400">Amount (NGN)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₦</span>
            <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-gray-400">Service Type</label>
          <div className="relative">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none appearance-none">
              <option value="">Select Service</option>
              <option value="POS Terminal">POS Terminal</option>
              <option value="Web Transfer">Web Transfer</option>
              <option value="Card Settlement">Card Settlement</option>
              <option value="Refund">Refund</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-gray-400">Description</label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Internal reference" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
        </div>

        <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-600/20">
          {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : "Initiate Settlement"}
        </button>
      </form>
    </div>
  );
};