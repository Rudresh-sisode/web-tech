import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/models/recomended.dart';
import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:provider/provider.dart';

import '../../components/global_snack_bar.dart';
import '../../providers/cart.dart';
import '../../providers/popular.dart';

class Premium extends StatelessWidget {
  List<Item> products = [
    Item(
        name: 'Apple',
        unit: 'Kg',
        price: 20,
        image: 'assets/images/tshirt.png'),
    Item(
        name: 'Mango',
        unit: 'Doz',
        price: 30,
        image: 'assets/images/glap.png'),
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
    return SafeArea(
      child: SingleChildScrollView(
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 20.0),
          height: 200.0,

          child: 
          Consumer<PopularApi>(
            builder: (ctx, product, _) => Container(
                child: product.premiumProductsImageData.length > 0 ?
                  ListView.builder(
                                scrollDirection: Axis.horizontal,
                                padding:
                                    const EdgeInsets.symmetric(vertical: 10.0, horizontal: 8.0),
                                shrinkWrap: true,
                                itemCount: product.premiumProductsImageData.length,
                                itemBuilder: (context, index) {
                                  return Card(
                                    // color: Color.fromARGB(255, 208, 224, 233),
                                    elevation: 5.0,
                                    child: Padding(
                                      padding: const EdgeInsets.all(4.0),
                                      child: Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                        mainAxisSize: MainAxisSize.max,
                                        children: [
                                          // Image(
                                          //   image: AssetImage(products[index].image.toString()),
                                          // )
                                          Image.network(
                                            product.premiumProductsImageData[index].sliderImageFullPath,
                                            // height: 80,
                                            // width: 80,
                                          ),
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
                                                                '${product.premiumProductsImageData[index].name}\n',
                                                            style: const TextStyle(
                                                                fontWeight: FontWeight.bold,
                                                                fontSize: 12.0)),
                                                      ]),
                                                ),
                                                RichText(
                                                  maxLines: 1,
                                                  text: TextSpan(
                                                      text: 'Price: ₹ ',
                                                      style: TextStyle(
                                                          color: Colors.blueGrey.shade800,
                                                          fontSize: 11.0),
                                                      children: [
                                                        TextSpan(
                                                            text:
                                                                '${product.premiumProductsImageData[index].price.toString()}\n',
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
                                                    itemSize: 20.0,
                                                    direction: Axis.horizontal,
                                                  ),
                                                ),
                                                ElevatedButton(
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: kPrimaryColor,
                                                elevation: 3,
                                                minimumSize: Size(30, 30),
                                                side: BorderSide(
                                                    width: 3,
                                                    color: Color.fromARGB(255, 171, 118, 207)),
                                              ),
                                              onPressed: () {
                                                //  saveData(index);
                                                Provider.of<Cart>(context, listen: false).addItem(
                                                product.premiumProductsImageData[index].id.toString(),"1");
                                                GlobalSnackBar.show(context, 'Items added in cart');
                                              },
                                              child: const Text(
                                                'Add to Cart',
                                                style: TextStyle(fontSize: 10),
                                              )),
                                                //   maxLines: 1,
                                                //   text: TextSpan(
                                                //       text: 'Unit: ',
                                                //       style: TextStyle(
                                                //           color: Colors.blueGrey.shade800,
                                                //           fontSize: 16.0),
                                                //       children: [
                                                //         TextSpan(
                                                //             text:
                                                //                 '${products[index].unit.toString()}\n',
                                                //             style: const TextStyle(
                                                //                 fontWeight: FontWeight.bold)),
                                                //       ]),
                                                // ),
                                              ],
                                            ),
                                          ),
                                          
                                        ],
                                      ),
                                    ),
                                  );
                                }) :
                                Center(child: 
                                  Text('Please wait...', 
                                    style: TextStyle(color: Colors.red),
                                  ),
                                ),
            ),
          ),
        ),
      ),
    );
  }
}
