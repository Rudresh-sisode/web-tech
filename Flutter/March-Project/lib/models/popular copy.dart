import 'dart:convert';

class PopularModel {
  PopularModel({
    required this.id,
    required this.name,
    // required this.imgage,
    // required this.url,
    // required this.thumbnailUrl,
  });

  int id;
  String name;
  // String imgage;
  // String url;
  // String thumbnailUrl;

  factory PopularModel.fromJson(Map<String, dynamic> json) => PopularModel(
        id: json["id"],
        name: json["name"],
        // imgage: json["imgage"],
        // url: json["url"],
        // thumbnailUrl: json["thumbnailUrl"],
      );
}

List<PopularModel> parsePopular(String responseBody) {
  final parsed = jsonDecode(responseBody).cast<Map<String, dynamic>>();

  return parsed
      .map<PopularModel>((json) => PopularModel.fromJson(json))
      .toList();
}
