"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Filter, X } from "lucide-react";

export const FilterBar = () => {
  const { filters, setFilter, resetFilters } = useTransactionStore();

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 mb-6 flex flex-wrap items-center gap-4 shadow-sm">
      <div className="flex items-center gap-2 text-gray-500 mr-2">
        <Filter className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
      </div>

      {/* Status Filter */}
      <select 
        value={filters.status}
        onChange={(e) => setFilter("status", e.target.value)}
        className="bg-gray-50 border-none rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600"
      >
        <option value="all">All Statuses</option>
        <option value="success">Success</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>

      {/* Type Filter */}
      <select 
        value={filters.type}
        onChange={(e) => setFilter("type", e.target.value)}
        className="bg-gray-50 border-none rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600"
      >
        <option value="all">All Types</option>
        <option value="credit">Credit (Inflow)</option>
        <option value="debit">Debit (Outflow)</option>
      </select>

      <button 
        onClick={resetFilters}
        className="ml-auto flex items-center gap-1 text-xs font-bold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors"
      >
        <X className="w-3 h-3" /> Clear All
      </button>
    </div>
  );
};