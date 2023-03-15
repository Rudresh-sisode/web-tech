import 'dart:math';
import '../models/apiUrls.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'dart:convert';
import 'dart:async';

import 'package:ecomm_app/models/http_exception.dart';
import 'package:flutter/widgets.dart';

import 'package:http/http.dart' as http;

import '../models/user-profile.dart';

class Auth with ChangeNotifier {
  String userRegMessage = "";
  String userProfileMessage = "";
  String userUpdatePasswordMessage = "";
  bool userProfileHasLoaded = false;
  String _token = "null";
  // DateTime _expiryDate = DateTime.now();
  String _userId = "null";
  // Timer _authTimer = null as Timer;
  // Timer _authTimer = Timer(Duration(seconds: DateTime.now().second ),(){});
  int count = 0;
  String userEmailAddress = "";

  UserProfile customerProfileData = UserProfile(name: "", email: "", mobile: "");

  // dynamic _authTimer = Timer(Duration(seconds: 5 ),null)

  bool get isAuth {
    return token == "null" ? false : true;
  }

  String get token {
    if (_token != "null") {
      /**
       * !_expiryDate.isAtSameMomentAs(DateTime.now()) &&
        _expiryDate.isAfter(DateTime.now()) &&
       */
      print("object1 " + _token);
      return _token;
    }
    print("object2 ");

    return "null";
  }

  Future<void> updateuserPassword(String oldPassword,String newPassword,String confirmPassword) async{
    final url = Uri.parse(APIURLS.updateUserPassword);
    final responseBody = {"old_password":oldPassword,"password":newPassword,"c_password":confirmPassword};
    

    try{
        final prefs = await SharedPreferences.getInstance();
        final dynamic extractedUserData = json.decode(prefs.getString("userData").toString());
        _token = extractedUserData["token"];
        final response = await http.post(url,body:json.encode(responseBody),
        headers:{'Content-Type': 'application/json','Authorization':'Bearer ${_token}'} );

        Map<String, dynamic> responseData = json.decode(response.body);
        if (responseData['status'] == false) {
          // userProfileMessage = responseData["message_type"];
          notifyListeners();
     
          //throwing error message, this will handle in profile widgets
          throw HttpException(response.body);
        } else if (responseData['status'] == true) {
          userUpdatePasswordMessage = "Password updated, successfully!";
     
          //make the cart empty promptly
          // userProfileMessage = responseData["message"];
          notifyListeners();
        }
    }
    catch(error){
      throw error;
    }
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
    // final expiryDate = DateTime.parse(extractedUserData["expiryDate"]);

    // if (expiryDate.isBefore(DateTime.now())) {
    //   // print("time date has issue " + expiryDate.toIso8601String());
    //   return false;
    // }

    _token = extractedUserData["token"];
    _userId = extractedUserData["userId"];
    // _expiryDate = expiryDate;
    // _autoLogout();
    notifyListeners();

    return true;
  }

  void logout() async {
    _token = "null";
    // _expiryDate = DateTime.now();
    _userId = "null";

    // if (_authTimer != null ) /** || DateTime.now().second.compareTo(_authTimer.tick) >= 0 */{
    //   _authTimer.cancel();
    //   _authTimer = null as Timer;
    //   //_authTimer = Timer(Duration(seconds: DateTime.now().second ),(){});
    // }

    final prefs = await SharedPreferences.getInstance();
    prefs.clear();
    notifyListeners();
  }

  void _autoLogout() {
    count++;
    print("Auth Timer " + count.toString());

    // print(_authTimer);
    // if (_authTimer != null /** || DateTime.now().second.compareTo(_authTimer.tick) >= 0 */) {
    //   _authTimer.cancel();
    //   //_authTimer = Timer(Duration(seconds: DateTime.now().second ),(){});
    // }
    // final timeToExpiry = _expiryDate.difference(DateTime.now()).inSeconds;
    // _authTimer = Timer(Duration(seconds: 3600),logout);
  }

