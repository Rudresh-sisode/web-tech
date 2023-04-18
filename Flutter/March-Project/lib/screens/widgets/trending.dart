import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/models/recomended.dart';
import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:provider/provider.dart';
import 'package:ribbon_widget/ribbon_widget.dart';

import '../../components/global_snack_bar.dart';
import '../../providers/cart.dart';
import '../../providers/popular.dart';
import '../../providers/products.dart';

class Trending extends StatelessWidget {
  List<Item> products = [
    Item(name: 'Glap', unit: 'Kg', price: 20, image: 'assets/images/glap.png'),
    Item(
        name: 'Tshirt',
        unit: 'Doz',
        price: 30,
        image: 'assets/images/tshirt.png'),
    Item(
        name: 'Strawberry',
        unit: 'Box',
        price: 12,
        image: 'assets/images/ps4_console_white_2.png'),
    Item(
        name: 'Fruit Basket',
        unit: 'Kg',
        price: 55,
        image: 'assets/images/Image Popular Product 3.png'),
  ];

  @override
  Widget build(BuildContext context) {
double nearLength = 25;
  double farLength = 20;
    Color color = Colors.redAccent;
    RibbonLocation location = RibbonLocation.topStart;

    return SafeArea(
      child: SingleChildScrollView(
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 20.0),
          height: 100.0,
          child:
          Consumer<PopularApi>(
            builder: (ctx, product, _) => 
            Container(
                child: product.trendingProductsImageData.length > 0 ?
                ListView.builder(
              scrollDirection: Axis.horizontal,
              padding:
                  const EdgeInsets.symmetric(vertical: 10.0, horizontal: 8.0),
              shrinkWrap: true,
              itemCount: product.trendingProductsImageData.length,
              itemBuilder: (context, index) {
                return Card(
                  color: Color.fromARGB(255, 255, 255, 255),
                  elevation: 5.0,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Ribbon(
                          nearLength: nearLength,
                          farLength: farLength,
                          title: 'New!',
                          titleStyle: TextStyle(
                              color: Colors.greenAccent,
                              fontSize: 18,
                              fontWeight: FontWeight.bold),
                          // color: Colors.redAccent,
                          // location: location,
                          child: Container(
                              width: 25,
                              // height: 30,
                              // color: Colors.blueAccent,
                              child: Center(
                              //     child: Text(
                              //   'hello ribbon',
                              //   style: TextStyle(
                              //       color: Colors.white, fontSize: 20),
                              // )
                              )
                              ),
                        ),
                        Image.network(
                          product.trendingProductsImageData[index].sliderImageFullPath,
                          height: 80,
                          width: 80,
                        ),
                        // Image(
                        //   height: 80,
                        //   width: 80,
                        //   image: AssetImage(products[index].image.toString()),
                        // ),
                        SizedBox(
                          width: 130,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(
                                height: 5.0,
                              ),
                              RichText(
                                overflow: TextOverflow.ellipsis,
                                maxLines: 1,
                                text: TextSpan(
                                    text: 'Name: ',
                                    style: TextStyle(
                                        color: Colors.blueGrey.shade800,
                                        fontSize: 11.0),
                                    children: [
                                      TextSpan(
                                          text:
                                              '${product.trendingProductsImageData[index].name}\n',
                                          style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 12.0)),
                                    ]),
                              ),

                              RichText(
                                maxLines: 1,
                                text: TextSpan(
                                    text: 'Price: ' + "₹: ",
                                    style: TextStyle(
                                        color: Colors.blueGrey.shade800,
                                        fontSize: 11.0),
                                    children: [
                                      TextSpan(
                                          text:
                                              '${product.trendingProductsImageData[index].price.toString()}\n',
                                          style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 12.0)),
                                    ]),
                              ),
                              SizedBox(
                                child: RatingBarIndicator(
                                  rating: 3.50,
                                  itemBuilder: (context, index) => Icon(
                                    Icons.star,
                                    color: Colors.amber,
                                  ),
                                  itemCount: 5,
                                  itemSize: 12.0,
                                  direction: Axis.horizontal,
                                ),
                              ),
                            ],
                          ),
                        ),
                        ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: kPrimaryColor,
                              elevation: 4,
                              minimumSize: Size(20, 30),
                              side: BorderSide(
                                  width: 1,
                                  color: Color.fromARGB(255, 171, 118, 207)),
                            ),
                            onPressed: () {
                              //add the product to cart
                              Provider.of<Cart>(context, listen: false).productData = Provider.of<Products>(context, listen: false).productDataList;
                             Provider.of<Cart>(context, listen: false).addItem(
                                  product.trendingProductsImageData[index].productId.toString(),"1");
                                  GlobalSnackBar.show(context, 'Items added in cart');
                            },
                            child: const Text(
                              'Add to Cart',
                              style: TextStyle(fontSize: 10),
                            ),
                            ),
                      ],
                    ),
                  ),
                );
              }) :
              Center(
                    child: Container(
                      child: Text("loading..."),
                    ),
                  ),
              // FutureBuilder(
              //   future: product.executeGetProduct(),
              //             builder: (ctx, productReturnSnapshot) =>
              //                 productReturnSnapshot.connectionState ==
              //                         ConnectionState.waiting
              //                     ? Center(
              //                         child: Container(
              //                           child: Text("loading..."),
              //                         ),
              //                       )
              //                     : Center(
              //                         child: Container(
              //                         child: Text("please restart the app."),
              //                       ),
              //                       ),
              //           ),
            ),
          )

           
        ),
      ),
    );
  }
}
