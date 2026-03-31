"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from "chart.js";
import { PieChart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { TooltipItem } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

export const Chart = () => {
  const [isMounted, setIsMounted] = useState(false);
  const transactions = useTransactionStore((state) => state.transactions);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const debits = transactions.filter((tx) => tx.type === "debit" && tx.status === "success");

  const categoryTotals: Record<string, number> = {};
  debits.forEach((tx) => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ["#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed"],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverBorderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { padding: 20, usePointStyle: true, color: '#6b7280', font: { size: 11, family: 'system-ui', weight: 600 } },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)', titleColor: '#fff', bodyColor: '#e5e7eb', borderColor: '#374151', borderWidth: 1, padding: 12,
        callbacks: { label: function(c: TooltipItem<'pie'>) { return ` ${c.label}: ₦${c.parsed.toLocaleString(undefined, { minimumFractionDigits: 2 })}`; } }
      },
    },
  };

  return (
    <div className="w-full">
      {debits.length > 0 ? (
        <div className="h-[300px] relative"><Pie data={chartData} options={options} /></div>
      ) : (
        <div className="h-[300px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <PieChart className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-900 font-bold">No outflow data</p>
          <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Initiate a successful debit settlement to see your breakdown.</p>
        </div>
      )}
    </div>
  );
};