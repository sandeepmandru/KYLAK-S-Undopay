import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Timer(const Duration(seconds: 2), () {
      if (mounted) {
        Provider.of<AppProvider>(context, listen: false).navigateTo('login');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 96,
              height: 96,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  colors: [AppColors.goldDark, AppColors.gold, AppColors.goldLight],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.gold.withOpacity(0.4),
                    blurRadius: 24,
                    spreadRadius: 4,
                  )
                ],
              ),
              child: const Center(
                child: Text(
                  'K',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 48,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              "KYLAK'S UNDOPAY",
              style: TextStyle(
                color: AppColors.gold,
                fontSize: 22,
                fontWeight: FontWeight.w800,
                letterSpacing: 3,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              '15-Second Reversible UPI Sovereign Engine',
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 12,
              ),
            ),
            const SizedBox(height: 32),
            const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(AppColors.gold),
              strokeWidth: 2,
            ),
          ],
        ),
      ),
    );
  }
}
