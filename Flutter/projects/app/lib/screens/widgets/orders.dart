import 'package:ecomm_app/components/menu/bottom_menu.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/enums.dart';
import 'package:ecomm_app/screens/profile/update_profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class Orders extends StatelessWidget {
  static var routeName = "orders";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        title: const Text("Oreders"),
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(4),
          child: Column(
            children: [
              ListTile(
                leading: Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(100),
                        color: kPrimaryColor.withOpacity(0.1)),
                    // child:  Icon: SvgPicture.asset("assets/icons/Cart.svg"),
                    child: Image.asset('assets/images/logo1.jpg')),
                title: const Text(
                  'Bag',
                  style: TextStyle(
                      fontSize: 12, color: Color.fromARGB(255, 75, 74, 74)),
                ),
                trailing: Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(100),
                      color: kPrimaryColor.withOpacity(0.1)),
                  child: SvgPicture.asset("assets/icons/arrow_right.svg"),
                ),
              ),
              ListTile(
                leading: Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(100),
                        color: kPrimaryColor.withOpacity(0.1)),
                    // child:  Icon: SvgPicture.asset("assets/icons/Cart.svg"),
                    child: Image.asset('assets/images/logo1.jpg')),
                title: const Text('T shirt',
                    style: TextStyle(
                        fontSize: 12, color: Color.fromARGB(255, 75, 74, 74))),
                trailing: Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(100),
                      color: kPrimaryColor.withOpacity(0.1)),
                  child: SvgPicture.asset("assets/icons/arrow_right.svg"),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomMenu(selectedMenu: MenuState.home),
    );
  }
}
