
import '../models/apiUrls.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'dart:convert';
import 'dart:async';

import 'package:ecomm_app/models/http_exception.dart';
import 'package:flutter/widgets.dart';

import 'package:http/http.dart' as http;

import '../models/user-profile.dart';

class AuthChecker with ChangeNotifier {
  String userRegMessage = "";
  String userProfileMessage = "";
  String userUpdatePasswordMessage = "";
  bool userProfileHasLoaded = false;
  String _token = "null";
  String _userId = "null";

  int count = 0;
  String userEmailAddress = "";

  UserProfile customerProfileData = UserProfile(name: "", email: "", mobile: "");

  bool get isAuth {
    return token == "null" ? false : true;
  }

  String get token {
    if (_token != "null") {
      return _token;
    }

    return "null";
  }

    Future<void> _authenticate(
      String email, String password, String urlSegment) async {
    // final url = Uri.parse('http://10.0.2.2:8000/api/login');

    final url = Uri.parse(APIURLS.userLoginAPIUrl);
    try {
      final response = await http.post(
        url,
        body: json.encode({
          'email': email,
          'password': password,
        }),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.body.runtimeType is Object) {
        print("response body is object type");
      }
      Map<String, dynamic> responseData = json.decode(response.body);

      // print('your value '+responseData["idToken"]);
      if (responseData['status'] == false) {
        _token = "null";
        _userId = "null";
        // _expiryDate = DateTime.now();
        throw HttpException(response.body);
      }

      _token = responseData["data"]["token"];
      print("your token value " + _token);
      _userId = responseData["data"]["name"];
      print("your local id valeu " + _userId);
      // _expiryDate = DateTime.now().add(Duration(seconds: 7600));
      // .add(Duration(seconds: int.parse(responseData["expiresIn"])));
      // print("your expiry date " + _expiryDate.toString());
      // _autoLogout();
      notifyListeners();
      final prefs = await SharedPreferences.getInstance();
      final userData = json.encode({
        'token': _token,
        'userId': _userId,
        // 'expiryDate': _expiryDate.toIso8601String()
      });

      final dynamic extractedUserData =
          json.decode(jsonEncode(prefs.getString("userData")));

      print("user data ");
      if (userData is Object) {
        print("user data is object");
      }
      print(userData);
      prefs.setString("userData", userData);
      userRegMessage = responseData["message"];
    } catch (error) {
      throw error;
    }
  }

  Future<void> signup(String email, String password) async {
    return _authenticate(email, password, "signUp");
  }

  Future<void> login(String email, String password) async {
    //this firebase url is accountable of Rudresh's firebase account.
    // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
    return _authenticate(email, password, "signInWithPassword");
  }

    Future<bool> tryAutoLogin() async {
    print("auto login method called");

    final prefs = await SharedPreferences.getInstance();
    if (!prefs.containsKey("userData")) {
      print("not containig userData key value pair");
      return false;
    }
    final dynamic extractedUserData =
        json.decode(prefs.getString("userData").toString());
    print("your extracted data value ");
    print(extractedUserData);

    _token = extractedUserData["token"];
    _userId = extractedUserData["userId"];

    notifyListeners();

    return true;
  }


  void logout() async {
    _token = "null";

    _userId = "null";


    final prefs = await SharedPreferences.getInstance();
    prefs.clear();
    notifyListeners();
  }

}