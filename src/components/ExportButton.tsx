"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Download } from "lucide-react";

export const ExportButton = () => {
  const { transactions, filters } = useTransactionStore();

  const handleExport = () => {
    // 1. Apply the same filters used in the list
    const filteredData = transactions.filter((tx) => {
      const statusMatch = filters.status === "all" || tx.status === filters.status;
      const typeMatch = filters.type === "all" || tx.type === filters.type;
      return statusMatch && typeMatch;
    });

    if (filteredData.length === 0) return alert("No data to export");

    // 2. Define CSV Headers
    const headers = ["Date", "Reference", "Service", "Description", "Type", "Status", "Amount (NGN)"];
    
    // 3. Map data to rows
    const rows = filteredData.map(tx => [
      new Date(tx.date).toLocaleString(),
      tx.reference,
      tx.category,
      tx.description,
      tx.type.toUpperCase(),
      tx.status.toUpperCase(),
      tx.amount
    ]);

    // 4. Combine into CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // 5. Trigger Browser Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MNP_Statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
    >
      <Download className="w-4 h-4" />
      Export Statement
    </button>
  );
};