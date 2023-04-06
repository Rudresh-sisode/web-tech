import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/screens/widgets/shipping_form.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/material.dart';

class Shipping extends StatelessWidget {
  static var routeName = "shipping";

  // const Shipping({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        // title: const Text("Shipping"),
        iconTheme: const IconThemeData(
          color: kAppBarColor, //change your color here
        ),
        title: const Text("Shipping", style: TextStyle(color: kAppBarColor)),
        // automaticallyImplyLeading: false,
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: SafeArea(
        child: SizedBox(
          width: double.infinity,
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: SingleChildScrollView(
              // physics: AlwaysScrollableScrollPhysics(),
              child: Column(
                children: [
                  SizedBox(height: 20 /**SizeConfig.screenHeight * 0.04*/),
                  SizedBox(
                    child: Icon(
                      Icons.delivery_dining,
                      color: kPrimaryColor,
                      size: 70.0,
                    ),
                    // child: Image(
                    //   image: AssetImage('assets/images/fedex-express.png'),
                    // ),
                  ),
                  SizedBox(height: 20 /**SizeConfig.screenHeight * 0.08*/),
                  // SingleChildScrollView(
                  // //   physics: AlwaysScrollableScrollPhysics(),
                  //   child: ShippingForm(),
                  // ),
                  ShippingForm(),
                  SizedBox(height: 20),
                  SizedBox(height: 20),
                ],
                // Text('New User? Create Account'),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
