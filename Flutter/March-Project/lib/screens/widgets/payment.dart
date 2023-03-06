import 'package:ecomm_app/components/menu/bottom_menu.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/enums.dart';
import 'package:ecomm_app/screens/profile/update_profile_screen.dart';
import 'package:ecomm_app/screens/widgets/success_msg.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import 'dart:convert';

import '../../providers/cart.dart';

class Payment extends StatefulWidget {
  static String routeName = "/payment";

  @override
  State<Payment> createState() => _PaymentState();
}

class _PaymentState extends State<Payment> {
  Future<void> orderCheckout() async {

    try {
      await Provider.of<Cart>(context, listen: false).checkoutOrder();

      if(Provider.of<Cart>(context,listen: false).checkoutOrderStatus){
        Provider.of<Cart>(context,listen:false).clear();
        Navigator.pop(context);
        Navigator.pushNamed(context, SuccessMsg.routeName);
      }
      else{
        //show message that unable to order this time.
      }
      
      
    } on FormatException catch (_, error) {
      // _showErrorDialog(error.toString());
    } catch (error) {
      Map<String, dynamic> errorRes = json.decode(error.toString());
      Map<String, dynamic> errorMessage = {};
      if (errorRes["message"] is String) {
        // _showErrorDialog(errorRes["message"]);
      } else if (errorRes["message"] is Map<String, dynamic>) {
        errorMessage = errorRes["message"];
        Map<String, String> newErrorMessage = {};
        String counterMessage = "";
        errorMessage.forEach((key, value) {
          // for (int i = 0; i < value.length; i++) {
          // newErrorMessage[key] = value;
          counterMessage = value;
          // }
        });

        String finalEmailErrorMessage = newErrorMessage.containsKey("error")
            ? newErrorMessage["error"].toString()
            : newErrorMessage.containsKey("email")
                ? newErrorMessage["email"].toString()
                : "";
        String finalPasswordErrorMessage =
            newErrorMessage.containsKey("c_password")
                ? newErrorMessage["c_password"].toString()
                : "";

        String finalErrorMessage = finalEmailErrorMessage.isNotEmpty
            ? finalEmailErrorMessage
            : finalPasswordErrorMessage.isNotEmpty
                ? finalPasswordErrorMessage
                : errorRes["message_type"];

      }
    }
  }

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
                    orderCheckout();
                    //here we'll hit checkout method
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
