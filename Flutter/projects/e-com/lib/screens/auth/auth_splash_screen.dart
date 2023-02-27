import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

import '../../const_error_msg.dart';

class AuthSplashScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: 
      // Center(
      //   child: Text('Loading...'),
        Center(
                child: Container(
                  height: MediaQuery.of(context).size.height * 0.2,
                  width: 60,
                  child: 
                  SpinKitCubeGrid(
                    color: kPrimaryColor,
                  )
                ),
              ) 
      // ),
    );
  }
}
