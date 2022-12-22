import 'package:flutter/material.dart';
import 'package:personal_expenses/widgets/transaction_list.dart';
import './widgets/new_transaction.dart';
import './models/transaction.dart';
import './widgets/transaction_list.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter App',
      theme: ThemeData(
        primarySwatch: Colors.purple,
        fontFamily: 'Quicksand',
        textTheme: ThemeData.light().textTheme.copyWith(
         titleMedium: TextStyle(
          fontFamily: 'OpenSans',
          fontWeight: FontWeight.bold,
          fontSize: 18
         )
        ),
        appBarTheme: AppBarTheme(textTheme: ThemeData.light().textTheme.copyWith(headline6: TextStyle(
          fontFamily: 'OpenSans',
          fontSize: 20,
          fontWeight: FontWeight.bold
        )),)
      ),
      home: MyHomeApp(),
    );
  }
}

class MyHomeApp extends StatefulWidget {
  

  @override
  State<MyHomeApp> createState() => _MyHomeAppState();
}

class _MyHomeAppState extends State<MyHomeApp> {

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

  void _startAddNewTransaction(BuildContext ctx){
    showModalBottomSheet(context: ctx, builder: (_)  {
      return GestureDetector(
        onTap: () {},
        child:  NewTransaction(_addNewTransactin),
        behavior: HitTestBehavior.opaque,
      );
    } );
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Flutter App',),
        actions: <Widget>[
          IconButton(onPressed: ()=> _startAddNewTransaction(context), 
          icon: Icon(Icons.add),
          )
        ]
      ),
      body: SingleChildScrollView(
        child: Column(
          // mainAxisAlignment: MainAxisAlignment.spaceAround,
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
           TransactionList(_userTransaction),
          ],
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: FloatingActionButton(child: Icon(Icons.add),onPressed: ()=> _startAddNewTransaction(context),),
    );
  }
}
