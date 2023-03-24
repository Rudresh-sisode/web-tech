import 'package:flutter/foundation.dart';



class TheLoader with ChangeNotifier {

  bool theLoader = false;

  void changeTheLoaderToggle(){
    theLoader = !theLoader;
    notifyListeners();
  }

}
