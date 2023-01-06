import 'package:flutter/material.dart';
import './dummy_data.dart';
import './category_item.dart';

class MyWidget extends StatelessWidget {
  const MyWidget();

  @override
  Widget build(BuildContext context) {
    return GridView(
      children: DUMMY_CATEGORIES.map((catData){
        CategoryItem(catData.title,catData.color);
      }).toList(),
      gridDelegate:
          /** this use for the scrollable area on the screen */ const SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 200,
              childAspectRatio: 3 / 2,
              crossAxisSpacing: 20,
              mainAxisSpacing: 20),
    );
  }
}
