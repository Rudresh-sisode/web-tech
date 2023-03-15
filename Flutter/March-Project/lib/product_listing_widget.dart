import 'package:easy_debounce/easy_debounce.dart';
import 'package:ecomm_app/app_theme.dart';
import 'package:ecomm_app/bloc/event/cart_event.dart';
import 'package:ecomm_app/components/global_snack_bar.dart';
import 'package:ecomm_app/components/menu/bottom_menu.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/enums.dart';
import 'package:ecomm_app/providers/auth.dart';
import 'package:ecomm_app/providers/bottom-menu.dart';
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
  void didChangeDependencies() {
    super.didChangeDependencies();
    print('dependancy changes on product listing widget');

  }

  @override
  void initState() {
    super.initState();

    
   

    textController = TextEditingController();
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
      // key: scaffoldKey,

      resizeToAvoidBottomInset: false,
      // backgroundColor: Colors.white,
      appBar: AppBar(
        centerTitle: true,

        iconTheme: const IconThemeData(
          color: kAppBarColor, //change your color here
        ),
        // title: const Text("", style: TextStyle(color: kAppBarColor)),
        title: Image.asset(
          "assets/images/G-Store.png",
          fit: BoxFit.contain,
          height: 32,
        ),
        elevation: 0,
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
                              onChanged: (_) {
                                Provider.of<Products>(context, listen: false)
                                    .searchProductList(textController.text);
                              },
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
                        )),
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
            Consumer<Products>(
              builder: (ctx, product, _) => Container(
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
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
          ],
        ),
      ),
     
      bottomNavigationBar: BottomMenu(),
      
      // ,
    );
  }
}
