import 'package:flutter/foundation.dart';

class Transaction {
  final String id;
  final String Title;
  final double amount;
  final DateTime date;

  Transaction({
    @required this.id,
    @required this.Title,
    @required this.amount,
    @required this.date
  });

}