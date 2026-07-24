import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_TRANSACTIONS, INITIAL_USER, SAMPLE_CONTACTS } from '../data/mockData';
import {
  AppScreen,
  Contact,
  DashboardStats,
  PaymentMethod,
  Transaction,
  UserProfile,
} from '../types';
import { sounds } from '../utils/audio';

interface AppContextType {
  user: UserProfile;
  transactions: Transaction[];
  contacts: Contact[];
  activeUndoTransaction: Transaction | null;
  activeUndoSeconds: number;
  activeScreen: AppScreen;
  selectedPaymentMethod: PaymentMethod | null;
  paymentFlowData: Partial<Transaction> | null;
  viewingReceiptTransaction: Transaction | null;
  searchQuery: string;
  showQrScanner: boolean;
  showAddFundsModal: boolean;
  showPinModal: boolean;
  dashboardStats: DashboardStats;

  // Actions
  navigateTo: (screen: AppScreen, params?: { method?: PaymentMethod; tx?: Transaction; flowData?: Partial<Transaction> }) => void;
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;
  setPaymentFlowData: React.Dispatch<React.SetStateAction<Partial<Transaction> | null>>;
  setSearchQuery: (query: string) => void;
  setShowQrScanner: (show: boolean) => void;
  setShowAddFundsModal: (show: boolean) => void;
  setShowPinModal: (show: boolean) => void;
  
  // Payment engine
  startPaymentFlow: (details: {
    recipientName: string;
    recipientUpiOrAccount: string;
    recipientAvatar?: string;
    bankName?: string;
    ifscCode?: string;
    amount: number;
    paymentMethod: PaymentMethod;
    note?: string;
    fundingSource?: string;
  }) => void;
  confirmPinAndInitiate: () => void;
  undoActivePayment: () => void;
  confirmActivePaymentNow: () => void;
  