  Future<void> updateCustomerProfile(String userName, userMobile) async {
    final url = Uri.parse(APIURLS.updateUserProfileAPIUrl);

    try {
      final prefs = await SharedPreferences.getInstance();
      final dynamic extractedUserData =
          json.decode(prefs.getString("userData").toString());
      _token = extractedUserData["token"];
      final response = await http.post(url,
          body: json.encode({'name': userName, "mobile": userMobile}),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${_token}'
          });

      Map<String, dynamic> responseData = json.decode(response.body);
      if (responseData['status'] == false) {
        userProfileMessage = responseData["message_type"];
        notifyListeners();
        //throwing error message, this will handle in profile widgets
        throw HttpException(response.body);
      } else if (responseData['status'] == true) {
        userProfileMessage = responseData["message"];
        notifyListeners();
      }
    } catch (error) {
      throw error;
    }
  }

  Future<bool> executeGetProfile() async {
    try {
      await getCustomerProfile();
      return true;
    } catch (error) {
      return false;
    }
  }

  Future<void> getCustomerProfile() async {
    final url = Uri.parse(APIURLS.getUserProfileAPIUrl);
    try {
      //getting token first
      final prefs = await SharedPreferences.getInstance();
      final dynamic extractedUserData =
          json.decode(prefs.getString("userData").toString());
      _token = extractedUserData["token"];
      final response = await http.get(url, headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${_token}'
      });

      Map<String, dynamic> responseData = json.decode(response.body);
      if (responseData['status'] == false) {
        customerProfileData = UserProfile(
            name: "Pending..", email: "Pending..", mobile: "Pending..");
            userProfileHasLoaded = false;
        notifyListeners();

        //throwing error message, this will handle in profile widgets
        throw HttpException(response.body);
      } else if (responseData['status'] == true) {
        
        customerProfileData = UserProfile(
          name: responseData["data"]["name"],
          email: responseData["data"]["email"],
          mobile: responseData["data"]["mobile"],
        );
        userProfileHasLoaded = true;
        notifyListeners();
      }
    } catch (error) {
      throw error;
    }
  }

  Future<void> customerOtpWithPasswordChange(String userEmail, String otpValue,
      String passwordValue, String cPasswordValue) async {
    // final url = Uri.parse('http://10.0.2.2:8000/api/resetpassword');
    final url = Uri.parse(APIURLS.resetPasswordWithOtpAPIUrl);
    try {
      final response = await http.post(url,
          body: json.encode({
            'email': userEmail,
            "otp": otpValue,
            "password": passwordValue,
            "c_password": cPasswordValue
          }),
          headers: {'Content-Type': 'application/json'});

      Map<String, dynamic> responseData = json.decode(response.body);
      if (responseData['status'] == false) {
        //throwing error message, this will handle in sign-up screen widgets
        throw HttpException(response.body);
      } else if (responseData['status'] == true) {
        //if response succeed

        //here from backend there is no data provided
        userEmailAddress = responseData["data"];
        //storing success message to state variable.
        userRegMessage = responseData['message'];
      } else {
        Map<String, dynamic> errorMessage = {
          "message_type": "Unable to registred \n Internal server error!"
        };
        throw HttpException(json.encode(errorMessage));
      }
    } catch (error) {
      throw error;
    }
  }

  void clearUserProfileNotificationMessage() {
    userProfileMessage = "";
  }

  void clearLoginNotificationMessage() {
    userRegMessage = "";
  }

  Future<void> customerForgotPassword(String userEmail) async {
    // final url = Uri.parse('http://10.0.2.2:8000/api/forgotpassword');
    final url = Uri.parse(APIURLS.forgotPasswordAPIurl);

    try {
      final response = await http.post(url,
          body: json.encode({'email': userEmail}),
          headers: {'Content-Type': 'application/json'});

      Map<String, dynamic> responseData = json.decode(response.body);
      if (responseData['status'] == false) {
        //throwing error message, this will handle in sign-up screen widgets
        throw HttpException(response.body);
      } else if (responseData['status'] == true) {
        //if response succeed

        userEmailAddress = responseData["data"]["email"];

        //storing success message to state variable.
        userRegMessage = responseData['message'];

        //telling widget that need to refresh/re-render/re-built, where this function been used.
        notifyListeners();
      } else {
        Map<String, dynamic> errorMessage = {
          "message_type": "Internal server error!"
        };

        throw HttpException(json.encode(errorMessage));
      }
    } catch (error) {
      throw error;
    }
  }

  Future<void> userRegistration(
      String userName, String userEmail, String userPassword) async {
    //This verbs going to send post register to server
    // final url = Uri.parse('http://10.0.2.2:8000/api/register');
    final url = Uri.parse(APIURLS.userRegisterAPIurl);

    try {
      //passing url,body and headers along with request
      final response = await http.post(
        url,
        body: json.encode({
          'name': userName,
          'email': userEmail,
          'password': userPassword,
          'c_password': userPassword
        }),
        headers: {'Content-Type': 'application/json'},
      );

      //Storing the json response in Object
      Map<String, dynamic> responseData = json.decode(response.body);

      //checking if response has error
      if (responseData['status'] == false) {
        _token = "null";
        _userId = "null";
        // _expiryDate = DateTime.now();
        //throwing error message, this will handle in sign-up screen widgets
        throw HttpException(response.body);
      } else if (responseData['status'] == true) {
        //if response succeed
        _token = responseData["data"]["token"];
        print("your token value " + _token);
        _userId = responseData["data"]["name"];
        print("your local id valeu " + _userId);
        // _expiryDate = DateTime.now().add(Duration(seconds: 30));

        //storing data to local storage
        final prefs = await SharedPreferences.getInstance();
        final userData = json.encode({
          'token': _token,
          'userId': _userId,
          // 'expiryDate': _expiryDate.toIso8601String()
        });
        userRegMessage = responseData['message'];
        prefs.setString("userData", userData);

        //telling widget that need to refresh/re-render/re-built, where this function been used.
        notifyListeners();
        // _autoLogout();
      } else {
        _token = "null";
        _userId = "null";
        // _expiryDate = DateTime.now();

        //Generating Unhandle Exception error message
        Map<String, dynamic> errorMessage = {
          "message_type": "Unable to registred"
        };

        throw HttpException(json.encode(errorMessage));
      }
    } catch (error) {
      throw error;
    }
  }
}
