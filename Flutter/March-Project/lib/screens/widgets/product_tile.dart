import 'package:animations/animations.dart';
import 'package:ecomm_app/app_theme.dart';
import 'package:ecomm_app/bloc/cart_bloc.dart';
import 'package:ecomm_app/models/product.dart';
import 'package:ecomm_app/product_detail_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../models/product-details.dart';

// import '../app_theme.dart';
// import '../bloc/cart_bloc.dart';
// import '../models/product.dart';
// import '../product_detail_widget.dart';

class ProductTile extends StatelessWidget {
  final int itemNo;
  final ProductDetails product;

  const ProductTile({this.itemNo = 0, required this.product});

  @override
  Widget build(BuildContext context) {
    final Color color = Colors.primaries[itemNo % Colors.primaries.length];
    var cartList = BlocProvider.of<CartBloc>(context).items;
    ContainerTransitionType _transitionType = ContainerTransitionType.fade;
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ProductDetailWidget(product: product),
            ),
          );
        },
        child: Container(
          //width: MediaQuery.of(context).size.width * 0.45,
          decoration: BoxDecoration(
            // color: AppTheme.of(context).secondaryBackground,
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
            borderRadius: BorderRadius.circular(8),
          ),
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(0, 0, 0, 12),
            child: Column(
              mainAxisSize: MainAxisSize.max,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: const BorderRadius.only(
                          bottomLeft: Radius.circular(0),
                          bottomRight: Radius.circular(0),
                          topLeft: Radius.circular(8),
                          topRight: Radius.circular(8),
                        ),
                        child: Image.network(
                          product.productImages[0].imageFullPath,
                          width: 100,
                          height: 100,
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0, 4, 0, 0),
                  child: Row(
                    mainAxisSize: MainAxisSize.max,
                    children: const [
                      Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(8, 4, 0, 0),
                        child: Text("\u20B9"),
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
                        //   '\$${product.price}',
                        //   style: AppTheme.of(context).bodyText2,
                        // ),
                        child: RichText(
                          text: TextSpan(
                            children: <TextSpan>[
                              TextSpan(
                                  text: ("\u20B9"),
                                  style: TextStyle(color: Colors.red)),
                              TextSpan(
                                  text: ' ${product.price}',
                                  style: TextStyle(color: Colors.blue)),
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
      ),
    );
  }
}
