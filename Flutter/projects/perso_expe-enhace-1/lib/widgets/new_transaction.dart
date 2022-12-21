import 'package:flutter/material.dart';
class NewTransaction extends StatelessWidget {
   NewTransaction({Key key}) : super(key: key);


  final titleController  = TextEditingController();
  final amountController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Card(
            elevation: 5,
            child: Container(
              padding: EdgeInsets.all(10),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  TextField(
                    decoration: InputDecoration(labelText: 'Title',)/**onChanged: (value){ titleInput = value; } */,
                    controller: titleController,
                  ),
                  TextField(
                    decoration: InputDecoration(labelText: 'Amount',)/**,onChanged: (value){ amountInput = value;} */,
                    controller: amountController,
                  ),
                  ElevatedButton(onPressed: () {
                    print('title input '+titleController.text);
                    print('Amount Input '+amountController.text);
                  }, child: Text("Add Transaction"),)
                ],
              ),
            ),
          );
  }
}