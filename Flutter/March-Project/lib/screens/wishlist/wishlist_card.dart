import 'package:flutter/material.dart';

class WishlistCard extends StatelessWidget {
  final Icon icon;
  final String name;

  WishlistCard(
    this.icon,
    this.name,
    // this.img,
  );
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10.0),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(blurRadius: 2, color: Color.fromARGB(255, 205, 6, 215))
          ],
        ),
        width: 30,
        child: Padding(
          padding: const EdgeInsets.all(5.0),
          child: Column(
            children: <Widget>[
              Card(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text('Monthly Membership'),
                            SizedBox(height: 10),
                            Text(name),
                          ],
                        ),
                      ),
                    ),
                    Flexible(
                      fit: FlexFit.tight,
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Text(
                              '12343',
                              maxLines: 1,
                              softWrap: false,
                              overflow: TextOverflow.fade,
                            ),
                            SizedBox(height: 10),
                            // Text(
                            //   '18 Sept 2021',
                            //   maxLines: 1,
                            //   softWrap: false,
                            //   overflow: TextOverflow.fade,
                            // ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // icon,
              // SizedBox(
              //   height: 10,
              // ),
              // Text(name,
              //     style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold))
            ],
          ),
        ),
      ),
    );
  }
}
