import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class HeaderBar extends StatelessWidget implements PreferredSizeWidget {
  const HeaderBar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(70);

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final user = provider.user;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: AppColors.background,
        border: Border(
          bottom: BorderSide(color: AppColors.cardBorder, width: 1),
        ),
      ),
      child: SafeArea(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Logo & Title
            GestureDetector(
              onTap: () => provider.navigateTo('home'),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [AppColors.goldDark, AppColors.gold, AppColors.goldLight],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      border: Border.all(color: AppColors.gold, width: 1.5),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.gold.withOpacity(0.3),
                          blurRadius: 10,
                        )
                      ],
                    ),
                    child: const Center(
                      child: Text(
                        'K',
                        style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.w900,
                          fontSize: 20,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Row(
                        children: [
                          const Text(
                            "KYLAK'S",
                            style: TextStyle(
                              color: AppColors.gold,
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                              letterSpacing: 1.5,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                            decoration: BoxDecoration(
                              color: AppColors.gold.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: AppColors.gold.withOpacity(0.4)),
                            ),
                            child: const Text(
                              'UNDO 15S',
                              style: TextStyle(
                                color: AppColors.goldLight,
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          )
                        ],
                      ),
                      const Text(
                        'UndoPay Sovereign',
                        style: TextStyle(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w800,
                          fontSize: 15,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Profile Avatar & Sound Toggle
            Row(
              children: [
                IconButton(
                  icon: Icon(
                    provider.soundEnabled ? Icons.volume_up : Icons.volume_off,
                    color: AppColors.gold,
                    size: 20,
                  ),
                  onPressed: () => provider.toggleSound(),
                ),
                const SizedBox(width: 4),
                GestureDetector(
                  onTap: () => provider.navigateTo('stats'),
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.gold, width: 1.5),
                    ),
                    child: CircleAvatar(
                      radius: 16,
                      backgroundImage: NetworkImage(user.avatarUrl),
                    ),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
