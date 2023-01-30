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

        // SingleChildScrollView(
        //   child: Column(
        //     children: <Widget>[
        //       Padding(
        //         padding: const EdgeInsets.only(top: 60.0),
        //         child: Center(
        //           child: Container(
        //               width: 350,
        //               height: 150,
        //               /*decoration: BoxDecoration(
        //                   color: Colors.red,
        //                   borderRadius: BorderRadius.circular(50.0)),*/
        //               child: Image.asset('assets/images/logo1.jpg')),
        //         ),
        //       ),
        //       SizedBox(height: getProportionateScreenHeight(30)),
        //       const Padding(
        //         //padding: const EdgeInsets.only(left:15.0,right: 15.0,top:0,bottom: 0),
        //         padding: EdgeInsets.symmetric(horizontal: 15),
        //         child: TextField(
        //           decoration: InputDecoration(
        //               contentPadding: EdgeInsets.all(12.0),
        //               border: OutlineInputBorder(),
        //               labelText: 'Email',
        //               hintText: 'Enter valid email id as abc@gmail.com'),
        //         ),
        //       ),
        //       const Padding(
        //         padding:
        //             EdgeInsets.only(left: 16.0, right: 15.0, top: 15, bottom: 0),
        //         //padding: EdgeInsets.symmetric(horizontal: 15),
        //         child: TextField(
        //           obscureText: true,
        //           decoration: InputDecoration(
        //               contentPadding: EdgeInsets.all(12.0),
        //               border: OutlineInputBorder(),
        //               labelText: 'Password',
        //               hintText: 'Enter secure password'),
        //         ),
        //       ),
        //       // SizedBox(height: SizeConfig.screenHeight * 0.08),
        //       // TextButton(
        //       //   onPressed: () {
        //       //     Navigator.pushNamed(context, ForgetPassScreen.routeName);
        //       //   },
        //       //   child: const Text(
        //       //     'Forgot Password',
        //       //     style: TextStyle(color: Colors.blue, fontSize: 15),
        //       //   ),
        //       // ),
        //       // const SizedBox(
        //       //   height: 20,
        //       // ),
        //       SizedBox(height: getProportionateScreenHeight(30)),
        //       Row(
        //         children: [
        //           // Checkbox(
        //           //   value: remember,
        //           //   activeColor: kPrimaryColor,
        //           //   onChanged: (value) {
        //           //     setState(() {
        //           //       remember = value;
        //           //     });
        //           //   },
        //           // ),
        //           // Text("Remember me"),
        //           Spacer(),
        //           GestureDetector(
        //             onTap: () =>
        //                 Navigator.pushNamed(context, ForgetPassScreen.routeName),
        //             child: const Text(
        //               "Forgot Password",
        //               textAlign: TextAlign.start,
        //               style: TextStyle(decoration: TextDecoration.underline),
        //             ),
        //           ),
        //         ],
        //       ),
        //       SizedBox(height: getProportionateScreenHeight(20)),
        //       Container(
        //         height: 50,
        //         width: 360,
        //         decoration: BoxDecoration(
        //             color: Colors.blue, borderRadius: BorderRadius.circular(20)),
        //         child: DefaultButton(
        //           text: "Login",
        //           press: () {
        //             Navigator.pushNamed(context, ProductListingWidget.routeName);
        //           },
        //           // child: const Text('null'),
        //         ),
        //         // child: DefaultButton(
        //         //   onPressed: () {
        //         //     Navigator.pushNamed(
        //         //         context, ProductListingWidget.routeName);
        //         //   },
        //         //   child: const Text(
        //         //     'Login',
        //         //     style: TextStyle(color: Colors.white, fontSize: 25),
        //         //   ),
        //         // ),
        //       ),
        //       const SizedBox(
        //         height: 60,
        //       ),
        //       Row(
        //         mainAxisAlignment: MainAxisAlignment.center,
        //         children: [
        //           SocalCard(
        //             icon: "assets/icons/google-icon.svg",
        //             press: () {},
        //           ),
        //           SocalCard(
        //             icon: "assets/icons/facebook-2.svg",
        //             press: () {},
        //           ),
        //           SocalCard(
        //             icon: "assets/icons/twitter.svg",
        //             press: () {},
        //           ),
        //         ],
        //       ),
        //       // Text('New User? Create Account'),
        //       TextButton(
        //         onPressed: () {
        //           Navigator.pushNamed(context, RegisterScreen.routeName);
        //         },
        //         child: const Text(
        //           'New User? Create Account', //title
        //         ),
        //       ),
        //     ],
        //   ),
        // ),

        );
    // );
  }
}
