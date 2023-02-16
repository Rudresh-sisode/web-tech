import 'package:flutter/foundation.dart';
import '../models/cart.dart';
import '../models/orders.dart';
import './cart.dart';

import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'dart:async';

class Orders with ChangeNotifier {
  List<OrderItem> _orders = [];

  List<OrderItem> get orders {
    return [..._orders];
  }

  void addOrder(List<CartItem> cartProduct, double total) {
    
    _orders.insert(
        0,
        OrderItem(
            id: DateTime.now().toString(),
            amount: total,
            products: cartProduct,
            dateTime: DateTime.now()));

    notifyListeners();

  }
}
