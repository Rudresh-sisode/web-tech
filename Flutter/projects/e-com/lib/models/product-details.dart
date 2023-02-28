class ProductDetails {
  final int productId;
  final int mainCategoryId;
  final int categoryId;
  final int subCategoryId;
  final String name;
  final String detail;
  final int price;
  final int quantity;
  final int offerPrice;
  final String mainCategoryValue;
  final String categoryValue;
  final String subCategoryValue;
  final List<ProductImage> productImages;

  ProductDetails({
    required this.productId,
    required this.mainCategoryId,
    required this.categoryId,
    required this.subCategoryId,
    required this.name,
    required this.detail,
    required this.price,
    required this.quantity,
    required this.offerPrice,
    required this.mainCategoryValue,
    required this.categoryValue,
    required this.subCategoryValue,
    required this.productImages,
  });


  factory ProductDetails.fromJson(Map<String, dynamic> json) {
    final productImages = (json['product_image'] as List<dynamic>)
        .map((e) => ProductImage.fromJson(e))
        .toList();

    return ProductDetails(
      productId: json['product_id'] as int,
      mainCategoryId: json['main_category_id'] as int,
      categoryId: json['category_id'] as int,
      subCategoryId: json['sub_category_id'] as int,
      name: json['name'] as String,
      detail: json['detail'] as String,
      price: json['price'] as int,
      quantity: json['quantity'] as int,
      offerPrice: json['offer_price'] as int,
      mainCategoryValue: json['main_category_value'] as String,
      categoryValue: json['category_value'] as String,
      subCategoryValue: json['sub_category_value'] as String,
      productImages: productImages,
    );
  }
}

class ProductImage {
  int id;
  int productId;
  String imageName;
  String imagePath;
  String imageFullPath;

  ProductImage({
    required this.id,
    required this.productId,
    required this.imageName,
    required this.imagePath,
    required this.imageFullPath,
  });
  //factory method
  factory ProductImage.fromJson(Map<String, dynamic> json) {
    return ProductImage(
      id: json['id'],
      productId: json['product_id'],
      imageName: json['image_name'],
      imagePath: json['image_path'],
      imageFullPath: json['image_full_path'],
    );
  }

  factory ProductImage.fromMap(Map<String, dynamic> map) {
    return ProductImage(
      id: map['id'],
      productId: map['product_id'],
      imageName: map['image_name'],
      imagePath: map['image_path'],
      imageFullPath: map['image_full_path'],
    );
  }
}