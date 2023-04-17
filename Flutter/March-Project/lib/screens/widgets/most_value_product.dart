import 'package:flutter/material.dart';
import 'dart:math';

class mostValueProduct extends StatefulWidget {
  final String title;

  mostValueProduct({this.title = 'Demo'});

  @override
  _mostValueProductState createState() => _mostValueProductState();
}

class _mostValueProductState extends State<mostValueProduct> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        physics: NeverScrollableScrollPhysics(),
        child: Container(
          height: 200,
          padding: EdgeInsets.all(16.0),
          child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: Column(
                children: [
                  buildCard(),
                  buildCard(),
                  buildCard(),
                  buildCard(),
                  buildCard(),
                  buildCard(),
                  buildCard(),
                ],
              )),
        ),
      ),
    );
  }

  Card buildCard() {
    var ran = Random();
    var heading = 'Titlle ';
    var subheading = '${(ran.nextInt(3) + 1).toString()} Price';
    // var subheading =
    //     '${(ran.nextInt(3) + 1).toString()} bed, ${(ran.nextInt(2) + 1).toString()} bath, ${(ran.nextInt(10) + 7).toString()}00 sqft';
    var cardImage = NetworkImage('assets/images/glap.png');
    var supportingText =
        'Beautiful home to rent, recently refurbished with modern appliances...';
    return Card(
      elevation: 4.0,
      child: Column(
        children: [
          ListTile(
            title: Text(heading),
            subtitle: Text(subheading),
            trailing: Icon(Icons.favorite_outline),
          ),
          Container(
            height: 70.0,
            child: Ink.image(
              image: cardImage,
              fit: BoxFit.cover,
            ),
          ),
          Container(
            padding: EdgeInsets.all(16.0),
            alignment: Alignment.centerLeft,
            child: Text(supportingText),
          ),
          ButtonBar(
            children: [
              TextButton(
                child: const Text('add to cart'),
                onPressed: () {/* ... */},
              ),
              TextButton(
                child: const Text(''),
                onPressed: () {/* ... */},
              )
            ],
          )
        ],
      ),
    );
  }
}
