import 'package:flutter/material.dart';
import './question.dart';
import './answer.dart';

class Quize extends StatelessWidget {
 

  final List<Map<String,Object>> questions;
  final int questionIndex;
  final Function answerQuestion;

   const Quize({@required this.questions,@required this.answerQuestion,@required this.questionIndex});

  @override
  Widget build(BuildContext context) {
    return Column(children:[Question(questions[questionIndex]['questionText'] as String,
      ),
      ...(questions[questionIndex]['answer'] as List<Map<String,Object>>)
      .map((ans){
        return Answer(()=>answerQuestion(ans['score']),ans['text'] as String);
      }).toList()
      // Answer(_answerQuestions),
      ],
      );
  }
}