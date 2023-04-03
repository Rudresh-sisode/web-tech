import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/models/recomended.dart';
import 'package:ecomm_app/screens/widgets/filter_widgets/sort_product.dart';
import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';

class Search extends StatefulWidget {
  static String routeName = "/search";

  @override
  _SearchState createState() => _SearchState();
}

class _SearchState extends State<Search> {
  final items = List<String>.generate(10000, (i) => "Item $i");

  @override
  Widget build(BuildContext context) {
    TextEditingController controller = TextEditingController();
    controller.addListener(() {
      print('Text field data');
      print(controller.text); // Print current value
      // controller.text = "Demo Text"; // Set new value
      // Do something here
    });

    List<Item> products = [
      Item(
          name: 'Apple',
          unit: 'Kg',
          price: 20,
          image: 'assets/images/tshirt.png'),
      Item(
          name: 'Mango',
          unit: 'Doz',
          price: 30,
          image: 'assets/images/glap.png'),
      Item(
          name: 'Strawberry',
          unit: 'Box',
          price: 12,
          image: 'assets/images/ps4_console_white_2.png'),
      Item(
          name: 'Fruit Basket',
          unit: 'Kg',
          price: 55,
          image: 'assets/images/Image Popular Product 3.png'),
    ];

// List<DropdownMenuItem<String>> get dropdownItems{
//   List<DropdownMenuItem<String>> menuItems = [
//     DropdownMenuItem(child: Text("USA"),value: "USA"),
//     DropdownMenuItem(child: Text("Canada"),value: "Canada"),
//     DropdownMenuItem(child: Text("Brazil"),value: "Brazil"),
//     DropdownMenuItem(child: Text("England"),value: "England"),
//   ];
//   return menuItems;
// }

    return Scaffold(
      // appBar: AppBar(title: Text('GridView Demo')),
      appBar: AppBar(
        elevation: 0,
        automaticallyImplyLeading: true,
        backgroundColor: Color.fromARGB(255, 194, 59, 235),
        centerTitle: true,
      ),
      body: Column(
        children: [
          SizedBox(height: 10),
          TextField(
            controller: controller,
            textInputAction: TextInputAction.send,
            style: TextStyle(
                color: Color.fromARGB(255, 179, 16, 243),
                fontWeight: FontWeight.w300),
            decoration: InputDecoration(prefixIcon: Icon(Icons.search)),
          ),
          // SizedBox(height: 10),
          SizedBox(
            child: Container(
              // margin: const EdgeInsets.symmetric(vertical: 60.0),
              height: 100.0,
              child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  // padding: const EdgeInsets.symmetric(
                  //     vertical: 60.0, horizontal: 10.0),
                  shrinkWrap: true,
                  itemCount: products.length,
                  itemBuilder: (context, index) {
                    return Card(
                      color: Color.fromARGB(255, 208, 224, 233),
                      elevation: 5.0,
                      child: Padding(
                        padding: const EdgeInsets.all(0.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            SizedBox(
                                width: 100,
                                child: SortProduct()),
                          ],
                        ),
                      ),
                    );
                  }),
            ),
          ),
          Expanded(
            child: LayoutBuilder(builder: (context, constraints) {
              return GridView.builder(
                itemCount: 100,
                itemBuilder: (context, index) => ItemList(index),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: constraints.maxWidth > 700 ? 4 : 2,
                  childAspectRatio: 2,
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}

class ItemList extends StatelessWidget {
  final int itemNo;

  const ItemList(
    this.itemNo,
  );

  @override
  Widget build(BuildContext context) {
    final Color color = Colors.primaries[itemNo % Colors.primaries.length];
    return Padding(
      padding: const EdgeInsets.all(2.0),
      child: Card(
        color: Color.fromARGB(255, 255, 255, 255),
        elevation: 5.0,
        child: Padding(
          padding: const EdgeInsets.all(4.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            mainAxisSize: MainAxisSize.max,
            children: [
              Image(
                width: 75,
                image: AssetImage('assets/images/Image Popular Product 3.png'),
              ),
              SizedBox(
                width: 75,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(
                      height: 5.0,
                    ),
                    RichText(
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                      text: TextSpan(
                          text: 'Name: ',
                          style: TextStyle(
                              color: Colors.blueGrey.shade800, fontSize: 11.0),
                          children: [
                            TextSpan(
                                text: '${itemNo.toString()}\n',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12.0)),
                          ]),
                    ),
                    RichText(
                      maxLines: 1,
                      text: TextSpan(
                          text: 'Price: ' r"$",
                          style: TextStyle(
                              color: Colors.blueGrey.shade800, fontSize: 11.0),
                          children: [
                            TextSpan(
                                text: '${itemNo.toString()}\n',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12.0)),
                          ]),
                    ),
                    SizedBox(
                      child: RatingBarIndicator(
                        rating: 3.50,
                        itemBuilder: (context, index) => Icon(
                          Icons.star,
                          color: Colors.amber,
                        ),
                        itemCount: 5,
                        itemSize: 12.0,
                        direction: Axis.horizontal,
                      ),
                    )
                    //   maxLines: 1,
                    //   text: TextSpan(
                    //       text: 'Unit: ',
                    //       style: TextStyle(
                    //           color: Colors.blueGrey.shade800,
                    //           fontSize: 16.0),
                    //       children: [
                    //         TextSpan(
                    //             text:
                    //                 '${products[index].unit.toString()}\n',
                    //             style: const TextStyle(
                    //                 fontWeight: FontWeight.bold)),
                    //       ]),
                    // ),
                  ],
                ),
              ),
              // ElevatedButton(
              //     style: ElevatedButton.styleFrom(
              //       backgroundColor: kPrimaryColor,
              //       elevation: 3,
              //       minimumSize: Size(30, 30),
              //       side: BorderSide(
              //           width: 3,
              //           color: Color.fromARGB(255, 171, 118, 207)),
              //     ),
              //     onPressed: () {
              //       //  saveData(index);
              //     },
              //     child: const Text(
              //       'Add to Cart',
              //       style: TextStyle(fontSize: 10),
              //     )),
            ],
          ),
        ),
      ),
    );
  }
}
