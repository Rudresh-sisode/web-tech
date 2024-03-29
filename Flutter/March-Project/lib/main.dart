// import 'package:ecomm_app/models/cart.dart';
import 'dart:io';

import 'package:ecomm_app/product_listing_widget.dart';
import 'package:ecomm_app/providers/auth-checker.dart';
import 'package:ecomm_app/providers/bottom-menu.dart';
import 'package:ecomm_app/providers/carousel.dart';
import 'package:ecomm_app/providers/delivery-address.dart';
import 'package:ecomm_app/providers/filter-provider.dart';
import 'package:ecomm_app/providers/home-page-slider.dart';
import 'package:ecomm_app/providers/loader.dart';
import 'package:ecomm_app/providers/orders.dart';
import 'package:ecomm_app/providers/popular.dart';
import 'package:ecomm_app/providers/products.dart';
import 'package:ecomm_app/services/local_notification_service.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
// import 'package:ecomm_app/providers/auth.dart';
import "./providers/auth.dart";
import 'package:ecomm_app/providers/cart.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:ecomm_app/screens/auth/auth_screen.dart';
import 'package:ecomm_app/screens/auth/auth_splash_screen.dart';
import 'package:provider/provider.dart';
import 'package:ecomm_app/routes.dart';
import 'package:ecomm_app/screens/splash/splash_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ecomm_app/theme.dart';
import 'package:firebase_core/firebase_core.dart';

Future<void> backgroundHandler(RemoteMessage message) async {
  	print(message.data.toString());
 	print(message.notification!.title);
	}

Future main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(backgroundHandler);
  LocalNotificationService.initialize();
  await dotenv.load(fileName: "assets/.env");
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  // Widget build(BuildContext context) {
  //   return MaterialApp(
  //     debugShowCheckedModeBanner: false,
  //     title: 'Flutter Demo',
  //     theme: theme(),
  //     // home: SplashScreen(),
  //     // We use routeName so that we dont need to remember the name
  //     initialRoute: SplashScreen.routeName,
  //     routes: routes,
  //   );
  // }
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthChecker()),
        ChangeNotifierProvider(create: (_) => Auth()),
        ChangeNotifierProvider(create: (_) => Cart()),
        ChangeNotifierProvider(create: (_) => Products()),
        ChangeNotifierProvider(create: (_) => Orders()),
        ChangeNotifierProvider(create: (_) => DeliveryAddress()),
        // ChangeNotifierProvider(create: (_) => CarouselApi()),
        ChangeNotifierProvider(create: (_) => PopularApi()),
        ChangeNotifierProvider(create: (_) => HomePageSlider()),
        ChangeNotifierProvider(create: (_) => BottomMenuHandler()),
        // add FilterProvider here
        ChangeNotifierProvider(create: (_) => FilterProvider()),
      ],
      child: Consumer<AuthChecker>(
        builder: (ctx, auth, _) => MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Flutter Demo',
          theme: theme(),
          home: auth.isAuth
              ? ProductListingWidget()
              : FutureBuilder(
                  future: auth.tryAutoLogin(),
                  builder: (ctx, authResultSnapshot) =>
                      authResultSnapshot.connectionState ==
                              ConnectionState.waiting
                          ? AuthSplashScreen()
                          : AuthScreen(),
                ),
          routes: routes,
        ),
      ),
    );
  }
}

/**
 * code backup
 * Consumer<Auth>(
        builder: (ctx, auth, _) => MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Flutter Demo',
          theme: theme(),
          home: auth.isAuth
              ? ProductListingWidget()
              : FutureBuilder(
                  future: auth.tryAutoLogin(),
                  builder: (ctx, authResultSnapshot) =>
                      authResultSnapshot.connectionState ==
                              ConnectionState.waiting
                          ? AuthSplashScreen()
                          : AuthScreen(),
                ),
          routes: routes,
        ),
      ),
 */