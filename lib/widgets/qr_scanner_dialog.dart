import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/transaction_model.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class QrScannerDialog extends StatelessWidget {
  const QrScannerDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    if (!provider.showQrScanner) return const SizedBox.shrink();

    final sampleQrs = [
      {
        'name': 'Taj Dining Club',
        'upi': 'taj.dining@hdfcbank',
        'amount': 8400.0,
        'avatar': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200',
      },
      {
        'name': 'Apex Luxury Watches',
        'upi': 'apex.luxury@icici',
        'amount': 12500.0,
        'avatar': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200',
      },
      {
        'name': 'Ananya Sharma',
        'upi': 'ananya.sharma@okaxis',
        'amount': 2000.0,
        'avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      },
    ];

    void handleScanSample(Map<String, dynamic> qr) {
      provider.closeQrScanner();
      provider.setSelectedPaymentMethod(PaymentMethod.qr);
      provider.navigateTo('enter-details', method: PaymentMethod.qr, flowData: {
        'recipientName': qr['name'],
        'recipientUpiOrAccount': qr['upi'],
        'recipientAvatar': qr['avatar'],
        'amount': qr['amount'],
        'paymentMethod': PaymentMethod.qr,
      });
    }

    return Dialog(
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(28),
        side: const BorderSide(color: AppColors.cardBorder, width: 1.5),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: const [
                    Icon(Icons.qr_code_scanner, color: AppColors.gold, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Scan UPI QR Code',
                      style: TextStyle(
                        color: AppColors.textSubtle,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: AppColors.textSecondary),
                  onPressed: () => provider.closeQrScanner(),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Viewfinder box
            Container(
              width: 220,
              height: 220,
              decoration: BoxDecoration(
                color: AppColors.darkInset,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.gold, width: 2),
              ),
              child: Stack(
                children: const [
                  Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.camera_alt_rounded, color: AppColors.gold, size: 40),
                        SizedBox(height: 8),
                        Text(
                          'Align QR Code in frame',
                          style: TextStyle(color: AppColors.textSubtle, fontSize: 10),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),

            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.auto_awesome, color: AppColors.gold, size: 14),
                SizedBox(width: 4),
                Text(
                  'Or Select Sample Merchant QR',
                  style: TextStyle(color: AppColors.textSubtle, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 8),

            ...sampleQrs.map((qr) => Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: InkWell(
                    onTap: () => handleScanSample(qr),
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.darkInset,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.cardBorder),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 16,
                                backgroundImage: NetworkImage(qr['avatar'] as String),
                              ),
                              const SizedBox(width: 10),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    qr['name'] as String,
                                    style: const TextStyle(
                                      color: AppColors.textPrimary,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                  Text(
                                    qr['upi'] as String,
                                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 10),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Text(
                            '₹${(qr['amount'] as double).toStringAsFixed(0)}',
                            style: const TextStyle(
                              color: AppColors.gold,
                              fontWeight: FontWeight.w900,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                )),
          ],
        ),
      ),
    );
  }
}
