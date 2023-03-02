import 'package:flutter/material.dart';

class OrderDetails extends StatefulWidget {
  const OrderDetails({super.key});
  static var routeName = "/order-details";

  @override
  State<OrderDetails> createState() => _OrderDetailsState();
}

class _OrderDetailsState extends State<OrderDetails> {
  @override
  Widget build(BuildContext context) {
    return  Container(
      child: Text("Your Id sir ji "),
    );
  }
}