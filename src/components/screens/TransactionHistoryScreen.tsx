import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Filter,
  History,
  RotateCcw,
  Search,
  Timer,
} from 'lucide-react';
import { useAppStore } from '../../context/AppContext';
import { Transaction, TransactionStatus } from '../../types';

export const TransactionHistoryScreen: React.FC = () => {
  const { transactions, navigateTo, openReceipt } = useAppStore();

  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(search.toLowerCase())) ||
      tx.amount.toString().includes(search);

    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 select-none">
      {/* Top Title */}
      <div className="p-6 rounded-3xl bg-[#16130B] border border-[#D4AF37]/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="p-2 rounded-xl bg-[#1A1710] text-[#D4AF37] border border-[#D4AF37]/20 hover:border-[#D4AF37] cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display font-bold text-xl text-[#EAE1D4] flex items-center gap-2">
                <History className="w-5 h-5 text-[#D4AF37]" />
                <span>Transaction History</span>
              </h1>
              <p className="text-xs text-[#A39985]">
                {transactions.length} total payments logged in reverse chronological order
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by recipient, transaction ID, or amount..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0A08] border border-[#D4AF37]/25 text-xs text-[#EAE1D4] placeholder-[#8C8370] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'success', label: 'Successful' },
              { id: 'cancelled', label: 'Cancelled (Undo)' },
              { id: 'initiated', label: 'Active 15s' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as 'all' | TransactionStatus)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all cursor-pointer border ${
                  statusFilter === tab.id
                    ? 'bg-[#D4AF37] text-black border-[#FFF1B0]'
                    : 'bg-[#12100B] text-[#A39985] border-[#D4AF37]/20 hover:text-[#EAE1D4]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#16130B] rounded-3xl border border-[#D4AF37]/15">
            <p className="text-sm font-semibold text-[#EAE1D4]">No transactions found.</p>
            <p className="text-xs text-[#A39985] mt-1">Try adjusting your search query or filter tab.</p>
          </div>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx.id}
              onClick={() => openReceipt(tx)}
              className="p-4 rounded-2xl bg-[#16130B] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#231F17] transition-all cursor-pointer flex items-center justify-between gap-4 shadow-md group"
            >
              <div className="flex items-center gap-3.5">
                {tx.recipientAvatar ? (
                  <img
                    src={tx.recipientAvatar}
                    alt={tx.recipientName}
                    className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/40 group-hover:border-[#D4AF37]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#231F17] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold text-base">
                    {tx.recipientName.charAt(0)}
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-sm text-[#EAE1D4] group-hover:text-[#F2CA50] flex items-center gap-2">
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
                  <p className="text-xs text-[#A39985] font-mono mt-0.5">
                    {tx.id} • {tx.paymentMethod.toUpperCase()}
                  </p>
                  <p className="text-[11px] text-[#D0C5AF]">{tx.formattedDate}</p>
                </div>
              </div>

              <div className="text-right flex items-center gap-2">
                <div>
                  <p
                    className={`font-display font-bold text-base ${
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
                      : 'Active Undo'}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-[#A39985] group-hover:text-[#D4AF37]" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
