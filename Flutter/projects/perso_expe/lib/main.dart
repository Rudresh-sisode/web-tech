import 'package:flutter/material.dart';
import './transaction.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter App',
      home: MyHomeApp(),
    );
  }
}

class MyHomeApp extends StatelessWidget {
  final List<Transaction> transaction = [
    Transaction(
      id: 't1',
      Title: 'New shoes',
      amount: 69.99,
      date: DateTime.now(),
    ),
    Transaction(
      id: 't2',
      Title: 'Weekly Grociers',
      amount: 16.53,
      date: DateTime.now(),
    )
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Flutter App'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Container(
            width: double.infinity,
            child: Card(
              child: Container(
                child: Text('Chart !'),
                color: Colors.pink[400],
              ),
              elevation: 12,
            ),
          ),
          Column(children: transaction.map((tx) {
            return Card(child: Row(children: <Widget>[
              Container(decoration: BoxDecoration(border: Border.all(color: Colors.black87,width: 2,)),margin:EdgeInsets.symmetric(vertical: 10,horizontal:15 ) ,child: Text(tx.amount.toString()),
              ),
              Column(children: <Widget>[
                Text(tx.Title),
                Text(tx.date.toString(),),
              ],)
            ]),);
          }).toList(),
          ),
        ],
      ),
    );
  }
}
