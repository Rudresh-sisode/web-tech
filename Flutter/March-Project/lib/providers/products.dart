
import 'dart:math';
import 'package:ecomm_app/models/product.dart';

import '../models/apiUrls.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';


import 'dart:convert';
import 'dart:async';

import 'package:ecomm_app/models/http_exception.dart';
import 'package:flutter/widgets.dart';

import 'package:http/http.dart' as http;

import '../models/product-details.dart';

class Products with ChangeNotifier {
  String _token = "null";
  List<Product> products = [
    Product(
        id: 1,
        name: 'samsung Galaxy',
        offerPrice: 33999,
        // image: 'https://wallpaperaccess.com/full/399842.jpg',
        image:"https://ecom.gunadhyasoftware.com/public/uploads/product_files/167593766763e4c7834e176.jpg",
        price: 35999,
        quantity: 14),
    Product(
        id: 2,
        name: 'Iphone x',
        offerPrice: 50000,
        image:
            'https://ecom.gunadhyasoftware.com/public/uploads/product_files/167645558863ecaea4a96b6.jpg',
        price: 55000,
        quantity: 10),
    Product(
        id: 3,
        name: 'Office Shirt',
        offerPrice: 950,
        image:
            'https://ecom.gunadhyasoftware.com/public/uploads/product_files/167645770963ecb6ed2b1f5.jpg',
        price: 1300,
        quantity: 12),
    // Product(
    //     id: 4,
    //     name: 'Laptop Bag',
    //     offerPrice: 82.0,
    //     image:
    //         'https://th.bing.com/th/id/OIP.9SDGaGX-SIQ2_oDY4lEmFgHaL_?pid=ImgDet&rs=1',
    //     price: 87.5,
    //     quantity: 2),
    // Product(
    //     id: 5,
    //     name: 'Laptop Bag',
    //     offerPrice: 62.0,
    //     image:
    //         'https://th.bing.com/th/id/OIP.9SDGaGX-SIQ2_oDY4lEmFgHaL_?pid=ImgDet&rs=1',
    //     price: 67.5,
    //     quantity: 5),
    // Product(
    //     id: 6,
    //     name: 'Laptop Bag',
    //     offerPrice: 85.0,
    //     image:
    //         'https://www.clueman.lk/wp-content/uploads/2019/12/SPG9962-scaled.jpg',
    //     price: 87.5,
    //     quantity: 7),
    // Product(
    //     id: 7,
    //     name: 'Monk',
    //     offerPrice: 45.0,
    //     image:
    //         'https://static.vecteezy.com/system/resources/previews/006/779/203/original/water-bottle-icon-illustration-sport-water-container-flat-cartoon-style-suitable-for-web-landing-page-banner-flyer-sticker-wallpaper-background-free-vector.jpg',
    //     price: 50.5
    //     ,
    //     quantity: 8),
    // Product(
    //     id: 8,
    //     name: 'T shirt',
    //     offerPrice: 95.0,
    //     image:
    //         'https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    //     price: 99.5,
    //     quantity: 5),
    // Product(
    //     id: 9,
    //     name: 'T shirt',
    //     offerPrice: 85.0,
    //     image:
    //         'https://th.bing.com/th/id/OIP.NXx98yatBhiTUaDzZdJzrQHaJC?pid=ImgDet&rs=1',
    //     price: 87.5,
    //     quantity: 10),
    // Product(
    //     id: 10,
    //     name: '',
    //     offerPrice: 140.0,
    //     image:
    //         'https://source.unsplash.com/random/1920x1080/?wallpaper,landscape',
    //     price: 144.5,
    //     quantity: 12),
  ];

   ProductDetails product = ProductDetails(productId: 0, mainCategoryId: 0, categoryId: 0, subCategoryId: 0, name: "Loading", detail: "N.A", price: 0, quantity: 0, offerPrice: 0, mainCategoryValue: "N.A", categoryValue: "N.A", subCategoryValue: "N.A", productImages: []);

  List<Product> get getProducts {
    return products;
  }

  void updateProductQuantity(int id,[String value="des"]){
    int index = products.indexWhere((element) => element.id == id);
    if(index >= 0 && value == "des"){
      products[index].quantity--;
    }
    else if(index >= 0 && value == "asc"){
      products[index].quantity++;
    }
  }

