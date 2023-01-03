import 'package:flutter/material.dart';
import '../models/transaction.dart';
import './transaction_item.dart';


class TransactionList extends StatelessWidget {
//   const TransactionList({Key key}) : super(key: key);

//   @override
//   State<TransactionList> createState() => _TransactionListState();
// }

// class _TransactionListState extends State<TransactionList> {

  final List<Transaction> transaction;
  final Function deleteTx;

  TransactionList(this.transaction, this.deleteTx);

  @override
  Widget build(BuildContext context) {
    print("build() TransactionList");
    return transaction.isEmpty
        ? LayoutBuilder(builder: (ctx, constraints) {
            return Column(
              children: <Widget>[
                Text('No transaction added yet!',
                    style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(
                  height: 10,
                ),
                Container(
                    width: constraints.maxHeight * 0.2,
                    child: Image.asset(
                      'assets/images/waiting.png',
                      fit: BoxFit.cover,
                    )),
              ],
            );
          })
        : ListView.builder(
            itemBuilder: (ctx, index) {
              return TransactionItem(transactions: transaction[index] as Object, deleteTx: deleteTx);
              // return Card(
              //   child: Row(children: <Widget>[
              //     Container(
              //       padding: EdgeInsets.all(10),
              //       decoration: BoxDecoration(
              //           border: Border.all(
              //         color: Theme.of(context).primaryColorDark,
              //         width: 2,
              //       )),
              //       margin:
              //           EdgeInsets.symmetric(vertical: 10, horizontal: 15),
              //       child: Text(
              //         '\$${transaction[index].amount.toStringAsFixed(2)}',
              //         style: TextStyle(
              //             fontWeight: FontWeight.bold,
              //             color: Theme.of(context).primaryColorDark),
              //       ),
              //     ),
              //     Column(
              //       crossAxisAlignment: CrossAxisAlignment.start,
              //       children: <Widget>[
              //         Text(
              //           transaction[index].Title,
              //           style: TextStyle(
              //               fontSize: 16, fontWeight: FontWeight.bold),
              //         ),
              //         Text(
              //           DateFormat.yMMMEd().format(transaction[index].date),
              //           style:
              //               TextStyle(color: Color.fromARGB(255, 82, 78, 78)),
              //         ),
              //       ],
              //     ),
              //   ]),
              // );
            },
            itemCount: transaction.length,
            // children: transaction.map((tx) {

            // }).toList(),
          );
  }
}

