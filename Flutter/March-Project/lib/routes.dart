import 'package:ecomm_app/checkout_widget.dart';
import 'package:ecomm_app/product_listing_widget.dart';
import 'package:ecomm_app/screens/category/category.dart';
import 'package:ecomm_app/screens/forget_password/forget_pass_screen.dart';
import 'package:ecomm_app/screens/location/loaction.dart';
// import 'package:ecomm_app/screens/home/components/product_list.dart';
// import 'package:ecomm_app/screens/home/components/product_screen.dart';
import 'package:ecomm_app/screens/otp/otp_screen.dart';
import 'package:ecomm_app/screens/profile/profile_screen.dart';
import 'package:ecomm_app/screens/profile/update_pass_screen.dart';
import 'package:ecomm_app/screens/profile/update_profile_screen.dart';
import 'package:ecomm_app/screens/register/components/register_screen.dart';
import 'package:ecomm_app/screens/widgets/orderDetails.dart';
import 'package:ecomm_app/screens/widgets/orders.dart';
import 'package:ecomm_app/screens/widgets/payment.dart';
import 'package:ecomm_app/screens/widgets/search.dart';
import 'package:ecomm_app/screens/widgets/shipping.dart';
import 'package:ecomm_app/screens/widgets/success_msg.dart';
import 'package:flutter/widgets.dart';
// import 'package:ecomm_app/screens/home/home_screen.dart';
import 'package:ecomm_app/screens/splash/splash_screen.dart';
import 'package:ecomm_app/screens/auth/auth_screen.dart';

import 'screens/wishlist/wishlist.dart';
import 'screens/wishlist/wishlist.dart';

// import 'screens/sign_up/sign_up_screen.dart';

// We use name route
// All our routes will be available here
final Map<String, WidgetBuilder> routes = {
  SplashScreen.routeName: (context) => SplashScreen(),
  // HomeScreen.routeName: (context) => HomeScreen(),
  AuthScreen.routeName: (context) => AuthScreen(),
  RegisterScreen.routeName: (context) => RegisterScreen(),
  OtpScreen.routeName: (context) => OtpScreen(),
  ProfileScreen.routeName: (context) => ProfileScreen(),
  UpdateprofileScreen.routeName: (context) => UpdateprofileScreen(),
  ForgetPassScreen.routeName: (context) => ForgetPassScreen(),
  // ProductList.routeName: (context) => ProductList(),
  // ProductScreen.routeName: (context) => ProductScreen(),
  ProductListingWidget.routeName: (context) => ProductListingWidget(),
  Shipping.routeName: (context) => Shipping(),
  Payment.routeName: (context) => Payment(),
  CheckoutWidget.routeName: (context) => CheckoutWidget(),
  Orders.routeName: (context) => Orders(),
  SuccessMsg.routeName: (context) => SuccessMsg(),
  OrderDetails.routeName: (context) => OrderDetails(),
  UpdateppassScreen.routeName: (context) => UpdateppassScreen(),
  Category.routeName: (context) => Category(),
  Wishlist.routeName: (context) => Wishlist(),
  Location.routeName: (context) => Location(),
  Search.routeName: (context) => Search(),
};
