import 'dart:math';
import 'package:ecomm_app/models/popular-products.dart';
import 'package:ecomm_app/models/popular.dart';
import 'package:ecomm_app/models/product.dart';

import '../models/apiUrls.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'dart:convert';
import 'dart:async';

import 'package:ecomm_app/models/http_exception.dart';
import 'package:flutter/widgets.dart';

import 'package:http/http.dart' as http;

import '../models/most-selling.dart';
import '../models/primium-product.dart';
import '../models/trending-products.dart';

class ApiConstants {
  static String baseUrl = 'https://jsonplaceholder.typicode.com';
  static String popularEndpoint = '/photos';
}

class PopularApi with ChangeNotifier {
  String _token = "null";
  List<PopularModel> allPopularData = [];

  List<PopularProducts> popularProductsImageData = [];


  List<Trending> trendingProductsImageData = [];
  List<MostSelling> mostSellingProductsImageData = [];
  List<PremiumProduct> premiumProductsImageData = [];

  //   final List<String> imagesList1 = [
  //   'https://cdn.pixabay.com/photo/2017/12/10/14/47/piza-3010062_1280.jpg',
  //   'https://cdn.pixabay.com/photo/2016/06/07/01/49/ice-cream-1440830_1280.jpg',
  //   'https://cdn.pixabay.com/photo/2017/12/27/07/07/brownie-3042106_1280.jpg',
  //   'https://cdn.pixabay.com/photo/2018/02/25/07/15/food-3179853_1280.jpg',
  //   'https://cdn.pixabay.com/photo/2015/10/26/11/10/honey-1006972_1280.jpg',
  // ];

  Future<bool> executeGetProduct() async{
    try{
      await getPopularProduct();
      return true;
    }
    catch(error){
      return false;
    }
  }

  

  Future<void> getPopularProduct() async {
    final url = Uri.parse(APIURLS.getPopularProductUrl);
    try {
      //getting token first
      // final prefs = await SharedPreferences.getInstance();
      // final dynamic extractedUserData =
      //     json.decode(prefs.getString("userData").toString());
      // _token = extractedUserData["token"];
      final response = await http.get(url, headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer $_token'
      });

      Map<String, dynamic> responseData = json.decode(response.body);
      if (responseData['status'] == false) {
        notifyListeners();
        //throwing error message, this will handle in profile widgets
        throw HttpException(response.body);
      } else if (responseData['status'] == true){
        List<dynamic> data = responseData["data"];
        List<dynamic> popularField = data.firstWhere((element) => element["slider_name"] == "Popular")["product"];
        for(int i = 0; i < popularField.length; i++){

          popularProductsImageData.add(PopularProducts(productId: popularField[i]["product_id"], populaImagePath: popularField[i]["slider_image_full_path"]) );
          
        }
        List<dynamic> trendingField = data.firstWhere((element) => element["slider_name"] == "Trending Product")["product"];
        for(int i = 0; i < trendingField.length; i++){
    
          trendingProductsImageData.add(Trending(productId:trendingField[i]["product_id"] ,mainCategoryId:trendingField[i]["main_category_id"] ,categoryId: trendingField[i]["category_id"],categoryValue:trendingField[i]["category_value"] ,detail:trendingField[i]["detail"] ,mainCategoryValue: trendingField[i]["main_category_value"] ,name: trendingField[i]["name"] ,offerPrice: trendingField[i]["offer_price"],price:trendingField[i]["price"] ,quantity:trendingField[i]["quantity"] ,sliderImageFullPath:trendingField[i]["slider_image_full_path"] ,sliderImageName:trendingField[i]["slider_image_name"] ,sliderImagePath:trendingField[i]["slider_image_path"] ,subCategoryId:trendingField[i]["sub_category_id"] ,subCategoryValue:trendingField[i]["sub_category_value"]  ) );
        }

        List<dynamic> mostSellingField = data.firstWhere((element) => element["slider_name"] == "Most Selling")["product"];
        for(int i = 0; i < mostSellingField.length; i++){
          mostSellingProductsImageData.add(MostSelling(productId:mostSellingField[i]["product_id"] ,mainCategoryId:mostSellingField[i]["main_category_id"] ,categoryId: mostSellingField[i]["category_id"],categoryValue:mostSellingField[i]["category_value"] ,detail:mostSellingField[i]["detail"] ,mainCategoryValue: mostSellingField[i]["main_category_value"] ,name: mostSellingField[i]["name"] ,offerPrice: mostSellingField[i]["offer_price"],price:mostSellingField[i]["price"] ,quantity:mostSellingField[i]["quantity"] ,sliderImageFullPath:mostSellingField[i]["slider_image_full_path"] ,sliderImageName:mostSellingField[i]["slider_image_name"] ,sliderImagePath:mostSellingField[i]["slider_image_path"] ,subCategoryId:mostSellingField[i]["sub_category_id"],total:mostSellingField[i]["total"] ,subCategoryValue:mostSellingField[i]["sub_category_value"]  ) );
        }

        List<dynamic> premiumField = data.firstWhere((element) => element["slider_name"] == "Premium Pick Product")["product"];
        for(int i = 0; i < premiumField.length; i++){
          premiumProductsImageData.add(PremiumProduct(id:premiumField[i]["product_id"] ,mainCategoryId:premiumField[i]["main_category_id"] ,categoryId: premiumField[i]["category_id"],categoryValue:premiumField[i]["category_value"] ,detail:premiumField[i]["detail"] ,mainCategoryValue: premiumField[i]["main_category_value"] ,name: premiumField[i]["name"] ,offerPrice: premiumField[i]["offer_price"],price:premiumField[i]["price"] ,quantity:premiumField[i]["quantity"] ,sliderImageFullPath:premiumField[i]["slider_image_full_path"] ,sliderImageName:premiumField[i]["slider_image_name"] ,sliderImagePath:premiumField[i]["slider_image_path"] ,subCategoryId:premiumField[i]["sub_category_id"] ,subCategoryValue:premiumField[i]["sub_category_value"]  ) );
        }

        notifyListeners();
      }
    } catch (error) {
      throw error;
    }
  }

}
