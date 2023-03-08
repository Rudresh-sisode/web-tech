import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/screens/profile/components/body.dart';
import 'package:flutter/material.dart';

import '../../components/menu/bottom_menu.dart';
import '../../enums.dart';

class ProfileScreen extends StatelessWidget {
  static String routeName = "/profile";
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: const IconThemeData(
          color: kAppBarColor, //change your color here
        ),
        title: const Text("Profile", style: TextStyle(color: kAppBarColor)),
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: Body(),
      bottomNavigationBar: const BottomMenu(selectedMenu: MenuState.home),
    );
  }
}
