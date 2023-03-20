import 'package:flutter/foundation.dart';
import '../models/cart.dart';
import '../models/order-pricing-detail.dart';
import '../models/orders.dart';
import '../models/ordes-product.dart';
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
  List<OrdersProduct> ordersProduct = [];
  late CustomerDeliveryAddress addressDetails;
  late OrderPricing orderPricing;
  int viewOrderId = -1;


  List<OrderItems> get orders {
    return [..._orders];
  }

  void addOrder(List<CartItem> cartProduct, double total) {
    
    notifyListeners();

  }

  OrderItems get selectedOrdersDetails{
   if(viewOrderId == -1){
    return OrderItems(orderId: 0, tokenOrderId: "0", orderSubtotal: 00.00, orderDiscountAmount: 00.00, orderTotal: 00.00, totalProducts: 0, orderDate: "0000-00-00", status: "order", deliveredDate: "NULL");
   }
    return _orders.firstWhere((element) => element.orderId == viewOrderId);
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
        dynamic availableData = responseData["data"];
        print("#% ${availableData.runtimeType}");

         if(availableData.runtimeType == Object){
          print("it's a map");
         }

        if (availableData.runtimeType == List) {
          // responseData['data'] is a list
          List<dynamic> dataList = availableData;

          if(dataList.isNotEmpty){
            List<dynamic> data = responseData["data"]["orders"];
            _orders = data.map((order) => OrderItems.fromJson(order)).toList();
          }
          else{
            _orders = [];
          }
          // use dataList as needed
        } else {
          // responseData['data'] is a map
          Map<String, dynamic> dataMap = availableData;
          if(dataMap.isNotEmpty){
            List<dynamic> data = responseData["data"]["orders"];
            _orders = data.map((order) => OrderItems.fromJson(order)).toList();
          }
          else{
            _orders = [];
          }
          // use dataMap as needed
        }
        
        notifyListeners();
      }
    } catch (error) {
      _orders = [];
      throw error;
    }
  }

  Future<void> getEachOrderDetails() async {
    final url = Uri.parse(APIURLS.orderDetails+'${viewOrderId}');
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
        Map<String,dynamic> orderDetails = responseData["data"]["orders"];
        List<dynamic> orderProducts = responseData["data"]["order_product"];
        ordersProduct = orderProducts.map((item) => OrdersProduct.fromJson(item)).toList();
        Map<String,dynamic> orderAddress = orderDetails["shipping_address"];
        addressDetails = CustomerDeliveryAddress.fromJson(orderAddress);
        orderPricing = OrderPricing(orderDate:orderDetails["order_date"] ,orderDiscountAmount:orderDetails["order_discount_amount"] ,orderId: orderDetails["order_id"],orderSubtotal:orderDetails["order_subtotal"] ,orderTotal: orderDetails["order_total"], status: orderDetails["status"],tokenOrderId:orderDetails["token_order_id"] ,totalProducts:orderDetails["total_products"]);
     
        // _orders = data.map((order) => OrderItems.fromJson(order)).toList();

        notifyListeners();
      }
    } catch (error) {
      throw error;
    }

  }

}
