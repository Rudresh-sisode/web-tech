import 'dart:async';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:easy_debounce/easy_debounce.dart';
import 'package:ecomm_app/app_theme.dart';
import 'package:ecomm_app/components/global_snack_bar.dart';
import 'package:ecomm_app/components/menu/bottom_menu.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/demo.dart';
import 'package:ecomm_app/enums.dart';
import 'package:ecomm_app/providers/auth.dart';
import 'package:ecomm_app/providers/bottom-menu.dart';
import 'package:ecomm_app/providers/carousel.dart';
import 'package:ecomm_app/providers/cart.dart';
import 'package:ecomm_app/providers/filter-provider.dart';
import 'package:ecomm_app/providers/products.dart';
import 'package:ecomm_app/screens/widgets/carousel.dart';
import 'package:ecomm_app/screens/widgets/most_value_product.dart';
import 'package:ecomm_app/screens/widgets/popular.dart';
import 'package:ecomm_app/screens/widgets/premium.dart';
// import 'package:ecomm_app/screens/widgets/popular.dart';
import 'package:ecomm_app/screens/widgets/product_list.dart';
import 'package:ecomm_app/screens/widgets/recommended.dart';
import 'package:ecomm_app/services/local_notification_service.dart';
import 'package:ecomm_app/screens/widgets/search.dart';
import 'package:ecomm_app/screens/widgets/trending.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:provider/provider.dart';

import 'models/product-details.dart';
import 'models/product.dart';

class ProductListingWidget extends StatefulWidget {
  static String routeName = "/product";

  const ProductListingWidget({Key? key}) : super(key: key);

  @override
  _ProductListingWidgetState createState() => _ProductListingWidgetState();
}

//here we need to call three API, the third API, need pagination logic for rendering the products

class _ProductListingWidgetState extends State<ProductListingWidget> {
  late TextEditingController textController;
  final scaffoldKey = GlobalKey<ScaffoldState>();
  bool isSearchStarted = false;
  // late BuildContext _buildContext;
  // late Products _productsProvider;
  bool isLoadingSpineer = true;
  bool productDataLoading = true;

  List<ProductDetails> searchedProducts = [];
  List<ProductDetails> products = [];

  late StreamSubscription subscription;
  bool isDeviceConnected = false;
  bool isAlertSet = false;
  Icon customIcon = const Icon(Icons.search);
  Widget customSearchBar = const Text('search products...');

  
  getConnectivity() =>
      subscription = Connectivity().onConnectivityChanged.listen(
        (ConnectivityResult result) async {
          isDeviceConnected = await InternetConnectionChecker().hasConnection;
          if (!isDeviceConnected && isAlertSet == false) {
            showDialogBox();
            setState(() => isAlertSet = true);
          }
        },
      );

  // late List<Product> products = [];

  // void _getData() async {
  //   products = (await Products().getProductList())!;
  //   Future.delayed(const Duration(seconds: 1)).then((value) => setState(() {}));
  // }

// @override
// void didChangeDependencies() {
//   super.didChangeDependencies();
//   _buildContext = context;
// }
  @override
  void dispose() {
    subscription.cancel();
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    print('dependancy changes on product listing widget');
  }

