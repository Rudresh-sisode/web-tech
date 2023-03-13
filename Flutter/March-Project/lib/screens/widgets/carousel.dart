import 'package:carousel_slider/carousel_options.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:ecomm_app/models/carousel.dart';
import 'package:ecomm_app/providers/carousel.dart';
import 'package:ecomm_app/providers/home-page-slider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class Carousel extends StatefulWidget {
  const Carousel({Key? key}) : super(key: key);

  @override
  _BannergWidgetState createState() => _BannergWidgetState();
}

class _BannergWidgetState extends State<Carousel> {
  bool isLoadingSpinner = true;
  late BuildContext _buildContext;

  @override
  void initState() {
    super.initState();

  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: 

        Column(
      children: [
        Consumer<HomePageSlider>(builder: (ctx,hpSlider,_)=> 
        Container(
          child:hpSlider.sliderImage.length > 0 ? CarouselSlider.builder(
                itemCount: hpSlider
                    .sliderImage
                    .length,
                options: CarouselOptions(
                  autoPlay: true,
                  aspectRatio: 2.0,
                  enlargeCenterPage: true,
                ),
                itemBuilder: (context, index, realIdx) {
                  return Container(
                    child: Center(
                        child:
                            Image.network(
                                hpSlider
                                    .sliderImage[index]
                                    .bannerImagePath,
                                fit: BoxFit.cover,
                                width: 1000)),
                    // ),
                  );
                },
              ) : FutureBuilder(future: hpSlider.executeGetSlider() ,builder: (ctx,hpSliderResultSnapshot)=>
              hpSliderResultSnapshot.connectionState == ConnectionState.waiting ? Container(
                child: Text("pending"),
              ) : Container(
                child: Text("please restart the app."),
              )) ,
        ),),
       
      ],
    ));
  }
}
