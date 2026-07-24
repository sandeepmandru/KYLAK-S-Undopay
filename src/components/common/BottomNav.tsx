import React from 'react';
import { History, Home, PieChart, QrCode, Send, Undo2 } from 'lucide-react';
import { useAppStore } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeScreen, activeUndoTransaction, activeUndoSeconds, navigateTo, setShowQrScanner } =
    useAppStore();

  if (activeScreen === 'splash' || activeScreen === 'login') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0A08]/95 backdrop-blur-lg border-t border-[#D4AF37]/20 px-3 py-2 sm:px-6">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
            activeScreen === 'home'
              ? 'text-[#D4AF37] font-semibold'
              : 'text-[#A39985] hover:text-[#EAE1D4]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-wider">Home</span>
        </button>

        {/* Send / Pay */}
        <button
          onClick={() => navigateTo('choose-method')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
            activeScreen === 'choose-method' || activeScreen === 'enter-details'
              ? 'text-[#D4AF37] font-semibold'
              : 'text-[#A39985] hover:text-[#EAE1D4]'
          }`}
        >
          <Send className="w-5 h-5" />
          <span className="text-[10px] tracking-wider">Send</span>
        </button>

        {/* Floating Center Action: QR or Active Undo */}
        <div className="-mt-6">
          {activeUndoTransaction ? (
            <button
              onClick={() => navigateTo('undo-countdown')}
              className="relative group p-3.5 rounded-full bg-gradient-to-tr from-[#93000A] via-[#D4AF37] to-[#F5E08B] text-black shadow-lg shadow-[#D4AF37]/30 border-2 border-[#D4AF37] animate-pulse cursor-pointer transition-transform hover:scale-105"
            >
              <Undo2 className="w-6 h-6 text-black font-bold" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center border border-black">
                {activeUndoSeconds}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setShowQrScanner(true)}
              className="p-3.5 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F5E08B] to-[#8C7332] text-black shadow-lg shadow-[#D4AF37]/25 border border-[#FFF1B0] hover:scale-105 transition-all cursor-pointer"
              title="Scan QR Code"
            >
              <QrCode className="w-6 h-6 text-black font-bold" />
            </button>
          )}
        </div>

        {/* History */}
        <button
          onClick={() => navigateTo('history')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
            activeScreen === 'history'
              ? 'text-[#D4AF37] font-semibold'
              : 'text-[#A39985] hover:text-[#EAE1D4]'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] tracking-wider">History</span>
        </button>

        {/* Analytics Stats */}
        <button
          onClick={() => navigateTo('stats')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
            activeScreen === 'stats'
              ? 'text-[#D4AF37] font-semibold'
              : 'text-[#A39985] hover:text-[#EAE1D4]'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px] tracking-wider">Analytics</span>
        </button>
      </div>
    </div>
  );
};
