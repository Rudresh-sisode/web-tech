
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
import 'package:ecomm_app/models/home-page-slider.dart';
import 'package:flutter/widgets.dart';

import 'package:http/http.dart' as http;

class HomePageSlider with ChangeNotifier {
   List<HomePageSliderS> sliderImage = [];
   String _token = "null";
   bool loading = false;

   Future<bool> executeGetSlider() async{
    try{
      
      await  getHomeSliderImage();
      return true;
      
    }
    catch(err){
      return false;
    }
   }

  //  Future<bool>  getSliderBoolean() async{
  //   return loading;
  //  }

  Future<void> getHomeSliderImage() async {
    final url = Uri.parse(APIURLS.getHomePageSlider);
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
        List<dynamic> data = responseData["data"];
        sliderImage = data.map((image) => HomePageSliderS.fromJson(image)).toList();
        
        // _orders = data.map((order) => OrderItems.fromJson(order)).toList();
        // allPopularData = data.map((item) {
        //   return PopularModel(id: item['id'], name: item['name']);
        // }).toList();

     notifyListeners();
     loading = true;
        
      }
    } catch (error) {
      loading = false;
      throw error;

    }
  }
}