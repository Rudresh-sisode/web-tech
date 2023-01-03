import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models//transaction.dart';

class TransactionItem extends StatelessWidget {
  const TransactionItem({
    Key key,
    @required this.transactions,
    @required this.deleteTx,
  }) : super(key: key);

  final Transaction transactions;
  final Function deleteTx;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 5),
      child: ListTile(
          leading: CircleAvatar(
            radius: 30,
            child: Padding(
              padding: EdgeInsets.all(6),
              child: FittedBox(
                  child: Text('\$${transactions.amount}')),
            ),
          ),
          title: Text(
            transactions.Title,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          subtitle: Text(
              DateFormat.yMMMd().format(transactions.date)),
          trailing: MediaQuery.of(context).size.width > 200
              ? TextButton.icon(
                  onPressed: () => deleteTx(transactions.id),
                  icon: Icon(Icons.delete),
                  label: Text('Delete'),
                  style: TextButton.styleFrom(
                      foregroundColor: Theme.of(context).errorColor))
              : IconButton(
                  icon: const Icon(Icons.delete),
                  color: Theme.of(context).errorColor,
                  onPressed: () => deleteTx(transactions.id),
                )),
    );
  }
}