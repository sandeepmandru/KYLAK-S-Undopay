import React from 'react';
import { Home, RefreshCw, RotateCcw, ShieldCheck, Undo2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../context/AppContext';

export const PaymentCancelledScreen: React.FC = () => {
  const { viewingReceiptTransaction, navigateTo } = useAppStore();

  const tx = viewingReceiptTransaction;

  if (!tx) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-[#A39985]">No payment details available.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 select-none">
      <div className="p-6 sm:p-8 rounded-3xl bg-[#16130B] border border-[#FFB4AB]/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#93000A]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Undo Icon Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#93000A] via-[#FFB4AB] to-[#D4AF37] p-1 mx-auto shadow-2xl shadow-[#93000A]/40"
        >
          <div className="w-full h-full bg-[#0B0A08] rounded-full flex items-center justify-center">
            <Undo2 className="w-12 h-12 text-[#FFB4AB]" />
          </div>
        </motion.div>

        <div>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#93000A]/40 text-[#FFB4AB] border border-[#FFB4AB]/40 tracking-widest uppercase">
            UNDO SUCCESSFUL • REFUNDED
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#FFB4AB] mt-2">
            ₹{tx.amount.toLocaleString('en-IN')}
          </h1>
          <p className="text-sm font-semibold text-[#EAE1D4] mt-1">
            Payment to <span className="text-[#D4AF37]">{tx.recipientName}</span> was cancelled.
          </p>
          <p className="text-xs text-[#52D183] font-medium mt-1">
            ✓ 100% credited back to your account balance.
          </p>
        </div>

        {/* Details */}
        <div className="p-4 rounded-2xl bg-[#0B0A08] border border-[#FFB4AB]/20 text-left space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
            <span className="text-[#A39985]">Transaction ID</span>
            <span className="font-mono text-[#D4AF37]">{tx.id}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
            <span className="text-[#A39985]">Cancelled Date</span>
            <span className="text-[#EAE1D4] font-medium">{tx.formattedDate}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
            <span className="text-[#A39985]">Payment Method</span>
            <span className="text-[#EAE1D4] font-bold uppercase">{tx.paymentMethod}</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-[#A39985]">Refund Account</span>
            <span className="text-[#EAE1D4] font-medium">{tx.fundingSource}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => navigateTo('choose-method')}
            className="py-3 px-4 rounded-xl bg-[#1A1710] border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:border-[#D4AF37]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Payment Again</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8C7332] text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
          >
            <Home className="w-4 h-4" />
            <span>Home Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
