import 'package:ecomm_app/checkout_widget.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/enums.dart';
import 'package:ecomm_app/product_listing_widget.dart';
// import 'package:ecomm_app/screens/home/home_screen.dart';
import 'package:ecomm_app/screens/profile/profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';

import '../../providers/auth.dart';
import '../../providers/bottom-menu.dart';

class BottomMenu extends StatefulWidget {
  const BottomMenu({
    Key? key,
    // required this.selectedMenu,
  }) : super(key: key);

  // final MenuState selectedMenu;

  @override
  State<BottomMenu> createState() => _BottomMenuState();
}

class _BottomMenuState extends State<BottomMenu> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    print("called this time ");
  }
  @override
  Widget build(BuildContext context) {
    final Color inActiveIconColor = Color.fromARGB(255, 34, 0, 255);
    return Container(
      padding: EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            offset: Offset(0, -15),
            blurRadius: 20,
            color: Color(0xFFDADADA).withOpacity(0.15),
          ),
        ],
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(40),
          topRight: Radius.circular(40),
        ),
      ),
      child: Consumer<BottomMenuHandler>(builder: (ctx, bottomMenuHandler, _) {
        return SafeArea(
          top: false,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              IconButton(
                icon: SvgPicture.asset(
                  "assets/icons/Home.svg",
                  color: BottomMuenu.Home == bottomMenuHandler.currentValue
                      ? kPrimaryColor
                      : inActiveIconColor,
                ),
                onPressed: bottomMenuHandler.currentValue == BottomMuenu.Home
                    ? null
                    : () {
                        // Navigator.pop(context);
                        // await .getCustomerProfile();

                        bottomMenuHandler.currentValue = BottomMuenu.Home;
                        // bottomMenuHandler.changeCurrentValue(BottomMuenu.Home);

                        Navigator.pushNamed(
                            context, ProductListingWidget.routeName);
                      },
              ),
              // IconButton(
              //   icon: SvgPicture.asset("assets/icons/Cart.svg"),
              //   onPressed: () {},
              // ),
              IconButton(
                icon: SvgPicture.asset(
                  "assets/icons/Cart Icon.svg",
                  color: BottomMuenu.Cart == bottomMenuHandler.currentValue
                      ? kPrimaryColor
                      : inActiveIconColor,
                ),
                onPressed: bottomMenuHandler.currentValue == BottomMuenu.Cart
                    ? null
                    : () {
                        // Navigator.pop(context);
                        // await .getCustomerProfile();

                        bottomMenuHandler.currentValue = BottomMuenu.Cart;
                        // bottomMenuHandler.changeCurrentValue(BottomMuenu.Cart);
                        // Navigator.pushReplacementNamed(context, CheckoutWidget.routeName);
                        Navigator.pushNamed(context, CheckoutWidget.routeName);
                      },
              ),
              IconButton(
                  icon: SvgPicture.asset(
                    "assets/icons/User Icon.svg",
                    color: BottomMuenu.Profile == bottomMenuHandler.currentValue
                        ? kPrimaryColor
                        : inActiveIconColor,
                  ),
                  onPressed: bottomMenuHandler.currentValue ==
                          BottomMuenu.Profile
                      ? null
                      : () {
                          // Navigator.pop(context);
                          // await .getCustomerProfile();

                          bottomMenuHandler.currentValue = BottomMuenu.Profile;
                          // bottomMenuHandler.changeCurrentValue(BottomMuenu.Profile);
                          Navigator.pushNamed(context, ProfileScreen.routeName);
                        }),
            ],
          ),
        );
      }),
    );
  }
}
