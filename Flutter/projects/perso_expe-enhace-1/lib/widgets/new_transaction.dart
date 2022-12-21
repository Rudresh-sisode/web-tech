import 'package:flutter/material.dart';

class NewTransaction extends StatelessWidget {
  final Function addTx;
  final titleController = TextEditingController();
  final amountController = TextEditingController();

  double amountValue;

  NewTransaction(this.addTx);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 5,
      child: Container(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            TextField(
              decoration: InputDecoration(
                labelText: 'Title',
              ) /**onChanged: (value){ titleInput = value; } */,
              controller: titleController,
            ),
            TextField(
              decoration: InputDecoration(
                labelText: 'Amount',
              ) /**,onChanged: (value){ amountInput = value;} */,
              controller: amountController,
            ),
            ElevatedButton(
              onPressed: () {
                addTx(titleController.text,
                    double.parse(amountController.text as String));
              },
              child: Text("Add Transaction"),
            )
          ],
        ),
      ),
    );
  }
}