  @override
  void initState() {
    super.initState();
    getConnectivity();
    textController = TextEditingController();

    // 1. This method call when app in terminated state and you get a notification
    // when you click on notification app open from terminated state and you can
    // get notification data in this method

    FirebaseMessaging.instance.getInitialMessage().then(
      (message) {
        print("FirebaseMessaging.instance.getInitialMessage");
        if (message != null) {
          print("New Notification");
          if (message.data['_id'] != null) {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => Demo(
                  id: message.data['_id'],
                ),
              ),
            );
          }
        }
      },
    );

    // 2. This method only call when App in forground it mean app must be opened
    FirebaseMessaging.onMessage.listen(
      (message) {
        print("FirebaseMessaging.onMessage.listen");
        if (message.notification != null) {
          print(message.notification!.title);
          print(message.notification!.body);
          print("message.data11 ${message.data}");
          LocalNotificationService.createanddisplaynotification(message);
        }
      },
    );

    // 3. This method only call when App in background and not terminated(not closed)
    FirebaseMessaging.onMessageOpenedApp.listen(
      (message) {
        print("FirebaseMessaging.onMessageOpenedApp.listen");
        if (message.notification != null) {
          print(message.notification!.title);
          print(message.notification!.body);
          print("message.data22 ${message.data['_id']}");
        }
      },
    );

    SchedulerBinding.instance.addPostFrameCallback((_) {
      String otpMessage =
          Provider.of<Auth>(context, listen: false).userRegMessage;
      if (otpMessage.isNotEmpty) {
        GlobalSnackBar.show(context, otpMessage);
      }
      Provider.of<Auth>(context, listen: false).userRegMessage = "";
      // Provider.of<BottomMenuHandler>(context,listen:false).changeCurrentValue(BottomMuenu.Home);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        automaticallyImplyLeading: false,
        centerTitle: true,
        leading: SizedBox(
            height: 10.0,
            width: 10.0, // fixed width and height
            child: Image.asset(
              'assets/images/logo1.png',
            ),
          ),
        title: Text('G-Store ',
            style: TextStyle(
                fontFamily: 'Open Sans', fontWeight: FontWeight.bold)),
      ),

      
      body: SingleChildScrollView(
       
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: <Widget>[
            // Container(
            //   child: Padding(
            //     padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
            //     child: Container(
            //       width: MediaQuery.of(context).size.width * 0.95,
            //       height: 50,
            //       decoration: BoxDecoration(
            //         color: AppTheme.of(context).secondaryBackground,
            //         borderRadius: BorderRadius.circular(8),
            //         border: Border.all(
            //           color: AppTheme.of(context).primaryBackground,
            //           width: 2,
            //         ),
            //         boxShadow: [
            //           BoxShadow(
            //             color: Colors.grey.withOpacity(0.5),
            //             spreadRadius: 5,
            //             blurRadius: 7,
            //             offset: Offset(0, 3), // changes position of shadow
            //             // color: Colors.deepPurpleAccent,
            //             // blurRadius: 10,
            //             // spreadRadius: 0,
            //             // offset: Offset(10, 10)
            //           ),
            //         ],
            //       ),
            //       child: Padding(
            //         padding: EdgeInsetsDirectional.fromSTEB(8, 0, 8, 0),
            //         child: 
            //         Row(
            //           mainAxisSize: MainAxisSize.max,
            //           children: [
            //             Padding(
            //               padding: EdgeInsetsDirectional.fromSTEB(4, 0, 4, 0),
            //               child: Icon(
            //                 Icons.search_rounded,
            //                 color: Color(0xFF95A1AC),
            //                 size: 24,
            //               ),
            //             ),
            //             Expanded(
            //               child: Padding(
            //                 padding: EdgeInsetsDirectional.fromSTEB(4, 0, 0, 0),
            //                 child: 
                            
            //                 TextField(
            //                   controller: textController,
            //                   obscureText: false,
            //                   decoration: InputDecoration(
            //                     hintText: 'Search',
            //                     hintStyle: TextStyle(
            //                       color: Color(0xFF95A1AC),
            //                     ),
            //                     enabledBorder: UnderlineInputBorder(
            //                       borderSide: BorderSide(
            //                         color: Colors.transparent,
            //                         width: 1,
            //                       ),
            //                       borderRadius: BorderRadius.circular(8),
            //                     ),
            //                     focusedBorder: UnderlineInputBorder(
            //                       borderSide: BorderSide(
            //                         color: Colors.transparent,
            //                         width: 1,
            //                       ),
            //                       borderRadius: BorderRadius.circular(8),
            //                     ),
            //                   ),
            //                   style: TextStyle(
            //                     color: Color(0xFF95A1AC),
            //                   ),
            //                   textAlign: TextAlign.start,
            //                   keyboardType: TextInputType.text,
            //                 ),
            //               ),
            //             ),
            //           ],
            //         ),
            //       ),
            //     ),
            //   ),
            // ),
            Container(
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                child: Column(
                  children: <Widget>[
                    Container(
                      // height: 120,
                      width: double.infinity,
                      child: Carousel(),
                    ),
                  ],
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(16, 0, 0, 0),
                  child: Text(
                    'Popular products',
                    textAlign: TextAlign.start,
                    style: TextStyle(
                        fontSize: 16, color: Color.fromARGB(255, 22, 17, 1)),
                  ),
                ),
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0, 0, 0, 0),
                  child:
                   RawMaterialButton(
                    onPressed: () {
                     Provider.of<FilterProvider>(context, listen: false).setChannelType(ChannelType.Popular);
                    Navigator.pushNamed(context, Search.routeName);
                    },
                    elevation: 1.0,
                    fillColor: Color.fromARGB(255, 255, 255, 255),
                    child: SvgPicture.asset("assets/icons/arrow_right.svg"),
                    // child: Icon(Icons.arrow_right,
                    //     size: 30.0,
                    //     color: Color.fromARGB(255, 255, 255, 255)),
                    padding: EdgeInsets.all(1.0),
                    shape: CircleBorder(),
                  ),
                ),
              ],
            ),
            Popular(),
            Text(
                    'Availble products',
                    textAlign: TextAlign.start,
                    style: TextStyle(
                        fontSize: 16, color: Color.fromARGB(255, 22, 17, 1)),
                  ),
            // Container(
            //   child: Padding(
            //     padding: EdgeInsetsDirectional.fromSTEB(8, 8, 8, 0),
            //     child: Row(
            //       mainAxisAlignment: MainAxisAlignment.end,
            //       children: <Widget>[
            //         Consumer<Cart>(
            //           builder: (_, cart, ch) => IconButton(
            //               onPressed: () {
            //                 // cart.isGridView = !cart.isGridView;
            //                 cart.changeGallaryView();
            //               },
            //               icon: !cart.isGridView
            //                   ? Icon(Icons.grid_on)
            //                   : Icon(Icons.list)),
            //         ),
            //       ],
            //     ),
            //   ),
            // ),
            Consumer<Products>(
              builder: (ctx, product, _) => Container(
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(8, 8, 8, 0),
                  child: product.productDataList.length > 0
                      ? Column(
                          children: <Widget>[
                            Container(
                              height: 620,
                              width: double.infinity,
                              child: ProductList(
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

//Trending products
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Padding(
                  // padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                                    padding: EdgeInsetsDirectional.fromSTEB(16, 0, 0, 0),

                  child: Text(
                    'Trending products',
                    textAlign: TextAlign.start,
                    style: TextStyle(
                        fontSize: 16, color: Color.fromARGB(255, 22, 17, 1)),
                  ),
                ),
                Padding(
                  // padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                                    padding: EdgeInsetsDirectional.fromSTEB(0, 0, 0, 0),

                  child: RawMaterialButton(
                    onPressed: () {
                      Provider.of<FilterProvider>(context, listen: false).setChannelType(ChannelType.Trending);
                      Navigator.pushNamed(context, Search.routeName);
                    },
                    elevation: 1.0,
                    fillColor: Color.fromARGB(255, 255, 255, 255),
                    child: SvgPicture.asset("assets/icons/arrow_right.svg"),
                    // child: Icon(Icons.arrow_right,
                    //     size: 30.0,
                    //     color: Color.fromARGB(255, 255, 255, 255)),
                    padding: EdgeInsets.all(1.0),
                    shape: CircleBorder(),
                  ),
                ),
              ],
            ),
            Trending(),

// most selling products
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Padding(
                  // padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                                    padding: EdgeInsetsDirectional.fromSTEB(16, 0, 0, 0),

                  child: Text(
                    'Most selling products',
                    textAlign: TextAlign.start,
                    style: TextStyle(
                        fontSize: 16, color: Color.fromARGB(255, 22, 17, 1)),
                  ),
                ),
                Padding(
                  // padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                    padding: EdgeInsetsDirectional.fromSTEB(0, 0, 0, 0),

                  child: RawMaterialButton(
                    onPressed: () {
                      Provider.of<FilterProvider>(context, listen: false).setChannelType(ChannelType.MostSelling);
                      Navigator.pushNamed(context, Search.routeName);
                    },
                    elevation: 1.0,
                    fillColor: Color.fromARGB(255, 255, 255, 255),
                    child: SvgPicture.asset("assets/icons/arrow_right.svg"),
                    // child: Icon(Icons.arrow_right,
                    //     size: 30.0,
                    //     color: Color.fromARGB(255, 255, 255, 255)),
                    padding: EdgeInsets.all(1.0),
                    shape: CircleBorder(),
                  ),
                ),
              ],
            ),
            Recommended(),

// most Primium products
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Padding(
                  // padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                    padding: EdgeInsetsDirectional.fromSTEB(16, 0, 0, 0),

                  child: Text(
                    'Premium products',
                    textAlign: TextAlign.start,
                    style: TextStyle(
                        fontSize: 16, color: Color.fromARGB(255, 22, 17, 1)),
                  ),
                ),
                Padding(
                  // padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                    padding: EdgeInsetsDirectional.fromSTEB(0, 0, 0, 0),

                  child: RawMaterialButton(
                    onPressed: () {
                      Provider.of<FilterProvider>(context, listen: false).setChannelType(ChannelType.PrimiumProduct);
                      Navigator.pushNamed(context, Search.routeName);
                    },
                    elevation: 1.0,
                    fillColor: Color.fromARGB(255, 255, 255, 255),
                    child: SvgPicture.asset("assets/icons/arrow_right.svg"),
                    // child: Icon(Icons.arrow_right,
                    //     size: 30.0,
                    //     color: Color.fromARGB(255, 255, 255, 255)),
                    padding: EdgeInsets.all(1.0),
                    shape: CircleBorder(),
                  ),
                ),
              ],
            ),
            Premium(),

