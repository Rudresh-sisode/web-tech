import 'package:flutter/material.dart';
import 'package:ecomm_app/size_config.dart';

const kPrimaryColor = Color(0xFF713590);
const kFavoriteColor = Color.fromARGB(255, 225, 7, 7);
const kPrimaryLightColor = Color(0xFFFFECDF);
const kAppBarColor = Color.fromARGB(255, 255, 255, 255);
const kPrimaryGradientColor = LinearGradient(
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
  colors: [Color.fromARGB(255, 7, 101, 232), Color.fromARGB(255, 67, 192, 255)],
);
const kSecondaryColor = Color.fromARGB(255, 86, 18, 222);
const kTextColor = Color(0xFF757575);

const kAnimationDuration = Duration(milliseconds: 200);

final headingStyle = TextStyle(
  fontSize: getProportionateScreenWidth(28),
  fontWeight: FontWeight.bold,
  color: Colors.black,
  height: 1.5,
);

const defaultDuration = Duration(milliseconds: 250);

// Form Error
final RegExp emailValidatorRegExp =
    RegExp(r"^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
const String kEmailNullError = "Please Enter your email";
const String kInvalidEmailError = "Please Enter Valid Email";
const String kPassNullError = "Please Enter your Current password";
const String kNewPassNullError = "Please Enter New password";
const String kConfirmPassNullError = "Please Enter Confirm password";
const String kShortPassError = "Password is too short";
const String kMatchPassError = "Passwords don't match";
const String kNamelNullError = "Please Enter your name";
const String kPhoneNumberNullError = "Please Enter your phone number";
const String kAddressNullError = "Please Enter your address";
const String kPincodeNullError = "Please Enter pincode";
const String kCountyNullError = "Please provide country name";
const String kStateNullError = "Please Enter state";
const String kCityNullError = "Please Enter city";
const String kOtpStrick = "Please, Enter six digit OTP!";
const String kFieldEmpty = "Don't leave any field empty";

final otpInputDecoration = InputDecoration(
  contentPadding:
      EdgeInsets.symmetric(vertical: getProportionateScreenWidth(15)),
  border: outlineInputBorder(),
  focusedBorder: outlineInputBorder(),
  enabledBorder: outlineInputBorder(),
);

OutlineInputBorder outlineInputBorder() {
  return OutlineInputBorder(
    borderRadius: BorderRadius.circular(getProportionateScreenWidth(15)),
    borderSide: const BorderSide(color: kTextColor),
  );
}
