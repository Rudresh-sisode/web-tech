import 'package:flutter/material.dart';
import 'package:ecomm_app/models/Sort.dart';
// This is the main application widget.

enum SingingCharacter { lafayette, jefferson }

class PriceRange extends StatefulWidget {
  PriceRange() : super();

  @override
  _PriceRangeState createState() => _PriceRangeState();
}

class _PriceRangeState extends State<PriceRange> {
  // RangeValues _currentRangeValues = const RangeValues(0, 80);
  RangeValues values = RangeValues(1, 100000);
  RangeLabels labels = RangeLabels('1', "100");

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElevatedButton(
        //       style: ElevatedButton.styleFrom(
        //   padding: const EdgeInsets.fromLTRB(20, 10, 20, 10)
        // ),
        child: const Text('Price'),
        onPressed: () {
          showModalBottomSheet<void>(
            context: context,
            builder: (BuildContext context) {
              return SizedBox(
                height: 300,
                child: Center(
                  child: Column(
                    // mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      // Text('Price Range', style: TextStyle(fontSize: 18,),
                      // ),
                      Padding(
                          padding: EdgeInsets.fromLTRB(50, 8, 8, 8),
                          child: Text('Price Range',
                              textAlign: TextAlign.center,
                              style: TextStyle(fontSize: 16))),
                      Divider(),
                      RangeSlider(
                          divisions: 5,
                          activeColor: Colors.red[700],
                          inactiveColor: Colors.red[300],
                          min: 1,
                          max: 100000,
                          values: values,
                          labels: labels,
                          onChanged: (value) {
                            print("START: ${value.start}, End: ${value.end}");

                            setState(() {
                              values = value;
                              labels = RangeLabels(
                                  "${value.start.toInt().toString()}\$",
                                  "${value.start.toInt().toString()}\$");
                            });
                          }),
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
