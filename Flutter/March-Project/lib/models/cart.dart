class CartItem{
   String id;
   int quantity;
   double productPrice;
   double discountPrice;
   double offerPrice;
   double totalPrice;

  CartItem({
    required this.id,
    required this.offerPrice,
    required this.quantity,
    required this.totalPrice,
    required this.discountPrice,
    required this.productPrice
  });

}