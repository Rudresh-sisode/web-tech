import 'package:flutter_dotenv/flutter_dotenv.dart';

class APIURLS {
  static String Url_Key = dotenv.env['API_URL'] as String;
  //this are private property
  static String _login_url = "login";
  static String _register_url = "register";
  static String _forgot_url = "forgotpassword";
  static String _reset_password_url = "resetpassword";
  static String _get_user_profile = "profile";
  static String _user_profile_data = "update-profile";
  static String _users_all_availble_address = "address";
  static String _order_place_with_token = "place-order";
  static String _add_shipping_address = "address";
  static String _edit_shipping_address = "address";

  static String _order_lisint = "order-listing";
  static String _order_details = "order-details?order_id=";
  static String _delete_shipping_address = "address";
  static String _get_product_detail_by_id = "products";
  static String _product_List = "products";
  static String _sliderImages = "home-sliders";
  static String _home_slider_image = "home-banner-sliders";
  static String _update_user_password = "update-password";

  //with getter you are free to access private properties.
  static String get updateUserPassword{
    return Url_Key + _update_user_password;
  }
  
  static String get getProductList{
    return Url_Key + _product_List;
  }
  
  static String get getHomePageSlider{
    return Url_Key + _home_slider_image;
  }

  static String get getProductDetailsById{
    return Url_Key + _get_product_detail_by_id;
  }
  
  static String get deleteShippingAddress{
    return Url_Key + _delete_shipping_address;
  }

  static String get orderDetails{
    return Url_Key + _order_details;
  }
  
  static String get orderListing{
    return Url_Key + _order_lisint;
  }
  
  static String get editShippingAddress{
    return Url_Key + _edit_shipping_address;
  }

  static String get addShippingAddress{
    return Url_Key + _add_shipping_address;
  }

  static String get orderPlaceWithToken{
    return Url_Key + _order_place_with_token;
  }

  static String get userLoginAPIUrl {
    return Url_Key + _login_url;
  }

  static String get userRegisterAPIurl {
    return Url_Key + _register_url;
  }

  static String get forgotPasswordAPIurl {
    return Url_Key + _forgot_url;
  }

  static String get resetPasswordWithOtpAPIUrl {
    return Url_Key + _reset_password_url;
  }

  static String get getUserProfileAPIUrl {
    return Url_Key + _get_user_profile;
  }

  static String get updateUserProfileAPIUrl{
    return Url_Key + _user_profile_data;
  }

  //below api getter is address's

  static String get getAllAddressDataAPIUrl{
    return Url_Key + _users_all_availble_address;
  }
    static String get getSliderUrl {
    return Url_Key + _sliderImages;
  }
    static String get getPopularProductUrl {
    return Url_Key + _sliderImages;
  }
  
}