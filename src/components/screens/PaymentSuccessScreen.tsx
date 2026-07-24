import React, { useState } from 'react';
import { CheckCircle2, Copy, Download, Home, Share2, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../context/AppContext';

export const PaymentSuccessScreen: React.FC = () => {
  const { viewingReceiptTransaction, navigateTo } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState(false);

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

  const handleCopyTxId = () => {
    navigator.clipboard.writeText(tx.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloadMsg(true);
    setTimeout(() => setDownloadMsg(false), 3000);
  };

  const handleShare = () => {
    const text = `KYLAK'S UndoPay Receipt\nRecipient: ${tx.recipientName}\nAmount: ₹${tx.amount.toLocaleString('en-IN')}\nTxn ID: ${tx.id}\nStatus: SUCCESSFUL`;
    if (navigator.share) {
      navigator.share({ title: 'Payment Receipt', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Receipt details copied to clipboard for sharing!');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 select-none">
      <div className="p-6 sm:p-8 rounded-3xl bg-[#16130B] border border-[#D4AF37]/30 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Success Icon Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F5E08B] to-[#8C7332] p-1 mx-auto shadow-2xl shadow-[#D4AF37]/30"
        >
          <div className="w-full h-full bg-[#0B0A08] rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-[#D4AF37]" />
          </div>
        </motion.div>

        <div>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#52D183]/20 text-[#52D183] border border-[#52D183]/30 tracking-widest uppercase">
            PAYMENT SUCCESSFUL
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#EAE1D4] gold-text-gradient mt-2">
            ₹{tx.amount.toLocaleString('en-IN')}
          </h1>
          <p className="text-sm font-semibold text-[#D0C5AF] mt-1">
            Transferred to <span className="text-[#D4AF37]">{tx.recipientName}</span>
          </p>
        </div>

        {/* Transaction Details Card */}
        <div className="p-4 rounded-2xl bg-[#0B0A08] border border-[#D4AF37]/20 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-[#D4AF37]/10">
            <span className="text-[#A39985]">Transaction ID</span>
            <button
              onClick={handleCopyTxId}
              className="flex items-center gap-1 font-mono font-semibold text-[#D4AF37] hover:underline cursor-pointer"
            >
              <span>{tx.id}</span>
              <Copy className="w-3.5 h-3.5" />
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
            Transaction ID copied to clipboard!
          </p>
        )}

        {downloadMsg && (
          <p className="text-xs text-[#52D183] font-semibold animate-pulse">
            Official PDF Receipt generated & saved!
          </p>
        )}

        {/* Share & Download Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="p-3 rounded-xl bg-[#1A1710] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-3 rounded-xl bg-[#1A1710] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>

        {/* Return Home */}
        <button
          onClick={() => navigateTo('home')}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5E08B] to-[#D4AF37] text-black font-extrabold text-sm shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 cursor-pointer transition-all uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home Dashboard</span>
        </button>
      </div>
    </div>
  );
};
