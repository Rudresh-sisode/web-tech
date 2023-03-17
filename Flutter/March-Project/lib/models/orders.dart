
class OrderItems {
  final int orderId;
  final String tokenOrderId;
  final double orderSubtotal;
  final double orderDiscountAmount;
  final double orderTotal;
  final int totalProducts;
  final String orderDate;
  final String status;
  final String deliveredDate;

  OrderItems({
    required this.orderId,
    required this.tokenOrderId,
    required this.orderSubtotal,
    required this.orderDiscountAmount,
    required this.orderTotal,
    required this.totalProducts,
    required this.orderDate,
    required this.status,
    required this.deliveredDate,
  });

  factory OrderItems.fromJson(Map<String, dynamic> json) {
    return OrderItems(
      orderId: json['order_id'],
      tokenOrderId: json['token_order_id'],
      orderSubtotal: double.parse(json['order_subtotal']),
      orderDiscountAmount: double.parse(json['order_discount_amount']),
      orderTotal: double.parse(json['order_total']),
      totalProducts: json['total_products'],
      orderDate: json['order_date'],
      status: json['status'],
      deliveredDate: json['delivered_date'],
    );
  }
}

/**
 *
 class OrderItems {
 final int orderId;
 final String tokenOrderId;
 final double orderSubtotal;
 final double orderDiscountAmount;
 final double orderTotal;
 final int totalProducts;
 final String orderDate;
 final String status;
 final String deliveredDate;

 OrderItems({
 required this.orderId,
 required this.tokenOrderId,
 required this.or factory OrderItems.fromJson(Map<String, dynamic> json) {
 return OrderItems(
 orderId: json['order_id'],
 tokenOrderId: json['token_order_id'],
 orderSubtotal: double.parse(json['order_subtotal']),
 orderDiscountAmount: double.parse(json['order_discount_amount']),
 orderTotal: double.parse(json['order_total']),
 totalProducts: json['total_products'],
 orderDate: json['order_date'],
 status: json['status'],
 deliveredDate: json['delivered_date'],
 );
 }derSubtotal,
 required this.orderDiscountAmount,
 required this.orderTotal,
 required this.totalProducts,
 required this.orderDate,
 required this.status,
 required this.deliveredDate,
 });


}
 */