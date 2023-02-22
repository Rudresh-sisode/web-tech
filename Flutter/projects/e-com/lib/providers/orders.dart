import 'package:flutter/foundation.dart';
import '../models/cart.dart';
import '../models/orders.dart';
import './cart.dart';

import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'dart:async';

import '../models/apiUrls.dart';
import '../models/delivery-address.dart';

import 'package:ecomm_app/models/http_exception.dart';
import 'package:flutter/widgets.dart';

import 'package:http/http.dart' as http;

class Orders with ChangeNotifier {
  List<OrderItems> _orders = [];
  String _token = "null";
  int viewOrderId = -1;

  List<OrderItems> get orders {
    return [..._orders];
  }

  void addOrder(List<CartItem> cartProduct, double total) {
    
    notifyListeners();

  }

  Future<void> getAllOrderListings() async {
 final url = Uri.parse(APIURLS.orderListing);
    try {
      //getting token first
      final prefs = await SharedPreferences.getInstance();
      final dynamic extractedUserData =
          json.decode(prefs.getString("userData").toString());
      _token = extractedUserData["token"];
      final response = await http.get(url, headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_token'
      });

      Map<String, dynamic> responseData = json.decode(response.body);
      if (responseData['status'] == false) {
      
        notifyListeners();
        //throwing error message, this will handle in profile widgets
        throw HttpException(response.body);
      } else if (responseData['status'] == true) {
        List<dynamic> data = responseData["data"]["orders"];
        _orders = data.map((order) => OrderItems.fromJson(order)).toList();

        notifyListeners();
      }
    } catch (error) {
      throw error;
    }
  }

}
