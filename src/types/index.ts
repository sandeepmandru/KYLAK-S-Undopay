export type PaymentMethod = 'qr' | 'mobile' | 'contact' | 'bank';

export type TransactionStatus = 'initiated' | 'success' | 'cancelled';

export interface Transaction {
  id: string;
  recipientName: string;
  recipientUpiOrAccount: string;
  recipientAvatar?: string;
  bankName?: string;
  ifscCode?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  timestamp: string; // ISO string
  formattedDate: string;
  note?: string;
  fundingSource: string;
  category?: string;
  undoSecondsLeft?: number;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  upiId: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  avatar: string;
  recent?: boolean;
}

export interface UserProfile {
  name: string;
  upiId: string;
  phone: string;
  accountNumber: string;
  tier: string;
  balance: number;
  avatarUrl: string;
  pin: string;
}

export interface DashboardStats {
  totalTransactions: number;
  successfulTransactions: number;
  cancelledTransactions: number;
  totalAmountSent: number;
  totalAmountSavedUndo: number;
  successRate: number; // Percentage 0-100
}

export type AppScreen =
  | 'splash'
  | 'login'
  | 'home'
  | 'choose-method'
  | 'enter-details'
  | 'confirmation'
  | 'undo-countdown'
  | 'success-receipt'
  | 'cancelled-receipt'
  | 'history'
  | 'stats';
