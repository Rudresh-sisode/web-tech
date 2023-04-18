import 'dart:convert';
import 'dart:ui';

import 'package:ecomm_app/app_theme.dart';
import 'package:ecomm_app/components/menu/bottom_menu.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/enums.dart';
import 'package:ecomm_app/models/product.dart';
import 'package:ecomm_app/product_listing_widget%20copy.dart';
import 'package:ecomm_app/providers/auth-checker.dart';
import 'package:ecomm_app/providers/bottom-menu.dart';
import 'package:ecomm_app/providers/cart.dart';
import 'package:ecomm_app/providers/delivery-address.dart';
import 'package:ecomm_app/providers/products.dart';
import 'package:ecomm_app/screens/widgets/count_controller.dart';
import 'package:ecomm_app/screens/widgets/payment.dart';
import 'package:ecomm_app/screens/widgets/shipping.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';
import 'components/global_snack_bar.dart';
import 'models/cart.dart';

import 'models/delivery-address.dart';
import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';

class CheckoutWidget extends StatefulWidget {
  static var routeName = "cart";

  const CheckoutWidget({Key? key}) : super(key: key);

  @override
  _CheckoutWidgetState createState() => _CheckoutWidgetState();
}

class _CheckoutWidgetState extends State<CheckoutWidget> {
  final scaffoldKey = GlobalKey<ScaffoldState>();
  bool showSheet = false;
  int countValue = 0;
  List<CartItem> cartItems = [];
  Map<String, dynamic> checkoutDetails = {};
  List<CustomerDeliveryAddress> allAddressData = [];
  bool isLoadingSpinner = false;
  int? countControllerValue;
  Razorpay _razorpay = Razorpay();
  //here need to implement address provider's logic

  @override
  void initState() {
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);

    print(" widget  created ");
    // TODO: implement initState
    super.initState();
    checkoutDetails = Provider.of<Cart>(context, listen: false).checkoutData;

    // allAddressData =
    //     Provider.of<DeliveryAddress>(context, listen: false).allAddressData;
    setState(() {
      // cartItems = BlocProvider.of<CartBloc>(context).items;

      cartItems = Provider.of<Cart>(context, listen: false).items;
    });

