import 'package:easy_debounce/easy_debounce.dart';
import 'package:ecomm_app/app_theme.dart';
import 'package:ecomm_app/bloc/event/cart_event.dart';
import 'package:ecomm_app/components/global_snack_bar.dart';
import 'package:ecomm_app/components/menu/bottom_menu.dart';
import 'package:ecomm_app/const_error_msg.dart';
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
import 'package:flutter_svg/flutter_svg.dart';
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
  // late BuildContext _buildContext;
  // late Products _productsProvider;
  bool isLoadingSpineer = true;
  bool productDataLoading = true;

  List<ProductDetails> searchedProducts = [];
  List<ProductDetails> products = [];
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
  void initState() {
    super.initState();
    // _buildContext = context;
    // _productsProvider = Provider.of<Products>(context, listen: false);
    if(productDataLoading){
      getProductsData();
      products = Provider.of<Products>(context, listen: false).productDataList;
    }
    
    textController = TextEditingController();
    SchedulerBinding.instance.addPostFrameCallback((_) {
      String otpMessage =
          Provider.of<Auth>(context, listen: false).userRegMessage;
      if (otpMessage.isNotEmpty) {
        GlobalSnackBar.show(context, otpMessage);
      }
      Provider.of<Auth>(context, listen: false).userRegMessage = "";
    });
 
  }

   getProductsData() async {
    
    await Provider.of<Products>(context, listen: false).getProductsData();
      
   if(mounted){
       setState(() {
        productDataLoading = false;
      });
   }
   
    
  
  }

  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // key: scaffoldKey,
      resizeToAvoidBottomInset: false,
      // backgroundColor: Colors.white,
      appBar: AppBar(
        centerTitle: true,
        // title: Text(
        //   'Store',
        //   style: AppTheme.of(context).title1,

        // ),
        iconTheme: const IconThemeData(
          color: kAppBarColor, //change your color here
        ),
        title: const Text("Store", style: TextStyle(color: kAppBarColor)),
        elevation: 0,
        // backgroundColor: Colors.white,
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
        // reverse: true,
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: <Widget>[
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
            Container(
              alignment: Alignment.centerLeft,
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                child: Column(
                  children: <Widget>[
                    SizedBox(height: 20),
                    ListTile(
                        // leading: Container(
                        //   width: 20,
                        //   height: 20,
                        //   decoration: BoxDecoration(
                        //       borderRadius: BorderRadius.circular(100),
                        //       color: kPrimaryColor.withOpacity(0.1)),
                        //   // child:  Icon: SvgPicture.asset("assets/icons/Cart.svg"),
                        //   child: SvgPicture.asset("assets/icons/Parcel.svg"),
                        // ),
                        title: const Text('Popular Products',
                            style: TextStyle(
                                fontSize: 16,
                                color: Color.fromARGB(255, 147, 3, 138))),
                        trailing: RawMaterialButton(
                          onPressed: () {},
                          elevation: 1.0,
                          fillColor: Color.fromARGB(255, 255, 255, 255),
                          child:
                              SvgPicture.asset("assets/icons/arrow_right.svg"),
                          // child: Icon(Icons.arrow_right,
                          //     size: 30.0,
                          //     color: Color.fromARGB(255, 255, 255, 255)),
                          padding: EdgeInsets.all(1.0),
                          shape: CircleBorder(),
                        )
                        //  Container(
                        //   width: 10,
                        //   height: 10,
                        //   decoration: BoxDecoration(
                        //       borderRadius: BorderRadius.circular(100),
                        //       color: kPrimaryColor.withOpacity(0.1)),
                        //   child: SvgPicture.asset("assets/icons/arrow_right.svg"),
                        // ),
                        ),
                    // Container(
                    //   alignment: Alignment.centerLeft,
                    //   height: 30,
                    //   child: Text(
                    //     'Popular Products',
                    //     style: TextStyle(fontSize: 16, color: Colors.grey),
                    //   ),
                    // ),
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
            productDataLoading
                ? Center(
                    child: Container(
                      child: Text("loading..."),
                    ),
                  )
                : Container(
                    child: Padding(
                      padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
                      child: Column(
                        children: <Widget>[
                          Container(
                            height: 620,
                            width: double.infinity,
                            child: 
                            
                            
                            ProductList(
                              products:
                                  isSearchStarted ? searchedProducts : products,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
          ],
        ),
      ),
      // body: SingleChildScrollView(
      //   child: ListView(
      //     padding: const EdgeInsets.all(8),
      //     children: <Widget>[
      //       Container(
      //         color: Colors.amber[600],
      //         child: const Center(child: Text('Entry A')),
      //       ),
      //       Container(
      //         color: Colors.amber[500],
      //         child: const Center(child: Text('Entry B')),
      //       ),
      //       Container(
      //         color: Colors.amber[100],
      //         child: const Center(child: Text('Entry C')),
      //       ),
      //     ],
      //   ),
      // ),

      bottomNavigationBar: BottomMenu(selectedMenu: MenuState.home),
    );
  }

 
}
