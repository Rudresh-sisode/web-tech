import 'package:flutter/material.dart';
import '../models/transaction.dart';
import 'package:intl/intl.dart';

class TransactionList extends StatelessWidget {
//   const TransactionList({Key key}) : super(key: key);

//   @override
//   State<TransactionList> createState() => _TransactionListState();
// }

// class _TransactionListState extends State<TransactionList> {
  
  final List<Transaction> transaction;

  TransactionList(this.transaction);

  @override
  Widget build(BuildContext context) {
    return Column(
            children: transaction.map((tx) {
              return Card(
                child: Row(children: <Widget>[
                  Container(
                    padding: EdgeInsets.all(10),
                    decoration: BoxDecoration(
                        border: Border.all(
                      color: Colors.black87,
                      width: 2,
                    )),
                    margin: EdgeInsets.symmetric(vertical: 10, horizontal: 15),
                    child: Text(
                      '\$${tx.amount}',
                      style: TextStyle(
                          fontWeight: FontWeight.bold, color: Colors.purple),
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        tx.Title,
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        DateFormat.yMMMEd().format(tx.date),
                        style: TextStyle(color: Color.fromARGB(255, 82, 78, 78)),
                      ),
                    ],
                  )
                ]),
              );
            }).toList(),
          );
  }
}