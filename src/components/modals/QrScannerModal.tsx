import React from 'react';
import { Camera, Image, QrCode, Sparkles, Upload, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../context/AppContext';

export const QrScannerModal: React.FC = () => {
  const { showQrScanner, setShowQrScanner, navigateTo, setSelectedPaymentMethod } =
    useAppStore();

  if (!showQrScanner) return null;

  const sampleQrs = [
    {
      name: 'Taj Dining Club',
      upi: 'taj.dining@hdfcbank',
      amount: 8400,
      avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Apex Luxury Watches',
      upi: 'apex.luxury@icici',
      amount: 12500,
      avatar: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Ananya Sharma',
      upi: 'ananya.sharma@okaxis',
      amount: 2000,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    },
  ];

  const handleScanSample = (qr: (typeof sampleQrs)[0]) => {
    setShowQrScanner(false);
    setSelectedPaymentMethod('qr');
    navigateTo('enter-details', {
      method: 'qr',
      flowData: {
        recipientName: qr.name,
        recipientUpiOrAccount: qr.upi,
        recipientAvatar: qr.avatar,
        amount: qr.amount,
        paymentMethod: 'qr',
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-[#16130B] border border-[#D4AF37]/30 rounded-3xl p-6 shadow-2xl space-y-5 text-center relative overflow-hidden select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/15">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-bold tracking-widest text-[#D0C5AF] uppercase">
              Scan UPI QR Code
            </span>
          </div>

          <button
            onClick={() => setShowQrScanner(false)}
            className="p-1.5 rounded-full bg-[#1A1710] text-[#A39985] hover:text-[#EAE1D4] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Frame */}
        <div className="relative w-60 h-60 mx-auto rounded-3xl bg-[#0B0A08] border-2 border-[#D4AF37]/40 overflow-hidden flex items-center justify-center shadow-inner">
          {/* Scanning Laser Line */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-lg shadow-[#D4AF37] animate-bounce my-auto" />

          {/* Corner Markers */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]" />

          {/* Center Graphic */}
          <div className="p-4 text-center space-y-1 z-10 opacity-70">
            <Camera className="w-8 h-8 text-[#D4AF37] mx-auto animate-pulse" />
            <p className="text-[10px] font-mono text-[#D0C5AF]">Align QR Code within frame</p>
          </div>
        </div>

        {/* Quick Test QR Code Selectors */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#D0C5AF] uppercase tracking-wider flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Or Select Sample Merchant QR</span>
          </p>

          <div className="grid grid-cols-1 gap-2">
            {sampleQrs.map((qr) => (
              <button
                key={qr.upi}
                onClick={() => handleScanSample(qr)}
                className="p-3 rounded-2xl bg-[#0B0A08] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#231F17] transition-all cursor-pointer flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={qr.avatar}
                    alt={qr.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]/40"
                  />
                  <div>
                    <p className="font-bold text-xs text-[#EAE1D4] group-hover:text-[#F2CA50]">
                      {qr.name}
                    </p>
                    <p className="text-[10px] text-[#A39985] font-mono">{qr.upi}</p>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-[#D4AF37]">
                  ₹{qr.amount.toLocaleString('en-IN')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
