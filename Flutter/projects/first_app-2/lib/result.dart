import 'package:flutter/material.dart';

class Result extends StatelessWidget {
  final int resultScore;

  final Function resetHandler;

  const Result(this.resultScore,this.resetHandler);

  String get resultPhrase {
    var resultText = 'you did it, sir!';
    if (resultScore <= 8) {
      resultText = 'You are awesome and innocent';
    } else if (resultScore <= 12) {
      resultText = 'Prettry likable';
    } else if (resultScore <= 16) {
      resultText = "You are ... strange?";
    } else {
      resultText = "You are so bad";
    }

    return resultText;
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: [
          Text(
            resultPhrase,
            style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          TextButton(child: Text("restart Quize") ,onPressed: resetHandler,style: TextButton.styleFrom(primary:Colors.amber) ,),
          OutlinedButton(child: Text("restart Quize") ,onPressed: resetHandler,style: OutlinedButton.styleFrom(primary: Colors.orange[400],side: BorderSide(color: Colors.orange[400])) ,),
          ElevatedButton(child: Text("restart Quize") ,onPressed: resetHandler ,)
        ],
      ),
    );
  }
}
