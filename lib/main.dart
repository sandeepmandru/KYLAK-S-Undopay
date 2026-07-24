import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/app_provider.dart';
import 'screens/dashboard_stats_screen.dart';
import 'screens/enter_payment_details_screen.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/payment_cancelled_screen.dart';
import 'screens/payment_methods_screen.dart';
import 'screens/payment_success_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/transaction_history_screen.dart';
import 'screens/undo_countdown_screen.dart';
import 'theme/app_theme.dart';
import 'widgets/add_funds_dialog.dart';
import 'widgets/bottom_nav_bar.dart';
import 'widgets/header_bar.dart';
import 'widgets/pin_confirmation_dialog.dart';
import 'widgets/qr_scanner_dialog.dart';
import 'widgets/transaction_receipt_dialog.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => AppProvider(),
      child: const UndoPayApp(),
    ),
  );
}

class UndoPayApp extends StatelessWidget {
  const UndoPayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "KYLAK'S UndoPay",
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const MainAppShell(),
    );
  }
}

class MainAppShell extends StatelessWidget {
  const MainAppShell({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final activeScreen = provider.activeScreen;

    Widget renderScreen() {
      switch (activeScreen) {
        case 'splash':
          return const SplashScreen();
        case 'login':
          return const LoginScreen();
        case 'home':
          return const HomeScreen();
        case 'choose-method':
          return const PaymentMethodsScreen();
        case 'enter-details':
          return const EnterPaymentDetailsScreen();
        case 'undo-countdown':
          return const UndoCountdownScreen();
        case 'success-receipt':
          return const PaymentSuccessScreen();
        case 'cancelled-receipt':
          return const PaymentCancelledScreen();
        case 'history':
          return const TransactionHistoryScreen();
        case 'stats':
          return const DashboardStatsScreen();
        default:
          return const HomeScreen();
      }
    }

    final hideHeaderAndNav = activeScreen == 'splash' || activeScreen == 'login';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: hideHeaderAndNav ? null : const HeaderBar(),
      body: Stack(
        children: [
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: renderScreen(),
            ),
          ),

          // Overlays / Modals
          const PinConfirmationDialog(),
          const QrScannerDialog(),
          const AddFundsDialog(),
          const TransactionReceiptDialog(),
        ],
      ),
      bottomNavigationBar: hideHeaderAndNav ? null : const BottomNavBar(),
    );
  }
}
