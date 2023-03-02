import 'dart:async';
import 'package:ecomm_app/models/apiUrls.dart';
import 'package:ecomm_app/models/carousel.dart';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/foundation.dart';

import 'dart:math';
import '../models/apiUrls.dart';
import '../models/carousel.dart';
import '../models/carousel.dart';
import '../models/delivery-address.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'dart:convert';
import 'dart:async';

import 'package:ecomm_app/models/http_exception.dart';
import 'package:flutter/widgets.dart';

import 'package:http/http.dart' as http;

import '../models/home-page-slider.dart';

class ApiConstants {
  static String baseUrl = 'https://ecom.gunadhyasoftware.com/api';
  static String bannerEndpoint = '/home-sliders';
}

class CarouselApi with ChangeNotifier {
  // List<CarouselModel> allSliderImages = [];

  List<CarouselModel> allImagesData = [];

 

  final List images = [
  'https://cdn.pixabay.com/photo/2017/12/10/14/47/piza-3010062_1280.jpg',
  'https://cdn.pixabay.com/photo/2016/06/07/01/49/ice-cream-1440830_1280.jpg',
  'https://cdn.pixabay.com/photo/2017/12/27/07/07/brownie-3042106_1280.jpg',
  'https://cdn.pixabay.com/photo/2018/02/25/07/15/food-3179853_1280.jpg',
  'https://cdn.pixabay.com/photo/2015/10/26/11/10/honey-1006972_1280.jpg',
];
  
  String _token = "null";


  Future<void> getCarousel() async {
    final url = Uri.parse(APIURLS.getSliderUrl);
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
        allImagesData = [];
        notifyListeners();
        //throwing error message, this will handle in profile widgets
        throw HttpException(response.body);
      } else if (responseData['status'] == true) {
        List<dynamic> data = responseData["data"];
        allImagesData = data.map((item) {
          return CarouselModel(
              // product_id: item['product_id'],
              slider_name: item['slider_name']);
        }).toList();
        notifyListeners();
      }
    } catch (error) {
      throw error;
    }
  }
}