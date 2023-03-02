class OrdersProduct {
  String name;
  String orderPrice;
  int productQuantity;
  String productPrice;
  String productOfferPrice;
  String discountPrice;
  String totalPrice;

  OrdersProduct({
    required this.name,
    required this.orderPrice,
    required this.productQuantity,
    required this.productPrice,
    required this.productOfferPrice,
    required this.discountPrice,
    required this.totalPrice,
  });

  factory OrdersProduct.fromJson(Map<String, dynamic> json) {
    return OrdersProduct(
      name: json['name'],
      orderPrice: json['order_price'],
      productQuantity: json['product_quantity'],
      productPrice: json['product_price'],
      productOfferPrice: json['product_offer_price'],
      discountPrice: json['discount_price'],
      totalPrice: json['total_price'],
    );
  }
}