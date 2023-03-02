import 'package:ecomm_app/components/default_button.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/product_listing_widget.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/cart.dart';

class SuccessMsg extends StatefulWidget {
  static var routeName = "success";

  @override
  State<SuccessMsg> createState() => _SuccessMsgState();
}

class _SuccessMsgState extends State<SuccessMsg> {
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
                    child: Text('Your Order has been confirm',
                        style: TextStyle(
                            color: Color.fromARGB(161, 201, 83, 9),
                            fontSize: 25)),
                  ),
                  Text("Order Id\t"+Provider.of<Cart>(context,listen:false).recentCheckoutOrderId),
                  SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pushNamed(context, ProductListingWidget.routeName);
                  },
                  child: Text("Home"),
                )
                  // SizedBox(
                  //   child: DefaultButton(
                  //     text: "Home",
                  //     press: () {
                  //       Navigator.pushNamed(
                  //           context, ProductListingWidget.routeName);
                  //     },
                  //   ),
                  // )
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
