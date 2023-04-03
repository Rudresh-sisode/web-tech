import 'package:flutter/material.dart';
import 'package:ecomm_app/models/Sort.dart';
// This is the main application widget.
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
    return Center(
      child: ElevatedButton(
        child: const Text('Sort'),
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
                height: 200,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const <Widget>[
                      Text('test'),
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
