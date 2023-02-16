// import 'dart:js';

import 'package:ecomm_app/providers/products.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:provider/provider.dart';

import '../models/cart.dart';
import '../models/product.dart';

import '../models/apiUrls.dart';
import 'package:shared_preferences/shared_preferences.dart';


import 'dart:convert';
import 'dart:async';

import 'package:ecomm_app/models/http_exception.dart';
import 'package:flutter/widgets.dart';

import 'package:http/http.dart' as http;

class Cart with ChangeNotifier {
  /**
   * CartItem(
      id: "1",
      title: "Product 1",
      quantity: int.parse("10"),
      productPrice: double.parse("300"),
      discountPrice: double.parse("100"),
      totalPrice: double.parse("2000"),
    ),
    CartItem(
      id: "2",
      title: "Product 2",
      quantity: int.parse("5"),
      productPrice: double.parse("30"),
      discountPrice: double.parse("5"),
      totalPrice: double.parse("125"),
    ),
   */

  List<CartItem> _items = [];

  double discountPrice = 0.0;
  double totalPrice = 0.0;
  double basePrice = 0.0;
  

  bool checkoutOrderStatus = false;
  String recentCheckoutOrderId = "";
  Map<String, dynamic> checkoutData = {
    "name": "Kedar L Ahirrao",
    "email": "kedar.ahirrao@gunadhyasoft.com",
    "mobile": "8768768768",
    "address_id": "1",
    "product": [
      {
        "product_id": "1",
        "quantity": "10",
        "product_price": "300",
        "discount_price": "100",
        "product_offer_price": "200",
        "total_price": "20000"
      },
      {
        "product_id": "2",
        "quantity": "5",
        "product_price": "30",
        "discount_price": "5",
        "product_offer_price": "25",
        "total_price": "125"
      }
    ],
    "total_nondiscount_price": "454544",
    "total_discount_price": "234",
    "total_price": "23424"
  };

  bool isGridView = true;
   String _token = "null";

  List<CartItem> get items {
    return [..._items];
  }

  void preparedCheckout(String addressId,String name,String mobile,String email){
    checkoutData["name"] = name;
    checkoutData["email"]= email;
    checkoutData["mobile"]= mobile;
    checkoutData["address_id"] = addressId;
    List<Map<String, dynamic>> products = items.map((item) {
        return {
          "product_id": item.id,
          "quantity": item.quantity,
          "product_price": item.productPrice,
          "discount_price": item.discountPrice,
          "product_offer_price": item.offerPrice,
          "total_price": item.totalPrice,
        };
      }).toList();
    checkoutData["product"] = products;
    checkoutData["total_nondiscount_price"] =basePrice;
    checkoutData["total_discount_price"] = discountPrice;
    checkoutData["total_price"] = totalPrice;

    print("checkout data "+checkoutData.toString());

  }

  Future<void> checkoutOrder() async {

    final url = Uri.parse(APIURLS.orderPlaceWithToken);

    try{
        final prefs = await SharedPreferences.getInstance();
        final dynamic extractedUserData = json.decode(prefs.getString("userData").toString());
        _token = extractedUserData["token"];
        final response = await http.post(url,body:json.encode(checkoutData),
        headers:{'Content-Type': 'application/json','Authorization':'Bearer ${_token}'} );

        Map<String, dynamic> responseData = json.decode(response.body);
        if (responseData['status'] == false) {
          // userProfileMessage = responseData["message_type"];
          notifyListeners();
          checkoutOrderStatus = false;
          //throwing error message, this will handle in profile widgets
          throw HttpException(response.body);
        } else if (responseData['status'] == true) {
          checkoutOrderStatus = true;
          recentCheckoutOrderId = responseData["data"]["order_id"];
          // userProfileMessage = responseData["message"];
          notifyListeners();
        }
    }
    catch(error){
      throw error;
    }
  }



  int get itemCount {
    return _items.length;
  }

  void changeGallaryView() {
    isGridView = !isGridView;
    notifyListeners();
  }

