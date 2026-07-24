import 'package:flutter/material.dart';

class AppColors {
  static const Color background = Color(0xFF0B0A08);
  static const Color surface = Color(0xFF16130B);
  static const Color cardBorder = Color(0x33D4AF37); // #D4AF37 with 20% opacity
  static const Color cardBorderActive = Color(0xFFD4AF37);
  
  static const Color gold = Color(0xFFD4AF37);
  static const Color goldLight = Color(0xFFF5E08B);
  static const Color goldBright = Color(0xFFF2CA50);
  static const Color goldDark = Color(0xFF8C7332);
  
  static const Color textPrimary = Color(0xFFEAE1D4);
  static const Color textSecondary = Color(0xFFA39985);
  static const Color textMuted = Color(0xFF8C8370);
  static const Color textSubtle = Color(0xFFD0C5AF);

  static const Color success = Color(0xFF52D183);
  static const Color errorRed = Color(0xFFFFB4AB);
  static const Color errorRedBg = Color(0xFF93000A);
  
  static const Color darkInset = Color(0xFF0B0A08);
  static const Color darkCardHover = Color(0xFF231F17);
  static const Color darkButton = Color(0xFF1A1710);
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData.dark().copyWith(
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.gold,
        surface: AppColors.surface,
        background: AppColors.background,
        error: AppColors.errorRed,
      ),
      cardTheme: CardThemeData(
        color: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24.0),
          side: const BorderSide(color: AppColors.cardBorder, width: 1.0),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
      ),
    );
  }
}
