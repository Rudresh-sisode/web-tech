import 'package:flutter/material.dart';
import './new_transaction.dart';
import './transaction_list.dart';
import '../models/transaction.dart';

class UserTransaction extends StatefulWidget {
  const UserTransaction({Key key}) : super(key: key);

  @override
  State<UserTransaction> createState() => _UserTransactionState();
}

class _UserTransactionState extends State<UserTransaction> {
  final List<Transaction> _userTransaction = [
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

  void _addNewTransactin(String txTitle, double txAmount) {
    final newTx = Transaction(
        Title: txTitle,
        amount: txAmount,
        id: DateTime.now().toString(),
        date: DateTime.now());

        setState(() {
          _userTransaction.add(newTx);
        });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        NewTransaction(),
        TransactionList(_userTransaction),
      ],
    );
  }
}
