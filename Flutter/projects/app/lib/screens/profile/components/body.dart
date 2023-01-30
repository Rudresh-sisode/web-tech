import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/models/user.dart';
import 'package:ecomm_app/provider/profile_service.dart';
import 'package:ecomm_app/screens/auth/components/auth_screen.dart';
import 'package:ecomm_app/screens/profile/update_profile_screen.dart';
import 'package:ecomm_app/screens/widgets/orders.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

// class profile extends StatefulWidget {
//   const Home({Key? key}) : super(key: key);

//   @override
//   // _HomeState createState() => _HomeState();
// }

class Body extends StatefulWidget {
  const Body({Key? key}) : super(key: key);

  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<Body> {
  late List<UserModel>? _userModel = [];

  @override
  void initState() {
    super.initState();
    _getData();
  }

  void _getData() async {
    _userModel = (await ApiService().getUsers())!;
    Future.delayed(const Duration(seconds: 1)).then((value) => setState(() {}));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('REST API Example'),
      ),
      body: _userModel == null || _userModel!.isEmpty
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : ListView.builder(
              itemCount: _userModel!.length,
              itemBuilder: (context, index) {
                return Card(
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Text(_userModel![index].id.toString()),
                          Text(_userModel![index].username),
                        ],
                      ),
                      const SizedBox(
                        height: 20.0,
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Text(_userModel![index].email),
                          Text(_userModel![index].website),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
  // Widget build(BuildContext context) {
  //   return SingleChildScrollView(
  //     child: Container(
  //       padding: const EdgeInsets.all(4),
  //       child: Column(
  //         children: [
  //           const SizedBox(
  //             width: 120,
  //             height: 120,
  //             child:
  //                 Image(image: AssetImage('assets/images/Profile Image.png')),
  //           ),
  //           const SizedBox(height: 10),
  //           const Text(
  //             'Adil Shaikh',
  //           ),
  //           const Text(
  //             'adil.shaikh@gunadhyasoft.com',
  //           ),
  //           const SizedBox(height: 20),
  //           SizedBox(
  //               width: 200,
  //               child: ElevatedButton(
  //                 onPressed: () {
  //                   Navigator.pushNamed(context, UpdateprofileScreen.routeName);
  //                 },
  //                 style: ElevatedButton.styleFrom(
  //                   backgroundColor: kPrimaryColor,
  //                 ),
  //                 child: const Text('Edit profile'),
  //               )),
  //           const SizedBox(height: 30),
  //           const Divider(),
  //           const SizedBox(height: 10),

  //           // List item
  //           ListTile(
  //             leading: Container(
  //                 width: 20,
  //                 height: 20,
  //                 decoration: BoxDecoration(
  //                     borderRadius: BorderRadius.circular(100),
  //                     color: kPrimaryColor.withOpacity(0.1)),
  //                 // child:  Icon: SvgPicture.asset("assets/icons/Cart.svg"),
  //                 child: SvgPicture.asset("assets/icons/G-Store.png")),
  //             title: const Text(
  //               'Settings',
  //               style: TextStyle(
  //                   fontSize: 12, color: Color.fromARGB(255, 75, 74, 74)),
  //             ),
  //             trailing: Container(
  //               width: 10,
  //               height: 10,
  //               decoration: BoxDecoration(
  //                   borderRadius: BorderRadius.circular(100),
  //                   color: kPrimaryColor.withOpacity(0.1)),
  //               child: SvgPicture.asset("assets/icons/arrow_right.svg"),
  //             ),
  //           ),
  //           ListTile(
  //             leading: Container(
  //               width: 20,
  //               height: 20,
  //               decoration: BoxDecoration(
  //                   borderRadius: BorderRadius.circular(100),
  //                   color: kPrimaryColor.withOpacity(0.1)),
  //               // child:  Icon: SvgPicture.asset("assets/icons/Cart.svg"),
  //               child: SvgPicture.asset("assets/icons/Parcel.svg"),
  //             ),
  //             title: const Text('Orders',
  //                 style: TextStyle(
  //                     fontSize: 12, color: Color.fromARGB(255, 75, 74, 74))),
  //             trailing: Container(
  //               width: 10,
  //               height: 10,
  //               decoration: BoxDecoration(
  //                   borderRadius: BorderRadius.circular(100),
  //                   color: kPrimaryColor.withOpacity(0.1)),
  //               child: SvgPicture.asset("assets/icons/arrow_right.svg"),
  //             ),
  //             onTap: () {
  //               Navigator.pushNamed(context, Orders.routeName);
  //             },
  //           ),
  //           ListTile(
  //             leading: Container(
  //               width: 20,
  //               height: 20,
  //               decoration: BoxDecoration(
  //                   borderRadius: BorderRadius.circular(100),
  //                   color: kPrimaryColor.withOpacity(0.1)),

  //               // child:  Icon: SvgPicture.asset("assets/icons/Cart.svg"),
  //               // child: SvgPicture.asset("assets/icons/exit.svg")
  //             ),

  //             title: TextButton.icon(
  //                 label: const Text('Logout'),
  //                 icon: const Icon(Icons.logout),
  //                 onPressed: () {
  //                   Navigator.pushNamed(context, AuthScreens.routeName);
  //                 }),
  //             // title: Text('Logout',
  //             //     style: TextStyle(
  //             //         fontSize: 12, color: Color.fromARGB(255, 75, 74, 74))
  //             //         ),
  //             trailing: Container(
  //               width: 10,
  //               height: 10,
  //               decoration: BoxDecoration(
  //                   borderRadius: BorderRadius.circular(100),
  //                   color: kPrimaryColor.withOpacity(0.1)),
  //               child: SvgPicture.asset("assets/icons/arrow_right.svg"),
  //             ),
  //           ),
  //         ],
  //       ),
  //     ),
  //   );
  // }
}
