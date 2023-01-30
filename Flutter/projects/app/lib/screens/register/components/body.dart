import 'package:ecomm_app/components/socal_card.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/screens/auth/auth_screen.dart';
import 'package:ecomm_app/screens/register/components/sign_up_form.dart';
import 'package:flutter/material.dart';
import 'package:ecomm_app/size_config.dart';

class Body extends StatelessWidget {
  const Body({super.key});
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SizedBox(
        width: double.infinity,
        child: Padding(
          padding:
              EdgeInsets.symmetric(horizontal: getProportionateScreenWidth(20)),
          child: SingleChildScrollView(
            child: Column(
              children: [
                SizedBox(height: SizeConfig.screenHeight * 0.04), // 4%
                SizedBox(
                  child: SizedBox(
                      width: 200,
                      height: 150,
                      child: Image.asset('assets/images/G-Store.png')),
                ), // 4%
                // Text("Register Account", style: headingStyle),
                // Text(
                //   "Complete your details or continue \nwith social media",
                //   textAlign: TextAlign.center,
                // ),
                SizedBox(height: SizeConfig.screenHeight * 0.08),
                SignUpForm(),
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
                Text(
                  'By continuing your confirm that you agree \nwith our Term and Condition',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.caption,
                ),

                // Text('New User? Create Account'),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, AuthScreen.routeName);
                  },
                  child: const Text(
                    'New User? Create Account', //title
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );

    // return Scaffold(
    //   backgroundColor: Colors.white,
    //   appBar: AppBar(
    //     title: const Text("Register"),
    //     centerTitle: true,
    //     backgroundColor: kPrimaryColor,
    //   ),
    //   body: SingleChildScrollView(
    //     child: Column(
    //       children: <Widget>[
    //         Padding(
    //           padding: const EdgeInsets.only(top: 60.0),
    //           child: Center(
    //             child: SizedBox(
    //                 width: 300,
    //                 height: 150,
    //                 child: Image.asset('assets/images/logo1.jpg')),
    //           ),
    //         ),
    //         SizedBox(height: getProportionateScreenHeight(30)),
    //         SizedBox(height: SizeConfig.screenHeight * 0.08),
    //         SignUpForm(),
    //         SizedBox(height: SizeConfig.screenHeight * 0.08),
    //         // const Padding(
    //         //   padding:
    //         //       EdgeInsets.only(left: 16.0, right: 15.0, top: 15, bottom: 0),
    //         //   //padding: EdgeInsets.symmetric(horizontal: 15),
    //         //   child: TextField(
    //         //     decoration: InputDecoration(
    //         //         contentPadding: EdgeInsets.all(12.0),
    //         //         border: OutlineInputBorder(),
    //         //         labelText: 'Mobile',
    //         //         hintText: 'Enter mobile number'),
    //         //   ),
    //         // ),
    //         // const Padding(
    //         //   padding:
    //         //       EdgeInsets.only(left: 16.0, right: 15.0, top: 15, bottom: 0),
    //         //   //padding: EdgeInsets.symmetric(horizontal: 15),
    //         //   child: TextField(
    //         //     decoration: InputDecoration(
    //         //         contentPadding: EdgeInsets.all(12.0),
    //         //         border: OutlineInputBorder(),
    //         //         labelText: 'Email',
    //         //         hintText: 'Enter email number'),
    //         //   ),
    //         // ),
    //         // const Padding(
    //         //   padding:
    //         //       EdgeInsets.only(left: 16.0, right: 15.0, top: 15, bottom: 0),
    //         //   //padding: EdgeInsets.symmetric(horizontal: 15),
    //         //   child: TextField(
    //         //     obscureText: true,
    //         //     decoration: InputDecoration(
    //         //         contentPadding: EdgeInsets.all(12.0),
    //         //         border: OutlineInputBorder(),
    //         //         labelText: 'Password',
    //         //         hintText: 'Enter password number'),
    //         //   ),
    //         // ),

    //         // const Padding(
    //         //   padding: EdgeInsets.symmetric(horizontal: 15),
    //         //   child: TextField(
    //         //     decoration: InputDecoration(
    //         //         border: OutlineInputBorder(),
    //         //         labelText: 'Mobile',
    //         //         hintText: 'Enter mobile number'),
    //         //   ),
    //         // ),
    //         // const Padding(
    //         //   padding:
    //         //       EdgeInsets.only(left: 15.0, right: 15.0, top: 15, bottom: 0),
    //         //   //padding: EdgeInsets.symmetric(horizontal: 15),
    //         //   child: TextField(
    //         //     obscureText: true,
    //         //     decoration: InputDecoration(
    //         //         border: OutlineInputBorder(),
    //         //         labelText: 'Password',
    //         //         hintText: 'Enter secure password'),
    //         //   ),
    //         // ),
    //         SizedBox(height: getProportionateScreenHeight(20)),
    //         Container(
    //           height: 50,
    //           width: 360,
    //           decoration: BoxDecoration(
    //               color: Colors.blue, borderRadius: BorderRadius.circular(20)),
    //           child: DefaultButton(
    //             text: "Login",
    //             press: () {
    //               Navigator.pushNamed(context, OtpScreen.routeName);
    //             },
    //             // child: const Text('null'),
    //           ),
    //         ),
    //         // Container(
    //         //   height: 50,
    //         //   width: 250,
    //         //   decoration: BoxDecoration(
    //         //       color: Colors.blue, borderRadius: BorderRadius.circular(20)),
    //         //   child: TextButton(
    //         //     onPressed: () {
    //         //       Navigator.pushNamed(context, OtpScreen.routeName);
    //         //     },
    //         //     child: const Text(
    //         //       'continue',
    //         //       style: TextStyle(color: Colors.white, fontSize: 25),
    //         //     ),
    //         //   ),
    //         // ),

    //         // const SizedBox(
    //         //   height: 60,
    //         // ),
    //         // const Text('New User? Create Account')
    //       ],
    //     ),
    //   ),
    // );
  }
}
