import 'package:easy_debounce/easy_debounce.dart';
import 'package:ecomm_app/app_theme.dart';
import 'package:ecomm_app/bloc/event/cart_event.dart';
import 'package:ecomm_app/components/global_snack_bar.dart';
import 'package:ecomm_app/components/menu/bottom_menu.dart';
import 'package:ecomm_app/enums.dart';
import 'package:ecomm_app/providers/auth.dart';
import 'package:ecomm_app/providers/carousel.dart';
import 'package:ecomm_app/providers/cart.dart';
import 'package:ecomm_app/providers/products.dart';
import 'package:ecomm_app/screens/widgets/carousel.dart';
import 'package:ecomm_app/screens/widgets/popular.dart';
// import 'package:ecomm_app/screens/widgets/popular.dart';
import 'package:ecomm_app/screens/widgets/product_list.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';

import 'bloc/cart_bloc.dart';
import 'bloc/state/cart_state.dart';
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

  bool isLoadingSpineer = true;
  bool productDataLoading = true;

  List<ProductDetails> searchedProducts = [];
  List<ProductDetails> products = [];
  // late List<Product> products = [];

  // void _getData() async {
  //   products = (await Products().getProductList())!;
  //   Future.delayed(const Duration(seconds: 1)).then((value) => setState(() {}));
  // }

  @override
  void initState() {
    super.initState();
    // products = Provider.of<Products>(context, listen: false).products;
    getProductsData();
    textController = TextEditingController();
    SchedulerBinding.instance.addPostFrameCallback((_) {
      String otpMessage =
          Provider.of<Auth>(context, listen: false).userRegMessage;
          if(otpMessage.isNotEmpty){
            GlobalSnackBar.show(context, otpMessage);

          }
          Provider.of<Auth>(context, listen: false).userRegMessage = "";

    });
    // _getData();
  }

  Future<void> getProductsData() async{

    await Provider.of<Products>(context,listen:false).getProductsData();
    products = Provider.of<Products>(context, listen: false).productDataList;


    setState(() {
      productDataLoading = false;
    });

  }

  Future<void> gettingNeededAPICalling() async {
    try {
      //first carousel api

      //second popular product's api

      //third product list's api

      // setState(() {
      //   isLoadingSpineer = false;
      // });
    } catch (error) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // key: scaffoldKey,
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'Gunadhya Store',
          style: AppTheme.of(context).title1,
        ),
        elevation: 0,
        backgroundColor: Colors.white,
        actions: <Widget>[
          Stack(
            children: [
              // Padding(
              //   padding: const EdgeInsets.only(right: 16),
              //   child: TextButton.icon(
              //     style: TextButton.styleFrom(primary: Colors.white),
              //     onPressed: () {
              //       //Navigator.pushNamed(context, CartPage.routeName);
              //     },
              //     icon: Icon(Icons.shopping_cart),
              //     label: Text(''),
              //     key: Key('cart'),
              //   ),
              // ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(height: 30),
            Container(
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.95,
                  height: 50,
                  decoration: BoxDecoration(
                    color: AppTheme.of(context).secondaryBackground,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: AppTheme.of(context).primaryBackground,
                      width: 2,
                    ),
                    boxShadow: [
                      // BoxShadow(
                      // blurRadius: 4,
                      // color: Color(0x3600000F),
                      // offset: Offset(0, 2),
                      // )
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.5),
                        spreadRadius: 5,
                        blurRadius: 7,
                        offset: Offset(0, 3), // changes position of shadow
                        // color: Colors.deepPurpleAccent,
                        // blurRadius: 10,
                        // spreadRadius: 0,
                        // offset: Offset(10, 10)
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: EdgeInsetsDirectional.fromSTEB(8, 0, 8, 0),
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(4, 0, 4, 0),
                          child: Icon(
                            Icons.search_rounded,
                            color: Color(0xFF95A1AC),
                            size: 24,
                          ),
                        ),
                        Expanded(
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(4, 0, 0, 0),
                            child: TextFormField(
                              controller: textController,
                              obscureText: false,
                              onChanged: (_) => EasyDebounce.debounce(
                                'tFMemberController',
                                Duration(milliseconds: 0),
                                () {
                                  isSearchStarted = textController!
                                          .text.isNotEmpty &&
                                      textController!.text.trim().length > 0;
                                  print('isSearchStarted $isSearchStarted');
                                  if (isSearchStarted) {
                                    print('${textController!.text.trim()}');
                                    searchedProducts = products
                                        .where((item) => item.name
                                            .toLowerCase()
                                            .contains(textController.text
                                                .trim()
                                                .toLowerCase()))
                                        .toList();
                                  }
                                },
                              ),
                              decoration: const InputDecoration(
                                labelText: 'Search product here...',
                                enabledBorder: UnderlineInputBorder(
                                  borderSide: BorderSide(
                                    color: Color(0x00000000),
                                    width: 1,
                                  ),
                                  borderRadius: BorderRadius.only(
                                    topLeft: Radius.circular(4.0),
                                    topRight: Radius.circular(4.0),
                                  ),
                                ),
                                focusedBorder: UnderlineInputBorder(
                                  borderSide: BorderSide(
                                    color: Color(0x00000000),
                                    width: 1,
                                  ),
                                  borderRadius: BorderRadius.only(
                                    topLeft: Radius.circular(4.0),
                                    topRight: Radius.circular(4.0),
                                  ),
                                ),
                              ),
                              style: AppTheme.of(context).bodyText1.override(
                                    fontFamily: 'Poppins',
                                    color: Color(0xFF95A1AC),
                                  ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            SizedBox(height: 15),
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
            SizedBox(height: 15),
            Container(
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                child: Column(
                  children: <Widget>[
                    SizedBox(height: 50),
                    const SizedBox(
                      // boxShadow: [

                      // BoxShadow(
                      // color: Colors.grey.withOpacity(0.5),
                      // spreadRadius: 5,
                      // blurRadius: 7,
                      // offset: Offset(0, 3), // changes position of shadow
                      // ),
                      // ],

                      child: Text(
                        'Popular Products',
                        textAlign: TextAlign.left,
                        style: TextStyle(fontSize: 16, color: Colors.grey
                            // BoxShadow(
                            // color: Colors.grey.withOpacity(0.5),
                            // spreadRadius: 5,
                            // blurRadius: 7,
                            // offset: Offset(0, 3), // changes position of shadow
                            // ),
                            ),
                      ),
                    ),
                    Container(
                      height: 120,
                      width: double.infinity,
                      child: Popular(),
                    ),
                  ],
                ),
              ),
            ),
            Container(
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: <Widget>[
                    Consumer<Cart>(
                      builder: (_, cart, ch) => IconButton(
                          onPressed: () {
                            // cart.isGridView = !cart.isGridView;
                            cart.changeGallaryView();
                          },
                          icon: !cart.isGridView
                              ? Icon(Icons.grid_on)
                              : Icon(Icons.list)),
                    ),
                  ],
                ),
              ),
            ),
            //loading spinner logic
            productDataLoading ? 
            Center(
              child: Container(child: 
              Text("loading..."),),
            )
            :
            Container(
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                child: Column(
                  children: <Widget>[
                    Container(
                      height: 620,
                      width: double.infinity,
                      child: ProductList(
                        products: isSearchStarted ? searchedProducts : products,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),

      bottomNavigationBar: BottomMenu(selectedMenu: MenuState.home),
    );
  }
}
