"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Search, X } from "lucide-react";
import { ExportButton } from "./ExportButton";

export const CommandBar = () => {
  const { searchQuery, setSearchQuery } = useTransactionStore();

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-white p-2 pl-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 flex-1 w-full">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Search by reference, category or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-sm font-medium text-gray-900 w-full placeholder:text-gray-400"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0">
        <ExportButton />
      </div>
    </div>
  );
};