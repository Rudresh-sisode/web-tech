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
        title: const Text("Profile"),
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: Body(),
      bottomNavigationBar: BottomMenu(selectedMenu: MenuState.home),
    );
  }
}
