import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/screens/profile/components/body.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../app_theme.dart';
import '../../components/menu/bottom_menu.dart';
import '../../enums.dart';
import '../../providers/bottom-menu.dart';

class ProfileScreen extends StatelessWidget {
  static String routeName = "/profile";
  final scaffoldKey = GlobalKey<ScaffoldState>();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      appBar: 
      AppBar(
          
          backgroundColor: kPrimaryColor,
        automaticallyImplyLeading: false,
        leading: InkWell(
          onTap: ()  {
            // Provider.of<BottomMenuHandler>(context,listen: false).backToParentValue();
            print("${Provider.of<BottomMenuHandler>(context,listen: false).currentValue}");
            Navigator.pop(context,true);
          },
          child: Icon(
            Icons.arrow_back_rounded,
            color: Color.fromARGB(255, 253, 253, 253),
            size: 24,
          ),
        ),
        title: Text(
          'Profile',
          style: AppTheme.of(context).subtitle2.override(
                fontFamily: 'Lexend Deca',
                color: Color.fromARGB(255, 253, 253, 253),
                fontSize: 20,
                fontWeight: FontWeight.w500,
              ),
        ),
        centerTitle: true,
         
        ),
      // AppBar(
      //   automaticallyImplyLeading: false,
      //   leading: InkWell(
      //     onTap: () async {
      //       // Provider.of<BottomMenuHandler>(context,listen: false).backToParentValue();
      //       Navigator.pop(context);
      //     },
      //     // child: Icon(
      //     //   Icons.arrow_back_rounded,
      //     //   color: Color.fromARGB(255, 253, 253, 253),
      //     //   size: 24,
      //     // ),
      //   ),
      //   // iconTheme: const IconThemeData(
      //   //   color: kAppBarColor, //change your color here
      //   // ),
      //   title: const Text("Profile", style: TextStyle(color: kAppBarColor)),
      //   centerTitle: true,
      //   backgroundColor: kPrimaryColor,
      //    elevation: 0,
      // ),
      body: Body(),
      bottomNavigationBar:  BottomMenu(),
    );
  }
}
