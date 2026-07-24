enum TransactionStatus { initiated, success, cancelled }
enum PaymentMethod { qr, mobile, contact, bank }

class TransactionModel {
  final String id;
  final String recipientName;
  final String recipientUpiOrAccount;
  final String? recipientAvatar;
  final double amount;
  final PaymentMethod paymentMethod;
  final TransactionStatus status;
  final DateTime timestamp;
  final String formattedDate;
  final String? note;
  final int undoCountdown; // in seconds
  final String fundingSource;

  TransactionModel({
    required this.id,
    required this.recipientName,
    required this.recipientUpiOrAccount,
    this.recipientAvatar,
    required this.amount,
    required this.paymentMethod,
    required this.status,
    required this.timestamp,
    required this.formattedDate,
    this.note,
    this.undoCountdown = 15,
    this.fundingSource = 'HDFC Bank Sovereign Account •••• 9842',
  });

  TransactionModel copyWith({
    String? id,
    String? recipientName,
    String? recipientUpiOrAccount,
    String? recipientAvatar,
    double? amount,
    PaymentMethod? paymentMethod,
    TransactionStatus? status,
    DateTime? timestamp,
    String? formattedDate,
    String? note,
    int? undoCountdown,
    String? fundingSource,
  }) {
    return TransactionModel(
      id: id ?? this.id,
      recipientName: recipientName ?? this.recipientName,
      recipientUpiOrAccount: recipientUpiOrAccount ?? this.recipientUpiOrAccount,
      recipientAvatar: recipientAvatar ?? this.recipientAvatar,
      amount: amount ?? this.amount,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      status: status ?? this.status,
      timestamp: timestamp ?? this.timestamp,
      formattedDate: formattedDate ?? this.formattedDate,
      note: note ?? this.note,
      undoCountdown: undoCountdown ?? this.undoCountdown,
      fundingSource: fundingSource ?? this.fundingSource,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'recipientName': recipientName,
    'recipientUpiOrAccount': recipientUpiOrAccount,
    'recipientAvatar': recipientAvatar,
    'amount': amount,
    'paymentMethod': paymentMethod.name,
    'status': status.name,
    'timestamp': timestamp.toIso8601String(),
    'formattedDate': formattedDate,
    'note': note,
    'undoCountdown': undoCountdown,
    'fundingSource': fundingSource,
  };

  factory TransactionModel.fromJson(Map<String, dynamic> json) => TransactionModel(
    id: json['id'],
    recipientName: json['recipientName'],
    recipientUpiOrAccount: json['recipientUpiOrAccount'],
    recipientAvatar: json['recipientAvatar'],
    amount: (json['amount'] as num).toDouble(),
    paymentMethod: PaymentMethod.values.firstWhere(
      (e) => e.name == json['paymentMethod'],
      orElse: () => PaymentMethod.mobile,
    ),
    status: TransactionStatus.values.firstWhere(
      (e) => e.name == json['status'],
      orElse: () => TransactionStatus.success,
    ),
    timestamp: DateTime.parse(json['timestamp']),
    formattedDate: json['formattedDate'],
    note: json['note'],
    undoCountdown: json['undoCountdown'] ?? 15,
    fundingSource: json['fundingSource'] ?? 'HDFC Bank Sovereign Account •••• 9842',
  );
}
