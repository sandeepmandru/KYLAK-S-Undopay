import React, { useState } from 'react';
import { Delete, Fingerprint, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../context/AppContext';
import { sounds } from '../../utils/audio';

export const LoginScreen: React.FC = () => {
  const { user, navigateTo } = useAppStore();
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleKeyPress = (num: string) => {
    if (pin.length >= 4) return;
    sounds.playKeyClick();
    const newPin = pin + num;
    setPin(newPin);
    setErrorMsg('');

    if (newPin.length === 4) {
      if (newPin === user.pin || newPin === '1234') {
        sounds.playSuccessChime();
        setTimeout(() => navigateTo('home'), 200);
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

  const handleBiometricLogin = () => {
    sounds.playKeyClick();
    sounds.playSuccessChime();
    navigateTo('home');
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto text-center select-none">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="relative mb-3">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20"
          />
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#1A1710] border border-[#D4AF37] text-[#D4AF37]">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <h2 className="font-display font-bold text-2xl text-[#EAE1D4] mb-1">{user.name}</h2>
        <p className="text-xs text-[#A39985] tracking-widest uppercase">{user.tier}</p>
        <p className="text-xs text-[#D4AF37] mt-1 font-mono">{user.upiId}</p>
      </motion.div>

      {/* PIN Dots */}
      <div className="mb-6 w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs font-semibold text-[#D0C5AF] uppercase tracking-wider">
            Enter 4-Digit Security PIN
          </span>
        </div>

        <div className="flex justify-center gap-4 py-3">
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
          <p className="text-xs text-[#FFB4AB] mt-1 font-medium">{errorMsg}</p>
        ) : (
          <p className="text-[11px] text-[#A39985] mt-1">Default PIN: 1234 (or use Biometrics)</p>
        )}
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-6">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            className="h-14 rounded-2xl bg-[#16130B] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#231F17] text-xl font-bold text-[#EAE1D4] transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-md"
          >
            {num}
          </button>
        ))}

        <button
          onClick={handleBiometricLogin}
          className="h-14 rounded-2xl bg-[#1D1912] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 text-[#D4AF37] transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-md"
          title="Use Fingerprint Biometrics"
        >
          <Fingerprint className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleKeyPress('0')}
          className="h-14 rounded-2xl bg-[#16130B] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#231F17] text-xl font-bold text-[#EAE1D4] transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-md"
        >
          0
        </button>

        <button
          onClick={handleDelete}
          className="h-14 rounded-2xl bg-[#1D1912] border border-[#D4AF37]/20 hover:bg-[#2B2315] text-[#D0C5AF] transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-md"
          title="Delete"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={handleBiometricLogin}
        className="w-full max-w-xs py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5E08B] to-[#D4AF37] text-black font-bold text-sm shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 cursor-pointer transition-all uppercase tracking-wider"
      >
        Unlock with Biometrics
      </button>
    </div>
  );
};
