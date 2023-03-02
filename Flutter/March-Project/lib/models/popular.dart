import 'dart:convert';

class PopularModel {  
  int id;
  String name;

  PopularModel({
    required this.id,
    required this.name,

  });


  factory PopularModel.fromJson(Map<String, dynamic> json) => PopularModel(
        id: json["id"],
        name: json["name"],
  
      );
}