  // Other features
  addFunds: (amount: number) => void;
  openReceipt: (tx: Transaction) => void;
  closeReceipt: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_TX = 'kylaks_undopay_transactions_v1';
const LOCAL_STORAGE_KEY_USER = 'kylaks_undopay_user_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_USER;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TX);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TRANSACTIONS;
  });

  const [contacts] = useState<Contact[]>(SAMPLE_CONTACTS);
  const [activeScreen, setActiveScreen] = useState<AppScreen>('splash');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentFlowData, setPaymentFlowData] = useState<Partial<Transaction> | null>(null);
  const [viewingReceiptTransaction, setViewingReceiptTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showQrScanner, setShowQrScanner] = useState<boolean>(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);

  // Active 15s Undo Countdown State
  const [activeUndoTransaction, setActiveUndoTransaction] = useState<Transaction | null>(null);
  const [activeUndoSeconds, setActiveUndoSeconds] = useState<number>(15);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TX, JSON.stringify(transactions));
    } catch {
      // silent
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
    } catch {
      // silent
    }
  }, [user]);

  // 15-Second Undo Timer Engine Effect
  useEffect(() => {
    if (!activeUndoTransaction) return;

    if (activeUndoSeconds <= 0) {
      // Timer finished -> Transaction completes successfully!
      const currentTxId = activeUndoTransaction.id;
      
      setTransactions((prev) =>
        prev.map((t) => (t.id === currentTxId ? { ...t, status: 'success', undoSecondsLeft: 0 } : t))
      );

      // Trigger Celebration & Audio
      sounds.playSuccessChime();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FFF1B0', '#F5E08B', '#FFFFFF'],
        });
      } catch {
        // ignore
      }

      setViewingReceiptTransaction({
        ...activeUndoTransaction,
        status: 'success',
        undoSecondsLeft: 0,
      });
      setActiveUndoTransaction(null);
      setActiveScreen('success-receipt');
      return;
    }

    const timer = setInterval(() => {
      setActiveUndoSeconds((prev) => {
        const nextSec = prev - 1;
        if (nextSec > 0) {
          sounds.playTick();
        }
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeUndoTransaction, activeUndoSeconds]);

  // Derived Statistics Calculation
  const dashboardStats: DashboardStats = React.useMemo(() => {
    const totalTransactions = transactions.length;
    const successfulTransactions = transactions.filter((t) => t.status === 'success').length;
    const cancelledTransactions = transactions.filter((t) => t.status === 'cancelled').length;
    const totalAmountSent = transactions
      .filter((t) => t.status === 'success')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalAmountSavedUndo = transactions
      .filter((t) => t.status === 'cancelled')
      .reduce((acc, t) => acc + t.amount, 0);
    const successRate =
      totalTransactions > 0 ? Math.round((successfulTransactions / totalTransactions) * 100) : 100;

    return {
      totalTransactions,
      successfulTransactions,
      cancelledTransactions,
      totalAmountSent,
      totalAmountSavedUndo,
      successRate,
    };
  }, [transactions]);

  const navigateTo = (
    screen: AppScreen,
    params?: { method?: PaymentMethod; tx?: Transaction; flowData?: Partial<Transaction> }
  ) => {
    if (params?.method !== undefined) setSelectedPaymentMethod(params.method);
    if (params?.tx !== undefined) setViewingReceiptTransaction(params.tx);
    if (params?.flowData !== undefined) setPaymentFlowData(params.flowData);
    setActiveScreen(screen);
  };

  const startPaymentFlow = (details: {
    recipientName: string;
    recipientUpiOrAccount: string;
    recipientAvatar?: string;
    bankName?: string;
    ifscCode?: string;
    amount: number;
    paymentMethod: PaymentMethod;
    note?: string;
    fundingSource?: string;
  }) => {
    setPaymentFlowData({
      recipientName: details.recipientName,
      recipientUpiOrAccount: details.recipientUpiOrAccount,
      recipientAvatar: details.recipientAvatar,
      bankName: details.bankName,
      ifscCode: details.ifscCode,
      amount: details.amount,
      paymentMethod: details.paymentMethod,
      note: details.note || 'KYLAK Payment Transfer',
      fundingSource: details.fundingSource || 'Kylak Wealth Account •••• 8842',
    });
    setShowPinModal(true);
  };

  const confirmPinAndInitiate = () => {
    if (!paymentFlowData || !paymentFlowData.amount) return;

    setShowPinModal(false);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newTx: Transaction = {
      id: 'TXN-' + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      recipientName: paymentFlowData.recipientName || 'Recipient',
      recipientUpiOrAccount: paymentFlowData.recipientUpiOrAccount || 'upi@kylak',
      recipientAvatar: paymentFlowData.recipientAvatar,
      bankName: paymentFlowData.bankName,
      ifscCode: paymentFlowData.ifscCode,
      amount: Number(paymentFlowData.amount),
      paymentMethod: paymentFlowData.paymentMethod || 'mobile',
      status: 'initiated',
      timestamp: now.toISOString(),
      formattedDate,
      note: paymentFlowData.note || 'KYLAK Payment Transfer',
      fundingSource: paymentFlowData.fundingSource || 'Kylak Wealth Account •••• 8842',
      category: 'Transfer',
      undoSecondsLeft: 15,
    };

    // Deduct user balance speculatively
    setUser((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - newTx.amount),
    }));

    // Add transaction to history immediately
    setTransactions((prev) => [newTx, ...prev]);

    // Start 15-second active countdown
    setActiveUndoTransaction(newTx);
    setActiveUndoSeconds(15);
    setViewingReceiptTransaction(newTx);
    setActiveScreen('undo-countdown');
  };

  const undoActivePayment = () => {
    if (!activeUndoTransaction) return;

    const txId = activeUndoTransaction.id;
    const amount = activeUndoTransaction.amount;

    sounds.playUndoSound();

    // Mark as cancelled
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'cancelled', undoSecondsLeft: 0 } : t))
    );

    // Restore user balance!
    setUser((prev) => ({
      ...prev,
      balance: prev.balance + amount,
    }));

    const cancelledTx: Transaction = {
      ...activeUndoTransaction,
      status: 'cancelled',
      undoSecondsLeft: 0,
    };

    setViewingReceiptTransaction(cancelledTx);
    setActiveUndoTransaction(null);
    setActiveScreen('cancelled-receipt');
  };

  const confirmActivePaymentNow = () => {
    if (!activeUndoTransaction) return;

    const txId = activeUndoTransaction.id;

    sounds.playSuccessChime();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF1B0', '#F5E08B', '#FFFFFF'],
      });
    } catch {
      // ignore
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'success', undoSecondsLeft: 0 } : t))
    );

    const successTx: Transaction = {
      ...activeUndoTransaction,
      status: 'success',
      undoSecondsLeft: 0,
    };

    setViewingReceiptTransaction(successTx);
    setActiveUndoTransaction(null);
    setActiveScreen('success-receipt');
  };

  const addFunds = (amount: number) => {
    if (amount <= 0) return;
    setUser((prev) => ({
      ...prev,
      balance: prev.balance + amount,
    }));
    sounds.playSuccessChime();
  };

  const openReceipt = (tx: Transaction) => {
    setViewingReceiptTransaction(tx);
  };

  const closeReceipt = () => {
    setViewingReceiptTransaction(null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        contacts,
        activeUndoTransaction,
        activeUndoSeconds,
        activeScreen,
        selectedPaymentMethod,
        paymentFlowData,
        viewingReceiptTransaction,
        searchQuery,
        showQrScanner,
        showAddFundsModal,
        showPinModal,
        dashboardStats,

        navigateTo,
        setSelectedPaymentMethod,
        setPaymentFlowData,
        setSearchQuery,
        setShowQrScanner,
        setShowAddFundsModal,
        setShowPinModal,

        startPaymentFlow,
        confirmPinAndInitiate,
        undoActivePayment,
        confirmActivePaymentNow,

        addFunds,
        openReceipt,
        closeReceipt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
