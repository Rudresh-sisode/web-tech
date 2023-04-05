import 'package:ecomm_app/const_error_msg.dart';
import 'package:flutter/material.dart';
import 'package:ecomm_app/models/Sort.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';

enum SingingCharacter { lafayette, jefferson }

class Rating extends StatefulWidget {
  Rating() : super();

  @override
  _RatingState createState() => _RatingState();
}

class _RatingState extends State<Rating> {
  late List _items;
  double _fontSize = 14;

  @override
  void initState() {
    super.initState();
    //  Model().getItems().then((items){
    //         _items = items;
    //     });
  }

  @override
  Widget build(BuildContext context) {
    var rating = 0.0;

    return Center(
      child: ElevatedButton(
        child: const Text('Rating'),
        onPressed: () {
          showModalBottomSheet<void>(
            context: context,
            builder: (BuildContext context) {
              return SizedBox(
                height: 250,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      // Text('Rating'),
                      Padding(
                          padding: EdgeInsets.fromLTRB(20, 8, 8, 8),
                          child: Text('Rating',
                              // textAlign: TextAlign.center,
                              style: TextStyle(fontSize: 16))),
                      Divider(),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            foregroundColor: Colors.black,
                            elevation: 0,
                            side: const BorderSide(
                              width: 1.0,
                              color: kPrimaryColor,
                            )),
                        onPressed: () {},
                        child: RatingBarIndicator(
                          rating: 4.50,
                          itemBuilder: (context, index) => Icon(
                            Icons.star,
                            color: Colors.amber,
                          ),
                          itemCount: 5,
                          itemSize: 20.0,
                          direction: Axis.horizontal,
                        ),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            foregroundColor: Colors.black,
                            elevation: 0,
                            side: const BorderSide(
                              width: 1.0,
                              color: kPrimaryColor,
                            )),
                        onPressed: () {},
                        child: RatingBarIndicator(
                          rating: 3.50,
                          itemBuilder: (context, index) => Icon(
                            Icons.star,
                            color: Colors.amber,
                          ),
                          itemCount: 5,
                          itemSize: 20.0,
                          direction: Axis.horizontal,
                        ),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            foregroundColor: Colors.black,
                            elevation: 0,
                            side: const BorderSide(
                              width: 1.0,
                              color: kPrimaryColor,
                            )),
                        onPressed: () {},
                        child: RatingBarIndicator(
                          rating: 2.50,
                          itemBuilder: (context, index) => Icon(
                            Icons.star,
                            color: Colors.amber,
                          ),
                          itemCount: 5,
                          itemSize: 20.0,
                          direction: Axis.horizontal,
                        ),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            foregroundColor: Colors.black,
                            elevation: 0,
                            side: const BorderSide(
                              width: 1.0,
                              color: kPrimaryColor,
                            )),
                        onPressed: () {},
                        child: RatingBarIndicator(
                          rating: 1.50,
                          itemBuilder: (context, index) => Icon(
                            Icons.star,
                            color: Colors.amber,
                          ),
                          itemCount: 5,
                          itemSize: 20.0,
                          direction: Axis.horizontal,
                        ),
                      ),

                      // ListTile(
                      //   leading: new Icon(Icons.share),
                      //   title: new Text('Share'),
                      //   onTap: () {
                      //     Navigator.pop(context);
                      //   },
                      // ),
                      // Text('test'),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