  String foundAndReturnProductsOfferPrice(int id){
    int index = -1;
    for (int i = 0; i < products.length; i++) {
          if (products[i].id == id) {
            index = i;
            break;
          }
        }
        if (index == -1) {
        return "00.00";
        }
        return products[index].offerPrice.toString();;
  }


  String foundAndReturnProductsImage(int id){
    int index = -1;
    for (int i = 0; i < products.length; i++) {
          if (products[i].id == id) {
            index = i;
            break;
          }
        }
        if (index == -1) {
        return "https://png.pngtree.com/png-vector/20210706/ourmid/pngtree-no-result-search-icon-png-image_3563805.jpg";
        }
        return products[index].image;
  }

  String foundAndReturnProductsPrice(int id){
    int index = -1;
     for (int i = 0; i < products.length; i++) {
            if (products[i].id == id) {
              index = i;
              break;
            }
          }
          if (index == -1) {
            return "00.00";
          }
          return products[index].price.toString();
  }

  String foundAndReturnProductsName(int id){
    int index = -1;
    
      for (int i = 0; i < products.length; i++) {
        if (products[i].id == id) {
          index = i;
          break;
        }
      }
      if (index == -1) {
          return "Product not avilable";
          
      }
      return products[index].name;
  }

  String foundAndReturnProductsQuantity(int id){
    int index = -1;
    
      for (int i = 0; i < products.length; i++) {
        if (products[i].id == id) {
          index = i;
          break;
        }
      }
      if (index == -1) {
          return "00.00";
          
      }
      return products[index].quantity.toString();
  }

  Future<void> getProductDetailsById(String id) async{
    final url = Uri.parse(APIURLS.getProductDetailsById+'/${id}');
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
      } else if (responseData['status'] == true){

        Map<String,dynamic> productData = responseData["data"];

        // String htmlString  = parse(productData["detail"]);
        
            product = ProductDetails(
            productId: productData['product_id'],
            mainCategoryId: productData['main_category_id'],
            categoryId: productData['category_id'],
            subCategoryId: productData['sub_category_id'],
            name: productData['name'],
            detail: Bidi.stripHtmlIfNeeded(productData["detail"]).replaceAll(RegExp(' +'), ' '),
            price: productData['price'],
            quantity: productData['quantity'],
            offerPrice: productData['offer_price'],
            mainCategoryValue: productData['main_category_value'],
            categoryValue: productData['category_value'],
            subCategoryValue: productData['sub_category_value'],
            productImages: List<ProductImage>.from(productData['product_image'].map((x) => ProductImage.fromMap(x))),
          );

        

        // _orders = data.map((order) => OrderItems.fromJson(order)).toList();

        notifyListeners();
      }
    } catch (error) {
      throw error;
    }
  }

  // String foundAndReturnProductsRequireData(int id,String request) {
  //   int index = -1;
  //   if(request.isNotEmpty && request == "name"){
  //     for (int i = 0; i < products.length; i++) {
  //       if (products[i].id == id) {
  //         index = i;
  //         break;
  //       }
  //     }
  //     if (index == -1) {
  //         return "Product not avilable";
          
  //     }
  //     return products[index].name;
  //   }
  //   else if(request.isNotEmpty && request == "image"){
  //       for (int i = 0; i < products.length; i++) {
  //         if (products[i].id == id) {
  //           index = i;
  //           break;
  //         }
  //       }
  //       if (index == -1) {
  //       return "https://png.pngtree.com/png-vector/20210706/ourmid/pngtree-no-result-search-icon-png-image_3563805.jpg";
  //       }
  //       return products[index].name;
  //   }
  //   else if(request.isNotEmpty && request == "price"){
  //     for (int i = 0; i < products.length; i++) {
  //           if (products[i].id == id) {
  //             index = i;
  //             break;
  //           }
  //         }
  //         if (index == -1) {
  //           return "00.00";
  //         }
  //         return products[index].price.toString();
  //   }
  //   else{
  //     return request == "image" ? "https://png.pngtree.com/png-vector/20210706/ourmid/pngtree-no-result-search-icon-png-image_3563805.jpg" : request == "name" ? "Product not avilable" : request == "price" ? "00.00" : "N.A";
  //   }
  // }
}
