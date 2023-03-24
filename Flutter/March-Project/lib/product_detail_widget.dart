import 'dart:convert';

import 'package:carousel_slider/carousel_slider.dart';
import 'package:ecomm_app/providers/bottom-menu.dart';
import 'package:ecomm_app/providers/cart.dart';
import 'package:ecomm_app/providers/products.dart';
import 'package:ecomm_app/screens/wishlist/wishlist.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:badges/badges.dart' as badge;
import 'package:ecomm_app/app_theme.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/screens/widgets/button.dart';
import 'package:flutter/scheduler.dart';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';
import 'package:provider/provider.dart';

import '/bloc/cart_bloc.dart';
import 'bloc/event/cart_event.dart';
import 'bloc/state/cart_state.dart';
import 'checkout_widget.dart';
import 'components/global_snack_bar.dart';
import 'models/cart.dart';
import 'models/product-details.dart';
import 'models/product.dart';
import 'screens/widgets/count_controller.dart';

class ProductDetailWidget extends StatefulWidget {
  const ProductDetailWidget({Key? key, required this.product})
      : super(key: key);

  final ProductDetails product;

  @override
  _ProductDetailWidgetState createState() => _ProductDetailWidgetState();
}

class _ProductDetailWidgetState extends State<ProductDetailWidget>
    with TickerProviderStateMixin {
  final scaffoldKey = GlobalKey<ScaffoldState>();
  int? countControllerValue;
  bool isLoadingSpinner = true;
  List<Widget> imageSliders = [];
  final CarouselController _controller = CarouselController();
  int _current = 0;

  @override
  void initState() {
    super.initState();

    getProductDetails(widget.product.productId.toString());
    SchedulerBinding.instance.addPostFrameCallback((_) {
      // Provider.of<BottomMenuHandler>(context,listen:false).changeCurrentValue(BottomMuenu.Home);
    });
  }

  Future<void> getProductDetails(String id) async {
    try {
      await Provider.of<Products>(context, listen: false)
          .getProductDetailsById(id);
      setState(() {
        isLoadingSpinner = false;
      });

      imageSliders = Provider.of<Products>(context, listen: false)
          .product
          .productImages
          .map((item) => Container(
                child: Container(
                  margin: EdgeInsets.all(5.0),
                  child: ClipRRect(
                      borderRadius: BorderRadius.all(Radius.circular(5.0)),
                      child: Stack(
                        children: <Widget>[
                          Image.network(item.imageFullPath,
                              fit: BoxFit.cover, width: 1000.0),
                          Positioned(
                            bottom: 0.0,
                            left: 0.0,
                            right: 0.0,
                            child: Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    Color.fromARGB(200, 0, 0, 0),
                                    Color.fromARGB(0, 0, 0, 0)
                                  ],
                                  begin: Alignment.bottomCenter,
                                  end: Alignment.topCenter,
                                ),
                              ),
                              padding: EdgeInsets.symmetric(
                                  vertical: 10.0, horizontal: 20.0),
                              child: Text(
                                // 'image ${Provider.of<Products>(context, listen: false).product.productImages.indexOf(item)+1}',
                                "${Provider.of<Products>(context, listen: false).product.quantity == 0 ? "Unavailable" : "Available"}",
                                style: TextStyle(
                                  color: Colors.white,
                                  // fontSize: 20.0,
                                  // fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      )),
                ),
              ))
          .toList();
    } catch (error) {
      Map<String, dynamic> errorRes = json.decode(error.toString());
      GlobalSnackBar.show(context, errorRes["message"]);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        // iconTheme: ,
        backgroundColor: AppTheme.of(context).secondaryBackground,
        automaticallyImplyLeading: false,
        leading: InkWell(
          onTap: () async {
            // Provider.of<BottomMenuHandler>(context,listen: false).backToParentValue();
            Navigator.pop(context);
          },
          child: Icon(
            Icons.arrow_back_rounded,
            color: AppTheme.of(context).secondaryText,
            size: 24,
          ),
        ),
        title: Text(
          ' ${Provider.of<Products>(context, listen: false).product.name}',
          style: AppTheme.of(context).subtitle2.override(
                fontFamily: 'Lexend Deca',
                color: Color(0xFF151B1E),
                fontSize: 20,
                fontWeight: FontWeight.w500,
              ),
        ),
        actions: [
          Consumer<Cart>(builder: (_, cartState, ch) {
            List<CartItem> cartItem = cartState.items;
            return Padding(
              padding: EdgeInsetsDirectional.fromSTEB(0, 8, 24, 0),
              child: badge.Badge(
                badgeContent: Text(
                  '${cartItem.length}',
                  style: AppTheme.of(context).bodyText1.override(
                        fontFamily: 'Poppins',
                        color: Colors.white,
                      ),
                ),
                showBadge: true,
                shape: badge.BadgeShape.circle,
                badgeColor: kPrimaryColor,
                elevation: 4,
                padding: EdgeInsetsDirectional.fromSTEB(8, 8, 8, 8),
                position: badge.BadgePosition.topEnd(),
                animationType: badge.BadgeAnimationType.scale,
                toAnimate: true,
                child: IconButton(
                  icon: Icon(
                    Icons.shopping_cart_outlined,
                    color: AppTheme.of(context).secondaryText,
                    size: 30,
                  ),
                  onPressed: () {
                    Provider.of<BottomMenuHandler>(context, listen: false)
                        .currentValue = BottomMuenu.Cart;
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => CheckoutWidget(),
                      ),
                    );
                  },
                ),
              ),
            );
          }),
        ],
        centerTitle: true,
        elevation: 0,
      ),
      backgroundColor: AppTheme.of(context).secondaryBackground,
      body: isLoadingSpinner
          ? Center(
              child: Container(
                  height: MediaQuery.of(context).size.height * 0.2,
                  width: 60,
                  child: SpinKitCubeGrid(
                    color: kPrimaryColor,
                  )),
            )
          : Column(
              mainAxisSize: MainAxisSize.max,
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        //coreusal here
                        Column(children: [
                          CarouselSlider(
                            items: imageSliders,
                            carouselController: _controller,
                            options: CarouselOptions(
                                autoPlay: true,
                                enlargeCenterPage: true,
                                aspectRatio: 2.0,
                                onPageChanged: (index, reason) {
                                  setState(() {
                                    _current = index;
                                  });
                                }),
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children:
                                Provider.of<Products>(context, listen: false)
                                    .product
                                    .productImages
                                    .asMap()
                                    .entries
                                    .map((entry) {
                              return GestureDetector(
                                onTap: () =>
                                    _controller.animateToPage(entry.key),
                                child: Container(
                                  width: 12.0,
                                  height: 12.0,
                                  margin: EdgeInsets.symmetric(
                                      vertical: 8.0, horizontal: 4.0),
                                  decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: (Theme.of(context).brightness ==
                                                  Brightness.dark
                                              ? Colors.white
                                              : Colors.black)
                                          .withOpacity(_current == entry.key
                                              ? 0.9
                                              : 0.4)),
                                ),
                              );
                            }).toList(),
                          ),
                        ]),
                        // Padding(
                        // padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 16),
                        // child:
                        //add a carosel here

                        // Hero(
                        //   tag: 'mainImage',
                        //   transitionOnUserGestures: true,
                        //   child: ClipRRect(
                        //     borderRadius: BorderRadius.circular(12),
                        //     child: Image.network(
                        //       widget.product.image,
                        //       // Provider.of<Products>(context, listen: false).product.
                        //       width: double.infinity,
                        //       height: 300,
                        //       fit: BoxFit.cover,
                        //     ),
                        //   ),
                        // ),
                        // ),

                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(16, 0, 16, 0),
                          // child: Card(
                          // color: Colors.grey,
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Expanded(
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Column(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceAround,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: <Widget>[
                                      Text('Product details'),
                                      SizedBox(height: 10),
                                      // Text('Subscription'),
                                      RatingBarIndicator(
                                        rating: 3.50,
                                        itemBuilder: (context, index) => Icon(
                                          Icons.star,
                                          color: Colors.amber,
                                        ),
                                        itemCount: 5,
                                        itemSize: 20.0,
                                        direction: Axis.horizontal,
                                      ),
                                      // RatingBar.builder(
                                      //     initialRating: 3,
                                      //     minRating: 1,
                                      //     direction: Axis.horizontal,
                                      //     allowHalfRating: true,
                                      //     itemCount: 5,
                                      //     itemPadding: EdgeInsets.symmetric(horizontal: 4.0),
                                      //     itemBuilder: (context, _) => Icon(
                                      //       Icons.star,
                                      //       color: Colors.amber,
                                      //     ),
                                      //     onRatingUpdate: (rating) {
                                      //       print(rating);
                                      //     },
                                      //   ),
                                    ],
                                  ),
                                ),
                              ),
                              Flexible(
                                fit: FlexFit.tight,
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Column(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceAround,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      IconButton(
                                        icon: Icon(
                                          Icons.favorite,
                                          color: kFavoriteColor,
                                          size: 30.0,
                                        ),
                                        // icon: SvgPicture.asset(
                                        //   "assets/icons/Home.svg",
                                        //   color: BottomMuenu.Home == bottomMenuHandler.currentValue
                                        //       ? kPrimaryColor
                                        //       : inActiveIconColor,
                                        // ),
                                        onPressed: () {
                                          Navigator.pushNamed(
                                              context, Wishlist.routeName);
                                        },
                                      ),
                                      // Text(
                                      //   '+100',
                                      //   maxLines: 1,
                                      //   softWrap: false,
                                      //   overflow: TextOverflow.fade,
                                      // ),
                                      SizedBox(height: 10),
                                      // Text(
                                      //   '18 Sept 2021',
                                      //   maxLines: 1,
                                      //   softWrap: false,
                                      //   overflow: TextOverflow.fade,
                                      // ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                          // ),
                        ),

                        // Padding(
                        //   padding: EdgeInsetsDirectional.fromSTEB(16, 0, 16, 0),
                        //   child: Text(
                        //     'Product details',
                        //     // style: AppTheme.of(context).title1,
                        //   ),
                        // ),

                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(16, 4, 0, 0),
                          // child: Text(
                          //   '\$${widget.product.price}',
                          //   textAlign: TextAlign.start,
                          //   style: AppTheme.of(context).subtitle1,
                          // ),
                          child: RichText(
                            text: TextSpan(
                              children: <TextSpan>[
                                TextSpan(
                                  text:
                                      '₹ ${Provider.of<Products>(context, listen: false).product.price}',
                                  // style: TextStyle(color: Colors.blue)
                                  style: TextStyle(
                                      color: Colors.blue,
                                      decoration: TextDecoration.lineThrough),
                                ),
                                TextSpan(text: " "),
                                TextSpan(
                                    text:
                                        '₹ ${Provider.of<Products>(context, listen: false).product.offerPrice}',
                                    style: TextStyle(color: Colors.blue)),
                                TextSpan(text: "  "),
                                TextSpan(
                                    text:
                                        '(${Provider.of<Products>(context, listen: false).product.offerPrice - Provider.of<Products>(context, listen: false).product.price} ₹ off)',
                                    style: TextStyle(color: Colors.blue))
                              ],
                            ),
                          ),
                        ),
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(16, 8, 16, 8),
                          child: Text(
                              "Qty: ${Provider.of<Products>(context, listen: false).product.quantity} available"),
                        ),
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(16, 8, 16, 8),
                          child: Text(
                            Provider.of<Products>(context, listen: false)
                                .product
                                .detail as String,
                            // 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.',
                            style: AppTheme.of(context).bodyText2,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Text(''),
                Material(
                  color: Colors.transparent,
                  elevation: 3,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(0),
                  ),
                  child: Container(
                    width: double.infinity,
                    height: 100,
                    decoration: BoxDecoration(
                      color: AppTheme.of(context).primaryBackground,
                      boxShadow: [
                        BoxShadow(
                          blurRadius: 4,
                          color: Color(0x320F1113),
                          offset: Offset(0, -2),
                        )
                      ],
                      borderRadius: BorderRadius.circular(0),
                    ),
                    child: Padding(
                      padding: EdgeInsetsDirectional.fromSTEB(16, 0, 16, 34),
                      child: Row(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            width: 130,
                            height: 50,
                            decoration: BoxDecoration(
                              color: AppTheme.of(context).secondaryBackground,
                              borderRadius: BorderRadius.circular(12),
                              shape: BoxShape.rectangle,
                              border: Border.all(
                                color: AppTheme.of(context).primaryBackground,
                                width: 2,
                              ),
                            ),
                            child: CountController(
                              decrementIconBuilder: (enabled) => Icon(
                                Icons.remove_rounded,
                                color: enabled
                                    ? AppTheme.of(context).secondaryText
                                    : AppTheme.of(context).secondaryText,
                                size: 16,
                              ),
                              incrementIconBuilder: (enabled) => Icon(
                                Icons.add_rounded,
                                color: enabled
                                    ? AppTheme.of(context).primaryColor
                                    : AppTheme.of(context).secondaryText,
                                size: 16,
                              ),
                              countBuilder: (count) => Text(
                                count.toString(),
                                style: AppTheme.of(context).subtitle1,
                              ),
                              count: countControllerValue ??= 1,
                              updateCount: (count) =>
                                  setState(() => countControllerValue = count),
                              stepSize: 1,
                              minimum: 1,
                            ),
                          ),
                          MyButtonWidget(
                            onPressed: () {
                              ProductDetails p = widget.product;
                              Provider.of<Cart>(context, listen: false).addItem(
                                  p.productId.toString(),
                                  context,
                                  countControllerValue.toString());
                              if (Provider.of<Cart>(context, listen: false)
                                      .quantityStatus
                                      .isNotEmpty &&
                                  Provider.of<Cart>(context, listen: false)
                                          .quantityStatus !=
                                      "Available") {
                                GlobalSnackBar.show(
                                    context,
                                    Provider.of<Cart>(context, listen: false)
                                        .quantityStatus);
                                Provider.of<Cart>(context, listen: false)
                                    .quantityStatus = "";
                              }
                              GlobalSnackBar.show(
                                  context, 'Items added in cart');
                              // BlocProvider.of<CartBloc>(context).add(AddProduct(p));
                            },
                            text: 'Add to Cart',
                            options: ButtonOptions(
                                width: 160,
                                height: 50,
                                color: kPrimaryColor,
                                textStyle:
                                    AppTheme.of(context).subtitle2.override(
                                          fontFamily: 'Poppins',
                                          color: Colors.white,
                                        ),
                                elevation: 5,
                                borderSide: BorderSide(
                                  color: Colors.black,
                                  width: 1,
                                ),
                                borderRadius:
                                    BorderRadius.all(Radius.circular(36))),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
