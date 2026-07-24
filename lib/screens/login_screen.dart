import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _passcodeController = TextEditingController();
  bool _isLoading = false;

  void _handleLogin() {
    setState(() {
      _isLoading = true;
    });

    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) {
        Provider.of<AppProvider>(context, listen: false).navigateTo('home');
      }
    });
  }

  @override
  void dispose() {
    _passcodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final user = provider.user;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(),

              // User Avatar
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.gold, width: 2),
                ),
                child: CircleAvatar(
                  radius: 40,
                  backgroundImage: NetworkImage(user.avatarUrl),
                ),
              ),

              const SizedBox(height: 16),
              Text(
                'Welcome Back, ${user.name.split(' ')[0]}',
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                user.upiId,
                style: const TextStyle(
                  color: AppColors.gold,
                  fontSize: 12,
                  fontFamily: 'monospace',
                ),
              ),

              const SizedBox(height: 32),

              // Quick Biometric Button
              ElevatedButton.icon(
                onPressed: _isLoading ? null : _handleLogin,
                icon: const Icon(Icons.fingerprint, color: Colors.black, size: 28),
                label: Text(
                  _isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE BIOMETRIC PASS',
                  style: const TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    letterSpacing: 1,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.gold,
                  minimumSize: const Size(double.infinity, 52),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              OutlinedButton(
                onPressed: _handleLogin,
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                  side: const BorderSide(color: AppColors.cardBorder),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: const Text(
                  'LOG IN WITH SECURITY PIN',
                  style: TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  ),
                ),
              ),

              const Spacer(),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.shield_outlined, color: AppColors.gold, size: 14),
                  SizedBox(width: 6),
                  Text(
                    'Secured by NPCI 256-Bit Encrypted Sovereign Guard',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 10),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
