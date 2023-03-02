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

  @override
  void initState() {
    super.initState();
    _getBannerData();
  }

  Future<void> _getBannerData() async {
    //  await Provider.of<CarouselApi>(context,listen:false).getCarousel();
    await Provider.of<HomePageSlider>(context, listen: false)
        .getHomeSliderImage();
    setState(() {
      isLoadingSpinner = false;
    });
  }

  // List itemColors = [Colors.green, Colors.purple, Colors.blue];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Column(
      children: [
        Provider.of<HomePageSlider>(context, listen: false)
                    .sliderImage
                    .length ==
                0
            ? Container(
                child: Text("pending"),
              )
            : Container(
              // width: 250,
                child: CarouselSlider.builder(
                itemCount: Provider.of<HomePageSlider>(context, listen: false)
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
                            // Text("${Provider.of<HomePageSlider>(context,listen:false).sliderImage[index].bannerImagePath}",
                            // style: TextStyle(
                            //   fontSize: 20
                            // ),),
                            Image.network(
                                Provider.of<HomePageSlider>(context,
                                        listen: false)
                                    .sliderImage[index]
                                    .bannerImagePath,
                                fit: BoxFit.cover,
                                width: 1000)),
                    // ),
                  );
                },
              )),
      ],
    ));
  }
}
//
// const MainHeader(),
        // Expanded(
        //   child: SingleChildScrollView(
        //     physics: const BouncingScrollPhysics(),
        //     child: Column(
        //       children: [
        //         SizedBox(
        //           height: 200,
        //           width: double.infinity,
        //           child: CarouselSlider(
        //             items: [
        //               //   //1st Image of Slider
        //               for (int i = 0; i < imagesList1.length; i++)
        //                 Container(
        //                   // margin: EdgeInsets.all(6.0),
        //                   decoration: BoxDecoration(
        //                     // borderRadius: BorderRadius.circular(8.0),
        //                     image: DecorationImage(
        //                       image: NetworkImage(imagesList1[i]),
        //                       fit: BoxFit.cover,
        //                     ),
        //                   ),
        //                 ),
        //             ],
        //             // items: imagesList
        //             //     .map(
        //             //       (item) => Center(
        //             //         child: Image.network(
        //             //           item,
        //             //           fit: BoxFit.cover,
        //             //         ),
        //             //       ),
        //             //     )
        //             //     .toList(),
        //             // items: [
        //             //   for (int i = 0; i < imagesList1.length; i++)
        //             //     Container(
        //             //       color: imagesList1[i],
        //             //       alignment: Alignment.center,
        //             //       child: Text(
        //             //         'Item $i',
        //             //         style: TextStyle(color: Colors.white, fontSize: 20),
        //             //       ),
        //             //     )
        //             // ],
        //             //                     items: [
        //             //   for (int i = 0; i < imagesList.length; i++)
        //             //     //       child: Image.network(
        //             //     //         item,
        //             //     //         fit: BoxFit.cover,
        //             //     //       ),
        //             //     Container(
        //             //       alignment: Alignment.center,
        //             //       child: Image.network(
        //             //         imagesList[i].thumbnailUrl,
        //             //         fit: BoxFit.cover,
        //             //       ),
        //             //     )
        //             // ],
        //             options: CarouselOptions(
        //                 autoPlay: true, autoPlayInterval: Duration(seconds: 3)),
        //           ),
        //         ),
        //         // Obx(() {
        //         // if (homeController.bannerList.isNotEmpty) {
        //         //   return CarouselSliderView(
        //         //       bannerList: homeController.bannerList);
        //         // } else {
        //         //   return const CarouselLoading();
        //         // }
        //         // }),
        //         // const SectionTitle(title: "Popular Category"),
        //         // Obx(() {
        //         //   if (homeController.popularCategoryList.isNotEmpty) {
        //         //     return PopularCategory(
        //         //         categories: homeController.popularCategoryList);
        //         //   } else {
        //         //     return const PopularCategoryLoading();
        //         //   }
        //         // }),
        //         // const SectionTitle(title: "Popular Product"),
        //         // Obx(() {
        //         //   if (homeController.popularProductList.isNotEmpty) {
        //         //     return PopularProduct(
        //         //         popularProducts: homeController.popularProductList);
        //         //   } else {
        //         //     return const PopularProductLoading();
        //         //   }
        //         // }),
        //       ],
        //     ),
        //   ),
        // )