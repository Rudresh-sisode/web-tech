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

class UpdatePassForm extends StatefulWidget {
  @override
  _UpdatePassFormState createState() => _UpdatePassFormState();
}

class _UpdatePassFormState extends State<UpdatePassForm> {
  final _formKey = GlobalKey<FormState>();
  String password = "Kedar@123";
  String newPassword = "Kedar@123xyz";
  String confirmPassword = "Kedar@123xyz";
  var conformPasswordError = null;
  // ignore: non_constant_identifier_names
  bool remember = false;
  final List<String?> errors = [];
  bool _autoValid = false;

  @override
  void initState() {
    super.initState();
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

  Future<void> _updatePassword() async {
    if (password.length < 8 ||
        newPassword.length < 8 ||
        confirmPassword.length < 8) {
      print("All passwords must be more than 8 characters long");
      return;
    }

    if (newPassword != confirmPassword) {
      print("New password and confirm password must match");
      return;
    }

    RegExp specialChars = RegExp(r'[!@#%^&*(),.?":{}|<>]');
    RegExp capitalLetters = RegExp(r'[A-Z]');
    RegExp numbers = RegExp(r'[0-9]');

    if (!specialChars.hasMatch(password) ||
        !capitalLetters.hasMatch(password) ||
        !numbers.hasMatch(password)) {
      GlobalSnackBar.show(context,
          "Password must contain at least one special character, one capital letter, and one number");
      print(
          "Password must contain at least one special character, one capital letter, and one number");
      return;
    }

    if (!specialChars.hasMatch(newPassword) ||
        !capitalLetters.hasMatch(newPassword) ||
        !numbers.hasMatch(newPassword)) {
      GlobalSnackBar.show(context,
          "New password must contain at least one special character, one capital letter, and one number");

      print(
          "New password must contain at least one special character, one capital letter, and one number");
      return;
    }

    if (!specialChars.hasMatch(confirmPassword) ||
        !capitalLetters.hasMatch(confirmPassword) ||
        !numbers.hasMatch(confirmPassword)) {
      GlobalSnackBar.show(context,
          "Confirm password must contain at least one special character, one capital letter, and one number");

      print(
          "Confirm password must contain at least one special character, one capital letter, and one number");
      return;
    }

    try {
      await Provider.of<Auth>(context, listen: false)
          .updateuserPassword(password, newPassword, confirmPassword);
      GlobalSnackBar.show(context,
          Provider.of<Auth>(context, listen: false).userUpdatePasswordMessage);
      Provider.of<Auth>(context, listen: false).userUpdatePasswordMessage = "";
      Navigator.pop(context);
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

        String finalEmailErrorMessage = newErrorMessage.containsKey("Error")
            ? newErrorMessage["Error"].toString()
            : newErrorMessage.containsKey("c_password")
                ? newErrorMessage["c_password"].toString()
                : newErrorMessage.containsKey("old_password")
                    ? newErrorMessage["old_password"].toString()
                    : "";
        String finalPasswordErrorMessage =
            newErrorMessage.containsKey("password")
                ? newErrorMessage["password"].toString()
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
            child: buildCurrentFormField(),
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
            child: buildNewFormField(),
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
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                buildConfirmFormField(),
                //  Text(
                //   "error occurred",
                //   style: TextStyle(
                //     color: Colors.red, // set text color to red
                //   ),
                // ),
              ],
            ),
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
                onPressed: () async {
                  if (_formKey.currentState!.validate()) {
                    _formKey.currentState!.save();
                    await _updatePassword();
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: kPrimaryColor,
                ),
                child: const Text('Update Password'),
              )),
        ],
      ),
    );
  }

  TextFormField buildCurrentFormField() {
    return TextFormField(
      initialValue: password,
      obscureText: true,
      onSaved: (newValue) => password = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            conformPasswordError = null;
          });
        } else if (value.length < 8) {
          setState(() {
            conformPasswordError = null;
          });
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return "value shouldn't be empty";
        } else if (value.length < 8) {
          return "At least have 8 character password";
        }
        return null;
      },
      decoration: InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "Current password",
        hintText: "Enter your Current password",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildNewFormField() {
    return TextFormField(
      initialValue: newPassword,
      obscureText: true,
      onSaved: (newValue) => newPassword = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            conformPasswordError = null;
          });
        } else if (value.length >= 8) {
          setState(() {
            conformPasswordError = null;
          });
        } else if (value == confirmPassword) {
          setState(() {
            conformPasswordError = null;
          });
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return "value shouldn't be empty";
        } else if (value.length < 8) {
          return "At least have 8 character password";
        } else if (value != confirmPassword) {
          return "New password doesn't match with confirm password!";
        }
        return conformPasswordError;
      },
      decoration: InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "New password",
        hintText: "Enter your new password",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildConfirmFormField() {
    return TextFormField(
      initialValue: confirmPassword,
      obscureText: true,
      onSaved: (newValue) => confirmPassword = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            conformPasswordError = null;
          });
          // confirmPassword
        } else if (value.length >= 8) {
          setState(() {
            conformPasswordError = null;
          });
        } else if (value == newPassword) {
          setState(() {
            conformPasswordError = null;
          });
        }
        return conformPasswordError;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return "value shouldn't be empty";
        } else if (value.length < 8) {
          return "At least have 8 character password";
        } else if (value != newPassword) {
          return "New password doesn't match with confirm password!";
        }
        return conformPasswordError;
      },
      decoration: InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "Confirm password*",
        hintText: "Re-enter your new password",
        floatingLabelBehavior: FloatingLabelBehavior.always,
        // er
      ),
    );
  }
}
