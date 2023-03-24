import 'package:ecomm_app/components/menu/bottom_menu.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/screens/wishlist/wishlist_card.dart';
import 'package:flutter/material.dart';

class Wishlist extends StatefulWidget {
  static String routeName = "/wishlist";

  @override
  State<Wishlist> createState() => _WishlistState();
}

class _WishlistState extends State<Wishlist> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        iconTheme: const IconThemeData(
          color: kAppBarColor, //change your color here
        ),
        title: const Text("WishList", style: TextStyle(color: kAppBarColor)),
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: SingleChildScrollView(
        child: Container(
          height: 500,
          child: ListView(
            scrollDirection: Axis.vertical,
            children: <Widget>[
              WishlistCard(
                  Icon(
                    Icons.book,
                    size: 40,
                  ),
                  'Book'),
              WishlistCard(
                  Icon(
                    Icons.computer,
                    size: 40,
                  ),
                  'Laptops'),
              WishlistCard(
                  Icon(
                    Icons.videogame_asset,
                    size: 40,
                  ),
                  'Games'),
              WishlistCard(
                  Icon(
                    Icons.videocam,
                    size: 40,
                  ),
                  'Movies'),
              WishlistCard(
                  Icon(
                    Icons.watch,
                    size: 40,
                  ),
                  'Watches'),
              WishlistCard(
                  Icon(
                    Icons.weekend,
                    size: 40,
                  ),
                  'Furniture'),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomMenu(),
    );
  }
}
