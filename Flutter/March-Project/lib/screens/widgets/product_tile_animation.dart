import 'package:animations/animations.dart';
import 'package:ecomm_app/app_theme.dart';
import 'package:ecomm_app/bloc/cart_bloc.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/models/product.dart';
import 'package:ecomm_app/product_detail_widget.dart';
import 'package:ecomm_app/providers/cart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';

import '../../models/product-details.dart';

// import '../app_theme.dart';
// import '../bloc/cart_bloc.dart';
// import '../models/product.dart';
// import '../product_detail_widget.dart';

class ProductTileAnimation extends StatelessWidget {
  final int itemNo;
  final ProductDetails product;

  const ProductTileAnimation({this.itemNo = 0, required this.product});

  @override
  Widget build(BuildContext context) {
    final Color color = Colors.primaries[itemNo % Colors.primaries.length];
    // var cartList = BlocProvider.of<CartBloc>(context).items;
    // final cartList = Provider.of<Cart>(context)
    ContainerTransitionType _transitionType = ContainerTransitionType.fade;
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: OpenContainer<bool>(
        transitionType: _transitionType,
        openBuilder: (BuildContext _, VoidCallback openContainer) {
          return ProductDetailWidget(
            product: product,
          );
        },
        //  double c_width = MediaQuery.of(context).size.width*0.8;
        closedShape: const RoundedRectangleBorder(),
        closedElevation: 0.0,
        closedBuilder: (BuildContext _, VoidCallback openContainer) {
          return Container(
            // padding: const EdgeInsets.all(2.0),
            // child: Padding(
            // padding: const EdgeInsets.all(2.0),
            // width: MediaQuery.of(context).size.width * 0.8,
            child: Card(
              // decoration: BoxDecoration(
              //   color: AppTheme.of(context).secondaryBackground,
              //   // boxShadow: [
              //   //   BoxShadow(
              //   //     color: Color(0xFF713590),
              //   //     spreadRadius: 1,
              //   //     blurRadius: 3,
              //   //     offset: const Offset(0, 0),
              //   //   )
              //   //   // BoxShadow(
              //   //   //   color: Colors.grey.withOpacity(0.5),
              //   //   //   spreadRadius: 5,
              //   //   //   blurRadius: 7,
              //   //   //   offset: Offset(0, 3), // changes position of shadow
              //   //   //   // color: Colors.deepPurpleAccent,
              //   //   //   // blurRadius: 10,
              //   //   //   // spreadRadius: 0,
              //   //   //   // offset: Offset(10, 10)
              //   //   // ),
              //   //   // BoxShadow(
              //   //   //   blurRadius: 4,
              //   //   //   color: Color(0x3600000F),
              //   //   //   offset: Offset(0, 2),
              //   //   // )
              //   // ],
              //   borderRadius: BorderRadius.circular(8),
              // ),
              child: Padding(
                padding: EdgeInsetsDirectional.all(0),
                //  width: MediaQuery.of(context).size.width * 0.2,
                // margin: EdgeInsetsDirectional.all(10),
                // padding: EdgeInsetsDirectional.fromSTEB(0, 20, 0, 0),
                child: Column(
                  // spacing: 5.0,
                  // runSpacing: 5.0,
                  // pad
                  // direction: Axis.vertical,
                  // crossAxisAlignment: CrossAxisAlignment.stretch,
                  // mainAxisSize: MainAxisSize.max,
                  children: [
                    Row(
                      // mainAxisSize: MainAxisSize.max,
                      children: [
                        Expanded(
                          child: ClipRRect(
                            borderRadius: BorderRadius.only(
                              bottomLeft: Radius.circular(0),
                              bottomRight: Radius.circular(0),
                              topLeft: Radius.circular(8),
                              topRight: Radius.circular(8),
                            ),
                            child: Image.network(
                              product.productImages[0].imageFullPath,
                              width: 80,
                              height: 100,
                              // width: double.infinity,
                              fit: BoxFit.contain,
                            ),
                          ),
                        ),
                      ],
                    ),
                    Padding(
                      padding: EdgeInsetsDirectional.fromSTEB(0, 0, 0, 0),
                      child: Row(
                        mainAxisSize: MainAxisSize.max,
                        children: <Widget>[
                          Flexible(
                            // padding: EdgeInsetsDirectional.fromSTEB(8, 4, 0, 0),
                            // child: Flexible(
                            child: Text(
                              product.name,
                              style: AppTheme.of(context).bodyText1,
                              // overflow: TextOverflow.clip
                              // softWrap: true,
                              // maxLines: 3,
                              // overflow: TextOverflow.ellipsis,
                            ),
                            // ),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: EdgeInsetsDirectional.fromSTEB(0, 2, 0, 0),
                      child: Row(
                        mainAxisSize: MainAxisSize.max,
                        children: [
                          Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(8, 4, 0, 0),
                            // child: Text(
                            //   '123',
                            //   style: AppTheme.of(context).bodyText2,
                            // ),
                            child: RichText(
                              text: TextSpan(
                                children: <TextSpan>[
                                  TextSpan(
                                      text: ("\u20B9"),
                                      style: TextStyle(
                                          color: Color.fromARGB(255, 4, 4, 4))),
                                  TextSpan(
                                      text: '${product.price}',
                                      style: TextStyle(color: kPrimaryColor)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // ),
          );
        },
      ),
    );
  }
}
