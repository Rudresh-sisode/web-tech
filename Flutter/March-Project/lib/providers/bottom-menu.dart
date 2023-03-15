import 'package:flutter/foundation.dart';

enum BottomMuenu { Home, Cart, Profile, Else, favourite, CheckoutWidget }

class BottomMenuHandler with ChangeNotifier {
  BottomMuenu currentValue = BottomMuenu.Home;

  List<BottomMuenu> theParants = [];

  void changeCurrentValue(BottomMuenu value) {
    currentValue = value;
    notifyListeners();
  }

  void addParent(BottomMuenu rCurrentValue) {
    theParants.add(rCurrentValue);
    notifyListeners();
  }

  void removeParent() {
    theParants.removeLast();
    notifyListeners();
  }
}
