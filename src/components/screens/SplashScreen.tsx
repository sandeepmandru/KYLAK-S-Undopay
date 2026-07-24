import React, { useState } from 'react';
import { Fingerprint, RotateCcw, ShieldCheck, Sparkles, Undo2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../context/AppContext';
import { sounds } from '../../utils/audio';

export const SplashScreen: React.FC = () => {
  const { navigateTo } = useAppStore();
  const [authenticating, setAuthenticating] = useState(false);

  const handleAuthenticate = () => {
    sounds.playKeyClick();
    setAuthenticating(true);
    sounds.playSuccessChime();
    setTimeout(() => {
      navigateTo('home');
    }, 900);
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-between px-6 py-12 text-center bg-[#0B0A08] overflow-hidden select-none">
      {/* Background radial gold glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Gold Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1710] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold tracking-widest uppercase shadow-md shadow-[#D4AF37]/10"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#F2CA50]" />
        <span>Kylak Private Wealth</span>
      </motion.div>

      {/* Center Logo & Branding (Matching provided visual mockup!) */}
      <div className="my-auto flex flex-col items-center max-w-sm w-full">
        {/* Circle with Curved Undo Arrow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative group cursor-pointer mb-8"
          onClick={handleAuthenticate}
        >
          <div className="w-44 h-44 rounded-full bg-gradient-to-b from-[#231F17] to-[#12100B] border border-[#D4AF37]/30 flex items-center justify-center p-2 shadow-2xl shadow-[#D4AF37]/15 group-hover:border-[#D4AF37] transition-all">
            <div className="w-full h-full rounded-full bg-[#14110A] border border-[#D4AF37]/20 flex items-center justify-center">
              <Undo2 className="w-20 h-20 text-[#D4AF37] stroke-[1.8] group-hover:rotate-[-12deg] transition-transform duration-300" />
            </div>
          </div>
          <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-display text-4xl sm:text-5xl font-extrabold tracking-[0.2em] text-[#F2CA50] mb-3 uppercase gold-text-gradient"
        >
          UNDOPAY
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xs sm:text-sm font-semibold tracking-[0.35em] text-[#D0C5AF] uppercase opacity-90 mb-6"
        >
          THE GOLD STANDARD OF WEALTH
        </motion.p>
      </div>

      {/* Bottom Biometric Trigger Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-col items-center w-full max-w-xs"
      >
        <button
          onClick={handleAuthenticate}
          disabled={authenticating}
          className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#1A1710] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#252014] transition-all cursor-pointer w-full shadow-lg shadow-[#D4AF37]/10 active:scale-98"
        >
          <div className="w-14 h-14 rounded-full bg-[#231F17] border border-[#D4AF37]/40 flex items-center justify-center group-hover:bg-[#D4AF37] transition-all">
            <Fingerprint className={`w-8 h-8 ${authenticating ? 'text-black animate-pulse' : 'text-[#D4AF37] group-hover:text-black'} transition-colors`} />
          </div>

          <div className="space-y-1 text-center">
            <span className="text-xs font-bold tracking-[0.15em] text-[#EAE1D4] group-hover:text-[#F2CA50] uppercase block">
              {authenticating ? 'AUTHENTICATING...' : 'BIOMETRIC READY'}
            </span>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A39985]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              <span>{authenticating ? 'Verifying Kylak Security Token' : 'Waiting for authentication...'}</span>
            </div>
          </div>
        </button>

        {/* Bottom Accent line */}
        <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent mt-6" />
      </motion.div>
    </div>
  );
};
