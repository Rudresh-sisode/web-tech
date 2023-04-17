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

  List<ProductDetails> productDataList = [];
  List<ProductDetails> productRequestingData = [];
  bool isFounded = true;

  List<Product> products = [
    Product(
        id: 1,
        name: 'samsung Galaxy',
        offerPrice: 33999,
        // image: 'https://wallpaperaccess.com/full/399842.jpg',
        image:
            "https://ecom.gunadhyasoftware.com/public/uploads/product_files/167593766763e4c7834e176.jpg",
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
  ];

  ProductDetails product = ProductDetails(
      productId: 0,
      mainCategoryId: 0,
      categoryId: 0,
      subCategoryId: 0,
      name: "Loading",
      detail: "N.A",
      price: 0,
      quantity: 0,
      offerPrice: 0,
      mainCategoryValue: "N.A",
      categoryValue: "N.A",
      subCategoryValue: "N.A",
      productImages: []);
  //  ProductDetails product = {} as ProductDetails;

  // List<Product> get getProducts {
  //   return products;
  // }

  void showAllProducts() {
    productRequestingData = productDataList;
    isFounded = productRequestingData.length > 0 ? true : false;
    notifyListeners();
  }

  void searchProductList(String prodNameCharString) {
    productRequestingData = productDataList
        .where((item) => item.name
            .toLowerCase()
            .contains(prodNameCharString.trim().toLowerCase()))
        .toList();
    isFounded = productRequestingData.length > 0 ? true : false;
    notifyListeners();
    // return productRequestingData;
  }

  void sortProductLowestToHighest() {
    productRequestingData = productDataList;
    productRequestingData.sort((a, b) => a.offerPrice.compareTo(b.offerPrice));
    isFounded = productRequestingData.length > 0 ? true : false;
    notifyListeners();
  }

  void sortProductHighestToLowest() {
    productRequestingData = productDataList;
    productRequestingData.sort((a, b) => b.offerPrice.compareTo(a.offerPrice));
    isFounded = productRequestingData.length > 0 ? true : false;
    notifyListeners();
  }

  void sortProductBetweenPriceRange(int minPrice, int maxPrice) {
    productRequestingData = productDataList;
    productRequestingData = productRequestingData
        .where((item) =>
            item.offerPrice >= minPrice && item.offerPrice <= maxPrice)
        .toList();
    isFounded = productRequestingData.length > 0 ? true : false;
    notifyListeners();
  }


  List<ProductDetails> get getProducts {
    return productDataList;
  }


  // void updateProductQuantity(int id, [String value = "des"]) {
  //   int index = products.indexWhere((element) => element.id == id);
  //   if (index >= 0 && value == "des") {
  //     products[index].quantity--;
  //   } else if (index >= 0 && value == "asc") {
  //     products[index].quantity++;
  //   }
  // }

  void updateProductQuantity(int id, [String value = "des"]) {
    int index =
        productDataList.indexWhere((element) => element.productId == id);
    if (index >= 0 && value == "des") {
      productDataList[index].quantity--;
    } else if (index >= 0 && value == "asc") {
      productDataList[index].quantity++;
    }
  }

  // String foundAndReturnProductsOfferPrice(int id) {
  //   int index = -1;
  //   for (int i = 0; i < products.length; i++) {
  //     if (products[i].id == id) {
  //       index = i;
  //       break;
  //     }
  //   }
  //   if (index == -1) {
  //     return "00.00";
  //   }
  //   return products[index].offerPrice.toString();

  // }

  String foundAndReturnProductsOfferPrice(int id) {
    int index = -1;
    for (int i = 0; i < productDataList.length; i++) {
      if (productDataList[i].productId == id) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      return "00.00";
    }
    return productDataList[index].offerPrice.toString();
  }

  // String foundAndReturnProductsImage(int id) {
  //   int index = -1;
  //   for (int i = 0; i < products.length; i++) {
  //     if (products[i].id == id) {
  //       index = i;
  //       break;
  //     }
  //   }
  //   if (index == -1) {
  //     return "https://png.pngtree.com/png-vector/20210706/ourmid/pngtree-no-result-search-icon-png-image_3563805.jpg";
  //   }
  //   return products[index].image;
  // }

  String foundAndReturnProductsImage(int id) {
    int index = -1;
    for (int i = 0; i < productDataList.length; i++) {
      if (productDataList[i].productId == id) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      return "https://png.pngtree.com/png-vector/20210706/ourmid/pngtree-no-result-search-icon-png-image_3563805.jpg";
    }
    return productDataList[index].productImages[0].imageFullPath;
  }

  // String foundAndReturnProductsPrice(int id) {
  //   int index = -1;
  //   for (int i = 0; i < products.length; i++) {
  //     if (products[i].id == id) {
  //       index = i;
  //       break;
  //     }
  //   }
  //   if (index == -1) {
  //     return "00.00";
  //   }
  //   return products[index].price.toString();
  // }

  String foundAndReturnProductsPrice(int id) {
    int index = -1;
    for (int i = 0; i < productDataList.length; i++) {
      if (productDataList[i].productId == id) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      return "00.00";
    }
    return productDataList[index].price.toString();
  }

  // String foundAndReturnProductsName(int id) {
  //   int index = -1;

  //   for (int i = 0; i < products.length; i++) {
  //     if (products[i].id == id) {
  //       index = i;
  //       break;
  //     }
  //   }
  //   if (index == -1) {
  //     return "Product not avilable";
  //   }
  //   return products[index].name;
  // }

  String foundAndReturnProductsName(int id) {
    int index = -1;

    for (int i = 0; i < productDataList.length; i++) {
      if (productDataList[i].productId == id) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      return "Product not avilable";
    }
    return productDataList[index].name;
  }

  // String foundAndReturnProductsQuantity(int id) {
  //   int index = -1;

  //   for (int i = 0; i < products.length; i++) {
  //     if (products[i].id == id) {
  //       index = i;
  //       break;
  //     }
  //   }
  //   if (index == -1) {
  //     return "00.00";
  //   }
  //   return products[index].quantity.toString();
  // }

  String foundAndReturnProductsQuantity(int id) {
    int index = -1;

    for (int i = 0; i < productDataList.length; i++) {
      if (productDataList[i].productId == id) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      return "00.00";
    }
    return productDataList[index].quantity.toString();
  }

  Future<void> getProductDetailsById(String id) async {
    final url = Uri.parse(APIURLS.getProductDetailsById + '/${id}');
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
      } else if (responseData['status'] == true) {
        Map<String, dynamic> productData = responseData["data"];

        // String htmlString  = parse(productData["detail"]);
//.replaceAll(RegExp(r'\s+|\{.*?\}|\.(st\d+)|\*{.*?}'), ' '),
        product = ProductDetails(
          productId: productData['product_id'],
          mainCategoryId: productData['main_category_id'],
          categoryId: productData['category_id'],
          subCategoryId: productData['sub_category_id'],
          name: productData['name'],
          detail: Bidi.stripHtmlIfNeeded(productData["detail"])
              .replaceAll(RegExp(' +'), ' '),
          price: productData['price'],
          quantity: productData['quantity'],
          offerPrice: productData['offer_price'],
          mainCategoryValue: productData['main_category_value'],
          categoryValue: productData['category_value'],
          subCategoryValue: productData['sub_category_value'],
          productImages: List<ProductImage>.from(
              productData['product_image'].map((x) => ProductImage.fromMap(x))),
        );

        // _orders = data.map((order) => OrderItems.fromJson(order)).toList();

        notifyListeners();
      }
    } catch (error) {
      throw error;
    }
  }



  Future<bool> getExecuteProductData() async {
    try {
      await getProductsData();
      return true;
    } catch (error) {
      return false;
    }
  }

  Future<void> getProductsData() async {
    final url = Uri.parse(APIURLS.getProductList);
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
      } else if (responseData['status'] == true) {
        List<dynamic> productData = responseData["data"];
        productDataList = productData
            .map((product) => ProductDetails.fromJson(product))
            .toList();

        productRequestingData = productDataList;

        notifyListeners();
       
      }
    } catch (error) {
      throw error;
    }
  }
}