// most valuable products
            // Row(
            //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
            //   children: <Widget>[
            //     Padding(
            //       padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
            //       child: Text(
            //         'Most Valuable Product',
            //         textAlign: TextAlign.start,
            //         style: TextStyle(
            //             fontSize: 16, color: Color.fromARGB(255, 22, 17, 1)),
            //       ),
            //     ),
            //     Padding(
            //       padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
            //       child: RawMaterialButton(
            //         onPressed: () {
            //           Provider.of<FilterProvider>(context, listen: false).setChannelType(ChannelType.MostValuable);
            //           Navigator.pushNamed(context, Search.routeName);
            //         },
            //         elevation: 1.0,
            //         fillColor: Color.fromARGB(255, 255, 255, 255),
            //         child: SvgPicture.asset("assets/icons/arrow_right.svg"),
            //         // child: Icon(Icons.arrow_right,
            //         //     size: 30.0,
            //         //     color: Color.fromARGB(255, 255, 255, 255)),
            //         padding: EdgeInsets.all(1.0),
            //         shape: CircleBorder(),
            //       ),
            //     ),
            //   ],
            // ),
            // mostValueProduct(),
            
          ],
        ),
      ),

      bottomNavigationBar: BottomMenu(),

      // ,
    );
  }

  showDialogBox() => showCupertinoDialog<String>(
        context: context,
        builder: (BuildContext context) => CupertinoAlertDialog(
          title: const Text('No Connection'),
          content: const Text('Please check your internet connectivity'),
          actions: <Widget>[
            TextButton(
              onPressed: () async {
                Navigator.pop(context, 'Cancel');
                setState(() => isAlertSet = false);
                isDeviceConnected =
                    await InternetConnectionChecker().hasConnection;
                if (!isDeviceConnected && isAlertSet == false) {
                  showDialogBox();
                  setState(() => isAlertSet = true);
                }
              },
              child: const Text('OK'),
            ),
          ],
        ),
      );
}
