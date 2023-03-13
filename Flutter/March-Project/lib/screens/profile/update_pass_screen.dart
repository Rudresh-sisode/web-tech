import 'package:ecomm_app/components/default_button.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/screens/auth/auth_screen.dart';
import 'package:ecomm_app/screens/profile/components/update_pass_form.dart';
import 'package:ecomm_app/screens/profile/components/update_profile_form.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/material.dart';

import '../../components/menu/bottom_menu.dart';
import '../../enums.dart';

class UpdateppassScreen extends StatelessWidget {
  static String routeName = "/updateppassword";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        iconTheme: const IconThemeData(
          color: kAppBarColor, //change your color here
        ),
        title: const Text(
          "Update Password",
          style: TextStyle(color: kAppBarColor),
        ),
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(
          horizontal: getProportionateScreenWidth(30),
        ),
        child: Column(
          children: <Widget>[
            SizedBox(
              width: 120,
              height: 120,
              child: Padding(
                padding: EdgeInsets.all(10),
                child: Image(
                  image: AssetImage('assets/images/Profile Image.png'),
                ),
              ),
            ),
            UpdatePassForm(),
          ],
        ),
      ),
      bottomNavigationBar: BottomMenu(),
    );
  }
}
