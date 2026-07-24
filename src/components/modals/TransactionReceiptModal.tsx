import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Download,
  RefreshCw,
  RotateCcw,
  Share2,
  ShieldCheck,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../context/AppContext';

export const TransactionReceiptModal: React.FC = () => {
  const { viewingReceiptTransaction, closeReceipt, navigateTo } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!viewingReceiptTransaction) return null;

  const tx = viewingReceiptTransaction;

  const handleCopy = () => {
    navigator.clipboard.writeText(tx.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2500);
  };

  const handleShare = () => {
    const text = `KYLAK'S UndoPay Official Receipt\nRecipient: ${tx.recipientName}\nAmount: ₹${tx.amount.toLocaleString('en-IN')}\nStatus: ${tx.status.toUpperCase()}\nTxn ID: ${tx.id}`;
    if (navigator.share) {
      navigator.share({ title: 'Receipt', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Receipt summary copied to clipboard!');
    }
  };

  const handlePayAgain = () => {
    closeReceipt();
    navigateTo('enter-details', {
      method: tx.paymentMethod,
      flowData: {
        recipientName: tx.recipientName,
        recipientUpiOrAccount: tx.recipientUpiOrAccount,
        recipientAvatar: tx.recipientAvatar,
        paymentMethod: tx.paymentMethod,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-[#16130B] border border-[#D4AF37]/30 rounded-3xl p-6 shadow-2xl space-y-5 text-center relative overflow-hidden select-none"
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeReceipt}
          className="absolute right-4 top-4 p-2 rounded-full bg-[#1A1710] text-[#A39985] hover:text-[#EAE1D4] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Badge */}
        <div className="pt-2">
          {tx.status === 'success' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52D183]/20 text-[#52D183] border border-[#52D183]/30 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>PAYMENT SUCCESSFUL</span>
            </span>
          )}

          {tx.status === 'cancelled' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#93000A]/30 text-[#FFB4AB] border border-[#FFB4AB]/40 text-xs font-bold uppercase tracking-wider">
              <RotateCcw className="w-4 h-4" />
              <span>PAYMENT UNDONE • REFUNDED</span>
            </span>
          )}

          {tx.status === 'initiated' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider animate-pulse">
              <span>15s UNDO ACTIVE</span>
            </span>
          )}
        </div>

        {/* Amount */}
        <div>
          <p className="font-display font-extrabold text-4xl text-[#EAE1D4] gold-text-gradient">
            ₹{tx.amount.toLocaleString('en-IN')}
          </p>
          <p className="text-sm font-semibold text-[#D0C5AF] mt-1">{tx.recipientName}</p>
          <p className="text-xs text-[#A39985] font-mono">{tx.recipientUpiOrAccount}</p>
        </div>

        {/* Details Grid */}
        <div className="p-4 rounded-2xl bg-[#0B0A08] border border-[#D4AF37]/20 text-left space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
            <span className="text-[#A39985]">Transaction Ref ID</span>
            <button
              onClick={handleCopy}
              className="font-mono font-semibold text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{tx.id}</span>
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
            <span className="text-[#A39985]">Date & Time</span>
            <span className="text-[#EAE1D4] font-medium">{tx.formattedDate}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
            <span className="text-[#A39985]">Payment Method</span>
            <span className="text-[#EAE1D4] font-bold uppercase">{tx.paymentMethod}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
            <span className="text-[#A39985]">Funding Account</span>
            <span className="text-[#EAE1D4] font-medium">{tx.fundingSource}</span>
          </div>

          {tx.note && (
            <div className="flex justify-between py-1">
              <span className="text-[#A39985]">Note</span>
              <span className="text-[#EAE1D4] font-medium">{tx.note}</span>
            </div>
          )}
        </div>

        {copied && (
          <p className="text-xs text-[#D4AF37] font-semibold animate-pulse">
            Reference ID copied!
          </p>
        )}

        {downloading && (
          <p className="text-xs text-[#52D183] font-semibold animate-pulse">
            Receipt PDF downloaded!
          </p>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleShare}
            className="p-3 rounded-xl bg-[#1A1710] border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:border-[#D4AF37]"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-3 rounded-xl bg-[#1A1710] border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:border-[#D4AF37]"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>

        <button
          onClick={handlePayAgain}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8C7332] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Pay {tx.recipientName.split(' ')[0]} Again</span>
        </button>
      </motion.div>
    </div>
  );
};
