import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';

class NewTransaction extends StatefulWidget {
  final Function addTx;

  NewTransaction(this.addTx);

  @override
  State<NewTransaction> createState() => _NewTransactionState();
}

class _NewTransactionState extends State<NewTransaction> {
  final _titleController = TextEditingController();

  final _amountController = TextEditingController();

  DateTime _selectedDate ;

  double amountValue;

  void _submitData() {
    print("button press");
    if(_amountController.text.isEmpty || _titleController.text.isEmpty){
      return;
    }

    final enteredTtile = _titleController.text;
    final enteredAmount = double.parse(_amountController.text);

    if (enteredTtile.isEmpty || enteredAmount <= 0 || _selectedDate == null) {
      return;
    }
    
    widget.addTx(enteredTtile, enteredAmount,_selectedDate);
    Navigator.of(context).pop();
  }

  void _presentDatePicker() {
    showDatePicker(
        context: context,
        initialDate: DateTime.now(),
        firstDate: DateTime(2022),
        lastDate: DateTime.now()).then((pickedDate) {
          if(pickedDate == null){
            return;
          }

          setState((){
             _selectedDate = pickedDate;
          });

        });


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
              controller: _titleController,
            ),
            TextField(
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Amount',
              ) /**,onChanged: (value){ amountInput = value;} */,
              controller: _amountController,
              onSubmitted: (_) => _submitData(),
            ),
            Container(
              height: 70,
              child: Row(
                children: <Widget>[
                  Expanded(child: Text(_selectedDate == null ? "No Date Choosen" : 'Picked Date: ${DateFormat.yMd().format(_selectedDate)}')),
                  TextButton(
                      // style:ButtonStyle(foregroundColor: Theme.of(context).primaryColor) ,//
                      onPressed: _presentDatePicker,
                      child: Text(
                        "Choose Date",
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ))
                ],
              ),
            ),
            ElevatedButton(
              onPressed: _submitData,
              child: Text("Add Transaction"),
            )
          ],
        ),
      ),
    );
  }
}
