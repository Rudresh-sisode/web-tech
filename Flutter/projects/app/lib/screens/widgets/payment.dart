import 'package:ecomm_app/components/menu/bottom_menu.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/enums.dart';
import 'package:ecomm_app/screens/profile/update_profile_screen.dart';
import 'package:ecomm_app/screens/widgets/success_msg.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class Payment extends StatelessWidget {
  static String routeName = "/payment";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        title: const Text("Payment"),
        centerTitle: true,
        elevation: 0,
        backgroundColor: kPrimaryColor,
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(4),
          child: Column(
            children: [
              // const Divider(),
              const SizedBox(height: 10),
              ListTile(
                leading: Container(
                    decoration: BoxDecoration(
                        color: kPrimaryLightColor.withOpacity(0.1)),
                    child: const Text("123",
                        style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Color.fromARGB(255, 75, 74, 74)))),
                title: TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, SuccessMsg.routeName);
                  },
                  child: const Text(
                    'Pay Now', //title
                  ),
                ),
                // const Text(
                //   'Pay Now',
                //   style: TextStyle(
                //       fontSize: 16, color: Color.fromARGB(255, 75, 74, 74)),
                // ),
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
                    decoration: BoxDecoration(
                      color: kPrimaryLightColor.withOpacity(0.1),
                    ),
                    child: const Text(
                      '123',
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: Color.fromARGB(255, 75, 74, 74)),
                    )),
                title: const Text('Cash On Delivery',
                    style: TextStyle(
                        fontSize: 16, color: Color.fromARGB(255, 75, 74, 74))),
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
    );
  }
}
