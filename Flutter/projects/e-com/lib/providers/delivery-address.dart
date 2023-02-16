import 'package:flutter/foundation.dart';

import 'dart:math';
import '../models/apiUrls.dart';
import '../models/delivery-address.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'dart:convert';
import 'dart:async';

import 'package:ecomm_app/models/http_exception.dart';
import 'package:flutter/widgets.dart';

import 'package:http/http.dart' as http;

enum AddressType {
    ADD,
    EDIT,
  }

class DeliveryAddress with ChangeNotifier {
  List<CustomerDeliveryAddress> selectedDectedAddress = [];
  List<CustomerDeliveryAddress> allAddressData = [];

  //initial address type value;
  AddressType addressType = AddressType.ADD;
  


  String _token = "null";

  

  Future<void> requestingAllDeliveryAvailableAddress() async{
    final url = Uri.parse(APIURLS.getAllAddressDataAPIUrl);
    try{
         //getting token first
      final prefs = await SharedPreferences.getInstance();
      final dynamic extractedUserData = json.decode(prefs.getString("userData").toString());
      _token = extractedUserData["token"];
      final response = await http.get(url,headers:{'Content-Type': 'application/json',
      'Authorization':'Bearer $_token'});

      Map<String, dynamic> responseData = json.decode(response.body);
      if (responseData['status'] == false) {
        selectedDectedAddress  = [];
        notifyListeners();
        //throwing error message, this will handle in profile widgets
        throw HttpException(response.body);
      } else if (responseData['status'] == true) {
      
      List<dynamic> data = responseData["data"];

      allAddressData = data.map((item){
        return CustomerDeliveryAddress(id: item['id'].toString(), firstName: item['first_name'].toString(), lastName: item['last_name'], address: item['address'], phone: item['phone'], address2: item['address2'], country: item['country'], state: item['state'], city: item['city'], pincode: item['pincode'], email: item['email']);
      }).toList();

      // data.forEach((item){
      //   allAddressData.add(CustomerDeliveryAddress(id: item['id'].toString(), firstName: item['first_name'].toString(), lastName: item['last_name'], address: item['address'], phone: item['phone'], address2: item['address2'], country: item['country'], state: item['state'], city: item['city'], pincode: item['pincode'], email: item['email']));
      // } as void Function(String key, dynamic value));
        
        notifyListeners();

      }
    }
    catch(error){
      throw error;
    }
  }
}