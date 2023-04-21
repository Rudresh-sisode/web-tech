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

enum SingingCharacter {lowToHigh, highToLow, showAll }

class Search extends StatefulWidget {
  static String routeName = "/search";

  @override
  _SearchState createState() => _SearchState();
}

class _SearchState extends State<Search> {
  final items = List<String>.generate(10000, (i) => "Item $i");
  late TextEditingController textController;
  bool value = false;
  List<String> sortingButton = [
    "Sort",
    "Price",
    "Rating",
    "Brand",
  ];


  RangeValues _currentRangeValues = RangeValues(100, 50000);

  bool showSheet = false;
  SingingCharacter? _character = SingingCharacter.showAll;
  Icon customIcon = Icon(Icons.search);
  late Widget customSearchBar;
   
  int _selectedIndex = -1;

  @override
  void initState() {
    super.initState();
    textController = TextEditingController();

   customSearchBar = Text(
              "Search ${Provider.of<FilterProvider>(context, listen: false).channelType == ChannelType.Popular ? "Popular Products" : Provider.of<FilterProvider>(context, listen: false).channelType == ChannelType.Trending ? "Trending Products" : Provider.of<FilterProvider>(context, listen: false).channelType == ChannelType.MostSelling ? "Most Selling Products": Provider.of<FilterProvider>(context, listen: false).channelType == ChannelType.PrimiumProduct ? "Premium Product" : "Products"}",
              style: TextStyle(
                  color: Color.fromARGB(255, 255, 255, 255),
                  fontWeight: FontWeight.w400,
                  fontSize: 20,),
              );
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

    return Scaffold(
        appBar: AppBar(
          title: customSearchBar ,
          elevation: 0,
          automaticallyImplyLeading: true,
          backgroundColor: kPrimaryColor,
          centerTitle: true,
          leading: InkWell(
          onTap: () async {
            Provider.of<Products>(context, listen: false).showAllProducts();
            Navigator.pop(context);
          },
          child: Icon(
            Icons.arrow_back_rounded,
            color: Color.fromARGB(255, 253, 253, 253),
            size: 24,
          ),
        ),
          actions: [
            IconButton(
              icon: customIcon,
              onPressed: () {
                print("search");

                setState(() {

                  if(showSheet == true){
                    showSheet = !showSheet;
                    _selectedIndex = -1;
                  }
                  
                  if (this.customIcon.icon == Icons.search) {
                        
                      this.customIcon = Icon(Icons.close);
                      //  customIcon = const Icon(Icons.cancel);
                      customSearchBar = 
                      Row(
                        // crossAxisAlignment: CrossAxisAlignment.,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Icon(
                            Icons.search,
                            color: Colors.white,
                            size: 20,
                          ),
                        Container(
                          
                          height: MediaQuery.of(context).size.width * 0.1,

                          width: MediaQuery.of(context).size.width * 0.6,
                          child: 
                          TextField(
                            controller: textController,
                            onChanged: (_){
                              Provider.of<Products>(context, listen: false)
                                  .searchProductList(textController.text);
                            },
                          onTap: () {
                            if(showSheet){
                               setState(() {
                                showSheet = !showSheet;
                                _selectedIndex = -1;
                              });
                            }
                          },
                          
                            decoration: 
                            InputDecoration(

                            contentPadding: EdgeInsets.fromLTRB(20, 0, 2, 0),
                            hintText: 'search...',
                            hintStyle: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontStyle: FontStyle.italic,
                            ),
                            border: InputBorder.none,
                            ),
                            style: TextStyle(
                            color: Colors.white,
                            ),
                          ),
                        ),
                      ],);
                  } else {
                    this.customIcon = Icon(Icons.search);
                    customSearchBar = Text(
                        "Search ${Provider.of<FilterProvider>(context, listen: false).channelType == ChannelType.Popular ? "Popular Products" : Provider.of<FilterProvider>(context, listen: false).channelType == ChannelType.Trending ? "Trending Products" : Provider.of<FilterProvider>(context, listen: false).channelType == ChannelType.MostSelling ? "Most Selling Products": Provider.of<FilterProvider>(context, listen: false).channelType == ChannelType.PrimiumProduct ? "Premium Product" : "Products"}",
                        style: TextStyle(
                        color: Color.fromARGB(255, 255, 255, 255),
                        fontWeight: FontWeight.w400,
                        fontSize: 20,
                        fontFamily: "Roboto"),
                      );
                  }
                });
              },
              color: Colors.white,
              
            )
          ],
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
                  // SizedBox(height: 10),
                  // Padding(
                  //   padding: EdgeInsets.symmetric(
                  //       horizontal: MediaQuery.of(context).size.width * 0.05),
                  //   child: TextField(
                  //     controller: textController,
                  //     onChanged: (_) {
                  //       Provider.of<Products>(context, listen: false)
                  //           .searchProductList(textController.text);
                  //       print("entered text ${textController.text}");
                  //     },
                  //     textInputAction: TextInputAction.send,
                  //     style: TextStyle(
                  //         color: Color.fromARGB(255, 0, 0, 0),
                  //         fontWeight: FontWeight.w300),
                  //     decoration:
                  //         InputDecoration(prefixIcon: Icon(Icons.search)),
                  //   ),
                  // ),

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
                                FocusScope.of(context).requestFocus(new FocusNode());
                                setState(() {
                                  if (_selectedIndex == -1) {
                                    showSheet = !showSheet;
                                  }
                                  _selectedIndex = index;
                                });
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
                                    child: !product.isFounded
                                    // (textController.text.length > 0 &&
                                    //         product.productRequestingData
                                    //                 .length ==
                                    //             0 )
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
                                          ),
                                          ),
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
            child: GestureDetector(
              onTap: () {
                FocusScope.of(context).requestFocus(new FocusNode());
                // setState(() {
                //   showSheet = !showSheet;
                // });
              },
              child: DraggableScrollableSheet(
                  initialChildSize: 0.6,
                  maxChildSize: 0.6,
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
                                      color: kPrimaryBackShadeLightCheckboxText,
                                      // color: Colors.black,
                                      fontSize: 18,
                                      // fontWeight: FontWeight.bold
                                      ),
                                ),
                                IconButton(
                                  icon: Icon(Icons.close),
                                  color: Color.fromARGB(255, 44, 41, 41),
                                  onPressed: () => setState(() {
                                    FocusScope.of(context).requestFocus(new FocusNode());
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
                              child: _selectedIndex == 0
                                  ? Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: <Widget>[
                                        Text('SORT BY',style: TextStyle(fontSize: 16,color: Colors.black)),
                                        Divider(),
                                        // ListTile(
                                        //   title: const Text('Relevance'),
                                        //   leading: Radio<SingingCharacter>(
                                        //     value: SingingCharacter.relevance,
                                        //     groupValue: _character,
                                        //     onChanged: (SingingCharacter? value) {
                                        //       setState(() {
                                        //         _character = value;
                                        //       });
                                        //     },
                                        //   ),
                                        // ),
                                        ListTile(
                                          title: const Text('Show All'),
                                          leading: Radio<SingingCharacter>(
                                            value: SingingCharacter.showAll,
                                            groupValue: _character,
                                            onChanged: (SingingCharacter? value) {
                                              setState(() {
                                                _character = value;
                                              });
                                            },
                                          ),
                                        ),
                                        ListTile(
                                          title:
                                              const Text('Price - Low to High'),
                                          leading: Radio<SingingCharacter>(
                                            value: SingingCharacter.lowToHigh,
                                            groupValue: _character,
                                            onChanged: (SingingCharacter? value) {
                                              setState(() {
                                                _character = value;
                                              });
                                            },
                                          ),
                                        ),
                                        ListTile(
                                          title:
                                              const Text('Price - High to Low'),
                                          leading: Radio<SingingCharacter>(
                                            value: SingingCharacter.highToLow,
                                            groupValue: _character,
                                            onChanged: (SingingCharacter? value) {
                                              setState(() {
                                                _character = value;
            
                                              });
                                            },
                                          ),
                                        ),
                                        
            
                                        //Add ElevatedButton
                                        ElevatedButton(
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: kPrimaryColorLight,
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(32.0),
                                            ),
                                          ),
                                          onPressed: () {
                                            // Navigator.pop(context);
                                            // if(_character == SingingCharacter.relevance){
                                            //   // Provider.of<Products>(context,listen: false).s(0);
                                            // }else if(_character == SingingCharacter.popularity){
                                            //   // Provider.of<Products>(context,listen: false).sortProductDataList(1);
                                            // }
                                            // else 
                                            if(_character == SingingCharacter.lowToHigh){
                                              Provider.of<Products>(context,listen: false).sortProductLowestToHighest();
                                              setState(() {
            
                                                showSheet = !showSheet;
                                                _selectedIndex = -1;
                                              });
                                            }else if(_character == SingingCharacter.highToLow){
                                              Provider.of<Products>(context,listen: false).sortProductHighestToLowest();
                                              setState(() {
            
                                                showSheet = !showSheet;
                                                _selectedIndex = -1;
                                              });
                                            }
                                            else if(_character == SingingCharacter.showAll){
                                              Provider.of<Products>(context,listen: false).showAllProducts();
                                              setState(() {
                                                showSheet = !showSheet;
                                                _selectedIndex = -1;
                                              });
                                            }
                                          },
                                          child: Text(
                                            "Apply",
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 18,
                                            ),
                                          ),
                                        ),
                                      ],
                                    )
                                  :
                                  //add Column and Price Range also show selected price range
                                  _selectedIndex == 1
                                      ? 
                                      Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: <Widget>[
                                            Text('PRICE RANGE',style: TextStyle(fontSize: 16,color: Colors.black)),
                                            Divider(),
                                            RangeSlider(
                                              // activeColor: Color.fromARGB(255, 49, 47, 47),
                                              // inactiveColor: ,
                                              values: _currentRangeValues,
                                              max: 50000,
                                              // min: ,
                                              divisions: 10,
                                              labels: RangeLabels(
                                                "${_currentRangeValues.start.round().toString()}₹",
                                                "${_currentRangeValues.end.round().toString()}₹",
                                              ),
                                              onChanged: (RangeValues values) {
                                                setState(() {
                                                  _currentRangeValues = values;
                                                });
                                              },
                                            ),
                                            Text(
                                              'Selected range: ${_currentRangeValues.start.toStringAsFixed(2)}₹ - ${_currentRangeValues.end.toStringAsFixed(2)}₹',
                                              style: TextStyle(fontSize: 16,color: Colors.green),
                                            ),
                                            //Add ElevatedButton
                                            ElevatedButton(
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor:
                                                    kPrimaryColorLight,
                                                shape: RoundedRectangleBorder(
                                                  borderRadius:
                                                      BorderRadius.circular(32.0),
                                                ),
                                              ),
                                              onPressed: () {
                                              Provider.of<Products>(context,listen: false).sortProductBetweenPriceRange(_currentRangeValues.start.toInt(),_currentRangeValues.end.toInt());
                                                // Navigator.pop(context);
                                                setState(() {
                                                  showSheet = !showSheet;
                                                  _selectedIndex = -1;
                                                });
                                              },
                                              child: Text(
                                                "Apply",
                                                style: TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 18,
                                                ),
                                              ),
                                            ),
                                          ],
                                        )
                                      : _selectedIndex == 2
                                          ? 
                                          Column(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: <Widget>[
                                                Text('RATING',style: TextStyle(fontSize: 16,color: Colors.black)),
                                                Divider(),
                                                RatingBar.builder(
                                                  initialRating: 3,
                                                  minRating: 1,
                                                  direction: Axis.horizontal,
                                                  allowHalfRating: true,
                                                  itemCount: 5,
                                                  itemPadding: EdgeInsets.symmetric(horizontal: 4.0),
                                                  itemBuilder: (context, _) => Icon(
                                                    Icons.star,
                                                    color: Colors.amber,
                                                  ),
                                                  onRatingUpdate: (rating) {
                                                    print(rating);
                                                  },
                                                ),
                                                //Add ElevatedButton
                                                ElevatedButton(
                                                  style: ElevatedButton.styleFrom(
                                                    backgroundColor:
                                                        kPrimaryColorLight,
                                                    shape: RoundedRectangleBorder(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              32.0),
                                                    ),
                                                  ),
                                                  onPressed: () {
                                                    // Navigator.pop(context);
                                                  },
                                                  child: Text(
                                                    "Apply",
                                                    style: TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 18,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            )
                                          : _selectedIndex == 3
                                              ? 
                                               Column(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment.center,
                                                  children: <Widget>[
                                                    Text('BRAND',
                                                        textAlign:
                                                            TextAlign.center,
                                                        style: TextStyle(fontSize: 16,color: Colors.black),
                                                            ),
                                                    Divider(),
            
                                                    Row(
                                                      // crossAxisAlignment: CrossAxisAlignment.center,
                                                      mainAxisAlignment:
                                                          MainAxisAlignment
                                                              .spaceAround,
                                                      children: <Widget>[
                                                        SizedBox(
                                                          width: 10,
                                                        ), //SizedBox
                                                        Text(
                                                          'Sam-sunga-sunga',
                                                          // style: TextStyle(
                                                          //     fontSize: 17.0,
                                                          //     color: kPrimaryBackShadeLightCheckboxText),
                                                        ), //Text
                                                        SizedBox(
                                                            width: 10), //SizedBox
                                                        /** Checkbox Widget **/
                                                        CheckboxTheme(
                                                          data: CheckboxThemeData(
                                                            shape: RoundedRectangleBorder( borderRadius:
                                                                  BorderRadius.circular(5.0),
                                                              side: BorderSide(color: Color.fromARGB(255, 158, 158, 158)),
                                                            ),
                                                            fillColor: MaterialStateColor.resolveWith(
                                                                        (states) {
                                                              if (states.contains(
                                                                  MaterialState.disabled)) {
                                                                return Colors.grey
                                                                    .shade400;
                                                              }
                                                              return kPrimaryBackShadeLightCheckbox;
                                                            }),
                                                          ),
                                                          child: Checkbox(
                                                            value: this.value,
                                                            onChanged:
                                                                (bool? value) {
                                                              setState(() {
                                                                this.value =
                                                                    value!;
                                                              });
                                                            },
                                                          ),
                                                        )
                                                      ], 
                                                    ),
            
                                                  ],
                                                )
                                              : 
                                              Column(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment.center,
                                                  children: <Widget>[
                                                    Text('DISCOUNT'),
                                                    Divider(),
                                                    RatingBar.builder(
                                                      initialRating: 3,
                                                      minRating: 1,
                                                      direction: Axis.horizontal,
                                                      allowHalfRating: true,
                                                      itemCount: 5,
                                                      itemPadding:
                                                          EdgeInsets.symmetric(
                                                              horizontal: 4.0),
                                                      itemBuilder: (context, _) =>
                                                          Icon(
                                                        Icons.star,
                                                        color: Colors.amber,
                                                      ),
                                                      onRatingUpdate: (rating) {
                                                        print(rating);
                                                      },
                                                    ),
                                                    //Add ElevatedButton
                                                    ElevatedButton(
                                                      style: ElevatedButton
                                                          .styleFrom(
                                                        backgroundColor:
                                                            kPrimaryColorLight,
                                                        shape:
                                                            RoundedRectangleBorder(
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(32.0),
                                                        ),
                                                      ),
                                                      onPressed: () {
                                                        // Navigator.pop(context);
                                                      },
                                                      child: Text(
                                                        "Apply",
                                                        style: TextStyle(
                                                          color: Colors.white,
                                                          fontSize: 18,
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                )
                                             
            
                              // Add Five Star rating bar design
            
                              )
                        ],
                      ),
                    );
                  }),
            ),
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
