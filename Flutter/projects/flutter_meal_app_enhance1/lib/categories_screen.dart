import 'package:flutter/material.dart';
import './dummy_data.dart';
import './category_item.dart';

class CategoriesScreen extends StatelessWidget {
  // const CategoriesScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title:const Text('DeliMeal')),
      body: GridView.builder(padding: const EdgeInsets.all(25),gridDelegate: 
      const SliverGridDelegateWithMaxCrossAxisExtent(
                maxCrossAxisExtent: 200,
                childAspectRatio: 3 / 2,
                crossAxisSpacing: 20,
                mainAxisSpacing: 20), 
      itemBuilder: (BuildContext context, int index) {
        return  CategoryItem(DUMMY_CATEGORIES[index].id,DUMMY_CATEGORIES[index].title, DUMMY_CATEGORIES[index].color);
      
      },itemCount: DUMMY_CATEGORIES.length, ),
      
    );
  }
}
