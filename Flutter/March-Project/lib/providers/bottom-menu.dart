import 'package:flutter/foundation.dart';

enum BottomMuenu {
  Home,
  Cart,
  Profile,
  Else,
  favourite,
  CheckoutWidget,
  Category,
  Location
}

class BottomMenuHandler with ChangeNotifier {
  BottomMuenu currentValue = BottomMuenu.Home;

  // List<BottomMuenu> theParants = [];

}
