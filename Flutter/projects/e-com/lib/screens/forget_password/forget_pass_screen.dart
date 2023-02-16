import 'package:ecomm_app/screens/forget_password/components/body.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/material.dart';

class ForgetPassScreen extends StatelessWidget {
  static String routeName = "/forgetpass";
  @override
  Widget build(BuildContext context) {
    // You have to call it on your starting screen
    SizeConfig().init(context);
    return Scaffold(
      body: Body(),
    );
  }
}
