import 'package:flutter/foundation.dart';
 enum BottomMuenu {
    Home,
    Cart,
    Profile
  }

class BottomMenuHandler with ChangeNotifier {

  BottomMuenu currentValue = BottomMuenu.Home;
  
}