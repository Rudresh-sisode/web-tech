import 'package:ecomm_app/components/default_button.dart';
import 'package:ecomm_app/components/form_error.dart';
import 'package:ecomm_app/components/global_snack_bar.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/product_listing_widget.dart';
// import 'package:ecomm_app/screens/home/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:provider/provider.dart';
import 'dart:convert';

import '../../../providers/auth.dart';
import '../../otp/otp_screen.dart';

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Scaffold(
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        title: const Text("Forgot password"),
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: SingleChildScrollView(
        padding:
            EdgeInsets.symmetric(horizontal: getProportionateScreenWidth(20)),
        child: Column(
          children: <Widget>[
            SizedBox(height: getProportionateScreenHeight(20)),
            Padding(
              padding: const EdgeInsets.only(top: 60.0),
              child: Center(
                child: SizedBox(
                    width: 150,
                    height: 100,
                    child: Image.asset('assets/images/G-Store.png')),
              ),
            ),
            SizedBox(height: getProportionateScreenHeight(50)),
            ForgetFrom()
          ],
        ),
      ),
    );
  }
}

// class OtpFrom extends Body {}

class ForgetFrom extends StatefulWidget {
  @override
  _ForgetFromState createState() => _ForgetFromState();
}

class _ForgetFromState extends State<ForgetFrom> {
  final _formKey = GlobalKey<FormState>();
  String email = "";
  bool successStage = false;

  final List<String?> errors = [];

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

  Future<void> _submitUserForgotPassword() async {
    try {
      await Provider.of<Auth>(context, listen: false)
          .customerForgotPassword(email);
      // successStage = true;
      Navigator.pushNamed(context, OtpScreen.routeName);
    } on FormatException catch (_, error){
       _showErrorDialog(error.toString());
    } catch (error) {
      
      Map<String, dynamic> errorRes = json.decode(error.toString());
      Map<String, dynamic> errorMessage = errorRes["message"];

      Map<String, String> newErrorMessage = {};
      errorMessage.forEach((key, value) {
        for (int i = 0; i < value.length; i++) {
          newErrorMessage[key] = value[i];
        }
      });

      String finalEmailErrorMessage = newErrorMessage.containsKey("email")
          ? newErrorMessage["email"].toString()
          : "";

      String finalErrorMessage = finalEmailErrorMessage.isNotEmpty
          ? finalEmailErrorMessage
          : errorRes["message_type"];

      _showErrorDialog(finalErrorMessage);
    
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          buildEmailFormField(),
          FormError(errors: errors),
          SizedBox(height: getProportionateScreenHeight(30)),
          DefaultButton(
            text: "Continue",
            press: () {
              if (_formKey.currentState!.validate()) {
                _formKey.currentState!.save();
                _submitUserForgotPassword();
                // successStage ? Navigator.pushNamed(context, OtpScreen.routeName) : "" ;
              }
            },
          ),
        ],
      ),
    );
  }

  TextFormField buildEmailFormField() {
    return TextFormField(
      keyboardType: TextInputType.emailAddress,
      onSaved: (newValue) => email = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          removeError(error: kEmailNullError);
        } else if (emailValidatorRegExp.hasMatch(value)) {
          removeError(error: kInvalidEmailError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kEmailNullError);
          return "";
        } else if (!emailValidatorRegExp.hasMatch(value)) {
          addError(error: kInvalidEmailError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        border: OutlineInputBorder(),
        labelText: "Email/Email",
        hintText: "Enter your email/Mobile",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }
}
