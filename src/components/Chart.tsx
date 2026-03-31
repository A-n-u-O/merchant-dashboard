"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BarChart3, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  // Grouping logic for "Inflow vs Outflow" per Category
  const categories = Array.from(new Set(transactions.map((tx) => tx.category)));
  
  const inflowData = categories.map((cat) =>
    transactions
      .filter((tx) => tx.category === cat && tx.type === "credit" && tx.status === "success")
      .reduce((sum, tx) => sum + tx.amount, 0)
  );

  const outflowData = categories.map((cat) =>
    transactions
      .filter((tx) => tx.category === cat && tx.type === "debit" && tx.status === "success")
      .reduce((sum, tx) => sum + tx.amount, 0)
  );

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Inflow (₦)",
        data: inflowData,
        backgroundColor: "#059669", // Emerald 600
        borderRadius: 6,
      },
      {
        label: "Outflow (₦)",
        data: outflowData,
        backgroundColor: "#2563eb", // Blue 600
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { font: { weight: 700 as any }, usePointStyle: true },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ₦${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="w-full">
      {transactions.length > 0 ? (
        <div className="h-[300px]"><Bar data={data} options={options} /></div>
      ) : (
        <div className="h-[300px] flex flex-col items-center justify-center text-center">
          <BarChart3 className="w-12 h-12 text-gray-200 mb-2" />
          <p className="text-gray-500 font-medium">No transaction data available for analysis</p>
        </div>
      )}
    </div>
  );
};