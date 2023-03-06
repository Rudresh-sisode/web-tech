import 'package:carousel_slider/carousel_options.dart';
import 'package:carousel_slider/carousel_slider.dart';
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
    _getPopularData();
  }

  Future<void> _getPopularData() async {
    await Provider.of<PopularApi>(context,listen: false).getPopularProduct();
    setState(() {
      isLoaderSpinner = false;
    });
  }


  List itemColors = [Colors.green, Colors.purple, Colors.blue];
  final List<int> numbers = [1, 2, 3, 5, 8, 13, 21, 34, 55];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child:
      // Provider.of<PopularApi>(context,listen: false).popularProductsImageData.length == 0 ? 
      isLoaderSpinner ?
      Center(
        child: Container(
            child: Text("loading..."),
          ),
      ) :

       Container(
        padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        height: MediaQuery.of(context).size.height * 0.35,
        child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount:  Provider.of<PopularApi>(context,listen:false).popularProductsImageData.length,
            itemBuilder: (context, index) {
              return Container(
                width: MediaQuery.of(context).size.width * 0.6,
                child: Card(
                  color: Colors.blue,
                  child: Container(
                    child: Image.network(
                      Provider.of<PopularApi>(context,listen:false).popularProductsImageData[index].populaImagePath,
                      fit: BoxFit.cover,
                    ),
                    // child: Center(
                    //     child: Text(
                    //   imagesList1[index].toString(),
                    //   style: TextStyle(color: Colors.white, fontSize: 36.0),
                    // )),
                  ),
                ),
              );
            }),
      ),
    );
  }
}
