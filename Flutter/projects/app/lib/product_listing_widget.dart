import 'package:easy_debounce/easy_debounce.dart';
import 'package:ecomm_app/app_theme.dart';
import 'package:ecomm_app/bloc/event/cart_event.dart';
import 'package:ecomm_app/components/menu/bottom_menu.dart';
import 'package:ecomm_app/enums.dart';
import 'package:ecomm_app/providers/cart.dart';
import 'package:ecomm_app/screens/widgets/product_list.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';

import 'bloc/cart_bloc.dart';
import 'bloc/state/cart_state.dart';
import 'models/product.dart';

class ProductListingWidget extends StatefulWidget {
  static String routeName = "/product";

  const ProductListingWidget({Key? key}) : super(key: key);

  @override
  _ProductListingWidgetState createState() => _ProductListingWidgetState();
}

class _ProductListingWidgetState extends State<ProductListingWidget> {
  TextEditingController? textController;
  final scaffoldKey = GlobalKey<ScaffoldState>();
  bool isSearchStarted = false;

  List<Product> searchedProducts = [];
  final List<Product> products = [
    Product(
        id: 1,
        name: 'hoodies',
        image: 'https://wallpaperaccess.com/full/399842.jpg',
        price: 55.5),
    Product(
        id: 2,
        name: 'hoodies',
        image:
            'https://w0.peakpx.com/wallpaper/335/803/HD-wallpaper-person-in-black-hoodie-jacket.jpg',
        price: 65.5),
    Product(
        id: 3,
        name: 'Water bottle',
        image:
            'https://static.vecteezy.com/system/resources/previews/006/779/203/original/water-bottle-icon-illustration-sport-water-container-flat-cartoon-style-suitable-for-web-landing-page-banner-flyer-sticker-wallpaper-background-free-vector.jpg',
        price: 75.5),
    Product(
        id: 4,
        name: 'Laptop Bag',
        image:
            'https://th.bing.com/th/id/OIP.9SDGaGX-SIQ2_oDY4lEmFgHaL_?pid=ImgDet&rs=1',
        price: 87.5),
    Product(
        id: 5,
        name: 'Laptop Bag',
        image:
            'https://th.bing.com/th/id/OIP.9SDGaGX-SIQ2_oDY4lEmFgHaL_?pid=ImgDet&rs=1',
        price: 67.5),
    Product(
        id: 6,
        name: 'Laptop Bag',
        image:
            'https://www.clueman.lk/wp-content/uploads/2019/12/SPG9962-scaled.jpg',
        price: 87.5),
    Product(
        id: 7,
        name: 'Monk',
        image:
            'https://static.vecteezy.com/system/resources/previews/006/779/203/original/water-bottle-icon-illustration-sport-water-container-flat-cartoon-style-suitable-for-web-landing-page-banner-flyer-sticker-wallpaper-background-free-vector.jpg',
        price: 50.5),
    Product(
        id: 8,
        name: 'T shirt',
        image:
            'https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        price: 99.5),
    Product(
        id: 9,
        name: 'T shirt',
        image:
            'https://th.bing.com/th/id/OIP.NXx98yatBhiTUaDzZdJzrQHaJC?pid=ImgDet&rs=1',
        price: 87.5),
    Product(
        id: 10,
        name: '',
        image:
            'https://source.unsplash.com/random/1920x1080/?wallpaper,landscape',
        price: 144.5),
  ];

  @override
  void initState() {
    super.initState();
    textController = TextEditingController();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
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
              Padding(
                padding: const EdgeInsets.only(right: 16),
                child: TextButton.icon(
                  style: TextButton.styleFrom(primary: Colors.white),
                  onPressed: () {
                    //Navigator.pushNamed(context, CartPage.routeName);
                  },
                  icon: Icon(Icons.shopping_cart),
                  label: Text(''),
                  key: Key('cart'),
                ),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        mainAxisSize: MainAxisSize.max,
        children: [
          Padding(
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
                  //   blurRadius: 4,
                  //   color: Color(0x3600000F),
                  //   offset: Offset(0, 2),
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
                              isSearchStarted =
                                  textController!.text.isNotEmpty &&
                                      textController!.text.trim().length > 0;
                              print('isSearchStarted $isSearchStarted');
                              if (isSearchStarted) {
                                print('${textController!.text.trim()}');
                                searchedProducts = products
                                    .where((item) => item.name
                                        .toLowerCase()
                                        .contains(textController!.text
                                            .trim()
                                            .toLowerCase()))
                                    .toList();
                              }
                              setState(() {});
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
          SizedBox(height: getProportionateScreenHeight(15)),
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
            child: Column(children: <Widget>[
              Container(
                height: 80,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Color.fromARGB(255, 162, 135, 244),
                  borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(10),
                      topRight: Radius.circular(10),
                      bottomLeft: Radius.circular(10),
                      bottomRight: Radius.circular(10)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.4),
                      spreadRadius: 2,
                      blurRadius: 2,
                      offset: Offset(0, 3), // changes position of shadow
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: const <Widget>[
                    SizedBox(
                      child: Text(
                        'Sale is live!! ',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            fontSize: 22,
                            color: Color.fromARGB(179, 255, 255, 255)),
                      ),
                    ),
                    // Text('Adil Shaikh',
                    //     style: TextStyle(fontSize: 16, color: Colors.white70)),
                  ],
                ),
              ),
            ]),
          ),
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: <Widget>[
                
                Consumer<Cart>(builder: (_,cart,ch)=> IconButton(
                      onPressed: () {
                        // cart.isGridView = !cart.isGridView;
                        cart.changeGallaryView();
                      },
                      icon: !cart.isGridView ? Icon(Icons.grid_on) : Icon(Icons.list)
                      ),
                      ) ,
                
                // BlocBuilder<CartBloc, CartState>(builder: (_, cartState) {
                //   bool isGridView = cartState.isGridView;
                //   return IconButton(
                //       onPressed: () {
                //         BlocProvider.of<CartBloc>(context)
                //             .add(ChangeGallaryView(!isGridView));
                //       },
                //       icon:
                //           !isGridView ? Icon(Icons.grid_on) : Icon(Icons.list));
                // }),
              ],
            ),
          ),
          Expanded(
            child: ProductList(
              products: isSearchStarted ? searchedProducts : products,
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomMenu(selectedMenu: MenuState.home),
    );
  }
}
