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
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        title: const Text("Shipping"),
        // automaticallyImplyLeading: false,
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: SafeArea(
        child: SizedBox(
          width: double.infinity,
          child: Padding(
            padding: EdgeInsets.symmetric(
                horizontal: getProportionateScreenWidth(20)),
            child: SingleChildScrollView(
              child: Column(
                children: [
                  SizedBox(height: SizeConfig.screenHeight * 0.04),
                  SizedBox(
                    child: Image(
                      image: AssetImage('assets/images/fedex-express.png'),
                    ),
                  ),
                  SizedBox(height: SizeConfig.screenHeight * 0.08),
                  ShippingForm(),
                  SizedBox(height: SizeConfig.screenHeight * 0.08),
                  SizedBox(height: getProportionateScreenHeight(20)),
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
