import 'package:ecomm_app/components/global_snack_bar.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/product_listing_widget.dart';
import 'package:ecomm_app/screens/forget_password/forget_pass_screen.dart';
import 'package:flutter/material.dart';
import 'package:ecomm_app/components/custom_surfix_icon.dart';
import 'package:ecomm_app/components/form_error.dart';
import 'package:ecomm_app/components/keyboard.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
// import 'package:shop_app/screens/forgot_password/forgot_password_screen.dart';
// import 'package:shop_app/screens/login_success/login_success_screen.dart';
import 'package:provider/provider.dart';
import 'dart:convert';

import '../../../providers/auth-checker.dart';
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
  final TextEditingController emailController = TextEditingController(
    text: "rudresh.sisodiya@gunadhyasoft.com",
  );
  final TextEditingController passwordController =
      TextEditingController(text: "Qwerty@123");
  final _emailFocusNode = FocusNode();
  final _passwordFocusNode = FocusNode();
  bool _obscureText = true;
  bool _isLoading = false;

  String? email;
  String? password;
  bool? remember = false;
  final List<String?> errors = [];
 
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
      setState(() {
        _isLoading = true;
      });

    try {
      
      await Provider.of<AuthChecker>(context, listen: false)
          .login(emailController.text, passwordController.text);
         setState(() {
        _isLoading = false;
      });

      if (Provider.of<AuthChecker>(context, listen: false).isAuth) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => ProductListingWidget()),
          (route) => false,
        );
      }
    } on FormatException catch (_, error) {
      setState(() {
        _isLoading = false;
      });
      _showErrorDialog(error.toString());
    } catch (error) {
      setState(() {
        _isLoading = false;
      }); 
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
              GestureDetector(
                onTap: () {
                  Provider.of<AuthChecker>(context,listen: false).doesUserHadTour = true;
                   Navigator.pop(context);
                   Navigator.pushNamed(context,ProductListingWidget.routeName);
                },
                   
                child: Text(
                  "Continue without login",
                  style: TextStyle(decoration: TextDecoration.underline),
                ),
              ),
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
          //loading logic here, with button disable
          _isLoading ? 
          Center(
                  child: 
                  CircularProgressIndicator(color: kPrimaryColor,)
                  // Container(
                  //     height: MediaQuery.of(context).size.height * 0.2,
                  //     width: 60,
                  //     child: SpinKitCubeGrid(
                  //       color: kPrimaryColor,
                  //     ),
                  //     ),
                ) :
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
        labelStyle: TextStyle(
          color: kPrimaryColor, //<-- SEE HERE
        ),
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
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
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
