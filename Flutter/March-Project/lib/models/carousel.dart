class CarouselModel {
  String slider_name;

  CarouselModel({required this.slider_name});

  factory CarouselModel.fromJson(Map<String, dynamic> json) {
    return CarouselModel(slider_name: json['slider_name']);
  }

  factory CarouselModel.fromMap(Map<String, dynamic> map) {
    return CarouselModel(slider_name: map['slider_name']);
  }
}
