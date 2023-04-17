import 'package:carousel_slider/carousel_options.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/models/carousel.dart';
import 'package:ecomm_app/models/popular.dart';
import 'package:ecomm_app/providers/carousel.dart';
import 'package:ecomm_app/providers/popular.dart';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class Popular extends StatefulWidget {
  const Popular({Key? key}) : super(key: key);

  @override
  _PopularWidgetState createState() => _PopularWidgetState();
}

class _PopularWidgetState extends State<Popular> {
  late List<PopularModel> imagesList = [];
  bool isLoaderSpinner = true;

  @override
  void initState() {
    super.initState();
  }

  // List itemColors = [Colors.green, Colors.purple, Colors.blue];
  // final List<int> numbers = [1, 2, 3, 5, 8, 13, 21, 34, 55];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Consumer<PopularApi>(
        builder: (ctx, popularAPI, _) => Container(
          padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
          height: 120.0,
          child: popularAPI.popularProductsImageData.length > 0
              ? ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: popularAPI.popularProductsImageData.length,
                  itemBuilder: (context, index) {
                    return Container(
                      width: 100.0,
                      // width: MediaQuery.of(context).size.width * 0.2,
                      child: Card(
                        child: Container(
                          decoration: BoxDecoration(
                              // color: Color(0xFF713590),
                              borderRadius: BorderRadius.circular(15),
                              boxShadow: [
                                BoxShadow(
                                    blurRadius: 8,
                                    offset: Offset(0, 15),
                                    color: Color.fromARGB(255, 255, 255, 255)
                                        .withOpacity(.6),
                                    spreadRadius: -9)
                              ]),
                          child: Image.network(
                            popularAPI.popularProductsImageData[index]
                                .populaImagePath,
                            fit: BoxFit.fitHeight,
                          ),
                        ),
                      ),
                    );
                  })
              : FutureBuilder(
                  future: popularAPI.executeGetProduct(),
                  builder: (ctx, popularAPIResultSnapshot) =>
                      popularAPIResultSnapshot.connectionState ==
                              ConnectionState.waiting
                          ? Center(
                              child: Container(
                                child: Text("loading..."),
                              ),
                            )
                          : Center(
                              child: Container(
                                child: Text("please restart the app."),
                              ),
                            ),
                ),
        ),
      ),
    );
  }
}
