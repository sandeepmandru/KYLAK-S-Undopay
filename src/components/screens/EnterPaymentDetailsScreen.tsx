import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  RotateCcw,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { useAppStore } from '../../context/AppContext';

export const EnterPaymentDetailsScreen: React.FC = () => {
  const { user, paymentFlowData, startPaymentFlow, navigateTo } = useAppStore();

  const recipientName = paymentFlowData?.recipientName || 'Recipient';
  const recipientUpiOrAccount = paymentFlowData?.recipientUpiOrAccount || 'upi@kylak';
  const recipientAvatar = paymentFlowData?.recipientAvatar;
  const paymentMethod = paymentFlowData?.paymentMethod || 'mobile';

  const [amount, setAmount] = useState<string>('2500');
  const [note, setNote] = useState<string>('Kylak Wealth Transfer');
  const [fundingSource, setFundingSource] = useState<string>('Kylak Wealth Account •••• 8842');
  const [amountError, setAmountError] = useState<string>('');

  const handleAddAmount = (addValue: number) => {
    const curr = Number(amount) || 0;
    setAmount((curr + addValue).toString());
    setAmountError('');
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      setAmountError('Please enter a valid amount.');
      return;
    }

    if (numAmount > user.balance) {
      setAmountError(`Insufficient available balance. Max: ₹${user.balance.toLocaleString('en-IN')}`);
      return;
    }

    setAmountError('');
    startPaymentFlow({
      recipientName,
      recipientUpiOrAccount,
      recipientAvatar,
      bankName: paymentFlowData?.bankName,
      ifscCode: paymentFlowData?.ifscCode,
      amount: numAmount,
      paymentMethod,
      note,
      fundingSource,
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20 select-none">
      <div className="p-6 rounded-3xl bg-[#16130B] border border-[#D4AF37]/25 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('choose-method')}
            className="p-2 rounded-xl bg-[#1A1710] text-[#D4AF37] border border-[#D4AF37]/20 hover:border-[#D4AF37] cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl text-[#EAE1D4]">
              Enter Payment Details
            </h1>
            <p className="text-xs text-[#A39985]">Step 2 of 3 • Protected by 15-Sec Undo</p>
          </div>
        </div>

        {/* Recipient Card */}
        <div className="p-4 rounded-2xl bg-[#0B0A08] border border-[#D4AF37]/20 flex items-center gap-4">
          {recipientAvatar ? (
            <img
              src={recipientAvatar}
              alt={recipientName}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#231F17] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-xl">
              {recipientName.charAt(0)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-[#EAE1D4]">{recipientName}</h2>
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <p className="text-xs text-[#A39985] font-mono">{recipientUpiOrAccount}</p>
            <span className="inline-block text-[10px] uppercase font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded mt-1 border border-[#D4AF37]/20">
              Verified UPI Beneficiary
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#D0C5AF] block">
            Transfer Amount (₹)
          </label>

          <div className="relative flex items-center justify-center p-6 rounded-2xl bg-[#0B0A08] border-2 border-[#D4AF37]/40 focus-within:border-[#D4AF37] shadow-inner">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#D4AF37] mr-2">
              ₹
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setAmountError('');
              }}
              placeholder="0"
              autoFocus
              className="w-full bg-transparent font-display text-4xl sm:text-5xl font-extrabold text-[#EAE1D4] focus:outline-none tracking-tight"
            />
          </div>

          {/* Quick Amount Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[500, 1000, 5000, 10000].map((addVal) => (
              <button
                key={addVal}
                type="button"
                onClick={() => handleAddAmount(addVal)}
                className="px-3.5 py-1.5 rounded-xl bg-[#1A1710] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#252014] text-xs font-semibold text-[#D4AF37] transition-all cursor-pointer flex-shrink-0"
              >
                +₹{addVal.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {amountError && <p className="text-xs text-[#FFB4AB] font-semibold">{amountError}</p>}
        </div>

        {/* Purpose / Note */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#D0C5AF] block mb-1.5">
            Note / Purpose
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add note (e.g. Rent, Dining, Luxury Watch)"
            className="w-full px-4 py-3 rounded-xl bg-[#0B0A08] border border-[#D4AF37]/30 text-sm text-[#EAE1D4] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Funding Account Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#D0C5AF] block mb-1.5">
            Paying From
          </label>

          <div className="p-3.5 rounded-2xl bg-[#0B0A08] border border-[#D4AF37]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <p className="text-xs font-bold text-[#EAE1D4]">{fundingSource}</p>
                <p className="text-[10px] text-[#A39985]">
                  Avail. Balance: ₹{user.balance.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase bg-[#D4AF37]/15 px-2 py-0.5 rounded border border-[#D4AF37]/30">
              Primary
            </span>
          </div>
        </div>

        {/* 15-Sec Undo Protection Feature Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1A160D] via-[#231F17] to-[#1A160D] border border-[#D4AF37]/40 flex items-center gap-3">
          <RotateCcw className="w-6 h-6 text-[#D4AF37] flex-shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
          <div>
            <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              15-Second Undo Protection Guarantee
            </h3>
            <p className="text-[11px] text-[#A39985] mt-0.5">
              After confirming, you will have exactly 15 seconds to cancel or undo this transaction instantly with zero questions asked.
            </p>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleProceed}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5E08B] to-[#D4AF37] text-black font-extrabold text-sm shadow-xl shadow-[#D4AF37]/25 hover:brightness-110 cursor-pointer transition-all uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          <span>Pay ₹{(Number(amount) || 0).toLocaleString('en-IN')} Now</span>
        </button>
      </div>
    </div>
  );
};
