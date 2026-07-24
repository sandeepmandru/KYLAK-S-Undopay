import React from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, ShieldCheck, Sparkles, Undo2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../context/AppContext';

export const UndoCountdownScreen: React.FC = () => {
  const {
    activeUndoTransaction,
    activeUndoSeconds,
    undoActivePayment,
    confirmActivePaymentNow,
    navigateTo,
  } = useAppStore();

  if (!activeUndoTransaction) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#1A1710] border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-bold text-lg text-[#EAE1D4]">No Active Undo Payment</h2>
        <p className="text-xs text-[#A39985]">All payments have been settled or refunded.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Calculate SVG Circle Stroke Dashoffset
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activeUndoSeconds / 15) * circumference;

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-20 select-none">
      {/* Container Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1C160B] via-[#14110A] to-[#0B0A08] border-2 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20 text-center space-y-6 relative overflow-hidden">
        {/* Glowing background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Status Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#93000A]/30 border border-[#FFB4AB]/40 text-[#FFB4AB] text-xs font-bold uppercase tracking-widest animate-pulse">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>PAYMENT INITIATED • 15s COUNTDOWN</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#EAE1D4] mt-2">
            Undo Window Open
          </h1>
          <p className="text-xs text-[#A39985]">
            You have <span className="text-[#D4AF37] font-bold">{activeUndoSeconds} seconds</span> to cancel this transaction before completion.
          </p>
        </div>

        {/* Recipient & Amount Info */}
        <div className="p-4 rounded-2xl bg-[#0B0A08] border border-[#D4AF37]/20 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            {activeUndoTransaction.recipientAvatar ? (
              <img
                src={activeUndoTransaction.recipientAvatar}
                alt={activeUndoTransaction.recipientName}
                className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#231F17] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-lg">
                {activeUndoTransaction.recipientName.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-bold text-sm text-[#EAE1D4]">
                {activeUndoTransaction.recipientName}
              </p>
              <p className="text-xs text-[#A39985] font-mono">
                {activeUndoTransaction.recipientUpiOrAccount}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-display font-extrabold text-2xl text-[#D4AF37]">
              ₹{activeUndoTransaction.amount.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-[#A39985]">Holding Pending</p>
          </div>
        </div>

        {/* 15-Second Animated Circular Countdown Timer Ring */}
        <div className="relative flex items-center justify-center py-4">
          <svg className="w-48 h-48 -rotate-90">
            {/* Background Ring */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="#2A2417"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Foreground Progress Ring */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="url(#goldGradient)"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="timer-ring-circle"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF1B0" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#93000A" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Ticking Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.span
              key={activeUndoSeconds}
              initial={{ scale: 1.2, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="font-display font-extrabold text-5xl text-[#F2CA50] gold-text-gradient drop-shadow-md"
            >
              {activeUndoSeconds}s
            </motion.span>
            <span className="text-[10px] font-bold text-[#A39985] uppercase tracking-widest mt-1">
              Seconds Left
            </span>
          </div>
        </div>

        {/* Action Buttons: UNDO vs CONFIRM NOW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* UNDO PAYMENT BUTTON */}
          <button
            onClick={undoActivePayment}
            className="group py-4 px-4 rounded-2xl bg-gradient-to-r from-[#93000A] via-[#B3261E] to-[#93000A] text-[#FFDAD6] font-extrabold text-sm border-2 border-[#FFB4AB] shadow-xl shadow-[#93000A]/40 hover:brightness-125 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <Undo2 className="w-5 h-5 text-[#FFDAD6] group-hover:rotate-[-20deg] transition-transform" />
            <span className="tracking-wider uppercase">UNDO PAYMENT NOW</span>
          </button>

          {/* CONFIRM NOW BUTTON */}
          <button
            onClick={confirmActivePaymentNow}
            className="py-4 px-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F5E08B] to-[#D4AF37] text-black font-extrabold text-sm border border-[#FFF1B0] shadow-xl shadow-[#D4AF37]/20 hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5 text-black" />
            <span className="tracking-wider uppercase">CONFIRM NOW</span>
          </button>
        </div>

        {/* Informational Micro Notice */}
        <div className="p-3 rounded-xl bg-[#0B0A08] border border-[#D4AF37]/15 flex items-center justify-center gap-2 text-[11px] text-[#A39985]">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
          <span>If Undo is pressed, 100% of ₹{activeUndoTransaction.amount.toLocaleString('en-IN')} is refunded instantly.</span>
        </div>
      </div>
    </div>
  );
};
