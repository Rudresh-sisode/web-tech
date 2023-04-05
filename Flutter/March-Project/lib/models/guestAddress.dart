class GuestAddress {
  final String name;
  final String email;
  final String mobile;
  final String address;
  final String address2;
  final String country;
  final String state;
  final String city;
  final String pincode;

  GuestAddress({
    required this.name,
    required this.email,
    required this.mobile,
    required this.address,
    required this.address2,
    required this.country,
    required this.state,
    required this.city,
    required this.pincode,
  });

  factory GuestAddress.fromJson(Map<String, dynamic> json) {
    return GuestAddress(
      name: json['name'],
      email: json['email'],
      mobile: json['mobile'],
      address: json['address'],
      address2: json['address2'],
      country: json['country'],
      state: json['state'],
      city: json['city'],
      pincode: json['pincode'],
    );
  }
  
}