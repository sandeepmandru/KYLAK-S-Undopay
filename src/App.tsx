import React from 'react';
import { BottomNav } from './components/common/BottomNav';
import { Header } from './components/common/Header';
import { AddFundsModal } from './components/modals/AddFundsModal';
import { PinConfirmationModal } from './components/modals/PinConfirmationModal';
import { QrScannerModal } from './components/modals/QrScannerModal';
import { TransactionReceiptModal } from './components/modals/TransactionReceiptModal';
import { DashboardStatsScreen } from './components/screens/DashboardStatsScreen';
import { EnterPaymentDetailsScreen } from './components/screens/EnterPaymentDetailsScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { PaymentCancelledScreen } from './components/screens/PaymentCancelledScreen';
import { PaymentMethodsScreen } from './components/screens/PaymentMethodsScreen';
import { PaymentSuccessScreen } from './components/screens/PaymentSuccessScreen';
import { SplashScreen } from './components/screens/SplashScreen';
import { TransactionHistoryScreen } from './components/screens/TransactionHistoryScreen';
import { UndoCountdownScreen } from './components/screens/UndoCountdownScreen';
import { AppProvider, useAppStore } from './context/AppContext';

const AppContent: React.FC = () => {
  const { activeScreen } = useAppStore();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen />;
      case 'home':
        return <HomeScreen />;
      case 'choose-method':
        return <PaymentMethodsScreen />;
      case 'enter-details':
        return <EnterPaymentDetailsScreen />;
      case 'undo-countdown':
        return <UndoCountdownScreen />;
      case 'success-receipt':
        return <PaymentSuccessScreen />;
      case 'cancelled-receipt':
        return <PaymentCancelledScreen />;
      case 'history':
        return <TransactionHistoryScreen />;
      case 'stats':
        return <DashboardStatsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const hideHeaderAndNav = activeScreen === 'splash' || activeScreen === 'login';

  return (
    <div className="min-h-screen bg-[#0B0A08] text-[#EAE1D4] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      {!hideHeaderAndNav && <Header />}

      <main className="flex-1 px-4 sm:px-6 pt-4 sm:pt-6">
        {renderScreen()}
      </main>

      {!hideHeaderAndNav && <BottomNav />}

      {/* Global Modals */}
      <PinConfirmationModal />
      <TransactionReceiptModal />
      <QrScannerModal />
      <AddFundsModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
