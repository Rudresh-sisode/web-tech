import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/models/recomended.dart';
import 'package:ecomm_app/screens/widgets/filter_widgets/brand.dart';
import 'package:ecomm_app/screens/widgets/filter_widgets/price_range.dart';
import 'package:ecomm_app/screens/widgets/filter_widgets/rating.dart';
import 'package:ecomm_app/screens/widgets/filter_widgets/sort_product.dart';
import 'package:ecomm_app/screens/widgets/product_list.dart';
import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:provider/provider.dart';
import 'package:ecomm_app/providers/products.dart';

import '../../providers/filter-provider.dart';

class Search extends StatefulWidget {
  static String routeName = "/search";

  @override
  _SearchState createState() => _SearchState();
}

class _SearchState extends State<Search> {
  final items = List<String>.generate(10000, (i) => "Item $i");
  late TextEditingController textController;
  List<Widget> sortingWidgets = [
    SortProduct(),
    PriceRange(),
    Rating(),
    Brand()
  ];

  @override
  void initState() {
    super.initState();
    textController = TextEditingController();
  }

  @override
  Widget build(BuildContext context) {
    TextEditingController controller = TextEditingController();
    controller.addListener(() {
      print('Text field data');
      print(controller.text); // Print current value
      // controller.text = "Demo Text"; // Set new value
      // Do something here
    });

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

// List<DropdownMenuItem<String>> get dropdownItems{
//   List<DropdownMenuItem<String>> menuItems = [
//     DropdownMenuItem(child: Text("USA"),value: "USA"),
//     DropdownMenuItem(child: Text("Canada"),value: "Canada"),
//     DropdownMenuItem(child: Text("Brazil"),value: "Brazil"),
//     DropdownMenuItem(child: Text("England"),value: "England"),
//   ];
//   return menuItems;
// }

    return Scaffold(
      // appBar: AppBar(title: Text('GridView Demo')),
      appBar: AppBar(
        title: Text(
            "Search ${Provider.of<FilterProvider>(context, listen: false).channelType == ChannelType.Popular ? "Popular Products" : Provider.of<FilterProvider>(context, listen: false).channelType == ChannelType.Trending ? "Trending Products" : "Products"}"),
        elevation: 0,
        automaticallyImplyLeading: true,
        backgroundColor: kPrimaryColor,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(height: 10),
            Padding(
              padding: EdgeInsets.symmetric(
                  horizontal: MediaQuery.of(context).size.width * 0.05),
              child: TextField(
                controller: textController,
                onChanged: (_) {
                  Provider.of<Products>(context, listen: false)
                      .searchProductList(textController.text);
                      print("entered text ${textController.text}");
                },
                textInputAction: TextInputAction.send,
                style: TextStyle(
                    color: Color.fromARGB(255, 0, 0, 0),
                    fontWeight: FontWeight.w300),
                decoration: InputDecoration(prefixIcon: Icon(Icons.search)),
              ),
            ),

            SizedBox(height: MediaQuery.of(context).size.height * 0.001),
            // SizedBox(height: 10),
            SizedBox(
              height: 100.0,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: sortingWidgets.length,
                itemBuilder: (BuildContext context, int index) {
                  return SizedBox(
                    width: MediaQuery.of(context).size.width *
                        0.25, // 30% of screen width
                    child: sortingWidgets[index],
                  );
                },
              ),
            ),

            Consumer<Products>(
              builder: (ctx, product, _) => Container(
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(8, 8, 8, 2),
                  child: product.productDataList.length > 0
                      ? Column(
                          children: <Widget>[
                            Container(
                              // height: ,
                              width: double.infinity,
                              child: (textController.text.length > 0 && product.productRequestingData.length == 0) ? Center(child: Text("Nothing Found"),) : ProductList(
                                products:
                                    product.productRequestingData.length > 0
                                        ? product.productRequestingData
                                        : product.productDataList,
                              ),
                            ),
                          ],
                        )
                      : FutureBuilder(
                          future: product.getExecuteProductData(),
                          builder: (ctx, productReturnSnapshot) =>
                              productReturnSnapshot.connectionState ==
                                      ConnectionState.waiting
                                  ? Center(
                                      child: Container(
                                        child: Text("loading..."),
                                      ),
                                    )
                                  : Center(
                                      child: Container(
                                      child: Text("please restart the app."),
                                    )),
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ItemList extends StatelessWidget {
  final int itemNo;

  const ItemList(
    this.itemNo,
  );

  @override
  Widget build(BuildContext context) {
    final Color color = Colors.primaries[itemNo % Colors.primaries.length];
    return Padding(
      padding: const EdgeInsets.all(2.0),
      child: Card(
        color: Color.fromARGB(255, 255, 255, 255),
        elevation: 5.0,
        child: Padding(
          padding: const EdgeInsets.all(4.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            mainAxisSize: MainAxisSize.max,
            children: [
              Image(
                width: 75,
                image: AssetImage('assets/images/Image Popular Product 3.png'),
              ),
              SizedBox(
                width: 75,
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
                              color: Colors.blueGrey.shade800, fontSize: 11.0),
                          children: [
                            TextSpan(
                                text: '${itemNo.toString()}\n',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12.0)),
                          ]),
                    ),
                    RichText(
                      maxLines: 1,
                      text: TextSpan(
                          text: 'Price: ' r"$",
                          style: TextStyle(
                              color: Colors.blueGrey.shade800, fontSize: 11.0),
                          children: [
                            TextSpan(
                                text: '${itemNo.toString()}\n',
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
                    )
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
              // ElevatedButton(
              //     style: ElevatedButton.styleFrom(
              //       backgroundColor: kPrimaryColor,
              //       elevation: 3,
              //       minimumSize: Size(30, 30),
              //       side: BorderSide(
              //           width: 3,
              //           color: Color.fromARGB(255, 171, 118, 207)),
              //     ),
              //     onPressed: () {
              //       //  saveData(index);
              //     },
              //     child: const Text(
              //       'Add to Cart',
              //       style: TextStyle(fontSize: 10),
              //     )),
            ],
          ),
        ),
      ),
    );
  }
}
