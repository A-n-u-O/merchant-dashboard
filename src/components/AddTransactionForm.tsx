"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Loader2, PlusCircle, Tag, Hash, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// THE INTEGRITY SCHEMA: Defines strict rules for the bank
const settlementSchema = z.object({
  type: z.enum(["credit", "debit"]),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string().min(1, "Please select a service type"),
  description: z.string()
    .min(3, "Description too short")
    .max(50, "Description must be under 50 characters (Bank Limit)"),
});

type SettlementValues = z.infer<typeof settlementSchema>;

export const AddTransactionForm = () => {
  const { addTransaction, isProcessing } = useTransactionStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SettlementValues>({
    resolver: zodResolver(settlementSchema),
    defaultValues: { type: "credit", category: "", amount: "", description: "" },
  });

  const currentType = watch("type");

  const onSubmit = async (data: SettlementValues) => {
    await addTransaction({
      ...data,
      amount: parseFloat(data.amount),
    });
    reset();
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <PlusCircle className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900">New Settlement</h2>
          <p className="text-sm text-gray-500 font-medium">Initiate a validated entry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button" 
            onClick={() => setValue("type", "credit")} 
            className={`py-3 rounded-xl border-2 font-bold transition-all ${currentType === "credit" ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-100 bg-gray-50 text-gray-400"}`}
          >
            Credit Inflow
          </button>
          <button 
            type="button" 
            onClick={() => setValue("type", "debit")} 
            className={`py-3 rounded-xl border-2 font-bold transition-all ${currentType === "debit" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 bg-gray-50 text-gray-400"}`}
          >
            Debit Outflow
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-gray-400">Amount (NGN)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₦</span>
            <input 
              {...register("amount")}
              type="number" 
              step="0.01"
              placeholder="0.00" 
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all ${errors.amount ? 'ring-2 ring-rose-500' : ''}`} 
            />
          </div>
          {errors.amount && <p className="text-rose-500 text-[10px] font-bold flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.amount.message}</p>}
        </div>

        {/* Service Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-gray-400">Service Type</label>
          <div className="relative">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              {...register("category")}
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none appearance-none ${errors.category ? 'ring-2 ring-rose-500' : ''}`}
            >
              <option value="">Select Service</option>
              <option value="POS Terminal">POS Terminal</option>
              <option value="Web Transfer">Web Transfer</option>
              <option value="Card Settlement">Card Settlement</option>
              <option value="Refund">Refund</option>
            </select>
          </div>
          {errors.category && <p className="text-rose-500 text-[10px] font-bold flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.category.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-gray-400">Description</label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              {...register("description")}
              type="text" 
              placeholder="Internal reference" 
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none ${errors.description ? 'ring-2 ring-rose-500' : ''}`} 
            />
          </div>
          {errors.description && <p className="text-rose-500 text-[10px] font-bold flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.description.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isProcessing} 
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-600/20"
        >
          {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : "Initiate Settlement"}
        </button>
      </form>
    </div>
  );
};