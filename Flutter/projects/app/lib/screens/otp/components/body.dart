import 'package:ecomm_app/components/default_button.dart';
import 'package:ecomm_app/components/form_error.dart';
import 'package:ecomm_app/components/global_snack_bar.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/product_listing_widget.dart';
// import 'package:ecomm_app/screens/home/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:ecomm_app/size_config.dart';

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Scaffold(
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        title: const Text("OTP"),
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: SingleChildScrollView(
        padding:
            EdgeInsets.symmetric(horizontal: getProportionateScreenWidth(20)),
        child: Column(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(top: 60.0),
              child: Center(
                child: SizedBox(
                    width: 300,
                    height: 150,
                    child: Image.asset('assets/images/G-Store.png')),
              ),
            ),
            SizedBox(height: getProportionateScreenHeight(30)),
            OtpFrom()
            // const Padding(
            //   padding:
            //       EdgeInsets.only(left: 16.0, right: 15.0, top: 15, bottom: 0),
            //   //padding: EdgeInsets.symmetric(horizontal: 15),
            //   child: TextField(
            //     obscureText: true,
            //     decoration: InputDecoration(
            //         contentPadding: EdgeInsets.all(12.0),
            //         border: OutlineInputBorder(),
            //         labelText: 'OTP',
            //         hintText: 'Enter otp number'),
            //   ),
            // ),
            // SizedBox(height: getProportionateScreenHeight(20)),
            // Container(
            //   height: 50,
            //   width: 360,
            //   decoration: BoxDecoration(
            //       color: Colors.blue, borderRadius: BorderRadius.circular(20)),
            //   child: DefaultButton(
            //     text: "Submit",
            //     press: () {
            //       Navigator.pushNamed(context, ProductListingWidget.routeName);
            //     },
            //     // child: const Text('null'),
            //   ),
            // ),
          ],
        ),
      ),
    );
  }
}

// class OtpFrom extends Body {}

class OtpFrom extends StatefulWidget {
  @override
  _OtpFromState createState() => _OtpFromState();
}

class _OtpFromState extends State<OtpFrom> {
  final _formKey = GlobalKey<FormState>();
  String? otp;

  final List<String?> errors = [];

  void addError({String? error}) {
    if (!errors.contains(error))
      setState(() {
        errors.add(error);
      });
  }

  void removeError({String? error}) {
    if (errors.contains(error))
      setState(() {
        errors.remove(error);
      });
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          buildOtpFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          FormError(errors: errors),
          SizedBox(height: getProportionateScreenHeight(20)),
          DefaultButton(
            text: "Continue",
            press: () {
              if (_formKey.currentState!.validate()) {
                _formKey.currentState!.save();
                GlobalSnackBar.show(context, 'Login successful');
                Navigator.pushNamed(context, ProductListingWidget.routeName);
              }
            },
          ),
        ],
      ),
    );
  }

  TextFormField buildOtpFormField() {
    return TextFormField(
      keyboardType: TextInputType.emailAddress,
      onSaved: (newValue) => otp = newValue,
      onChanged: (value) {
        if (value.isNotEmpty) {
          removeError(error: kEmailNullError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kEmailNullError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        border: OutlineInputBorder(),
        labelText: "Otp",
        hintText: "Enter your Otp",
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }
}
