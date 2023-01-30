import 'package:ecomm_app/components/default_button.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/product_listing_widget.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/material.dart';

class SuccessMsg extends StatelessWidget {
  static var routeName = "success";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        title: const Text(""),
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
                  // SizedBox(height: SizeConfig.screenHeight * 0.04),
                  SizedBox(
                    child: Image(
                      image: AssetImage('assets/images/Pattern Success.png'),
                    ),
                  ),
                  SizedBox(height: getProportionateScreenHeight(20)),
                  const SizedBox(
                    child: Text('Thank You!',
                        style: TextStyle(
                            color: Color.fromARGB(161, 201, 83, 9),
                            fontSize: 45)),
                  ),
                  const SizedBox(
                    child: Text('Payment done successfully',
                        style: TextStyle(
                            color: Color.fromARGB(161, 201, 83, 9),
                            fontSize: 25)),
                  ),
                  SizedBox(height: getProportionateScreenHeight(20)),
                  SizedBox(
                    child: DefaultButton(
                      text: "Home",
                      press: () {
                        Navigator.pushNamed(
                            context, ProductListingWidget.routeName);
                      },
                    ),
                  )
                  //   Container(
                  //     child: Row(
                  //   children: <Widget>[

                  //   ],
                  // ))
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
