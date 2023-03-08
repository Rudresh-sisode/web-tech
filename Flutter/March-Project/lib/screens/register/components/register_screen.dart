import 'package:ecomm_app/const_error_msg.dart';
import 'package:flutter/material.dart';

import '../../register/components/body.dart';

class RegisterScreen extends StatelessWidget {
  static String routeName = "/register";
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: const IconThemeData(
          color: kAppBarColor, //change your color here
        ),
        title: const Text("Sign up", style: TextStyle(color: kAppBarColor)),
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: Body(),
    );
  }
}
