
import 'package:flutter/foundation.dart';

enum ChannelType {
  Popular,
  Trending,
  None

}

class FilterProvider with ChangeNotifier {

  ChannelType _channelType = ChannelType.None;
  ChannelType get channelType => _channelType;

  void setChannelType(ChannelType channelType) {
    _channelType = channelType;
    // notifyListeners();
  }

  get isFilterActive {

    if(_channelType == ChannelType.None){
      return false;
    }
    else{
      return true;
    }
  }

}