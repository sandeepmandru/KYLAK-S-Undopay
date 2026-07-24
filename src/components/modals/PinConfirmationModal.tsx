import React, { useState } from 'react';
import { Delete, Fingerprint, Lock, ShieldCheck, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../context/AppContext';
import { sounds } from '../../utils/audio';

export const PinConfirmationModal: React.FC = () => {
  const { showPinModal, setShowPinModal, confirmPinAndInitiate, paymentFlowData, user } =
    useAppStore();

  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!showPinModal || !paymentFlowData) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length >= 4) return;
    sounds.playKeyClick();
    const newPin = pin + num;
    setPin(newPin);
    setErrorMsg('');

    if (newPin.length === 4) {
      if (newPin === user.pin || newPin === '1234') {
        sounds.playSuccessChime();
        setTimeout(() => {
          setPin('');
          confirmPinAndInitiate();
        }, 200);
      } else {
        setErrorMsg('Invalid Security PIN. Default PIN is 1234');
        setPin('');
      }
    }
  };

  const handleDelete = () => {
    sounds.playKeyClick();
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleBiometricAuth = () => {
    sounds.playKeyClick();
    sounds.playSuccessChime();
    setPin('');
    confirmPinAndInitiate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="w-full max-w-md bg-[#16130B] border-t sm:border border-[#D4AF37]/30 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-6 text-center select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/15">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-bold tracking-widest text-[#D0C5AF] uppercase">
              Confirm Security PIN
            </span>
          </div>

          <button
            onClick={() => {
              setPin('');
              setShowPinModal(false);
            }}
            className="p-1.5 rounded-full bg-[#1A1710] text-[#A39985] hover:text-[#EAE1D4] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Summary */}
        <div className="p-4 rounded-2xl bg-[#0B0A08] border border-[#D4AF37]/20 text-center">
          <p className="text-xs text-[#A39985]">Paying to</p>
          <p className="font-bold text-base text-[#EAE1D4]">{paymentFlowData.recipientName}</p>
          <div className="font-display font-extrabold text-3xl text-[#D4AF37] my-1">
            ₹{(paymentFlowData.amount || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#A39985]">{paymentFlowData.fundingSource}</p>
        </div>

        {/* PIN Dots */}
        <div>
          <div className="flex justify-center gap-4 py-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 border ${
                  pin.length > index
                    ? 'bg-[#D4AF37] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/40 scale-110'
                    : 'bg-[#1A1710] border-[#D4AF37]/30'
                }`}
              />
            ))}
          </div>

          {errorMsg ? (
            <p className="text-xs text-[#FFB4AB] mt-1 font-semibold">{errorMsg}</p>
          ) : (
            <p className="text-[11px] text-[#A39985] mt-1">Default PIN: 1234 or tap Biometrics</p>
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-12 rounded-xl bg-[#0B0A08] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#231F17] text-lg font-bold text-[#EAE1D4] transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
            >
              {num}
            </button>
          ))}

          <button
            onClick={handleBiometricAuth}
            className="h-12 rounded-xl bg-[#1D1912] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 text-[#D4AF37] transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
            title="Biometric Fingerprint"
          >
            <Fingerprint className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-xl bg-[#0B0A08] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#231F17] text-lg font-bold text-[#EAE1D4] transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
          >
            0
          </button>

          <button
            onClick={handleDelete}
            className="h-12 rounded-xl bg-[#1D1912] border border-[#D4AF37]/20 hover:bg-[#2B2315] text-[#D0C5AF] transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
            title="Delete"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
