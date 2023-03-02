class CustomerDeliveryAddress{
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String phone;
  final String address;
  final String address2;
  final String country;
  final String state;
  final String city;
  final String pincode;
  
  CustomerDeliveryAddress({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.address,
    required this.phone,
    required this.address2,
    required this.country,
    required this.state,
    required this.city,
    required this.pincode,
    required this.email
  });

  factory CustomerDeliveryAddress.fromJson(Map<String, dynamic> json) {
  return CustomerDeliveryAddress(
    id: json['id'],
    firstName: json['first_name'],
    lastName: json['last_name'],
    address: json['address'],
    phone: json['phone'],
    address2: json['address2'],
    country: json['country'],
    state: json['state'],
    city: json['city'],
    pincode: json['pincode'],
    email: json['email'],
  );
}

}