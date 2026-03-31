"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { Store, ShieldCheck, Edit3 } from "lucide-react";
import { useState } from "react";

export const ProfileSettings = () => {
  const { profile, updateProfile } = useTransactionStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profile.businessName);

  const handleSave = () => {
    updateProfile({ businessName: tempName });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Business Profile</h3>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors text-blue-600"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <Store className="w-6 h-6" />
        </div>
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <input 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="border-b-2 border-blue-600 outline-none font-bold text-gray-900 text-lg w-full"
                autoFocus
              />
              <button onClick={handleSave} className="text-xs font-black text-emerald-600 uppercase">Save</button>
            </div>
          ) : (
            <h4 className="text-lg font-black text-gray-900">{profile.businessName}</h4>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-gray-400">{profile.merchantId}</span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
              <ShieldCheck className="w-3 h-3" /> {profile.tier}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};