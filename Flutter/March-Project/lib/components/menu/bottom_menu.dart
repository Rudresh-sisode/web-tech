import 'package:ecomm_app/checkout_widget.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/enums.dart';
import 'package:ecomm_app/product_listing_widget.dart';
import 'package:ecomm_app/screens/category/category.dart';
import 'package:ecomm_app/screens/location/loaction.dart';
// import 'package:ecomm_app/screens/home/home_screen.dart';
import 'package:ecomm_app/screens/profile/profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';

import '../../providers/auth-checker.dart';
import '../../providers/bottom-menu.dart';
import '../../screens/auth/auth_screen.dart';

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
    final Color inActiveIconColor = Color.fromARGB(255, 46, 46, 46);
    // final Color inActiveIconColor = Color.fromARGB(255, 34, 0, 255);
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
      child:
          // Consumer<BottomMenuHandler>(builder: (ctx, bottomMenuHandler, _) {
          //   return
          SafeArea(
        top: false,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(
              icon: Icon(
                Icons.home,
                color: BottomMuenu.Home ==
                        Provider.of<BottomMenuHandler>(context, listen: false)
                            .currentValue
                    ? kPrimaryColor
                    : inActiveIconColor,
                size: 30.0,
              ),
              // icon: SvgPicture.asset(
              //   "assets/icons/Home.svg",
              //   color: BottomMuenu.Home == bottomMenuHandler.currentValue
              //       ? kPrimaryColor
              //       : inActiveIconColor,
              // ),
              onPressed: Provider.of<BottomMenuHandler>(context, listen: false)
                          .currentValue ==
                      BottomMuenu.Home
                  ? null
                  : () {
                      // Navigator.pop(context);
                      // await .getCustomerProfile();

                      Provider.of<BottomMenuHandler>(context, listen: false)
                          .currentValue = BottomMuenu.Home;
                      print(
                          " Home click ${Provider.of<BottomMenuHandler>(context, listen: false).currentValue}");

                      Navigator.pushNamed(
                          context, ProductListingWidget.routeName);
                    },
            ),
            // IconButton(
            //   icon: SvgPicture.asset("assets/icons/Cart.svg"),
            //   onPressed: () {},
            // ),

            //Category
            IconButton(
              icon: Icon(
                Icons.category,
                color: BottomMuenu.Category ==
                        Provider.of<BottomMenuHandler>(context, listen: false)
                            .currentValue
                    ? kPrimaryColor
                    : inActiveIconColor,
                size: 30.0,
              ),
              // icon: SvgPicture.asset(
              //   "assets/icons/Cart Icon.svg",
              //   color: BottomMuenu.Cart == bottomMenuHandler.currentValue
              //       ? kPrimaryColor
              //       : inActiveIconColor,
              // ),
              onPressed: Provider.of<BottomMenuHandler>(context, listen: false)
                          .currentValue ==
                      BottomMuenu.Category
                  ? null
                  : () {
                      // Navigator.pop(context);
                      // await .getCustomerProfile();

                      Provider.of<BottomMenuHandler>(context, listen: false)
                          .currentValue = BottomMuenu.Category;
                      print(
                          " Category click ${Provider.of<BottomMenuHandler>(context, listen: false).currentValue}");
                      Navigator.pushNamed(context, Category.routeName);
                    },
            ),

            IconButton(
              icon: Icon(
                Icons.shopping_cart,
                color: BottomMuenu.Cart ==
                        Provider.of<BottomMenuHandler>(context, listen: false)
                            .currentValue
                    ? kPrimaryColor
                    : inActiveIconColor,
                size: 30.0,
              ),
              // icon: SvgPicture.asset(
              //   "assets/icons/Cart Icon.svg",
              //   color: BottomMuenu.Cart == bottomMenuHandler.currentValue
              //       ? kPrimaryColor
              //       : inActiveIconColor,
              // ),
              onPressed: Provider.of<BottomMenuHandler>(context, listen: false)
                          .currentValue ==
                      BottomMuenu.Cart
                  ? null
                  : () {
                      // Navigator.pop(context);
                      // await .getCustomerProfile();

                      Provider.of<BottomMenuHandler>(context, listen: false)
                          .currentValue = BottomMuenu.Cart;
                      print(
                          " Cart click ${Provider.of<BottomMenuHandler>(context, listen: false).currentValue}");
                      Navigator.pushNamed(context, CheckoutWidget.routeName);
                    },
            ),
            Provider.of<AuthChecker>(context,listen:false).isAuth ?
            IconButton(
                icon: Icon(
                  Icons.person,
                  color: BottomMuenu.Profile ==
                          Provider.of<BottomMenuHandler>(context, listen: false)
                              .currentValue
                      ? kPrimaryColor
                      : inActiveIconColor,
                  size: 30.0,
                ),
                // icon: SvgPicture.asset(
                //   "assets/icons/User Icon.svg",
                //   color: BottomMuenu.Profile == bottomMenuHandler.currentValue
                //       ? kPrimaryColor
                //       : inActiveIconColor,
                // ),
                onPressed: Provider.of<BottomMenuHandler>(context,
                                listen: false)
                            .currentValue ==
                        BottomMuenu.Profile
                    ? null
                    : () {
                        Provider.of<BottomMenuHandler>(context, listen: false)
                            .currentValue = BottomMuenu.Profile;
                        // bottomMenuHandler.changeCurrentValue(BottomMuenu.Profile);
                        print(
                            " profile click ${Provider.of<BottomMenuHandler>(context, listen: false).currentValue}");
                        Navigator.pushNamed(context, ProfileScreen.routeName);
                      }) : IconButton(
                icon: Icon(
                  Icons.login,
                  color: BottomMuenu.Location ==
                          Provider.of<BottomMenuHandler>(context, listen: false)
                              .currentValue
                      ? kPrimaryColor
                      : inActiveIconColor,
                  size: 30.0,
                ),
               
                onPressed:
                    Provider.of<BottomMenuHandler>(context, listen: false)
                                .currentValue ==
                            BottomMuenu.Location
                        ? null
                        : () {
                          Provider.of<BottomMenuHandler>(context, listen: false)
                                .currentValue = BottomMuenu.Home;
                          Navigator.pop(context);
                          Navigator.pushNamed(context, AuthScreen.routeName);
                          }) ,
            ...Provider.of<AuthChecker>(context,listen:false).isAuth ?
            [IconButton(
                icon: Icon(
                  Icons.person,
                  color: BottomMuenu.Location ==
                          Provider.of<BottomMenuHandler>(context, listen: false)
                              .currentValue
                      ? kPrimaryColor
                      : inActiveIconColor,
                  size: 30.0,
                ),
               
                onPressed:
                    Provider.of<BottomMenuHandler>(context, listen: false)
                                .currentValue ==
                            BottomMuenu.Location
                        ? null
                        : () {
                            Navigator.pushNamed(context, Location.routeName);
                          })] : []
          ],
        ),
      ),
      // }),
    );
  }
}
