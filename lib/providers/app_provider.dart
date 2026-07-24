import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:intl/intl.dart';
import '../models/contact_model.dart';
import '../models/transaction_model.dart';
import '../models/user_model.dart';
import '../services/storage_service.dart';

class AppProvider extends ChangeNotifier {
  final StorageService _storage = StorageService();

  String _activeScreen = 'splash';
  String get activeScreen => _activeScreen;

  UserModel _user = UserModel(
    id: 'usr_1',
    name: 'Kylak Gold Member',
    email: 'kylak.vip@undopay.ai',
    upiId: 'kylak@hdfcbank',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    balance: 125000.0,
    accountType: 'Kylak Sovereign Wealth Balance',
    isUpiPinSet: true,
  );
  UserModel get user => _user;

  List<TransactionModel> _transactions = [];
  List<TransactionModel> get transactions => _transactions;

  PaymentMethod _selectedPaymentMethod = PaymentMethod.mobile;
  PaymentMethod get selectedPaymentMethod => _selectedPaymentMethod;

  // Active Flow Data
  Map<String, dynamic>? _activeFlowData;
  Map<String, dynamic>? get activeFlowData => _activeFlowData;

  TransactionModel? _activeTransaction;
  TransactionModel? get activeTransaction => _activeTransaction;

  int _countdownSeconds = 15;
  int get countdownSeconds => _countdownSeconds;

  Timer? _countdownTimer;

  // Viewing Receipt
  TransactionModel? _viewingReceiptTransaction;
  TransactionModel? get viewingReceiptTransaction => _viewingReceiptTransaction;

  // Modals visibility
  bool _showPinModal = false;
  bool get showPinModal => _showPinModal;

  bool _showQrScanner = false;
  bool get showQrScanner => _showQrScanner;

  bool _showAddFundsModal = false;
  bool get showAddFundsModal => _showAddFundsModal;

  bool _soundEnabled = true;
  bool get soundEnabled => _soundEnabled;

  AppProvider() {
    _initApp();
  }

  Future<void> _initApp() async {
    await _storage.init();
    final savedUser = await _storage.getUser();
    if (savedUser != null) {
      _user = savedUser;
    }

    final savedTxs = await _storage.getTransactions();
    if (savedTxs != null && savedTxs.isNotEmpty) {
      _transactions = savedTxs;
    } else {
      _transactions = _getInitialTransactions();
      await _storage.saveTransactions(_transactions);
    }

    _soundEnabled = await _storage.getSoundEnabled();
    notifyListeners();
  }

  List<TransactionModel> _getInitialTransactions() {
    final now = DateTime.now();
    return [
      TransactionModel(
        id: 'TXN-984210',
        recipientName: 'Taj Dining Club',
        recipientUpiOrAccount: 'taj.dining@hdfcbank',
        recipientAvatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200',
        amount: 8400.0,
        paymentMethod: PaymentMethod.qr,
        status: TransactionStatus.success,
        timestamp: now.subtract(const Duration(hours: 3)),
        formattedDate: DateFormat('MMM dd, yyyy • hh:mm a').format(now.subtract(const Duration(hours: 3))),
        note: 'Sovereign Banquet Dinner',
      ),
      TransactionModel(
        id: 'TXN-984209',
        recipientName: 'Ananya Sharma',
        recipientUpiOrAccount: 'ananya.sharma@okaxis',
        recipientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        amount: 2500.0,
        paymentMethod: PaymentMethod.contact,
        status: TransactionStatus.cancelled,
        formattedDate: DateFormat('MMM dd, yyyy • hh:mm a').format(now.subtract(const Duration(hours: 12))),
        timestamp: now.subtract(const Duration(hours: 12)),
        note: 'Shared Travel Expense - Refunded via Undo',
      ),
      TransactionModel(
        id: 'TXN-984208',
        recipientName: 'Apex Luxury Watches',
        recipientUpiOrAccount: 'apex.watches@icici',
        recipientAvatar: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200',
        amount: 45000.0,
        paymentMethod: PaymentMethod.bank,
        status: TransactionStatus.success,
        formattedDate: DateFormat('MMM dd, yyyy • hh:mm a').format(now.subtract(const Duration(days: 1))),
        timestamp: now.subtract(const Duration(days: 1)),
        note: 'Limited Edition Chronograph Deposit',
      ),
    ];
  }

  void navigateTo(String screen, {PaymentMethod? method, Map<String, dynamic>? flowData}) {
    _activeScreen = screen;
    if (method != null) _selectedPaymentMethod = method;
    if (flowData != null) _activeFlowData = flowData;
    notifyListeners();
  }

  void setSelectedPaymentMethod(PaymentMethod method) {
    _selectedPaymentMethod = method;
    notifyListeners();
  }

  void openPinModal(Map<String, dynamic> flowData) {
    _activeFlowData = flowData;
    _showPinModal = true;
    notifyListeners();
  }

  void closePinModal() {
    _showPinModal = false;
    notifyListeners();
  }

  void openQrScanner() {
    _showQrScanner = true;
    notifyListeners();
  }

