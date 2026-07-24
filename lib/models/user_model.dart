class UserModel {
  final String id;
  final String name;
  final String email;
  final String upiId;
  final String avatarUrl;
  final double balance;
  final String accountType;
  final bool isUpiPinSet;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.upiId,
    required this.avatarUrl,
    required this.balance,
    required this.accountType,
    required this.isUpiPinSet,
  });

  UserModel copyWith({
    String? id,
    String? name,
    String? email,
    String? upiId,
    String? avatarUrl,
    double? balance,
    String? accountType,
    bool? isUpiPinSet,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      upiId: upiId ?? this.upiId,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      balance: balance ?? this.balance,
      accountType: accountType ?? this.accountType,
      isUpiPinSet: isUpiPinSet ?? this.isUpiPinSet,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'upiId': upiId,
    'avatarUrl': avatarUrl,
    'balance': balance,
    'accountType': accountType,
    'isUpiPinSet': isUpiPinSet,
  };

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['id'] ?? 'usr_1',
    name: json['name'] ?? 'Kylak Gold Member',
    email: json['email'] ?? 'kylak.vip@undopay.ai',
    upiId: json['upiId'] ?? 'kylak@hdfcbank',
    avatarUrl: json['avatarUrl'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    balance: (json['balance'] as num?)?.toDouble() ?? 125000.0,
    accountType: json['accountType'] ?? 'Kylak Sovereign Wealth Balance',
    isUpiPinSet: json['isUpiPinSet'] ?? true,
  );
}
