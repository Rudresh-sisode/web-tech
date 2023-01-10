import 'package:flutter/material.dart';
import 'package:meals_app/category_meals_screen.dart';
import './categories_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // const MyApp({Key key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
          colorScheme: ColorScheme.fromSwatch(primarySwatch: Colors.pink)
              .copyWith(secondary: Color.fromARGB(255, 249, 212, 99)),
          canvasColor: Color.fromARGB(38, 0, 0, 0),
          fontFamily: 'RaleWay',
          textTheme: ThemeData.light().textTheme.copyWith(
                bodySmall: const TextStyle(
                  color: Color.fromRGBO(20, 51, 51, 1),
                ),
                bodyMedium: const TextStyle(
                  color: Color.fromRGBO(20, 51, 51, 1),
                ),
                titleMedium: const TextStyle(
                  fontSize: 24,
                  fontFamily: 'RobotoCondensed',
                  fontWeight: FontWeight.bold
                )
              )),
      //  home:  MyHomePage(), //here we tells flutter that this is the first page, welcome page, the root screen of your app.
      // home: CategoriesScreen(),
      initialRoute: '/',
      routes:{
        '/':(ctx)=> CategoriesScreen(),
        // '/category-meals':(ctx)=> CategoryMealsScreen(),
        CategoryMealsScreen.routeName:(ctx)=> CategoryMealsScreen()
      }
    );
  }
}

// class MyHomePage extends StatefulWidget {
//     @override
//   _MyHomePageState createState() => _MyHomePageState();
// }

// class _MyHomePageState extends State<MyHomePage> {

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('DeliMeals'),
//       ),
//       body: Center(
//         child: Text('Navigation Time!'),
//       ),
//     );
//   }
// }
