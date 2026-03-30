"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Calendar, CreditCard, Loader2, PlusCircle, Tag, Hash } from "lucide-react";
import { useEffect, useState } from "react";

export const AddTransactionForm = () => {
  // 1. Pull the processing state from the store
  const { addTransaction, isProcessing } = useTransactionStore();

  const [type, setType] = useState<"credit" | "debit">("credit");
  const [category, setCategory] = useState(""); // This will be "Service Type" (e.g., Transfer, POS)
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !amount || !description) return alert("Please fill all business fields.");

    // 2. Simplified Payload: Notice we don't send ID or Date anymore!
    // The store generates the Metadata (Reference, ID, Date, Status).
    await addTransaction({
      type,
      category,
      description,
      amount: parseFloat(amount),
    });

    // 3. Reset Form on success
    setCategory("");
    setAmount("");
    setDescription("");
  };

  if (!isMounted) return null;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <PlusCircle className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">New Settlement</h2>
          <p className="text-sm text-gray-500">Initiate a new transaction ledger entry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Transaction Type (Credit/Debit) */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setType("credit")}
            className={`py-3 rounded-xl border-2 font-medium transition-all ${
              type === "credit" ? "border-green-600 bg-green-50 text-green-700" : "border-gray-100 bg-gray-50 text-gray-500"
            }`}
          >
            Credit (Inflow)
          </button>
          <button
            type="button"
            onClick={() => setType("debit")}
            className={`py-3 rounded-xl border-2 font-medium transition-all ${
              type === "debit" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 bg-gray-50 text-gray-500"
            }`}
          >
            Debit (Outflow)
          </button>
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Amount (NGN)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-400">₦</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
          </div>
        </div>

        {/* Category / Service Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Service Type</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none appearance-none"
            >
              <option value="">Select Service</option>
              <option value="POS Terminal">POS Terminal</option>
              <option value="Web Transfer">Web Transfer</option>
              <option value="Card Settlement">Card Settlement</option>
              <option value="Refund">Refund</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Narrative / Description</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Internal reference or note"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Settlement...
            </>
          ) : (
            "Initiate Settlement"
          )}
        </button>
      </form>
    </div>
  );
};