  void closeQrScanner() {
    _showQrScanner = false;
    notifyListeners();
  }

  void openAddFundsModal() {
    _showAddFundsModal = true;
    notifyListeners();
  }

  void closeAddFundsModal() {
    _showAddFundsModal = false;
    notifyListeners();
  }

  void openReceipt(TransactionModel tx) {
    _viewingReceiptTransaction = tx;
    notifyListeners();
  }

  void closeReceipt() {
    _viewingReceiptTransaction = null;
    notifyListeners();
  }

  void toggleSound() {
    _soundEnabled = !_soundEnabled;
    _storage.saveSoundEnabled(_soundEnabled);
    notifyListeners();
  }

  Future<void> addFunds(double amount) async {
    _user = _user.copyWith(balance: _user.balance + amount);
    await _storage.saveUser(_user);
    notifyListeners();
  }

  // Confirm PIN & Initiate Payment with 15-Second Timer
  Future<bool> verifyAndExecutePayment(String pin) async {
    if (pin != '1234') return false;

    closePinModal();

    final data = _activeFlowData ?? {};
    final double amount = (data['amount'] as num?)?.toDouble() ?? 1000.0;
    final String recipientName = data['recipientName'] ?? 'Merchant';
    final String recipientUpiOrAccount = data['recipientUpiOrAccount'] ?? 'recipient@upi';
    final String? recipientAvatar = data['recipientAvatar'];
    final PaymentMethod method = data['paymentMethod'] ?? _selectedPaymentMethod;
    final String? note = data['note'];

    // Deduct balance immediately
    _user = _user.copyWith(balance: _user.balance - amount);
    await _storage.saveUser(_user);

    final now = DateTime.now();
    final newTx = TransactionModel(
      id: 'TXN-${(now.millisecondsSinceEpoch / 100).floor().toString().substring(3)}',
      recipientName: recipientName,
      recipientUpiOrAccount: recipientUpiOrAccount,
      recipientAvatar: recipientAvatar,
      amount: amount,
      paymentMethod: method,
      status: TransactionStatus.initiated,
      timestamp: now,
      formattedDate: DateFormat('MMM dd, yyyy • hh:mm a').format(now),
      note: note,
      undoCountdown: 15,
    );

    _activeTransaction = newTx;
    _transactions.insert(0, newTx);
    await _storage.saveTransactions(_transactions);

    _countdownSeconds = 15;
    _activeScreen = 'undo-countdown';
    notifyListeners();

    _startCountdownTimer();
    return true;
  }

  void _startCountdownTimer() {
    _countdownTimer?.cancel();
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) async {
      if (_countdownSeconds > 1) {
        _countdownSeconds -= 1;
        notifyListeners();
      } else {
        timer.cancel();
        _countdownSeconds = 0;
        await _finalizePaymentSuccess();
      }
    });
  }

  Future<void> _finalizePaymentSuccess() async {
    if (_activeTransaction == null) return;

    final updatedTx = _activeTransaction!.copyWith(
      status: TransactionStatus.success,
      undoCountdown: 0,
    );

    final idx = _transactions.indexWhere((t) => t.id == updatedTx.id);
    if (idx != -1) {
      _transactions[idx] = updatedTx;
    }
    _activeTransaction = updatedTx;
    _viewingReceiptTransaction = updatedTx;

    await _storage.saveTransactions(_transactions);
    _activeScreen = 'success-receipt';
    notifyListeners();
  }

  // User presses UNDO payment
  Future<void> undoPayment() async {
    _countdownTimer?.cancel();
    if (_activeTransaction == null) return;

    final tx = _activeTransaction!;

    // Refund 100% back to balance
    _user = _user.copyWith(balance: _user.balance + tx.amount);
    await _storage.saveUser(_user);

    final cancelledTx = tx.copyWith(
      status: TransactionStatus.cancelled,
      undoCountdown: 0,
    );

    final idx = _transactions.indexWhere((t) => t.id == cancelledTx.id);
    if (idx != -1) {
      _transactions[idx] = cancelledTx;
    }

    _activeTransaction = cancelledTx;
    _viewingReceiptTransaction = cancelledTx;

    await _storage.saveTransactions(_transactions);
    _activeScreen = 'cancelled-receipt';
    notifyListeners();
  }

  // Dashboard Telemetry Calculations
  double get totalAmountSent => _transactions
      .where((t) => t.status == TransactionStatus.success)
      .fold(0.0, (sum, item) => sum + item.amount);

  double get totalAmountSavedUndo => _transactions
      .where((t) => t.status == TransactionStatus.cancelled)
      .fold(0.0, (sum, item) => sum + item.amount);

  int get totalTransactions => _transactions.length;

  int get successfulTransactions => _transactions.where((t) => t.status == TransactionStatus.success).length;

  int get cancelledTransactions => _transactions.where((t) => t.status == TransactionStatus.cancelled).length;

  int get successRate {
    if (_transactions.isEmpty) return 100;
    return ((successfulTransactions / _transactions.length) * 100).round();
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    super.dispose();
  }
}
