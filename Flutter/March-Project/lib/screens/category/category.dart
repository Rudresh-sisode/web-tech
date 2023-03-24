import 'package:ecomm_app/components/menu/bottom_menu.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/enums.dart';
import 'package:ecomm_app/screens/category/category_card.dart';
import 'package:ecomm_app/screens/profile/update_profile_screen.dart';
import 'package:ecomm_app/screens/widgets/success_msg.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import 'dart:convert';

import '../../providers/cart.dart';

class Category extends StatefulWidget {
  static String routeName = "/category";

  @override
  State<Category> createState() => _CategoryState();
}

class _CategoryState extends State<Category> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        iconTheme: const IconThemeData(
          color: kAppBarColor, //change your color here
        ),
        title: const Text("Category", style: TextStyle(color: kAppBarColor)),
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: SingleChildScrollView(
        child: Container(
          height: 500,
          child: ListView(
            scrollDirection: Axis.vertical,
            children: <Widget>[
              CategoryCard(
                  Icon(
                    Icons.book,
                    size: 40,
                  ),
                  'Book'),
              CategoryCard(
                  Icon(
                    Icons.computer,
                    size: 40,
                  ),
                  'Laptops'),
              CategoryCard(
                  Icon(
                    Icons.videogame_asset,
                    size: 40,
                  ),
                  'Games'),
              CategoryCard(
                  Icon(
                    Icons.videocam,
                    size: 40,
                  ),
                  'Movies'),
              CategoryCard(
                  Icon(
                    Icons.watch,
                    size: 40,
                  ),
                  'Watches'),
              CategoryCard(
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
