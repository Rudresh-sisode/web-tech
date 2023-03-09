import 'package:ecomm_app/components/global_snack_bar.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/product_listing_widget.dart';
import 'package:ecomm_app/screens/forget_password/forget_pass_screen.dart';
import 'package:flutter/material.dart';
import 'package:ecomm_app/components/custom_surfix_icon.dart';
import 'package:ecomm_app/components/form_error.dart';
import 'package:ecomm_app/components/keyboard.dart';
// import 'package:shop_app/screens/forgot_password/forgot_password_screen.dart';
// import 'package:shop_app/screens/login_success/login_success_screen.dart';
import 'package:provider/provider.dart';
import 'dart:convert';

import '../../../providers/auth.dart';
import '../../../models/http_exception.dart';
import '../../../components/default_button.dart';
import '../../../size_config.dart';

class SignForm extends StatefulWidget {
  @override
  _SignFormState createState() => _SignFormState();
}

class _SignFormState extends State<SignForm> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController(text:"kedar.ahirrao@gunadhyasoft.com",);
  final TextEditingController passwordController = TextEditingController(text: "Kedar@123");
  final _emailFocusNode = FocusNode();
  final _passwordFocusNode = FocusNode();
  bool _obscureText = true;

  String? email;
  String? password;
  bool? remember = false;
  final List<String?> errors = [];
  var _isLoading = false;
  var validError = null;

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Error'),
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

  Future<void> _submitLogin() async {
    try {
      await Provider.of<Auth>(context, listen: false)
          .login(emailController.text, passwordController.text);
          if(Provider.of<Auth>(context,listen: false).isAuth){
              Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => ProductListingWidget()),
              (route) => false,
            );
          }

    }
    on FormatException catch (_, error){
       _showErrorDialog(error.toString());
    }
     catch (error) {
      
      Map<String, dynamic> errorRes = json.decode(error.toString());
      Map<String, dynamic> errorMessage = errorRes["message"];

      Map<String, String> newErrorMessage = {};
      errorMessage.forEach((key, value) {
        // for (int i = 0; i < value.length; i++) {
        newErrorMessage[key] = value;
        // }
      });

      String finalEmailErrorMessage = newErrorMessage.containsKey("error")
          ? newErrorMessage["error"].toString()
          : newErrorMessage.containsKey("email")
              ? newErrorMessage["email"].toString()
              : "";
      String finalPasswordErrorMessage =
          newErrorMessage.containsKey("c_password")
              ? newErrorMessage["c_password"].toString()
              : "";

      String finalErrorMessage = finalEmailErrorMessage.isNotEmpty
          ? finalEmailErrorMessage
          : finalPasswordErrorMessage.isNotEmpty
              ? finalPasswordErrorMessage
              : errorRes["message_type"];

      _showErrorDialog(finalErrorMessage);
    }
    // setState(() {
    //   _isLoading = false;
    // });
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          buildEmailFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildPasswordFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          Row(
            children: [
              // Checkbox(
              //   value: remember,
              //   activeColor: kPrimaryColor,
              //   onChanged: (value) {
              //     setState(() {
              //       remember = value;
              //     });
              //   },
              // ),
              // Text("Remember me"),
              Spacer(),
              GestureDetector(
                onTap: () =>
                    Navigator.pushNamed(context, ForgetPassScreen.routeName),
                child: Text(
                  "Forgot Password",
                  style: TextStyle(decoration: TextDecoration.underline),
                ),
              ),
            ],
          ),
          FormError(errors: errors),
          SizedBox(height: getProportionateScreenHeight(20)),
          DefaultButton(
            text: "Continue",
            press: () {
              FocusScope.of(context).unfocus();
              if (_formKey.currentState!.validate()) {
                _formKey.currentState!.save();
                
                // if all are valid then go to success screen
                // KeyboardUtil.hideKeyboard(context);
                _submitLogin();
                KeyboardUtil.hideKeyboard(context);
                // GlobalSnackBar.show(context, 'Login successful',);
                // Navigator.pushNamed(context, ProductListingWidget.routeName);
              }
            },
          ),
        ],
      ),
    );
  }

  TextFormField buildPasswordFormField() {
    return TextFormField(
      controller: passwordController,
      focusNode: _passwordFocusNode,
      obscureText: _obscureText,
      onSaved: (newValue) => password = newValue,
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            validError = null;
          });
        } else if (value.length >= 8) {
           setState(() {
            validError = null;
          });
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
        
          return kPassNullError;
        } else if (value.length < 8) {
          
          return kShortPassError;
        }
        return null;
      },
      decoration: InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        border: OutlineInputBorder(),
        labelText: "Password",
        hintText: "Enter your password",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
        // suffixIcon: CustomSurffixIcon(svgIcon: "assets/icons/Lock.svg"),
        suffixIcon: IconButton(
          icon: Icon(
            _obscureText ? Icons.visibility : Icons.visibility_off,
          ),
          onPressed: () {
            setState(() {
              _obscureText = !_obscureText;
            });
          },
        ),
      ),
    );
  }

  TextFormField buildEmailFormField() {
    return TextFormField(
      focusNode: _emailFocusNode,
      controller: emailController,
      keyboardType: TextInputType.emailAddress,
      onSaved: (newValue) => email = newValue,
      onChanged: (value) {
        if (value.isNotEmpty) {
           setState(() {
            validError = null;
          });
        } else if (emailValidatorRegExp.hasMatch(value)) {
          setState(() {
            validError = null;
          });
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          
          return kEmailNullError;
        } else if (!emailValidatorRegExp.hasMatch(value)) {
         
          return kInvalidEmailError;
        }
        return null;
      },
      decoration: InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        border: OutlineInputBorder(),
        labelText: "Email",
        hintText: "Enter your email",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
        suffixIcon: CustomSurffixIcon(svgIcon: "assets/icons/Mail.svg"),
      ),
    );
  }
}
