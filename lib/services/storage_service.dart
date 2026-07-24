import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../models/transaction_model.dart';

class StorageService {
  static const String _userKey = 'undopay_user_profile';
  static const String _txsKey = 'undopay_transactions_list';
  static const String _soundKey = 'undopay_sound_enabled';

  SharedPreferences? _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // User balance & profile
  Future<void> saveUser(UserModel user) async {
    _prefs ??= await SharedPreferences.getInstance();
    await _prefs?.setString(_userKey, jsonEncode(user.toJson()));
  }

  Future<UserModel?> getUser() async {
    _prefs ??= await SharedPreferences.getInstance();
    final String? data = _prefs?.getString(_userKey);
    if (data == null) return null;
    try {
      return UserModel.fromJson(jsonDecode(data));
    } catch (_) {
      return null;
    }
  }

  // Transactions list
  Future<void> saveTransactions(List<TransactionModel> txs) async {
    _prefs ??= await SharedPreferences.getInstance();
    final List<Map<String, dynamic>> jsonList = txs.map((e) => e.toJson()).toList();
    await _prefs?.setString(_txsKey, jsonEncode(jsonList));
  }

  Future<List<TransactionModel>?> getTransactions() async {
    _prefs ??= await SharedPreferences.getInstance();
    final String? data = _prefs?.getString(_txsKey);
    if (data == null) return null;
    try {
      final List<dynamic> jsonList = jsonDecode(data);
      return jsonList.map((e) => TransactionModel.fromJson(e)).toList();
    } catch (_) {
      return null;
    }
  }

  // Sound toggle
  Future<void> saveSoundEnabled(bool enabled) async {
    _prefs ??= await SharedPreferences.getInstance();
    await _prefs?.setBool(_soundKey, enabled);
  }

  Future<bool> getSoundEnabled() async {
    _prefs ??= await SharedPreferences.getInstance();
    return _prefs?.getBool(_soundKey) ?? true;
  }
}
