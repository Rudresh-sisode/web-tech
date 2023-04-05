import 'package:flutter/material.dart';
import 'package:ecomm_app/models/Sort.dart';

import 'package:flutter/scheduler.dart' show timeDilation;

class Brand extends StatefulWidget {
  Brand() : super();

  @override
  _BrandState createState() => _BrandState();
}

class _BrandState extends State<Brand> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    // SingingCharacter? _character = SingingCharacter.lafayette;

    return Center(
      child: ElevatedButton(
        child: const Text('Brand'),
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
                      Text('Brand',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 16)),
                      Divider(),
                      CheckboxListTile(
                        title: const Text('Apple'),
                        value: timeDilation != 1.0,
                        onChanged: (bool? value) {
                          setState(() {
                            timeDilation = value! ? 10.0 : 1.0;
                          });
                        },
                        // secondary: const Icon(Icons.hourglass_empty),
                      ),
                      CheckboxListTile(
                        title: const Text('Puma'),
                        value: timeDilation != 1.0,
                        onChanged: (bool? value) {
                          setState(() {
                            timeDilation = value! ? 10.0 : 1.0;
                          });
                        },
                        // secondary: const Icon(Icons.hourglass_empty),
                      ),
                      CheckboxListTile(
                        title: const Text('Puma'),
                        value: timeDilation != 1.0,
                        onChanged: (bool? value) {
                          setState(() {
                            timeDilation = value! ? 10.0 : 1.0;
                          });
                        },
                        // secondary: const Icon(Icons.hourglass_empty),
                      )
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