  void addItem(String productId, BuildContext context, String prodQuantity) {
    List<Product> productData =
        Provider.of<Products>(context, listen: false).getProducts;

    final product =
        productData.firstWhere((prod) => prod.id == int.parse(productId));
    if (product == null || product.quantity == 0) return;

    final existingCartItemIndex =
        _items.indexWhere((item) => item.id == productId);
    if (existingCartItemIndex >= 0) {
      _items[existingCartItemIndex].quantity += int.parse(prodQuantity);
      _items[existingCartItemIndex].offerPrice = product.offerPrice;
      _items[existingCartItemIndex].totalPrice =
          _items[existingCartItemIndex].offerPrice *
              _items[existingCartItemIndex].quantity;
      _items[existingCartItemIndex].discountPrice =
          (product.price - product.offerPrice);

      // deletion of the product quantity need to affect the db.

      // for (int i = 0; i < int.parse(prodQuantity); i++) {
      discountPrice += (_items[existingCartItemIndex].discountPrice *
          int.parse(prodQuantity));
      // }
      totalPrice +=
          (_items[existingCartItemIndex].offerPrice * int.parse(prodQuantity));
      basePrice += (_items[existingCartItemIndex].productPrice *
          int.parse(prodQuantity));
      Provider.of<Products>(context, listen: false);
    } else {
      final newCartItem = CartItem(
          id: product.id.toString(),
          offerPrice: product.offerPrice * int.parse(prodQuantity),
          productPrice: product.price,
          discountPrice: (product.price - product.offerPrice),
          quantity: int.parse(prodQuantity),
          totalPrice: product.offerPrice * int.parse(prodQuantity));

      // for (int i = 0; i < int.parse(prodQuantity); i++) {
      discountPrice += (newCartItem.discountPrice * int.parse(prodQuantity));
      // }

      totalPrice += newCartItem.totalPrice;
      basePrice += (newCartItem.productPrice * int.parse(prodQuantity));

      _items.add(newCartItem);
      //deletion of the product quantity need to affect the db.
      // product.quantity--;
    }
    notifyListeners();
  }

  String findCartItemQuantity(String id) {
    for (int i = 0; i < items.length; i++) {
      if (items[i].id == id) {
        return items[i].quantity.toString();
      }
    }
    return "0";
  }

  void removeItem(String productId, BuildContext context, String prodQuantity) {
    List<Product> productData =
        Provider.of<Products>(context, listen: false).getProducts;

    final product =
        productData.firstWhere((prod) => prod.id == int.parse(productId));
    if (product == null || product.quantity == 0) return;

    final existingCartItemIndex =
        _items.indexWhere((item) => item.id == productId);
      if(_items[existingCartItemIndex].quantity == 1){
        //one quantity remain as it is.
        return;
      }
    if (existingCartItemIndex >= 0) {
      _items[existingCartItemIndex].quantity -= int.parse(prodQuantity);
      _items[existingCartItemIndex].offerPrice = product.offerPrice;
      _items[existingCartItemIndex].totalPrice =
          _items[existingCartItemIndex].offerPrice *
              _items[existingCartItemIndex].quantity;
      _items[existingCartItemIndex].discountPrice =
          (product.price - product.offerPrice);

      // deletion of the product quantity need to affect the db.
      discountPrice -= (_items[existingCartItemIndex].discountPrice *
          int.parse(prodQuantity));
  
      totalPrice -=
          (_items[existingCartItemIndex].offerPrice * int.parse(prodQuantity));
      basePrice -= (_items[existingCartItemIndex].productPrice *
          int.parse(prodQuantity));
      Provider.of<Products>(context, listen: false);
    }
    notifyListeners();
  }

  // void deleteItem(String productId) {}

  void deleteItem(String productId) {

    final existingCartItemIndex = _items.indexWhere((item) => item.id == productId);
    bool isLenghZero = _items.length == 1;
    final removingItemData = _items[existingCartItemIndex];
    _items.removeAt(existingCartItemIndex);

    if (existingCartItemIndex >= 0) {
      
      discountPrice -= (removingItemData.discountPrice * removingItemData.quantity);
      if(isLenghZero){
       totalPrice = 0.0; 
      }
      else{
       totalPrice -= (removingItemData.offerPrice * removingItemData.quantity); 
      }
      
      basePrice -= (removingItemData.productPrice * removingItemData.quantity);

    }

    notifyListeners();
  }

  void clear() {
    _items = [];
    notifyListeners();
  }
}
