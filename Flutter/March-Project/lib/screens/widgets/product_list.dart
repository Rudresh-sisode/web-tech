
import 'package:ecomm_app/models/product.dart';
import 'package:ecomm_app/product_detail_widget.dart';
import 'package:ecomm_app/providers/filter-provider.dart';
import 'package:ecomm_app/screens/widgets/product_tile_animation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';

// import '../bloc/cart_bloc.dart';
// import '../bloc/state/cart_state.dart';
// import '../models/product.dart';
import '../../models/product-details.dart';
import '../../providers/cart.dart';
import 'product_tile.dart';

class ProductList extends StatelessWidget {
  const ProductList({super.key, required this.products});

  final List<ProductDetails> products;

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<Cart>(context, listen: true);
    if (cart.isGridView) {
      return LayoutBuilder(builder: (context, constraints) {
        return GridView.builder(
          physics: Provider.of<FilterProvider>(context,listen: false).isFilterActive ? null : NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: products.length,
          itemBuilder: (context, index) => ProductTileAnimation(
            itemNo: index,
            product: products[index],
          ),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: constraints.maxWidth > 700 ? 4 : 2,
            childAspectRatio: 1,
          ),
        );
      });
    } else {
      return ListView.builder(
          physics: NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: products.length,
          itemBuilder: (BuildContext context, int index) {
            return ProductTileAnimation(
              itemNo: index,
              product: products[index],
            );
          });
    }
  }
}