    SchedulerBinding.instance.addPostFrameCallback((_) {
      // Provider.of<BottomMenuHandler>(context,listen:false).changeCurrentValue(BottomMuenu.Cart);
    });
  }

  @override
  void dispose() {
    super.dispose();
    _razorpay.clear();
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) {
    // Do something when payment succeeds
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    // Do something when payment fails
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    // Do something when an external wallet was selected
  }
  var options = {
    'key': 'rzp_test_WrQBsNAtdv4k3e',
    'amount': 100,
    'name': 'Acme Corp.',
    'description': 'Fine T-Shirt',
    'prefill': {'contact': '8888888888', 'email': 'test@razorpay.com'}
  };

  Future<void> deleteShippingAddres(String id) async {
    try {
      await Provider.of<DeliveryAddress>(context, listen: false)
          .deleteDeliveryAddressById(id);
      GlobalSnackBar.show(
          context,
          Provider.of<DeliveryAddress>(context, listen: false)
              .responseSuccessMessage);
      Provider.of<DeliveryAddress>(context, listen: false)
          .responseSuccessMessage = "";
    } catch (error) {
      Map<String, dynamic> errorRes = json.decode(error.toString());
      GlobalSnackBar.show(context, errorRes["message"]);
    }
  }

  Future<void> getAllAvailableData() async {
    try {
      await Provider.of<DeliveryAddress>(context, listen: false)
          .requestingAllDeliveryAvailableAddress();
    } catch (error) {
      Map<String, dynamic> errorRes = json.decode(error.toString());
      GlobalSnackBar.show(context, errorRes["message"]);
    }
  }

  void cartItemUpdated() {
    setState(() {
      cartItems = Provider.of<Cart>(context, listen: false).items;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      appBar:
          // PreferredSize(
          //   preferredSize: Size.fromHeight(120),
          // child:
          AppBar(
        centerTitle: true,

        // backgroundColor: AppTheme.of(context).secondaryBackground,
        backgroundColor: kPrimaryColor,
        automaticallyImplyLeading: false,
        leading: InkWell(
          onTap: () async {
            print(
                "checkout back ${Provider.of<BottomMenuHandler>(context, listen: false).currentValue}");
            Navigator.pop(context);
          },
          child: Icon(
            Icons.arrow_back_rounded,
            color: Color.fromARGB(255, 253, 253, 253),
            size: 24,
          ),
        ),
        title: Text(
          'Cart',
          style: AppTheme.of(context).subtitle2.override(
                fontFamily: 'Lexend Deca',
                color: Color.fromARGB(255, 253, 253, 253),
                fontSize: 20,
                fontWeight: FontWeight.w500,
              ),
        ),
        actions: [],
        elevation: 0,
      ),
      // ),
      backgroundColor: AppTheme.of(context).primaryBackground,
      body: Stack(
        children: <Widget>[
          GestureDetector(
            onTap: () => FocusScope.of(context).unfocus(),
            child: Column(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Consumer<Cart>(builder: (_, cart, ch) {
                          return ListView.builder(
                              padding: EdgeInsets.zero,
                              primary: false,
                              shrinkWrap: true,
                              scrollDirection: Axis.vertical,
                              itemCount: cartItems.length,
                              itemBuilder: (BuildContext context, int index) {
                                return Consumer<Products>(
                                  builder: (_, product, prod) {
                                    return Container(
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: Card(
                                        child: Row(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.center,
                                          children: <Widget>[
                                            Card(
                                              child: Container(
                                                height: MediaQuery.of(context)
                                                        .size
                                                        .height *
                                                    0.15,
                                                width: MediaQuery.of(context)
                                                        .size
                                                        .width *
                                                    0.25,
                                                decoration: BoxDecoration(
                                                  image: DecorationImage(
                                                    // image: NetworkImage(cartItems[index].image),
                                                    image: NetworkImage(product
                                                        .foundAndReturnProductsImage(
                                                            int.parse(
                                                                cartItems[index]
                                                                    .id))),
                                                    fit: BoxFit.cover,
                                                  ),
                                                  borderRadius:
                                                      BorderRadius.circular(10),
                                                ),
                                              ),
                                            ),
                                            Container(
                                              decoration: BoxDecoration(
                                                borderRadius:
                                                    BorderRadius.circular(10),
                                                color: Colors.white,
                                              ),
                                              height: MediaQuery.of(context)
                                                      .size
                                                      .height *
                                                  0.15,
                                              width: MediaQuery.of(context)
                                                      .size
                                                      .width *
                                                  0.5,
                                              child: Column(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                children: [
                                                  Text(
                                                    // cartItems[index].name,
                                                    product
                                                        .foundAndReturnProductsName(
                                                            int.parse(
                                                                cartItems[index]
                                                                    .id)),
                                                    style: TextStyle(
                                                      fontSize: 18,
                                                      fontWeight:
                                                          FontWeight.bold,
                                                    ),
                                                  ),
                                                  SizedBox(height: 10),

                                                  Row(
                                                      mainAxisAlignment:
                                                          MainAxisAlignment
                                                              .center,
                                                      crossAxisAlignment:
                                                          CrossAxisAlignment
                                                              .center,
                                                      children: [
                                                        Text.rich(
                                                          TextSpan(
                                                            children: [
                                                              TextSpan(
                                                                text:
                                                                    '₹ ${product.foundAndReturnProductsPrice(int.parse(cartItems[index].id))}',
                                                                style: TextStyle(
                                                                    // fontSize: 18,
                                                                    // fontWeight: FontWeight.bold,
                                                                    decoration: TextDecoration.lineThrough),
                                                              ),
                                                              WidgetSpan(
                                                                child: SizedBox(
                                                                  width: MediaQuery.of(
                                                                              context)
                                                                          .size
                                                                          .width *
                                                                      0.05, // your of space
                                                                ),
                                                              ),
                                                              TextSpan(
                                                                text:
                                                                    '₹ ${product.foundAndReturnProductsOfferPrice(int.parse(cartItems[index].id))}',
                                                                style: TextStyle(
                                                                    // fontSize: 16,
                                                                    // fontWeight: FontWeight.bold,
                                                                    ),
                                                              ),
                                                            ],
                                                          ),
                                                        )
                                                      ]),

                                                  SizedBox(height: 15),

                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .spaceEvenly,
                                                    children: [
                                                      Text(
                                                        // 'Quantity: ${cartItems[index].quantity}',
                                                        // 'Quantity: ${product.foundAndReturnProductsQuantity(int.parse(cartItems[index].id))}',
                                                        'Qty:',
                                                        style: TextStyle(
                                                          fontSize: 14,
                                                          color: Colors.grey,
                                                        ),
                                                      ),

                                                      //Remove button here
                                                      Container(
                                                        width: 25.0,
                                                        height: 25,
                                                        child: ElevatedButton(
                                                          onPressed: () {
                                                            setState(() {
                                                              cart.removeItem(
                                                                  cartItems[
                                                                          index]
                                                                      .id,
                                                                  context,
                                                                  "1");
                                                            });
                                                            // your on pressed function here
                                                          },
                                                          style: ElevatedButton
                                                              .styleFrom(
                                                            backgroundColor:
                                                                Colors
                                                                    .grey[500],
                                                            shape:
                                                                RoundedRectangleBorder(
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          40.0),
                                                            ),
                                                            padding:
                                                                EdgeInsets.zero,
                                                          ),
                                                          child: Container(
                                                            width: 20.0,
                                                            height: 20,
                                                            child: Center(
                                                              child: Icon(
                                                                Icons.remove,
                                                                color: Colors
                                                                    .white,
                                                                size: 15.0,
                                                              ),
                                                            ),
                                                          ),
                                                        ),
                                                      ),

                                                      Text(
                                                        // "${countValue.toString()}",
                                                        // 'Quantity: ${cartItems[index].quantity}',
                                                        // 'Quantity: ${product.foundAndReturnProductsQuantity(int.parse(cartItems[index].id))}',
                                                        '${cart.findCartItemQuantity(cartItems[index].id)}',
                                                        style: TextStyle(
                                                          fontSize: 14,
                                                          color: Colors.grey,
                                                        ),
                                                      ),
                                                      Container(
                                                        width: 25.0,
                                                        height: 25,
                                                        child: ElevatedButton(
                                                          onPressed: () {
                                                            // your on pressed function here
                                                            cart.productData = product.productDataList;
                                                            setState(() {
                                                              cart.addItem(
                                                                  cartItems[
                                                                          index]
                                                                      .id,
                                                                  "1");
                                                              if (Provider.of<
                                                                          Cart>(
                                                                      context,
                                                                      listen:
                                                                          false)
                                                                  .quantityError
                                                                  .isNotEmpty) {
                                                                GlobalSnackBar.show(
                                                                    context,
                                                                    Provider.of<Cart>(
                                                                            context,
                                                                            listen:
                                                                                false)
                                                                        .quantityError);
                                                                Provider.of<Cart>(
                                                                        context,
                                                                        listen:
                                                                            false)
                                                                    .quantityError = "";
                                                              }
                                                            });
                                                          },
                                                          style: ElevatedButton
                                                              .styleFrom(
                                                            backgroundColor:
                                                                Colors
                                                                    .green[500],
                                                            shape:
                                                                RoundedRectangleBorder(
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          40.0),
                                                            ),
                                                            padding:
                                                                EdgeInsets.zero,
                                                          ),
                                                          child: Container(
                                                            width: 20.0,
                                                            height: 20,
                                                            child: Center(
                                                              child: Icon(
                                                                Icons.add,
                                                                color: Colors
                                                                    .white,
                                                                size: 15.0,
                                                              ),
                                                            ),
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),

                                                  // ),
                                                ],
                                              ),
                                            ),
                                            Container(
                                              width: 60.0,
                                              height: 60,
                                              child: ElevatedButton(
                                                onPressed: () {
                                                  // your on pressed function here
                                                  cart.deleteItem(
                                                      cartItems[index].id);
                                                  cartItemUpdated();
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  primary: Colors.red,
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            30.0),
                                                  ),
                                                  padding: EdgeInsets.zero,
                                                ),
                                                child: Container(
                                                  // width: 20.0,
                                                  // height: 20,
                                                  child: Center(
                                                    child: Icon(
                                                      Icons.delete,
                                                      color: Colors.white,
                                                      size: 20.0,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                );
                              });
                        }),
                        cartItems.length != 0
                            ? Column(
                                children: <Widget>[
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        24, 16, 24, 4),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.max,
                                      children: [
                                        Text(
                                          'Price Breakdown',
                                          style: AppTheme.of(context).bodyText2,
                                        ),
                                      ],
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        24, 4, 24, 0),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Base Price',
                                          style: AppTheme.of(context).subtitle2,
                                        ),
                                        Text(
                                          '₹${Provider.of<Cart>(context, listen: false).basePrice}',
                                          style: AppTheme.of(context).subtitle1,
                                        ),
                                      ],
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        24, 4, 24, 0),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Taxes',
                                          style: AppTheme.of(context).subtitle2,
                                        ),
                                        Text(
                                          '₹ 00.00',
                                          style: AppTheme.of(context).subtitle1,
                                        ),
                                      ],
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        24, 4, 24, 0),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Discount',
                                          style: AppTheme.of(context).subtitle2,
                                        ),
                                        Text(
                                          '₹ ${Provider.of<Cart>(context, listen: false).discountPrice}',
                                          style: AppTheme.of(context).subtitle1,
                                        ),
                                      ],
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        24, 4, 24, 24),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Row(
                                          mainAxisSize: MainAxisSize.max,
                                          children: [
                                            Text(
                                              'Total',
                                              style: AppTheme.of(context)
                                                  .subtitle2,
                                            ),
                                            IconButton(
                                              icon: Icon(
                                                Icons.info_outlined,
                                                color: Color(0xFF57636C),
                                                size: 18,
                                              ),
                                              onPressed: () {
                                                print('IconButton pressed ...');
                                              },
                                            ),
                                          ],
                                        ),
                                        Text(
                                          '₹${Provider.of<Cart>(context, listen: false).totalPrice}',
                                          style: AppTheme.of(context).title1,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              )
                            : Column(
                                children: <Widget>[
                                  SizedBox(height: 40),
                                  SizedBox(
                                    child: Icon(
                                      Icons.sentiment_very_dissatisfied,
                                      size: 40.0,
                                    ),
                                  ),
                                  Text(
                                    "Your cart is empty!",
                                    style: TextStyle(fontSize: 24),
                                  ),
                                  // AnimatedTextKit(
                                  //   animatedTexts: [
                                  //     TypewriterAnimatedText(
                                  //       'Hello world!',
                                  //       textStyle: const TextStyle(
                                  //         fontSize: 32.0,
                                  //         fontWeight: FontWeight.bold,
                                  //       ),
                                  //       speed:
                                  //           const Duration(milliseconds: 2000),
                                  //     ),
                                  //   ],
                                  //   totalRepeatCount: 4,
                                  //   pause: const Duration(milliseconds: 1000),
                                  //   displayFullTextOnTap: true,
                                  //   stopPauseOnTap: true,
                                  // ),
                                  SizedBox(height: 30),
                                  SizedBox(
                                      width: 200,
                                      child: ElevatedButton(
                                        onPressed: () {
                                          Provider.of<BottomMenuHandler>(
                                                  context,
                                                  listen: false)
                                              .currentValue = BottomMuenu.Home;
                                          Navigator.pop(context);
                                          Navigator.pushNamed(context,
                                              ProductListingWidget.routeName);
                                        },
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: kPrimaryColor,
                                        ),
                                        child: const Text('Shopping now'),
                                      )),
                                ],
                              ),
                      ],
                    ),
                  ),
                ),
                if (cartItems.length != 0)
                  Container(
                    width: double.infinity,
                    height: 70,
                    decoration: const BoxDecoration(
                      color: kPrimaryColor,
                      boxShadow: [
                        BoxShadow(
                          blurRadius: 4,
                          color: Color(0x320E151B),
                          offset: Offset(0, -2),
                        )
                      ],
                    ),
                    alignment: AlignmentDirectional(0, -0.35),
                    child: TextButton(
                      onPressed: () async {
                        if(Provider.of<AuthChecker>(context,listen: false).isAuth)
                        {
                          setState(() {
                            isLoadingSpinner = true;
                          });

                          await getAllAvailableData();

                          setState(() {
                            isLoadingSpinner = false;
                            showSheet = !showSheet;
                          });

                        }
                        else{
                          Navigator.pushNamed(context, Shipping.routeName);
                        }
                         
                        // Navigator.pushNamed(context, AddressPageSelection.routeName);
                      },
                      child: RichText(
                        text: TextSpan(
                          children: <TextSpan>[
                            TextSpan(
                              text: ("Checkout ₹"),
                              style: AppTheme.of(context).title2.override(
                                    fontFamily: 'Poppins',
                                    color: AppTheme.of(context).primaryBtnText,
                                  ),
                            ),
                            TextSpan(
                                text:
                                    "${Provider.of<Cart>(context, listen: false).totalPrice}",
                                style: AppTheme.of(context).title2.override(
                                    fontFamily: 'Poppins',
                                    color:
                                        AppTheme.of(context).primaryBtnText)),
                          ],
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),

          isLoadingSpinner
              ? Center(
                  child: Container(
                      height: MediaQuery.of(context).size.height * 0.2,
                      width: 60,
                      child: SpinKitCubeGrid(
                        color: kPrimaryColor,
                      )),
                )
              : Offstage(
                  offstage: !showSheet,
                  child: DraggableScrollableSheet(
                      initialChildSize: 0.5,
                      maxChildSize: 1.0,
                      builder:
                          (BuildContext context, ScrollController controller) {
                        return Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
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
                                color: Colors.lightBlue,
                                height: 40,
                                //  backgroundColor: Colors.lightBlue,
                                child: Row(
                                  children: <Widget>[
                                    Expanded(
                                      child: Text(
                                        'Select address',
                                        textAlign: TextAlign.center,
                                        style: TextStyle(
                                            // textAlign:TextAlign.center,/
                                            color: Colors.white,
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                    IconButton(
                                    icon: Icon(Icons.close),
                                    onPressed: () => setState(() {
                                      showSheet = !showSheet;
                                    }),
                                  ),
                                  ],
                                ),
                              ),

                              Row(
                                children: [
                                  Container(
                                    margin: EdgeInsets.only(
                                        left:
                                            MediaQuery.of(context).size.width *
                                                0.01,
                                        right:
                                            MediaQuery.of(context).size.width *
                                                0.01,
                                        top: MediaQuery.of(context).size.width *
                                            0.01),
                                    child: TextButton(
                                      onPressed: () {
                                        // Add new address action

                                        setState(() {
                                          showSheet = !showSheet;
                                        });
                                        Provider.of<DeliveryAddress>(context,
                                                listen: false)
                                            .addressType = AddressType.ADD;
                                        /**
                                   * AddressType.ADD
                                   */
                                        Navigator.pushNamed(
                                            context, Shipping.routeName);
                                      },
                                      child: Container(
                                        height: 30,
                                        padding: EdgeInsets.all(5),
                                        child: Text("Add New Address"),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              SizedBox(
                                  height:
                                      MediaQuery.of(context).size.width * 0.05),
                              Provider.of<DeliveryAddress>(context,
                                              listen: false)
                                          .allAddressData
                                          .length ==
                                      0
                                  ? Column(
                                      children: [
                                        Text("No address available!"),
                                      ],
                                    )
                                  : 
                                  Consumer<DeliveryAddress>(
                                      builder: (_, addressData, ch) {
                                        return Container(
                                          height: MediaQuery.of(context)
                                                  .size
                                                  .width *
                                              01,
                                          child: ListView.builder(
                                              itemCount: addressData
                                                  .allAddressData.length,
                                              itemBuilder: ((context, index) {
                                                return Container(
                                                  width: MediaQuery.of(context)
                                                          .size
                                                          .width *
                                                      02,
                                                  child: Card(
                                                    shape:
                                                        RoundedRectangleBorder(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              10.0),
                                                    ),
                                                    child: Container(
                                                      padding:
                                                          EdgeInsets.all(10),
                                                      child: Column(
                                                        children: [
                                                          Column(
                                                            children: [
                                                              Container(
                                                                margin:
                                                                    EdgeInsets
                                                                        .only(
                                                                  left: MediaQuery.of(
                                                                              context)
                                                                          .size
                                                                          .width *
                                                                      0.05,
                                                                ),
                                                                child: Text(
                                                                  // checkoutDetails["name"],
                                                                  addressData
                                                                          .allAddressData[
                                                                              index]
                                                                          .firstName +
                                                                      " " +
                                                                      addressData
                                                                          .allAddressData[
                                                                              index]
                                                                          .lastName,
                                                                  style:
                                                                      TextStyle(
                                                                    fontWeight:
                                                                        FontWeight
                                                                            .bold,
                                                                    fontSize:
                                                                        18,
                                                                  ),
                                                                ),
                                                              ),
                                                              Container(
                                                                margin: EdgeInsets.only(
                                                                    left: MediaQuery.of(context)
                                                                            .size
                                                                            .width *
                                                                        0.05,
                                                                    top: 10),
                                                                child: Text(
                                                                  // "Gunadhya Software, Month Vert Zenith, Baner Road",
                                                                  addressData
                                                                      .allAddressData[
                                                                          index]
                                                                      .address,
                                                                  style:
                                                                      TextStyle(
                                                                    fontSize:
                                                                        14,
                                                                  ),
                                                                ),
                                                              ),
                                                              Container(
                                                                margin: EdgeInsets.only(
                                                                    left: MediaQuery.of(context)
                                                                            .size
                                                                            .width *
                                                                        0.05,
                                                                    top: 10),
                                                                child: Text(
                                                                  // "Baner Pashan Link Road, Pune, Maharashtra, 411045, India",
                                                                  addressData
                                                                          .allAddressData[
                                                                              index]
                                                                          .city +
                                                                      ", " +
                                                                      addressData
                                                                          .allAddressData[
                                                                              index]
                                                                          .state +
                                                                      "," +
                                                                      addressData
                                                                          .allAddressData[
                                                                              index]
                                                                          .country +
                                                                      ", " +
                                                                      addressData
                                                                          .allAddressData[
                                                                              index]
                                                                          .pincode,
                                                                  style:
                                                                      TextStyle(
                                                                    fontSize:
                                                                        14,
                                                                  ),
                                                                ),
                                                              ),
                                                              Container(
                                                                margin: EdgeInsets
                                                                    .only(
                                                                        left:
                                                                            20,
                                                                        top:
                                                                            10),
                                                                child: Text(
                                                                  // "Baner Pashan Link Road, Pune, Maharashtra, 411045, India",
                                                                  addressData
                                                                      .allAddressData[
                                                                          index]
                                                                      .phone,
                                                                  style:
                                                                      TextStyle(
                                                                    fontSize:
                                                                        14,
                                                                  ),
                                                                ),
                                                              ),
                                                              Column(
                                                                children: <
                                                                    Widget>[
                                                                  ElevatedButton(
                                                                    onPressed:
                                                                        () {
                                                                      Provider.of<Cart>(context, listen: false).preparedCheckout(
                                                                          addressData
                                                                              .allAddressData[
                                                                                  index]
                                                                              .id,
                                                                          addressData.allAddressData[index].firstName +
                                                                              addressData.allAddressData[index].lastName,
                                                                          addressData.allAddressData[index].phone,
                                                                          addressData.allAddressData[index].email);
                                                                      setState(
                                                                          () {
                                                                        showSheet =
                                                                            !showSheet;
                                                                      });

                                                                      Navigator.pushNamed(
                                                                          context,
                                                                          Payment
                                                                              .routeName);
                                                                    },
                                                                    child: Text(
                                                                      "Deliver to this address",
                                                                      textAlign:
                                                                          TextAlign
                                                                              .center,
                                                                    ),
                                                                  ),
                                                                  Row(
                                                                    mainAxisAlignment:
                                                                        MainAxisAlignment
                                                                            .center,
                                                                    children: [
                                                                      Container(
                                                                        margin: EdgeInsets.only(
                                                                            left:
                                                                                20,
                                                                            right:
                                                                                20,
                                                                            top:
                                                                                20),
                                                                        child:
                                                                            TextButton(
                                                                          onPressed:
                                                                              () {
                                                                            // Edit address action
                                                                            Provider.of<DeliveryAddress>(context, listen: false).addressType =
                                                                                AddressType.EDIT;
                                                                            Provider.of<DeliveryAddress>(context, listen: false).editAddressId =
                                                                                int.parse(addressData.allAddressData[index].id);
                                                                            Provider.of<DeliveryAddress>(context, listen: false).returnEditingAddressValues();

                                                                            setState(() {
                                                                              showSheet = !showSheet;
                                                                            });
                                                                            // Navigator.pop(context);
                                                                            Navigator.pushNamed(context,
                                                                                Shipping.routeName);
                                                                          },
                                                                          child:
                                                                              Container(
                                                                            height:
                                                                                30,
                                                                            padding:
                                                                                EdgeInsets.all(5),
                                                                            child:
                                                                                Text("Edit"),
                                                                          ),
                                                                        ),
                                                                      ),
                                                                      Container(
                                                                        margin: EdgeInsets.only(
                                                                            left:
                                                                                20,
                                                                            right:
                                                                                20,
                                                                            top:
                                                                                20),
                                                                        child:
                                                                            TextButton(
                                                                          onPressed:
                                                                              () async {
                                                                            // Remove address action

                                                                            setState(() {
                                                                              //delete loading spinner
                                                                              isLoadingSpinner = true;
                                                                            });

                                                                            await deleteShippingAddres(addressData.allAddressData[index].id);

                                                                            setState(() {
                                                                              isLoadingSpinner = false;
                                                                              showSheet = !showSheet;
                                                                            });
                                                                            // Navigator.pop(context);
                                                                          },
                                                                          child:
                                                                              Container(
                                                                            height:
                                                                                30,
                                                                            padding:
                                                                                EdgeInsets.all(5),
                                                                            child:
                                                                                Text(
                                                                              "Remove",
                                                                              style: TextStyle(
                                                                                color: Colors.red,
                                                                              ),
                                                                            ),
                                                                          ),
                                                                        ),
                                                                      ),
                                                                    ],
                                                                  ),
                                                                ],
                                                              ),
                                                            ],
                                                          ),
                                                        ],
                                                      ),
                                                    ),
                                                  ),
                                                );
                                              })),
                                        );
                                      },
                                    ),
                            ],
                          ),
                        );
                      }),
                )
        ],
      ),
      bottomNavigationBar: BottomMenu(),
    );
  }
}
