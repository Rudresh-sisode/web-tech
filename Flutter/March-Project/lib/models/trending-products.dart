class Trending {
  final int productId;
  final int mainCategoryId;
  final int categoryId;
  final int subCategoryId;
  final String name;
  final String detail;
  final int price;
  final int quantity;
  final int offerPrice;
  final String sliderImageName;
  final String sliderImagePath;
  final String mainCategoryValue;
  final String categoryValue;
  final String subCategoryValue;
  final String sliderImageFullPath;

  Trending({
    required this.productId,
    required this.mainCategoryId,
    required this.categoryId,
    required this.subCategoryId,
    required this.name,
    required this.detail,
    required this.price,
    required this.quantity,
    required this.offerPrice,
    required this.sliderImageName,
    required this.sliderImagePath,
    required this.mainCategoryValue,
    required this.categoryValue,
    required this.subCategoryValue,
    required this.sliderImageFullPath,
  });

  factory Trending.fromJson(Map<String, dynamic> json) {
    return Trending(
      productId: json['product_id'],
      mainCategoryId: json['main_category_id'],
      categoryId: json['category_id'],
      subCategoryId: json['sub_category_id'],
      name: json['name'],
      detail: json['detail'],
      price:json['price'],
      quantity: json['quantity'],
      offerPrice: json['offer_price'],
      sliderImageName: json['slider_image_name'],
      sliderImagePath: json['slider_image_path'],
      mainCategoryValue: json['main_category_value'],
      categoryValue: json['category_value'],
      subCategoryValue: json['sub_category_value'],
      sliderImageFullPath: json['slider_image_full_path'],
    );
  }
}