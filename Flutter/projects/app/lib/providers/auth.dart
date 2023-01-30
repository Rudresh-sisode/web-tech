import 'dart:math';

import 'package:shared_preferences/shared_preferences.dart';

import 'dart:convert';
import 'dart:async';

import 'package:ecomm_app/models/http_exception.dart';
import 'package:flutter/widgets.dart';

import 'package:http/http.dart' as http;

class Auth with ChangeNotifier {
   String _token = "null";
   DateTime _expiryDate = DateTime.now();
   String _userId = "null";
   Timer _authTimer = null as Timer;
  // dynamic _authTimer = Timer(Duration(seconds: 5 ),null)

  bool get isAuth {

    // notifyListeners();
    var authValue = false;
    // return (token == "null") ? false : true;
    switch (token) {
      case "null":
        authValue = false;
        break;
      default:
        authValue = true;
        break;
    }
    print("token value from isAuth getter " +authValue.toString() + token +" firebase token "+ _token );

    return authValue;

  }

  String get token {
    if (!_expiryDate.isAtSameMomentAs(DateTime.now()) &&
        _expiryDate.isAfter(DateTime.now()) &&
        _token != "null") {
          print("object1 "+_token);
      return _token;
    }
    print("object2 " );

    return "null";
    
  }

  Future<void> _authenticate(
      String email, String password, String urlSegment) async {
    final url = Uri.parse(
        'https://identitytoolkit.googleapis.com/v1/accounts:$urlSegment?key=AIzaSyApgq7GtucB4dZBF5pQUt21p-alhJC4oBg');
    try {
      final response = await http.post(url,
          body: json.encode({
            'email': email,
            'password': password,
            'returnSecureToken': true
          }));

      if(response.body.runtimeType is Object){
        print("response body is object type");
      }
      Map<String, dynamic> responseData = json.decode(response.body);


      // print('your value '+responseData["idToken"]);

      if (responseData['error'] != null) {
        _token = "null";
        _userId = "null";
        _expiryDate = DateTime.now();
        throw HttpException(responseData['error']['message']);
      }

      _token = responseData["idToken"];
    print("your token value "+_token);
      _userId = responseData["localId"];
      print("your local id valeu "+_userId);
      _expiryDate = DateTime.now()
          .add(Duration(seconds: int.parse(responseData["expiresIn"])));
          print("your expiry date "+_expiryDate.toString());

          _autoLogout();
          notifyListeners();
          final prefs = await SharedPreferences.getInstance();
          final userData = json.encode({'token':_token,'userId':_userId,'expiryDate':_expiryDate.toIso8601String()});
          
          final dynamic extractedUserData = json.decode(jsonEncode(prefs.getString("userData")));

          print("user data ");
          if(userData is Object){
            print("user data is object");
          }
          print(userData);
          prefs.setString("userData", userData);
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
    if(!prefs.containsKey("userData")){
      print("not containig userData key value pair");
      return false;
    }
    final dynamic extractedUserData = json.decode(prefs.getString("userData").toString());
    print("your extracted data value ");
    print(extractedUserData);
    final expiryDate = DateTime.parse(extractedUserData["expiryDate"]);

    if(expiryDate.isBefore(DateTime.now())){
      print("time date has issue "+expiryDate.toIso8601String());
      return false;
    }

    _token = extractedUserData["token"];
    _userId = extractedUserData["userId"];
    _expiryDate = expiryDate;
    notifyListeners();
    _autoLogout();
    return true;
  }
  
  void logout() async{
    _token = "null";
    _expiryDate = DateTime.now();
    _userId = "null";

    if(_authTimer != null){
      _authTimer.cancel();
      _authTimer = null as Timer;
    }
    final prefs = await SharedPreferences.getInstance();
    prefs.clear();
    notifyListeners();
  }

  void _autoLogout(){
    print("Auth Timer ");
    print(_authTimer);
    if(_authTimer != null){
      _authTimer.cancel();
    }
    final timeToExpiry = _expiryDate.difference(DateTime.now()).inSeconds;
    _authTimer = Timer(Duration(seconds: 30 ),logout);
  }
}
