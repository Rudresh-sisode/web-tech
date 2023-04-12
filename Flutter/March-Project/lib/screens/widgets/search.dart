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

enum SingingCharacter { lafayette, jefferson }

class Search extends StatefulWidget {
  static String routeName = "/search";

  @override
  _SearchState createState() => _SearchState();
}

class _SearchState extends State<Search> {
  final items = List<String>.generate(10000, (i) => "Item $i");
  late TextEditingController textController;
  List<String> sortingButton = [
    "Sort",
    "Price",
    "Rating",
    "Brand",
  ];

  List<Widget> sortingWidgets = [
    SortProduct(),
    PriceRange(),
    Rating(),
    Brand()
  ];

  bool showSheet = false;
  SingingCharacter? _character = SingingCharacter.lafayette;

  int _selectedIndex = -1;

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

    return Scaffold(
        appBar: AppBar(
          title: Text(
              "Search ${Provider.of<FilterProvider>(context, listen: false).channelType == ChannelType.Popular ? "Popular Products" : Provider.of<FilterProvider>(context, listen: false).channelType == ChannelType.Trending ? "Trending Products" : "Products"}"),
          elevation: 0,
          automaticallyImplyLeading: true,
          backgroundColor: kPrimaryColor,
          centerTitle: true,
        ),
        body: Stack(children: <Widget>[
          GestureDetector(
            onTap: () {
              print("tapped");

              FocusScope.of(context).requestFocus(new FocusNode());
            },
            child: SingleChildScrollView(
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
                      decoration:
                          InputDecoration(prefixIcon: Icon(Icons.search)),
                    ),
                  ),

                  SizedBox(height: MediaQuery.of(context).size.height * 0.001),
                  // SizedBox(height: 10),
                  SizedBox(
                    // height: 100.0,
                    height: MediaQuery.of(context).size.height * 0.06,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      // itemCount: sortingWidgets.length,
                      itemCount: sortingButton.length,
                      itemBuilder: (BuildContext context, int index) {
                        return Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: SizedBox(
                            // height:,
                            width: MediaQuery.of(context).size.width *
                                0.25, // 30% of screen width
                            // child: sortingWidgets[index],
                            child: ElevatedButton(
                              child: Text("${sortingButton[index]}"),
                              onPressed: () {
                                setState(() {
                                  if (_selectedIndex == -1) {
                                    showSheet = !showSheet;
                                  }
                                  _selectedIndex = index;

                                  // if(_selectedIndex == index){

                                  // }

                                  // showSheet = !showSheet;
                                });

                                // setState(() {
                                //   _selectedIndex = index;
                                //   showSheet = !showSheet;
                                // });
                              },
                              style: ElevatedButton.styleFrom(
                                foregroundColor: Colors.white,
                                backgroundColor: _selectedIndex == index
                                    ? Color.fromARGB(255, 102, 59, 123)
                                    : Colors.grey,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(32.0),
                                ),
                              ),
                            ),
                          ),
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
                                    child: (textController.text.length > 0 &&
                                            product.productRequestingData
                                                    .length ==
                                                0)
                                        ? Center(
                                            child: Text("Nothing Found"),
                                          )
                                        : ProductList(
                                            products: product
                                                        .productRequestingData
                                                        .length >
                                                    0
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
                                            child:
                                                Text("please restart the app."),
                                          )),
                              ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          //     isLoadingSpinner
          // ? Center(
          //     child: Container(
          //         height: MediaQuery.of(context).size.height * 0.2,
          //         width: 60,
          //         child: SpinKitCubeGrid(
          //           color: kPrimaryColor,
          //         )),
          //   )
          // :
          Offstage(
            offstage: !showSheet,
            child: DraggableScrollableSheet(
                initialChildSize: 0.5,
                maxChildSize: 0.5,
                builder: (BuildContext context, ScrollController controller) {
                  return Container(
                    decoration: BoxDecoration(
                      color: kPrimaryBackShade,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                      ),
                    ),
                    child: ListView(
                      controller: controller,
                      padding: EdgeInsets.all(10),
                      children: [
                        Container(
                          height: MediaQuery.of(context).size.height * 0.04,
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              Text(
                                'Apply filter',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                    // textAlign:TextAlign.center,/
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold),
                              ),
                              IconButton(
                                icon: Icon(Icons.close),
                                color: Color.fromARGB(255, 44, 41, 41),
                                onPressed: () => setState(() {
                                  showSheet = !showSheet;
                                  _selectedIndex = -1;
                                }),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(
                            height: MediaQuery.of(context).size.width * 0.05),
                        Center(
                          child: 
                          
                          Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Text('SORT BY'),
                              Divider(),
                              ListTile(
                                title: const Text('Relevance'),
                                leading: Radio<SingingCharacter>(
                                  value: SingingCharacter.lafayette,
                                  groupValue: _character,
                                  onChanged: (SingingCharacter? value) {
                                    setState(() {
                                      _character = value;
                                    });
                                  },
                                ),
                              ),
                              ListTile(
                                title: const Text('Popularity'),
                                leading: Radio<SingingCharacter>(
                                  value: SingingCharacter.jefferson,
                                  groupValue: _character,
                                  onChanged: (SingingCharacter? value) {
                                    setState(() {
                                      _character = value;
                                    });
                                  },
                                ),
                              ),
                              ListTile(
                                title: const Text('Price - Low to High'),
                                leading: Radio<SingingCharacter>(
                                  value: SingingCharacter.jefferson,
                                  groupValue: _character,
                                  onChanged: (SingingCharacter? value) {
                                    setState(() {
                                      _character = value;
                                    });
                                  },
                                ),
                              ),
                              ListTile(
                                title: const Text('Price - High to Low'),
                                leading: Radio<SingingCharacter>(
                                  value: SingingCharacter.jefferson,
                                  groupValue: _character,
                                  onChanged: (SingingCharacter? value) {
                                    setState(() {
                                      _character = value;
                                    });
                                  },
                                ),
                              ),

                              // ListTile(
                              //   leading: new Icon(Icons.share),
                              //   title: new Text('Share'),
                              //   onTap: () {
                              //     Navigator.pop(context);
                              //   },
                              // ),
                              // Text('test'),
                            ],
                          ),
                          // Column(
                          //     children: [
                          //       Text("No address available!"),
                          //     ],
                          //   ),
                        )
                      ],
                    ),
                  );
                }),
          )
        ]));
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
