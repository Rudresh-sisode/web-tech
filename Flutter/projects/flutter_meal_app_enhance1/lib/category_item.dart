import 'package:flutter/material.dart';
import 'package:meals_app/category_meals_screen.dart';

class CategoryItem extends StatelessWidget {
  final String id;
  final String title;
  final Color color;

  const CategoryItem( this.id,this.title,this.color, {Key key}) : super(key: key);

  void selectCategory(BuildContext ctx){
    Navigator.of(ctx).pushNamed(
      // '/category-meals', arguments: {'id':id,'title':title},
      CategoryMealsScreen.routeName,arguments: {'id':id,'title':title}
    );
    // Navigator.of(ctx).push(MaterialPageRoute(builder: (_){
    //   return CategoryMealsScreen(id,title);
    // })
    // ,);
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(onTap: () => selectCategory(context) ,splashColor: Theme.of(context).primaryColor,
      child: Container(
        padding: EdgeInsets.all(15),
        child: Text(title,style: Theme.of(context).textTheme.titleSmall,),
        decoration: BoxDecoration(
            gradient: LinearGradient(
          colors: [
            color.withOpacity(0.7),
            color,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(15),
        ),
      ),
    );
  }
}
