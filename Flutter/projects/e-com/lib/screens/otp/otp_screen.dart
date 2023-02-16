import 'package:ecomm_app/screens/otp/components/body.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';

import '../../components/global_snack_bar.dart';
import '../../providers/auth.dart';

class OtpScreen extends StatefulWidget {
  static String routeName = "/otp";

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  @override
  void initState() {
    super.initState();
    SchedulerBinding.instance.addPostFrameCallback((_) {
     final otpMessage = Provider.of<Auth>(context, listen: false).userRegMessage;
      GlobalSnackBar.show(context, otpMessage);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Body(),
    );
  }
}
