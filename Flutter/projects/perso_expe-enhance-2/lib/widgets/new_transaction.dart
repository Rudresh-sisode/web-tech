import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class NewTransaction extends StatefulWidget {
  final Function addTx;

  NewTransaction(this.addTx);

  @override
  State<NewTransaction> createState() => _NewTransactionState();
}

class _NewTransactionState extends State<NewTransaction> {
  final titleController = TextEditingController();

  final amountController = TextEditingController();

  double amountValue;

  void submitData(){
    print("button press");
    final enteredTtile = titleController.text;
    final enteredAmount = double.parse(amountController.text);

    
    if(enteredTtile.isEmpty || enteredAmount <= 0){
      return;
    }
    widget.addTx(enteredTtile,enteredAmount);
    Navigator.of(context).pop();
  }

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
              keyboardType: TextInputType.number,
              decoration: InputDecoration(labelText: 'Amount',) /**,onChanged: (value){ amountInput = value;} */,
              controller: amountController,
              onSubmitted: (_) =>  submitData() ,
            ),
            ElevatedButton(
              onPressed: submitData,
              child: Text("Add Transaction"),
            )
          ],
        ),
      ),
    );
  }
}
