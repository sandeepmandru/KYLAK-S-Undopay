import React, { useState } from 'react';
import { Plus, Wallet, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../context/AppContext';

export const AddFundsModal: React.FC = () => {
  const { showAddFundsModal, setShowAddFundsModal, addFunds, user } = useAppStore();
  const [topUpAmount, setTopUpAmount] = useState<string>('10000');

  if (!showAddFundsModal) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(topUpAmount);
    if (val > 0) {
      addFunds(val);
      setShowAddFundsModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-[#16130B] border border-[#D4AF37]/30 rounded-3xl p-6 shadow-2xl space-y-5 text-center relative overflow-hidden select-none"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/15">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-bold tracking-widest text-[#D0C5AF] uppercase">
              Add Wealth Funds
            </span>
          </div>

          <button
            onClick={() => setShowAddFundsModal(false)}
            className="p-1.5 rounded-full bg-[#1A1710] text-[#A39985] hover:text-[#EAE1D4] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <p className="text-xs text-[#A39985]">Current Balance</p>
          <p className="font-display font-extrabold text-3xl text-[#D4AF37]">
            ₹{user.balance.toLocaleString('en-IN')}
          </p>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="relative flex items-center justify-center p-4 rounded-2xl bg-[#0B0A08] border-2 border-[#D4AF37]/40 focus-within:border-[#D4AF37]">
            <span className="font-display text-3xl font-extrabold text-[#D4AF37] mr-2">₹</span>
            <input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              required
              className="w-full bg-transparent font-display text-3xl font-extrabold text-[#EAE1D4] focus:outline-none"
            />
          </div>

          {/* Quick presets */}
          <div className="flex items-center justify-center gap-2">
            {[5000, 10000, 50000, 100000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTopUpAmount(preset.toString())}
                className="px-3 py-1.5 rounded-xl bg-[#1A1710] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-bold text-[#D4AF37] cursor-pointer transition-all"
              >
                +₹{(preset / 1000).toFixed(0)}k
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5E08B] to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 cursor-pointer hover:brightness-110 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Funds to Account</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
