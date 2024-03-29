import 'package:ecomm_app/components/global_snack_bar.dart';
import 'package:ecomm_app/screens/profile/profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:ecomm_app/components/custom_surfix_icon.dart';
import 'package:ecomm_app/components/default_button.dart';
import 'package:ecomm_app/components/form_error.dart';
import 'package:provider/provider.dart';
import 'dart:convert';
import '../../../const_error_msg.dart';

import '../../../providers/auth.dart';
import '../../../size_config.dart';

class UpdateProfileForm extends StatefulWidget {
  @override
  _UpdateProfileFormState createState() => _UpdateProfileFormState();
}

class _UpdateProfileFormState extends State<UpdateProfileForm> {
  final _formKey = GlobalKey<FormState>();
  String email = "";
  String mobile = "";
  String userName = "";
  // ignore: non_constant_identifier_names
  bool remember = false;
  final List<String?> errors = [];
  var validError = null;

  @override
  void initState() {
    super.initState();

    // isAuth = Provider.of<Auth>(context,listen: false).isAuth;

    print("body init printed");
    email = Provider.of<Auth>(context, listen: false).customerProfileData.email;
    userName =
        Provider.of<Auth>(context, listen: false).customerProfileData.name;
    mobile =
        Provider.of<Auth>(context, listen: false).customerProfileData.mobile;

    // Provider.of<Auth>(context,listen: false).getCustomerProfile();
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

  Future<void> _updateProfile() async {
    try {
      await Provider.of<Auth>(context, listen: false)
          .updateCustomerProfile(userName, mobile);
      Navigator.pop(context);
      // ignore: use_build_context_synchronously
      // Navigator.pushNamed(context, ProfileScreen.routeName);
      Navigator.pushReplacementNamed(context, ProfileScreen.routeName);
    } on FormatException catch (_, error) {
      _showErrorDialog(error.toString());
    } catch (error) {
      Map<String, dynamic> errorRes = json.decode(error.toString());
      Map<String, dynamic> errorMessage = {};
      if (errorRes["message"] is String) {
        _showErrorDialog(errorRes["message"]);
      } else if (errorRes["message"] is Map<String, dynamic>) {
        errorMessage = errorRes["message"];
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
    }
  }

  @override
  Widget build(BuildContext context) {
    // Map<String,String> profileData = Provider.of<Auth>(context).customerProfileData;

    return Form(
      key: _formKey,
      child: Column(
        children: [
          SizedBox(
            height: MediaQuery.of(context).size.width * 0.05,
          ),
          Container(
            padding: EdgeInsets.fromLTRB(12, 0, 12, 0),
            margin: EdgeInsets.only(
              left: MediaQuery.of(context).size.width * 0.01,
              right: MediaQuery.of(context).size.width * 0.01,
            ),
            child: buildNameFormField(),
          ),
          // SizedBox(height:30),
          SizedBox(
            height: MediaQuery.of(context).size.width * 0.1,
          ),
          Container(
            padding: EdgeInsets.fromLTRB(12, 0, 12, 0),
            margin: EdgeInsets.only(
              left: MediaQuery.of(context).size.width * 0.01,
              right: MediaQuery.of(context).size.width * 0.01,
            ),
            child: buildEmailFormField(),
          ),

          // SizedBox(height: 30),
          SizedBox(
            height: MediaQuery.of(context).size.width * 0.1,
          ),
          Container(
            padding: EdgeInsets.fromLTRB(12, 0, 12, 0),
            margin: EdgeInsets.only(
              left: MediaQuery.of(context).size.width * 0.01,
              right: MediaQuery.of(context).size.width * 0.01,
            ),
            child: buildMobileFormField(),
          ),

          Container(
            padding: EdgeInsets.fromLTRB(12, 0, 12, 0),
            margin: EdgeInsets.only(
              left: MediaQuery.of(context).size.width * 0.01,
              right: MediaQuery.of(context).size.width * 0.01,
            ),
            child: FormError(errors: errors),
          ),
          // SizedBox(height: 40),
          SizedBox(
            height: MediaQuery.of(context).size.width * 0.2,
          ),

          SizedBox(
              width: 200,
              child: ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    _formKey.currentState!.save();
                    // if all are valid then go to success screen
                    _updateProfile();
                    // GlobalSnackBar.show(context, 'Profile update successful');
                    // ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    //   content: Text('Profile updated successfully'),
                    // ));
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: kPrimaryColor,
                ),
                child: const Text('Update Profile'),
              )),

       
        ],
      ),
    );
  }

  TextFormField buildMobileFormField() {
    return TextFormField(
      initialValue: mobile,
      onSaved: (newValue) => mobile = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
           setState(() {
            validError = null;
          });
        }
       
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return kPhoneNumberNullError;
        }
        if(value.length < 9 || value.length > 11)
        {
          return "Please enter 10 digit number.";
        }
        return null;
      },
      decoration: InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "Mobile",
        hintText: "Enter your mobile",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }



  TextFormField buildNameFormField() {
    return TextFormField(
      initialValue: userName,
      onSaved: (newValue) => userName = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            validError = null;
          });
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
         
          return kNamelNullError;
        }
        return null;
      },
      decoration: InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "Name",
        hintText: "Enter your name",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildEmailFormField() {
    return TextFormField(
      initialValue: email,
      keyboardType: TextInputType.emailAddress,
      onSaved: (newValue) => email = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
             setState(() {
            validError = null;
          });
        } 
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return kEmailNullError;
        } else if (!emailValidatorRegExp.hasMatch(value)){
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
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }
}
