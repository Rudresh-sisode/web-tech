import 'package:flutter/material.dart';
import 'package:ecomm_app/models/Sort.dart';
// This is the main application widget.

enum SingingCharacter { lafayette, jefferson }


class SortProduct extends StatefulWidget {
  SortProduct() : super();

  @override
  _SortState createState() => _SortState();
}

class _SortState extends State<SortProduct> {
  late List<Sort> users;
  late Sort selectedUser;
  late int selectedRadio;
  late int selectedRadioTile;
  @override
  void initState() {
    super.initState();
    selectedRadio = 0;
    selectedRadioTile = 0;
    users = Sort.getUsers();
  }

  setSelectedRadio(int val) {
    setState(() {
      selectedRadio = val;
    });
  }

  setSelectedRadioTile(int val) {
    setState(() {
      selectedRadioTile = val;
    });
  }

  setSelectedUser(Sort user) {
    setState(() {
      selectedUser = user;
    });
  }

  List<Widget> createRadioListUsers() {
    List<Widget> widgets = [];
    for (Sort user in users) {
      widgets.add(
        RadioListTile(
          value: user,
          groupValue: selectedUser,
          title: Text(user.firstName),
          subtitle: Text(user.lastName),
          onChanged: (currentUser) {
            // print("Current User ${currentUser.firstName}");
            setSelectedUser(user.lastName as Sort);
          },
          selected: selectedUser == user,
          activeColor: Colors.green,
        ),
      );
    }
    return widgets;
  }

  @override
  Widget build(BuildContext context) {
    SingingCharacter? _character = SingingCharacter.lafayette;

    return Center(
      child: ElevatedButton(
        child: const Text('Sort By'),
  //       style: ElevatedButton.styleFrom(
  //   padding: const EdgeInsets.fromLTRB(20, 10, 20, 10)
  // ),
        onPressed: () {
          // when raised button is pressed
          // we display showModalBottomSheet
          showModalBottomSheet<void>(
            // context and builder are
            // required properties in this widget
            context: context,
            builder: (BuildContext context) {
              // we set up a container inside which
              // we create center column and display text

              // Returning SizedBox instead of a Container
              return SizedBox(
                height: 300,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Text('SORT BY'),
                     Divider(),
                     
                      ListTile(
                        title: const Text('Relevance'),
                        leading: Radio<SingingCharacter>(
                          value: SingingCharacter.lafayette,
                          groupValue: _character,
                          onChanged: (SingingCharacter? value) {
                            setState(() {
                              _character = value;
                            });
                          },
                        ),
                      ),
                      ListTile(
                        title: const Text('Popularity'),
                        leading: Radio<SingingCharacter>(
                          value: SingingCharacter.jefferson,
                          groupValue: _character,
                          onChanged: (SingingCharacter? value) {
                            setState(() {
                              _character = value;
                            });
                          },
                        ),
                      ),
                      ListTile(
                        title: const Text('Price - Low to High'),
                        leading: Radio<SingingCharacter>(
                          value: SingingCharacter.jefferson,
                          groupValue: _character,
                          onChanged: (SingingCharacter? value) {
                            setState(() {
                              _character = value;
                            });
                          },
                        ),
                      ),
                      ListTile(
                        title: const Text('Price - High to Low'),
                        leading: Radio<SingingCharacter>(
                          value: SingingCharacter.jefferson,
                          groupValue: _character,
                          onChanged: (SingingCharacter? value) {
                            setState(() {
                              _character = value;
                            });
                          },
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
