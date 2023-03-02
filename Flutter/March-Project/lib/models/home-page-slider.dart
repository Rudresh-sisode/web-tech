class HomePageSliderS {
  final int productId;
  final String bannerImagePath;

  HomePageSliderS({
    required this.productId,
    required this.bannerImagePath,
  });

  factory HomePageSliderS.fromJson(Map<String, dynamic> json) {
    return HomePageSliderS(
      productId: json['product_id'],
      bannerImagePath: json['banner_image_path'],
    );
  }

  factory HomePageSliderS.fromMap(Map<String, dynamic> map) {
    return HomePageSliderS(
      productId: map['product_id'],
      bannerImagePath: map['banner_image_path'],
    );
  }
}