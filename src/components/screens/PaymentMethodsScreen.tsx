import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  QrCode,
  Search,
  Smartphone,
  UserCheck,
} from 'lucide-react';
import { useAppStore } from '../../context/AppContext';
import { Contact, PaymentMethod } from '../../types';

export const PaymentMethodsScreen: React.FC = () => {
  const {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    contacts,
    navigateTo,
    setShowQrScanner,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<PaymentMethod>(selectedPaymentMethod || 'mobile');

  // Mobile Payment state
  const [mobileNum, setMobileNum] = useState<string>('');
  const [mobileName, setMobileName] = useState<string>('');

  // Contact Payment state
  const [contactSearch, setContactSearch] = useState<string>('');

  // Bank Transfer state
  const [accountNo, setAccountNo] = useState<string>('');
  const [confirmAccountNo, setConfirmAccountNo] = useState<string>('');
  const [ifsc, setIfsc] = useState<string>('HDFC0000240');
  const [holderName, setHolderName] = useState<string>('');
  const [bankError, setBankError] = useState<string>('');

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.upiId.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.phone.includes(contactSearch)
  );

  const handleProceedMobile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNum || mobileNum.length < 10) return;

    navigateTo('enter-details', {
      method: 'mobile',
      flowData: {
        recipientName: mobileName || `Contact (${mobileNum})`,
        recipientUpiOrAccount: `${mobileNum}@kylak`,
        paymentMethod: 'mobile',
      },
    });
  };

  const handleSelectContact = (contact: Contact) => {
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
  };

  const handleProceedBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNo || accountNo !== confirmAccountNo) {
      setBankError('Account numbers do not match!');
      return;
    }
    if (!holderName || !ifsc) {
      setBankError('Please enter all required bank fields.');
      return;
    }

    setBankError('');
    navigateTo('enter-details', {
      method: 'bank',
      flowData: {
        recipientName: holderName,
        recipientUpiOrAccount: `Acc: •••• ${accountNo.slice(-4)}`,
        bankName: 'National Bank Settlement',
        ifscCode: ifsc.toUpperCase(),
        paymentMethod: 'bank',
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Top Title & Navigation Tabs */}
      <div className="p-6 rounded-3xl bg-[#16130B] border border-[#D4AF37]/20 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigateTo('home')}
            className="p-2 rounded-xl bg-[#1A1710] text-[#D4AF37] border border-[#D4AF37]/20 hover:border-[#D4AF37] cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl text-[#EAE1D4]">
              Choose Payment Method
            </h1>
            <p className="text-xs text-[#A39985]">
              Instant zero-risk transfer backed by 15-second undo protection
            </p>
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => {
              setActiveTab('qr');
              setShowQrScanner(true);
            }}
            className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'qr'
                ? 'bg-[#231F17] border-[#D4AF37] text-[#D4AF37]'
                : 'bg-[#12100B] border-[#D4AF37]/20 text-[#A39985] hover:text-[#EAE1D4]'
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs font-bold">QR Scan</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('mobile');
              setSelectedPaymentMethod('mobile');
            }}
            className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'mobile'
                ? 'bg-[#231F17] border-[#D4AF37] text-[#D4AF37]'
                : 'bg-[#12100B] border-[#D4AF37]/20 text-[#A39985] hover:text-[#EAE1D4]'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-xs font-bold">Mobile</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('contact');
              setSelectedPaymentMethod('contact');
            }}
            className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'contact'
                ? 'bg-[#231F17] border-[#D4AF37] text-[#D4AF37]'
                : 'bg-[#12100B] border-[#D4AF37]/20 text-[#A39985] hover:text-[#EAE1D4]'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span className="text-xs font-bold">Contacts</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bank');
              setSelectedPaymentMethod('bank');
            }}
            className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'bank'
                ? 'bg-[#231F17] border-[#D4AF37] text-[#D4AF37]'
                : 'bg-[#12100B] border-[#D4AF37]/20 text-[#A39985] hover:text-[#EAE1D4]'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-xs font-bold">Bank</span>
          </button>
        </div>
      </div>

      {/* Tab 1: QR Payment Trigger */}
      {activeTab === 'qr' && (
        <div className="p-8 rounded-3xl bg-[#16130B] border border-[#D4AF37]/30 text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-[#231F17] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto">
            <QrCode className="w-10 h-10" />
          </div>
          <h2 className="font-bold text-lg text-[#EAE1D4]">Scan Any Merchant or UPI QR Code</h2>
          <p className="text-xs text-[#A39985] max-w-sm mx-auto">
            Use your camera or select a sample test QR code to simulate instant scanning.
          </p>
          <button
            onClick={() => setShowQrScanner(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8C7332] text-black font-bold text-sm shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 cursor-pointer"
          >
            Launch Camera / Test QR Scanner
          </button>
        </div>
      )}

      {/* Tab 2: Mobile Number Payment */}
      {activeTab === 'mobile' && (
        <form
          onSubmit={handleProceedMobile}
          className="p-6 rounded-3xl bg-[#16130B] border border-[#D4AF37]/20 space-y-4"
        >
          <h2 className="font-bold text-base text-[#EAE1D4] flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#D4AF37]" />
            <span>Pay to Mobile Number</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#D0C5AF] block mb-1.5">
                Recipient Mobile Number
              </label>
              <input
                type="tel"
                value={mobileNum}
                onChange={(e) => setMobileNum(e.target.value)}
                placeholder="Enter 10-digit phone number (e.g., 9876543210)"
                maxLength={10}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-[#0B0A08] border border-[#D4AF37]/30 text-sm text-[#EAE1D4] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#D0C5AF] block mb-1.5">
                Recipient Name (Optional)
              </label>
              <input
                type="text"
                value={mobileName}
                onChange={(e) => setMobileName(e.target.value)}
                placeholder="Name or alias"
                className="w-full px-4 py-3.5 rounded-xl bg-[#0B0A08] border border-[#D4AF37]/30 text-sm text-[#EAE1D4] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!mobileNum || mobileNum.length < 10}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5E08B] to-[#D4AF37] text-black font-bold text-sm shadow-lg shadow-[#D4AF37]/20 disabled:opacity-40 cursor-pointer hover:brightness-110 transition-all uppercase tracking-wider mt-4"
          >
            Continue to Amount
          </button>
        </form>
      )}

      {/* Tab 3: Contact Picker */}
      {activeTab === 'contact' && (
        <div className="p-6 rounded-3xl bg-[#16130B] border border-[#D4AF37]/20 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-[#EAE1D4] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#D4AF37]" />
              <span>Select Verified Beneficiary</span>
            </h2>
            <span className="text-xs text-[#D4AF37] font-semibold">
              {filteredContacts.length} Contacts
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
            <input
              type="text"
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              placeholder="Search contact name, phone, or UPI..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0A08] border border-[#D4AF37]/25 text-xs text-[#EAE1D4] placeholder-[#8C8370] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className="p-3.5 rounded-2xl bg-[#0B0A08] border border-[#D4AF37]/15 hover:border-[#D4AF37] hover:bg-[#1F1B12] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#D4AF37]/40"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-[#EAE1D4] group-hover:text-[#F2CA50]">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-[#A39985] font-mono">{contact.upiId}</p>
                    <p className="text-[10px] text-[#D0C5AF]">{contact.bankName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-[#D4AF37] font-semibold">
                  <span>Pay</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Bank Transfer */}
      {activeTab === 'bank' && (
        <form
          onSubmit={handleProceedBank}
          className="p-6 rounded-3xl bg-[#16130B] border border-[#D4AF37]/20 space-y-4"
        >
          <h2 className="font-bold text-base text-[#EAE1D4] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#D4AF37]" />
            <span>Bank Account Transfer</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#D0C5AF] block mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="Full name as in bank record"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0B0A08] border border-[#D4AF37]/30 text-sm text-[#EAE1D4] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#D0C5AF] block mb-1">
                Bank Account Number
              </label>
              <input
                type="password"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="Enter bank account number"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0B0A08] border border-[#D4AF37]/30 text-sm text-[#EAE1D4] focus:outline-none focus:border-[#D4AF37] font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#D0C5AF] block mb-1">
                Confirm Bank Account Number
              </label>
              <input
                type="text"
                value={confirmAccountNo}
                onChange={(e) => setConfirmAccountNo(e.target.value)}
                placeholder="Re-enter bank account number"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0B0A08] border border-[#D4AF37]/30 text-sm text-[#EAE1D4] focus:outline-none focus:border-[#D4AF37] font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#D0C5AF] block mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="e.g. HDFC0000240"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0B0A08] border border-[#D4AF37]/30 text-sm text-[#EAE1D4] focus:outline-none focus:border-[#D4AF37] font-mono uppercase"
              />
            </div>
          </div>

          {bankError && <p className="text-xs text-[#FFB4AB] font-semibold">{bankError}</p>}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5E08B] to-[#D4AF37] text-black font-bold text-sm shadow-lg shadow-[#D4AF37]/20 cursor-pointer hover:brightness-110 transition-all uppercase tracking-wider mt-4"
          >
            Verify & Proceed
          </button>
        </form>
      )}
    </div>
  );
};
