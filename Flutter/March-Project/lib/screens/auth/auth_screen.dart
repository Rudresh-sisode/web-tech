import 'package:ecomm_app/components/default_button.dart';
import 'package:ecomm_app/components/socal_card.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/product_listing_widget.dart';
import 'package:ecomm_app/screens/auth/components/auth_screen.dart';
import 'package:ecomm_app/screens/auth/components/sign_form.dart';
import 'package:ecomm_app/screens/forget_password/forget_pass_screen.dart';
// import 'package:ecomm_app/screens/home/home_screen.dart';
import 'package:ecomm_app/screens/register/components/register_screen.dart';
import 'package:flutter/material.dart';
import 'package:ecomm_app/size_config.dart';

class AuthScreen extends StatelessWidget {
  static String routeName = "/auth";
  @override
  Widget build(BuildContext context) {
    // You have to call it on your starting screen
    SizeConfig().init(context);
    print("Auth screen been called");
    return Scaffold(
        // child: AuthScreens() ,
        // child: Scaffold(
        backgroundColor: kAppBarColor,
        appBar: AppBar(
          title: const Text(""),
          automaticallyImplyLeading: false,
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
                      child: SizedBox(
                          width: 150,
                          height: 100,
                          child: Image.asset('assets/images/G-Store.png')),
                    ),
                    SizedBox(height: SizeConfig.screenHeight * 0.04),
                    // Text(
                    //   "Welcome Back",
                    //   style: TextStyle(
                    //     color: Colors.black,
                    //     fontSize: getProportionateScreenWidth(28),
                    //     fontWeight: FontWeight.bold,
                    //   ),
                    // ),
                    Text(
                      "Sign in ",
                      textAlign: TextAlign.center,
                      style: TextStyle(color: kPrimaryColor, fontSize: 25),
                    ),
                    SizedBox(height: SizeConfig.screenHeight * 0.08),
                    SignForm(),
                    SizedBox(height: SizeConfig.screenHeight * 0.08),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SocalCard(
                          icon: "assets/icons/google-icon.svg",
                          press: () {},
                        ),
                        SocalCard(
                          icon: "assets/icons/facebook-2.svg",
                          press: () {},
                        ),
                        SocalCard(
                          icon: "assets/icons/twitter.svg",
                          press: () {},
                        ),
                      ],
                    ),
                    SizedBox(height: getProportionateScreenHeight(20)),
                    // Text('New User? Create Account'),
                    TextButton(
                      onPressed: () {
                        Navigator.pushNamed(context, RegisterScreen.routeName);
                      },
                      child: const Text(
                        'New User? Create Account', //title
                      ),
                    ),
                  ],
                  // Text('New User? Create Account'),
                ),
              ),
            ),
          ),
        )


        );
    // );
  }
}
