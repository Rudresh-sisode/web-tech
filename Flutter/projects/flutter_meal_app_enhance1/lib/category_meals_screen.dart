import 'package:flutter/material.dart';


class CategoryMealsScreen extends StatelessWidget {

  static const routeName = '/category-meals';
  // final String categoryId;
  // final String categoryTitle;

  // const CategoryMealsScreen(this.categoryId,this.categoryTitle,{Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final routeArgs = ModalRoute.of(context).settings.arguments as Map<String,String>;
    final categoryTitle = routeArgs['title'];
    final categoryId = routeArgs['id'];
    return  Scaffold(
      appBar: AppBar(
        title:Text(categoryTitle),
        ),
      // ignore: prefer_const_constructors
      body: Center(child: 
       Text('The Recipes for the category',style: TextStyle(color: Colors.white)),
      ),
    );
  }
}