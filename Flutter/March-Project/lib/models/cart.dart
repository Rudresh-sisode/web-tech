class CartItem{
   String id;
   int quantity;
   int availableQuantity;
   double productPrice;
   double discountPrice;
   double offerPrice;
   double totalPrice;

  CartItem({
    required this.id,
    required this.offerPrice,
    required this.quantity,
    required this.availableQuantity,
    required this.totalPrice,
    required this.discountPrice,
    required this.productPrice
  });

}