import 'package:flutter/foundation.dart';

class CartItem{
  final String id;
  final String title;
  final int quantity;
  final double price;

  CartItem({
    required this.id,
    required this.title,
    required this.quantity,
    required this.price
  });

}

class Cart with ChangeNotifier{

  Map<String, CartItem> _items = {};
  
  bool isGridView = true;

 Map<String,CartItem> get items{

  return {..._items};

 }

 int get itemCount{
  return _items.length;
 }

 void changeGallaryView(){
  isGridView = !isGridView;
  notifyListeners();
 }

 void addItem (String productId,double price,String title,){
    if (_items.containsKey(productId)) {
      // change quantity...
      _items.update(
        productId,
        (existingCartItem) => CartItem(
              id: existingCartItem.id,
              title: existingCartItem.title,
              price: existingCartItem.price,
              quantity: existingCartItem.quantity + 1,
            ),
      );
    } else {
      //here we are putting or adding new value if that id doesn't available using library functions
      _items.putIfAbsent(
        productId,
        () => CartItem(
              id: DateTime.now().toString(),
              title: title,
              price: price,
              quantity: 1,
            ),
      );
    }
    notifyListeners();
  }

}