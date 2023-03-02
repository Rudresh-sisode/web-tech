import 'package:ecomm_app/components/default_button.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/screens/auth/auth_screen.dart';
import 'package:ecomm_app/screens/profile/components/update_profile_form.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/material.dart';

import '../../components/menu/bottom_menu.dart';
import '../../enums.dart';

class UpdateprofileScreen extends StatelessWidget {
  static String routeName = "/updateprofile";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        title: const Text("Update profile"),
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: SingleChildScrollView(
        padding:
            EdgeInsets.symmetric(horizontal: getProportionateScreenWidth(30),
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
            UpdateProfileForm(),
          ],
        ),
      ),
      bottomNavigationBar: BottomMenu(selectedMenu: MenuState.home),
    );
  }
}
