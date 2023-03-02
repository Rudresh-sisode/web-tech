import 'package:ecomm_app/components/default_button.dart';
import 'package:ecomm_app/components/form_error.dart';
import 'package:ecomm_app/components/global_snack_bar.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/product_listing_widget.dart';
// import 'package:ecomm_app/screens/home/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'dart:convert';

import '../../../providers/auth.dart';
import '../../auth/auth_screen.dart';

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Scaffold(
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        title: const Text("OTP"),
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: SingleChildScrollView(
        padding:
            EdgeInsets.symmetric(horizontal: getProportionateScreenWidth(20)),
        child: Column(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(top: 60.0),
              child: Center(
                child: SizedBox(
                    width: 300,
                    height: 150,
                    child: Image.asset('assets/images/G-Store.png')),
              ),
            ),
            SizedBox(height: getProportionateScreenHeight(30)),
            OtpFrom()
            // const Padding(
            //   padding:
            //       EdgeInsets.only(left: 16.0, right: 15.0, top: 15, bottom: 0),
            //   //padding: EdgeInsets.symmetric(horizontal: 15),
            //   child: TextField(
            //     obscureText: true,
            //     decoration: InputDecoration(
            //         contentPadding: EdgeInsets.all(12.0),
            //         border: OutlineInputBorder(),
            //         labelText: 'OTP',
            //         hintText: 'Enter otp number'),
            //   ),
            // ),
            // SizedBox(height: getProportionateScreenHeight(20)),
            // Container(
            //   height: 50,
            //   width: 360,
            //   decoration: BoxDecoration(
            //       color: Colors.blue, borderRadius: BorderRadius.circular(20)),
            //   child: DefaultButton(
            //     text: "Submit",
            //     press: () {
            //       Navigator.pushNamed(context, ProductListingWidget.routeName);
            //     },
            //     // child: const Text('null'),
            //   ),
            // ),
          ],
        ),
      ),
    );
  }
}

// class OtpFrom extends Body {}

class OtpFrom extends StatefulWidget {
  @override
  _OtpFromState createState() => _OtpFromState();
}

class _OtpFromState extends State<OtpFrom> {
  final _formKey = GlobalKey<FormState>();
  String otp="";
  String password="";
  String c_password = "";

  final List<String?> errors = [];

    void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Error!'),
        content: Text(message),
        actions: <Widget>[
          TextButton(
              onPressed: () {
                Navigator.of(ctx).pop();
              },
              child: Text("Okey"))
        ],
      ),
    );
  }

  Future<void> _submitUserOTP_Password() async {
    try {
      
      await Provider.of<Auth>(context, listen: false)
      .customerOtpWithPasswordChange(Provider.of<Auth>(context,listen: false).userEmailAddress, otp, password, c_password);
      Navigator.pop(context);
      Navigator.pushNamed(context, AuthScreen.routeName);
    } catch (error) {
      if (error.runtimeType == FormatException) {
        if (error is Map<String, dynamic>) {
          _showErrorDialog(error['message']);
        }
      } else {
        Map<String, dynamic> errorRes = json.decode(error.toString());
        Map<String, dynamic> errorMessage = errorRes["message"];

        Map<String, String> newErrorMessage = {};
        errorMessage.forEach((key, value) {
          // for (int i = 0; i < value.length; i++) {
            newErrorMessage[key] = value;
          // }
        });

         String finalEmailErrorMessage = newErrorMessage.containsKey("Error") ? newErrorMessage["Error"].toString() :
          newErrorMessage.containsKey("email") ? newErrorMessage["email"].toString() : "";
      String finalPasswordErrorMessage = newErrorMessage.containsKey("c_password")
          ? newErrorMessage["c_password"].toString()
          : "";

      String finalErrorMessage = finalEmailErrorMessage.isNotEmpty
          ? finalEmailErrorMessage
          : finalPasswordErrorMessage.isNotEmpty
              ? finalPasswordErrorMessage
              : errorRes["message_type"];

      _showErrorDialog(finalErrorMessage);
      }
    }
  }

  void addError({String? error}) {
    if (!errors.contains(error))
      setState(() {
        errors.add(error);
      });
  }

  void removeError({String? error}) {
    if (errors.contains(error))
      setState(() {
        errors.remove(error);
      });
  }

  @override
  Widget build(BuildContext context) {
    // final otpMessage = Provider.of<Auth>(context, listen: true).userRegMessage;
    return Form(
      key: _formKey,
      child: Column(
        children: [
          buildOtpFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildPasswordFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildConfirmPasswordFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          FormError(errors: errors),
          SizedBox(height: getProportionateScreenHeight(20)),
          DefaultButton(
            text: "Continue",
            press: () {
              if (_formKey.currentState!.validate()) {
                var st = _formKey.currentState!.validate();
                _formKey.currentState!.save();
                // GlobalSnackBar.show(context, otpMessage);
                _submitUserOTP_Password();
              }
            },
          ),
        ],
      ),
    );
  }

  TextFormField buildOtpFormField() {
    return TextFormField(
      
      keyboardType: TextInputType.visiblePassword,
      onSaved: (newValue) => otp = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          removeError(error: kOtpStrick);
        }
        return null;
      },
      inputFormatters: [
          FilteringTextInputFormatter.digitsOnly
        ],
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kOtpStrick);
          return "";
        }
        else if(value.length != 6){
          addError(error: kOtpStrick);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        border: OutlineInputBorder(),
        labelText: "Otp",
        hintText: "Enter your Otp",
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildPasswordFormField() {
    return TextFormField(
      obscureText: true,
      keyboardType: TextInputType.visiblePassword,
      onSaved: (newValue) => password = newValue.toString(),
      onChanged: (value) {
        password = value;
        if (value.isNotEmpty) {
          removeError(error: kShortPassError);
        }
        return null;
      },
     
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kFieldEmpty);
          return "";
        }
        else if(value.length <= 6){
          addError(error: kShortPassError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        border: OutlineInputBorder(),
        labelText: "Password",
        hintText: "Enter your New Password.",
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildConfirmPasswordFormField() {
    return TextFormField(
      obscureText: true,
      keyboardType: TextInputType.visiblePassword,
      onSaved: (newValue) => c_password = newValue.toString(),
      onChanged: (value) {
        c_password = value;
        if (value.isNotEmpty) {
          removeError(error: kMatchPassError);
        }
        return null;
      },
    
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kFieldEmpty);
          return "";
        }
        else if(value.length <= 6){
          addError(error: kShortPassError);
          return "";
        }
        else if(password != value){
          print("not match");
          addError(error:kMatchPassError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        border: OutlineInputBorder(),
        labelText: "Confirm Password",
        hintText: "Confirm your password here.",
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }
}
