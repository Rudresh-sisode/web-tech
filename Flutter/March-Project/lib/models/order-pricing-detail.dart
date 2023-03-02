class OrderPricing {
   int orderId;
   String tokenOrderId;
   String orderSubtotal;
   String orderDiscountAmount;
   String orderTotal;
   int totalProducts;
   String orderDate;
   String status;

  OrderPricing({
    required this.orderId,
    required this.tokenOrderId,
    required this.orderSubtotal,
    required this.orderDiscountAmount,
    required this.orderTotal,
    required this.totalProducts,
    required this.orderDate,
    required this.status,
  });

  factory OrderPricing.fromJson(Map<String, dynamic> json) {
    return OrderPricing(
      orderId: json['order_id'],
      tokenOrderId: json['token_order_id'],
      orderSubtotal: json['order_subtotal'],
      orderDiscountAmount: json['order_discount_amount'],
      orderTotal: json['order_total'],
      totalProducts: json['total_products'],
      orderDate: json['order_date'],
      status: json['status'],
    );
  }
}