// import 'package:ecomm_app/screens/home/home_screen.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/screens/register/components/register_screen.dart';
import 'package:flutter/material.dart';
import '../../../components/default_button.dart';
// import '../../../size_config.dart';

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        title: const Text("Login Page"),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: <Widget>[
            const Padding(
              padding: EdgeInsets.all(20),
              child: Center(
                child: SizedBox(
                  width: 200,
                  height: 150,
                  /*decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(50.0)),*/
                  // child: Image.asset('asset/images/logo.png')
                ),
              ),
            ),
            const Padding(
              //padding: const EdgeInsets.only(left:15.0,right: 15.0,top:0,bottom: 0),
              padding: EdgeInsets.symmetric(horizontal: 15),
              child: TextField(
                decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    labelText: 'Email',
                    hintText: 'Enter valid email id as abc@gmail.com'),
              ),
            ),
            const Padding(
              padding:
                  EdgeInsets.only(left: 15.0, right: 15.0, top: 15, bottom: 0),
              //padding: EdgeInsets.symmetric(horizontal: 15),
              child: TextField(
                obscureText: true,
                decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    labelText: 'Password',
                    hintText: 'Enter secure password'),
              ),
            ),
            DefaultButton(
              press: () {
                // ignore: todo
                //TODO FORGOT PASSWORD SCREEN GOES HERE
              },
             
            ),
            
            const SizedBox(
              height: 130,
            ),
            const Text(
              'New User? Create Account 123',
            ),
            DefaultButton(
              text: "Continue",
              press: () {
                Navigator.pushNamed(context, RegisterScreen.routeName);
              },
              // child: const Text('null'),
            ),
          ],
        ),
      ),
    );
  }
}
