import 'package:flutter/material.dart';
class Demo extends StatelessWidget {
  final id;
  const Demo({super.key,this.id});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(id)),
    );
  }
}