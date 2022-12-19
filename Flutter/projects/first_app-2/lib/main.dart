import 'package:first_app/answer.dart';
import 'package:flutter/material.dart';
import './quiz.dart';
import './result.dart';

// void main() {
//   runApp(MyApp());
// }

void main() => runApp(MyApp());

class MyApp extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _MyAppState();
  }
}

class _MyAppState extends State<MyApp> {
  int _questionIndex = 0;
  int _totalScore = 0;

  void _answerQuestions(int score) {
    _totalScore += score;
    setState(() {
      // if(_questionIndex >= 1){
      //     _questionIndex = 0;
      // }
      // else{
      //   _questionIndex = _questionIndex + 1;
      // }
      _questionIndex = _questionIndex + 1;

    });


    print(_questionIndex);
    // if(_questionIndex >= 3){
    //   _resetQuize();
    // }
  }

  void _resetQuize(){
    setState(() {
      _questionIndex = 0;
      _totalScore = 0;
    });
    
  }

  @override
  Widget build(BuildContext context) {
    var _question = const [
      {
        'questionText': 'what your favorite color ?',
        'answer': [{'text':'Black','score':10}, {'text':'Red','score':6}, {'text':'White','score':3}, {'text':'Green','score':5}]
      },
      {
        'questionText': 'what your favorite animal ?',
        'answer': [{'text':'Rabbit','score':3}, {'text':'snake','score':11}, {'text':'Elephante','score':5}, {'text':'Lioness','score':1}]
      },
      {
        'questionText': 'Who is your favorite instructor ?',
        'answer': [{'text':'Maxmillian','score':4}, {'text':'Akash handa','score':6}, {'text':'Sachine Kapoor','score':2}]
      }
    ];
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text("My First App"),
        ),
        body: _questionIndex < _question.length
            ? Quize(
                answerQuestion: _answerQuestions,
                questionIndex: _questionIndex,
                questions: _question,
              )
            : Result(_totalScore,_resetQuize) ,
      ),
    );
  }
}
