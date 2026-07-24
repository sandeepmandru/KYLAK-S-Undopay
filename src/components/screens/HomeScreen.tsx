import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  ChevronRight,
  Eye,
  EyeOff,
  History,
  Plus,
  QrCode,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Smartphone,
  TrendingUp,
  UserCheck,
  Wallet,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../context/AppContext';
import { PaymentMethod, Transaction } from '../../types';

export const HomeScreen: React.FC = () => {
  const {
    user,
    transactions,
    contacts,
    dashboardStats,
    activeUndoTransaction,
    activeUndoSeconds,
    navigateTo,
    setSelectedPaymentMethod,
    setSearchQuery,
    searchQuery,
    setShowQrScanner,
    setShowAddFundsModal,
    openReceipt,
  } = useAppStore();

  const [showBalance, setShowBalance] = useState<boolean>(true);

  // Top 5 recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Filter contacts by search query
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.upiId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    navigateTo('choose-method', { method });
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* 1. Profile Banner & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#16130B] border border-[#D4AF37]/20 relative overflow-hidden shadow-xl shadow-[#D4AF37]/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 z-10">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-[10px] font-bold">
              ★
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A39985] tracking-widest uppercase">Welcome back</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                VERIFIED WEALTH
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl text-[#EAE1D4] gold-text-gradient">
              {user.name}
            </h1>
            <p className="text-xs text-[#D0C5AF] font-mono mt-0.5">{user.upiId}</p>
          </div>
        </div>

        {/* Quick Add Funds & Tier Info */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setShowAddFundsModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#8C7332] text-black font-bold text-xs shadow-lg shadow-[#D4AF37]/15 hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Funds</span>
          </button>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts, UPI IDs, bank accounts, or past payments..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#16130B] border border-[#D4AF37]/25 text-sm text-[#EAE1D4] placeholder-[#8C8370] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#A39985] hover:text-[#D4AF37]"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3. Active 15-Second Undo Banner (If payment pending) */}
      {activeUndoTransaction && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-[#2B1B10] via-[#1A140B] to-[#2B1B10] border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#93000A] text-[#FFDAD6] border border-[#FFB4AB] flex items-center justify-center animate-pulse">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FFB4AB] tracking-widest uppercase">
                  15s UNDO ACTIVE
                </span>
                <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-black font-bold text-[10px]">
                  {activeUndoSeconds}s Left
                </span>
              </div>
              <p className="text-sm font-semibold text-[#EAE1D4]">
                Paying ₹{activeUndoTransaction.amount.toLocaleString('en-IN')} to{' '}
                <span className="text-[#D4AF37]">{activeUndoTransaction.recipientName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('undo-countdown')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs hover:bg-[#F5E08B] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            <span>Open Undo Screen</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* 4. Available Balance Obsidian Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#231F17] via-[#16130B] to-[#0E0C07] p-6 sm:p-8 border border-[#D4AF37]/30 shadow-2xl shadow-[#D4AF37]/10 overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-bold tracking-widest text-[#D0C5AF] uppercase">
              Available Wealth Balance
            </span>
          </div>

          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 rounded-xl bg-[#1A1710] text-[#D4AF37] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all cursor-pointer"
            title={showBalance ? 'Hide Balance' : 'Show Balance'}
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-[#D4AF37]">₹</span>
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#EAE1D4] tracking-tight">
              {showBalance ? user.balance.toLocaleString('en-IN') : '••••••••'}
            </span>
          </div>
          <p className="text-xs text-[#A39985] mt-1 font-mono">
            Kylak Wealth Account •••• {user.accountNumber.slice(-4)}
          </p>
        </div>

        {/* Card Footer info */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#D4AF37]/15 text-xs text-[#D0C5AF]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>15-Sec Undo Payment Guaranteed</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[#D4AF37]">
            <span>UPI ID: {user.upiId}</span>
          </div>
        </div>
      </div>

      {/* 5. Dashboard Statistics Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold tracking-wider text-[#D0C5AF] uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <span>Dashboard Live Statistics</span>
          </h2>
          <button
            onClick={() => navigateTo('stats')}
            className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Full Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Stat 1: Total Sent */}
          <div className="p-4 rounded-2xl bg-[#16130B] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all">
            <p className="text-[11px] text-[#A39985] uppercase tracking-wider">Total Sent</p>
            <p className="font-display font-bold text-xl text-[#EAE1D4] mt-1">
              ₹{dashboardStats.totalAmountSent.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-[#D4AF37] mt-1 font-medium">Successful Payments</p>
          </div>

          {/* Stat 2: Success Rate */}
          <div className="p-4 rounded-2xl bg-[#16130B] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all">
            <p className="text-[11px] text-[#A39985] uppercase tracking-wider">Success Rate</p>
            <p className="font-display font-bold text-xl text-[#F2CA50] mt-1">
              {dashboardStats.successRate}%
            </p>
            <p className="text-[10px] text-[#A39985] mt-1">
              {dashboardStats.successfulTransactions} / {dashboardStats.totalTransactions} completed
            </p>
          </div>

          {/* Stat 3: Undo Cancelled */}
          <div className="p-4 rounded-2xl bg-[#16130B] border border-[#FFB4AB]/30 hover:border-[#FFB4AB]/60 transition-all">
            <p className="text-[11px] text-[#FFB4AB] uppercase tracking-wider flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              <span>Undo Cancelled</span>
            </p>
            <p className="font-display font-bold text-xl text-[#FFB4AB] mt-1">
              {dashboardStats.cancelledTransactions}
            </p>
            <p className="text-[10px] text-[#FFDAD6] mt-1 font-mono">
              ₹{dashboardStats.totalAmountSavedUndo.toLocaleString('en-IN')} Saved
            </p>
          </div>

          {/* Stat 4: Total Txns */}
          <div className="p-4 rounded-2xl bg-[#16130B] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all">
            <p className="text-[11px] text-[#A39985] uppercase tracking-wider">Total Actions</p>
            <p className="font-display font-bold text-xl text-[#EAE1D4] mt-1">
              {dashboardStats.totalTransactions}
            </p>
            <p className="text-[10px] text-[#D0C5AF] mt-1 font-medium">Updated Real-Time</p>
          </div>
        </div>
      </div>

      {/* 6. Quick Payment Methods Action Grid */}
      <div>
        <h2 className="text-sm font-bold tracking-wider text-[#D0C5AF] uppercase mb-3">
          Choose Payment Option
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* QR Payment */}
          <button
            onClick={() => handleSelectPaymentMethod('qr')}
            className="group p-4 rounded-2xl bg-[#16130B] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#231F17] transition-all cursor-pointer flex flex-col items-center text-center shadow-lg shadow-[#D4AF37]/5"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#231F17] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-[#EAE1D4] group-hover:text-[#F2CA50]">
              QR Scan
            </span>
            <span className="text-[11px] text-[#A39985] mt-0.5">Scan UPI QR</span>
          </button>

          {/* Mobile Payment */}
          <button
            onClick={() => handleSelectPaymentMethod('mobile')}
            className="group p-4 rounded-2xl bg-[#16130B] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#231F17] transition-all cursor-pointer flex flex-col items-center text-center shadow-lg shadow-[#D4AF37]/5"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#231F17] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all mb-3">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-[#EAE1D4] group-hover:text-[#F2CA50]">
              To Mobile
            </span>
            <span className="text-[11px] text-[#A39985] mt-0.5">Enter Number</span>
          </button>

          {/* Contact Payment */}
          <button
            onClick={() => handleSelectPaymentMethod('contact')}
            className="group p-4 rounded-2xl bg-[#16130B] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#231F17] transition-all cursor-pointer flex flex-col items-center text-center shadow-lg shadow-[#D4AF37]/5"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#231F17] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-[#EAE1D4] group-hover:text-[#F2CA50]">
              To Contact
            </span>
            <span className="text-[11px] text-[#A39985] mt-0.5">Saved Beneficiaries</span>
          </button>

          {/* Bank Transfer */}
          <button
            onClick={() => handleSelectPaymentMethod('bank')}
            className="group p-4 rounded-2xl bg-[#16130B] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#231F17] transition-all cursor-pointer flex flex-col items-center text-center shadow-lg shadow-[#D4AF37]/5"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#231F17] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-[#EAE1D4] group-hover:text-[#F2CA50]">
              Bank Transfer
            </span>
            <span className="text-[11px] text-[#A39985] mt-0.5">Account & IFSC</span>
          </button>
        </div>
      </div>

      {/* 7. Send Money Quick Beneficiary Carousel */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold tracking-wider text-[#D0C5AF] uppercase flex items-center gap-2">
            <Send className="w-4 h-4 text-[#D4AF37]" />
            <span>Send Money Fast</span>
          </h2>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => {
                setSelectedPaymentMethod('contact');
                navigateTo('enter-details', {
                  method: 'contact',
                  flowData: {
                    recipientName: contact.name,
                    recipientUpiOrAccount: contact.upiId,
                    recipientAvatar: contact.avatar,
                    bankName: contact.bankName,
                    paymentMethod: 'contact',
                  },
                });
              }}
              className="flex-shrink-0 flex flex-col items-center w-20 p-2 rounded-2xl bg-[#16130B] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#231F17] transition-all cursor-pointer group"
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/40 group-hover:border-[#D4AF37]"
              />
              <span className="text-xs font-semibold text-[#EAE1D4] truncate w-full text-center mt-2 group-hover:text-[#F2CA50]">
                {contact.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-[#A39985] truncate w-full text-center">
                {contact.bankName.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 8. Recent Transactions Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold tracking-wider text-[#D0C5AF] uppercase flex items-center gap-2">
            <History className="w-4 h-4 text-[#D4AF37]" />
            <span>Recent Transactions</span>
          </h2>
          <button
            onClick={() => navigateTo('history')}
            className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View All History ({transactions.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => openReceipt(tx)}
              className="p-4 rounded-2xl bg-[#16130B] border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 hover:bg-[#231F17] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md"
            >
              <div className="flex items-center gap-3">
                {tx.recipientAvatar ? (
                  <img
                    src={tx.recipientAvatar}
                    alt={tx.recipientName}
                    className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#231F17] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold">
                    {tx.recipientName.charAt(0)}
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-sm text-[#EAE1D4] flex items-center gap-2">
                    <span>{tx.recipientName}</span>
                    {tx.status === 'cancelled' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FFB4AB]/20 text-[#FFB4AB] border border-[#FFB4AB]/30">
                        UNDONE
                      </span>
                    )}
                    {tx.status === 'initiated' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/30 text-[#D4AF37] animate-pulse">
                        PENDING (15s)
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#A39985] mt-0.5">
                    {tx.formattedDate} • {tx.paymentMethod.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-display font-bold text-sm ${
                    tx.status === 'cancelled'
                      ? 'text-[#FFB4AB] line-through'
                      : 'text-[#EAE1D4]'
                  }`}
                >
                  -₹{tx.amount.toLocaleString('en-IN')}
                </p>
                <p
                  className={`text-[10px] font-semibold uppercase ${
                    tx.status === 'success'
                      ? 'text-[#52D183]'
                      : tx.status === 'cancelled'
                      ? 'text-[#FFB4AB]'
                      : 'text-[#D4AF37]'
                  }`}
                >
                  {tx.status === 'success'
                    ? 'Successful'
                    : tx.status === 'cancelled'
                    ? 'Refunded'
                    : '15s Undo Available'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
