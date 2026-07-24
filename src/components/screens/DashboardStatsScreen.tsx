import React from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  PieChart,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { useAppStore } from '../../context/AppContext';

export const DashboardStatsScreen: React.FC = () => {
  const { dashboardStats, transactions, navigateTo } = useAppStore();

  // Payment Method counts
  const qrCount = transactions.filter((t) => t.paymentMethod === 'qr').length;
  const mobileCount = transactions.filter((t) => t.paymentMethod === 'mobile').length;
  const contactCount = transactions.filter((t) => t.paymentMethod === 'contact').length;
  const bankCount = transactions.filter((t) => t.paymentMethod === 'bank').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 select-none">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#16130B] border border-[#D4AF37]/20 shadow-xl flex items-center gap-3">
        <button
          onClick={() => navigateTo('home')}
          className="p-2 rounded-xl bg-[#1A1710] text-[#D4AF37] border border-[#D4AF37]/20 hover:border-[#D4AF37] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-bold text-xl text-[#EAE1D4] flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#D4AF37]" />
            <span>Wealth & Undo Protection Analytics</span>
          </h1>
          <p className="text-xs text-[#A39985]">
            Real-time live telemetry calculated automatically across all transactions
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Amount Sent */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1C180E] to-[#12100B] border border-[#D4AF37]/30 shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#231F17] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#A39985]">
            Total Volume Sent
          </p>
          <p className="font-display font-extrabold text-2xl text-[#EAE1D4]">
            ₹{dashboardStats.totalAmountSent.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-[#D4AF37] font-medium">Successful Transactions</p>
        </div>

        {/* Success Rate */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1C180E] to-[#12100B] border border-[#D4AF37]/30 shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#231F17] border border-[#D4AF37]/30 flex items-center justify-center text-[#F2CA50]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#A39985]">
            Success Rate
          </p>
          <p className="font-display font-extrabold text-2xl text-[#F2CA50]">
            {dashboardStats.successRate}%
          </p>
          <div className="w-full h-2 rounded-full bg-[#1A1710] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2CA50]"
              style={{ width: `${dashboardStats.successRate}%` }}
            />
          </div>
        </div>

        {/* Saved via Undo */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#2B1B10] to-[#16130B] border border-[#FFB4AB]/40 shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#93000A]/40 border border-[#FFB4AB]/40 flex items-center justify-center text-[#FFB4AB]">
            <RotateCcw className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#FFB4AB]">
            Saved via UndoPay
          </p>
          <p className="font-display font-extrabold text-2xl text-[#FFB4AB]">
            ₹{dashboardStats.totalAmountSavedUndo.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-[#FFDAD6]">
            {dashboardStats.cancelledTransactions} Payments Undone
          </p>
        </div>

        {/* Total Actions */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1C180E] to-[#12100B] border border-[#D4AF37]/30 shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#231F17] border border-[#D4AF37]/30 flex items-center justify-center text-[#D0C5AF]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#A39985]">
            Total Actions
          </p>
          <p className="font-display font-extrabold text-2xl text-[#EAE1D4]">
            {dashboardStats.totalTransactions}
          </p>
          <p className="text-[11px] text-[#D0C5AF]">Live Shared State</p>
        </div>
      </div>

      {/* Payment Method Distribution */}
      <div className="p-6 rounded-3xl bg-[#16130B] border border-[#D4AF37]/20 shadow-xl space-y-4">
        <h2 className="font-bold text-base text-[#EAE1D4] flex items-center gap-2">
          <span>Payment Channel Breakdown</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#0B0A08] border border-[#D4AF37]/15 text-center">
            <QrCode className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
            <span className="text-xs font-bold text-[#EAE1D4] block">QR Code</span>
            <span className="text-sm font-extrabold text-[#D4AF37]">{qrCount} Txns</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0A08] border border-[#D4AF37]/15 text-center">
            <Smartphone className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
            <span className="text-xs font-bold text-[#EAE1D4] block">Mobile</span>
            <span className="text-sm font-extrabold text-[#D4AF37]">{mobileCount} Txns</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0A08] border border-[#D4AF37]/15 text-center">
            <UserCheck className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
            <span className="text-xs font-bold text-[#EAE1D4] block">Contacts</span>
            <span className="text-sm font-extrabold text-[#D4AF37]">{contactCount} Txns</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0A08] border border-[#D4AF37]/15 text-center">
            <Building2 className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
            <span className="text-xs font-bold text-[#EAE1D4] block">Bank Transfer</span>
            <span className="text-sm font-extrabold text-[#D4AF37]">{bankCount} Txns</span>
          </div>
        </div>
      </div>
    </div>
  );
};
