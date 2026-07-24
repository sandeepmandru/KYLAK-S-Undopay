class ContactModel {
  final String id;
  final String name;
  final String phone;
  final String upiId;
  final String avatar;
  final bool isFrequent;

  ContactModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.upiId,
    required this.avatar,
    this.isFrequent = false,
  });

  static List<ContactModel> initialContacts = [
    ContactModel(
      id: 'c1',
      name: 'Rohan Verma',
      phone: '+91 98765 43210',
      upiId: 'rohan.verma@okaxis',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      isFrequent: true,
    ),
    ContactModel(
      id: 'c2',
      name: 'Ananya Sharma',
      phone: '+91 98123 45678',
      upiId: 'ananya.sharma@icici',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      isFrequent: true,
    ),
    ContactModel(
      id: 'c3',
      name: 'Vikramaditya Roy',
      phone: '+91 99887 76655',
      upiId: 'vikram.roy@hdfcbank',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
      isFrequent: true,
    ),
    ContactModel(
      id: 'c4',
      name: 'Priya Malhotra',
      phone: '+91 97654 32109',
      upiId: 'priya.m@ybl',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      isFrequent: true,
    ),
    ContactModel(
      id: 'c5',
      name: 'Karan Kapoor',
      phone: '+91 98989 89898',
      upiId: 'karan.kapoor@sbi',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200',
      isFrequent: false,
    ),
    ContactModel(
      id: 'c6',
      name: 'Sanya Mirza',
      phone: '+91 91234 56789',
      upiId: 'sanya.m@paytm',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      isFrequent: false,
    ),
  ];
}
