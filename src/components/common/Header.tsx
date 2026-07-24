import React from 'react';
import { ArrowLeft, Bell, QrCode, ShieldCheck, Sparkles, Timer } from 'lucide-react';
import { useAppStore } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { user, activeScreen, activeUndoTransaction, activeUndoSeconds, navigateTo, setShowQrScanner } =
    useAppStore();

  const isHome = activeScreen === 'home';
  const showBack = !isHome && activeScreen !== 'splash' && activeScreen !== 'login';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0B0A08]/90 backdrop-blur-md border-b border-[#D4AF37]/15 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left branding or Back button */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={() => navigateTo('home')}
              className="p-2 rounded-xl bg-[#1A1710] text-[#D4AF37] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#252014] transition-all cursor-pointer flex items-center gap-1.5 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
          ) : (
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F2CA50] to-[#8C7332] p-0.5 shadow-md shadow-[#D4AF37]/20 group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-[#0B0A08] rounded-[10px] flex items-center justify-center">
                  <span className="font-display font-bold text-lg text-[#D4AF37] tracking-tighter">U</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-base tracking-wider text-[#EAE1D4] group-hover:text-[#D4AF37] transition-colors">
                    KYLAK'S
                  </span>
                  <span className="text-[10px] font-semibold tracking-widest px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                    UNDO
                  </span>
                </div>
                <p className="text-[10px] text-[#A39985] tracking-widest uppercase">Wealth Portal</p>
              </div>
            </button>
          )}
        </div>

        {/* Center Active Undo Countdown Pill (if counting down in background) */}
        {activeUndoTransaction && activeScreen !== 'undo-countdown' && (
          <button
            onClick={() => navigateTo('undo-countdown')}
            className="animate-pulse flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/30 to-[#8C7332]/20 border border-[#D4AF37]/60 text-[#D4AF37] text-xs font-semibold cursor-pointer shadow-lg shadow-[#D4AF37]/10"
          >
            <Timer className="w-4 h-4 text-[#F2CA50] animate-spin" style={{ animationDuration: '3s' }} />
            <span>UNDO AVAILABLE ({activeUndoSeconds}s)</span>
          </button>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowQrScanner(true)}
            className="p-2 rounded-xl bg-[#1A1710] text-[#D4AF37] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#252014] transition-all cursor-pointer relative"
            title="Quick QR Scan"
          >
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1A1710] border border-[#D4AF37]/20">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-medium text-[#D0C5AF]">{user.tier}</span>
          </div>

          <button
            onClick={() => navigateTo('login')}
            className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full bg-[#1A1710] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 cursor-pointer transition-all"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]/40"
            />
            <span className="text-xs font-medium text-[#EAE1D4] hidden md:inline">{user.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
