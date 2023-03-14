import 'dart:convert';

import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/models/user.dart';
import 'package:ecomm_app/screens/auth/auth_screen.dart';
import 'package:ecomm_app/screens/profile/update_pass_screen.dart';
import 'package:ecomm_app/screens/profile/update_profile_screen.dart';
import 'package:ecomm_app/screens/widgets/orders.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';

import '../../../models/user-profile.dart';
import '../../../providers/bottom-menu.dart';
import '../../../providers/orders.dart' as OrdersProvider;
import '../../../components/global_snack_bar.dart';
import '../../../providers/auth.dart';

// class profile extends StatefulWidget {
//   const Home({Key? key}) : super(key: key);

//   @override
//   // _HomeState createState() => _HomeState();
// }

class Body extends StatefulWidget {
  // const Body({Key? key}) : super(key: key);

  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<Body> {
  late List<UserModel>? _userModel = [];
  bool isAuth = false;
  late UserProfile profileData;
  bool isLoadingSpinner = true;

  @override
  void initState() {
    super.initState();

    //you can add after builder do action here for checking is local time has expired or not.

    // isAuth = Provider.of<Auth>(context,listen: false).isAuth;
    _getData();

    if (Provider.of<Auth>(context, listen: false)
        .userProfileMessage
        .isNotEmpty) {
      SchedulerBinding.instance.addPostFrameCallback((_) {
        final otpMessage =
            Provider.of<Auth>(context, listen: false).userProfileMessage;
        GlobalSnackBar.show(context, otpMessage);
        Provider.of<Auth>(context, listen: false)
            .clearUserProfileNotificationMessage();
      });
    }
  }

  Future<void> _getData() async {
    try{
      await Provider.of<Auth>(context, listen: false).getCustomerProfile();
    profileData = Provider.of<Auth>(context, listen: false).customerProfileData;
    setState(() {
      isLoadingSpinner = false;
    });
    }
    catch(error){
      GlobalSnackBar.show(context, error.toString());
    }
    
  }

  Future<void> orderCheckout() async {
    try {
      // await Provider.of<OrdersProvider.Orders>(context, listen: false).getAllOrderListings();
      Navigator.pushNamed(context, Orders.routeName);
    } on FormatException catch (_, error) {
      // _showErrorDialog(error.toString());
    } catch (error) {
      Map<String, dynamic> errorRes = json.decode(error.toString());
      Map<String, dynamic> errorMessage = {};
      if (errorRes["message"] is String) {
        // _showErrorDialog(errorRes["message"]);
        if (errorRes["message"] == "Unauthenticated token") {
          //your session expired message & log jump on auth screen
        } else {
          // show the rest response message
        }
      } else if (errorRes["message"] is Map<String, dynamic>) {
        errorMessage = errorRes["message"];
        Map<String, String> newErrorMessage = {};
        errorMessage.forEach((key, value) {
          // for (int i = 0; i < value.length; i++) {
          newErrorMessage[key] = value;
          // }
        });

        String finalEmailErrorMessage = newErrorMessage.containsKey("error")
            ? newErrorMessage["error"].toString()
            : newErrorMessage.containsKey("email")
                ? newErrorMessage["email"].toString()
                : "";
        String finalPasswordErrorMessage =
            newErrorMessage.containsKey("c_password")
                ? newErrorMessage["c_password"].toString()
                : "";

        String finalErrorMessage = finalEmailErrorMessage.isNotEmpty
            ? finalEmailErrorMessage
            : finalPasswordErrorMessage.isNotEmpty
                ? finalPasswordErrorMessage
                : errorRes["message_type"];
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        padding: const EdgeInsets.all(4),
        child:
            /**
         *  Consumer<Cart>(builder: (_, cartState,ch) {
            List<CartItem> cartItem = cartState.items;
            eturn Padding(
         */
            // Consumer<Auth>(builder: (_,authState,ch) {
            //   authState.getCustomerProfile();
            //   return authState.userProfileHasLoaded == false ?
            isLoadingSpinner
                ? Center(
                    child: Container(
                        height: MediaQuery.of(context).size.height * 0.2,
                        width: 60,
                        child: SpinKitCubeGrid(
                          color: kPrimaryColor,
                        )),
                  )
                : Column(
                    children: <Widget>[
                      const SizedBox(
                        width: 120,
                        height: 120,
                        child: Image(
                            image:
                                AssetImage('assets/images/Profile Image.png')),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        // authState.customerProfileData.name
                        profileData.name.isNotEmpty
                            ? profileData.name
                            : "user name",
                      ),
                      Text(
                        // authState.customerProfileData.email
                        profileData.email.isNotEmpty
                            ? profileData.email
                            : "user email",
                      ),
                      const SizedBox(height: 20),
                      SizedBox(
                          width: 200,
                          child: ElevatedButton(
                            onPressed: () {
                              if (Provider.of<Auth>(context, listen: false)
                                  .isAuth) {
                                // print("auth value ",Provider.of<Auth>(context).isAuth);
                                // Navigator.pop(context);
                                Navigator.pushNamed(
                                    context, UpdateprofileScreen.routeName);
                              } else {
                                Navigator.pop(context);
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: kPrimaryColor,
                            ),
                            child: const Text('Edit profile'),
                          )),
                      const SizedBox(height: 30),
                      const Divider(),
                      const SizedBox(height: 10),

                      // List item
                      ListTile(
                        leading: Container(
                            width: 20,
                            height: 20,
                            decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(100),
                                color: kPrimaryColor.withOpacity(0.1)),
                            // child:  Icon: SvgPicture.asset("assets/icons/Cart.svg"),
                            child:
                                SvgPicture.asset("assets/icons/Settings.svg")),
                        title: const Text(
                          'Settings',
                          style: TextStyle(
                              fontSize: 12,
                              color: Color.fromARGB(255, 75, 74, 74)),
                        ),
                        trailing: Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(100),
                              color: kPrimaryColor.withOpacity(0.1)),
                          child:
                              SvgPicture.asset("assets/icons/arrow_right.svg"),
                        ),
                        onTap: () {
                          Navigator.pushNamed(
                              context, UpdateppassScreen.routeName);
                        },
                      ),
                      ListTile(
                        leading: Container(
                          width: 20,
                          height: 20,
                          decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(100),
                              color: kPrimaryColor.withOpacity(0.1)),
                          // child:  Icon: SvgPicture.asset("assets/icons/Cart.svg"),
                          child: SvgPicture.asset("assets/icons/Parcel.svg"),
                        ),
                        title: const Text('Orders',
                            style: TextStyle(
                                fontSize: 12,
                                color: Color.fromARGB(255, 75, 74, 74))),
                        trailing: Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(100),
                              color: kPrimaryColor.withOpacity(0.1)),
                          child:
                              SvgPicture.asset("assets/icons/arrow_right.svg"),
                        ),
                        onTap: () {
                          orderCheckout();
                        },
                      ),
                      ListTile(
                        leading: Container(
                            width: 20,
                            height: 20,
                            decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(100),
                                color: kPrimaryColor.withOpacity(0.1)),

                            // child:  Icon: SvgPicture.asset("assets/icons/Cart.svg"),
                            child:
                                SvgPicture.asset("assets/icons/Log out.svg")),

                        title: const Text('Logout',
                            style: TextStyle(
                                fontSize: 12,
                                color: Color.fromARGB(255, 75, 74, 74))),
                        onTap: () {
                          Provider.of<BottomMenuHandler>(context,listen:false).changeCurrentValue(BottomMuenu.Home);
                          Provider.of<Auth>(context, listen: false).logout();
                          Navigator.pushAndRemoveUntil(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => AuthScreen()),
                              (route) => false);
                        },
                        // title: TextButton.icon(
                        //     label: const Text('Logout'),
                        //     icon: const Icon(Icons.logout),
                        //     onPressed: () {
                        //       // Navigator.pop(context);
                        //       Provider.of<Auth>(context, listen: false)
                        //           .logout();
                        //       Navigator.pushAndRemoveUntil(
                        //           context,
                        //           MaterialPageRoute(
                        //               builder: (context) => AuthScreen()),
                        //           (route) => false);
                        //       // Navigator.pushNamed(context, AuthScreens.routeName);
                        //     }),

                        // title: Text('Logout',
                        //     style: TextStyle(
                        //         fontSize: 12, color: Color.fromARGB(255, 75, 74, 74))
                        //         ),
                        // trailing: Container(
                        //   width: 10,
                        //   height: 10,
                        //   // decoration: BoxDecoration(
                        //   //     borderRadius: BorderRadius.circular(100),
                        //   //     color: kPrimaryColor.withOpacity(0.1)),
                        //   // child:
                        //   //     SvgPicture.asset("assets/icons/arrow_right.svg"),
                        // ),
                      ),
                    ],
                  ),
        // ,),
        // Provider.of<Auth>(context,listen:false).userProfileHasLoaded == false ?
      ),
    );
  }
}

/**
 * 
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('REST API Example'),
      ),
      body: _userModel == null || _userModel!.isEmpty
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : ListView.builder(
              itemCount: _userModel!.length,
              itemBuilder: (context, index) {
                return Card(
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Text(_userModel![index].id.toString()),
                          Text(_userModel![index].username),
                        ],
                      ),
                      const SizedBox(
                        height: 20.0,
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Text(_userModel![index].email),
                          Text(_userModel![index].website),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
 */
