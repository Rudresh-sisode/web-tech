import 'package:ecomm_app/components/menu/bottom_menu.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/enums.dart';
import 'package:ecomm_app/screens/profile/update_profile_screen.dart';
import 'package:ecomm_app/screens/widgets/orderDetails.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import '../../providers/orders.dart' as OrdersProvider;
import 'dart:convert';

class Orders extends StatefulWidget {
  static var routeName = "orders";

  @override
  State<Orders> createState() => _OrdersState();
}

class _OrdersState extends State<Orders> {
  bool showSheet = false;
  @override
  void initState() {
    super.initState();
  }

  Future<void> orderCheckout() async {
    try {
      await Provider.of<OrdersProvider.Orders>(context, listen: false)
          .getAllOrderListings();
    } on FormatException catch (_, error) {
      // _showErrorDialog(error.toString());
    } catch (error) {
      Map<String, dynamic> errorRes = json.decode(error.toString());
      Map<String, dynamic> errorMessage = {};
      if (errorRes["message"] is String) {
        // _showErrorDialog(errorRes["message"]);
      } else if (errorRes["message"] is Map<String, dynamic>) {
        errorMessage = errorRes["message"];
        Map<String, String> newErrorMessage = {};
        errorMessage.forEach((key, value) {
          // for (int i = 0; i < value.length; i++) {
          newErrorMessage[key] = value;
          // }
        });

        String finalEmailErrorMessage = newErrorMessage.containsKey("error")
            ? newErrorMessage["error"].toString()
            : newErrorMessage.containsKey("email")
                ? newErrorMessage["email"].toString()
                : "";
        String finalPasswordErrorMessage =
            newErrorMessage.containsKey("c_password")
                ? newErrorMessage["c_password"].toString()
                : "";

        String finalErrorMessage = finalEmailErrorMessage.isNotEmpty
            ? finalEmailErrorMessage
            : finalPasswordErrorMessage.isNotEmpty
                ? finalPasswordErrorMessage
                : errorRes["message_type"];
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kAppBarColor,
      appBar: AppBar(
        title: const Text("Orders"),
        centerTitle: true,
        backgroundColor: kPrimaryColor,
      ),
      body: Stack(children: <Widget>[
        SingleChildScrollView(
          child: Container(
            padding: const EdgeInsets.all(4),
            child: //here we can add ListView Widgets
                Column(
              children: [
                /**
                 * Consumer<Cart>(builder: (_, cart, ch) {
                 */
                Consumer<OrdersProvider.Orders>(
                  builder: (_, ordersCon, ch) {
                    return ordersCon.orders.length > 0
                        ? ListView.builder(
                            padding: EdgeInsets.zero,
                            primary: false,
                            shrinkWrap: true,
                            scrollDirection: Axis.vertical,
                            itemCount: ordersCon.orders.length,
                            itemBuilder: (BuildContext context, int index) {
                              return ListTile(
                                leading: Container(
                                    width: 50,
                                    height: 50,
                                    decoration: BoxDecoration(
                                        borderRadius:
                                            BorderRadius.circular(100),
                                        color: kPrimaryColor.withOpacity(0.1)),
                                    // child:  Icon: SvgPicture.asset("assets/icons/Cart.svg"),
                                    child:
                                        Image.asset('assets/images/logo1.jpg')),
                                title: Text(
                                    'OrderId: ${ordersCon.orders[index].tokenOrderId}',
                                    style: TextStyle(
                                        fontSize: 12,
                                        color:
                                            Color.fromARGB(255, 75, 74, 74))),
                                trailing: Container(
                                  width: 25.0,
                                  height: 25,
                                  child: ElevatedButton(
                                    onPressed: () async{
                                      // your on pressed function here
                                      ordersCon.viewOrderId =
                                          ordersCon.orders[index].orderId;
                                         await ordersCon.getEachOrderDetails();
                                      setState(() {
                                        showSheet = !showSheet;
                                      });
                                      // Navigator.pushNamed(
                                      //     context, OrderDetails.routeName);
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.grey[500],
                                      shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(40.0),
                                      ),
                                      padding: EdgeInsets.zero,
                                    ),
                                    child: Container(
                                      width: 20.0,
                                      height: 20,
                                      child: Center(
                                        child: Icon(
                                          Icons.arrow_forward,
                                          color: Colors.white,
                                          size: 15.0,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                subtitle: Text(
                                    'Amount ₹ ${ordersCon.orders[index].orderTotal.toString()}'),
                              );
                            },
                          )
                        : Container(
                            child: Text("No orders yet."),
                          );
                  },
                ),
                //
              ],
            ),
          ),
        ),
        Offstage(
          offstage: !showSheet,
          child: DraggableScrollableSheet(
              initialChildSize: 0.5,
              maxChildSize: 1.0,
              builder: (BuildContext context, ScrollController controller) {
                return Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(30),
                      topRight: Radius.circular(30),
                    ),
                  ),
                  child: ListView(
                    controller: controller,
                    padding: EdgeInsets.all(10),
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Order Details',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          IconButton(
                            icon: Icon(Icons.close),
                            onPressed: () => setState(() {
                              Provider.of<OrdersProvider.Orders>(context,
                                      listen: false)
                                  .viewOrderId = -1;
                              showSheet = !showSheet;
                            }),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          Container(
                              margin: EdgeInsets.only(
                                  left:
                                      MediaQuery.of(context).size.width * 0.01,
                                  right:
                                      MediaQuery.of(context).size.width * 0.01,
                                  top:
                                      MediaQuery.of(context).size.width * 0.01),
                              child: Text(
                                  "Order Id: ${Provider.of<OrdersProvider.Orders>(context, listen: false).selectedOrdersDetails.tokenOrderId}")),
                        ],
                      ),
                      SizedBox(
                          height: MediaQuery.of(context).size.width * 0.05),
                      /**
                             * Consumer<Cart>(builder: (_, cartState,ch) {
                              List<CartItem> cartItem = cartState.items;
                              return Padding(
                             */
                      Provider.of<OrdersProvider.Orders>(context, listen: false)
                                  .viewOrderId ==
                              -1
                          ? Column(
                              children: [
                                Text("No address available!"),
                              ],
                            )
                          : Consumer<OrdersProvider.Orders>(
                              builder: (_, addressData, ch) {
                                return Column(
                                  children: <Widget>[
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceAround,
                                      children: [
                                        Text(
                                          'Product Details',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        Text(
                                          'Total Products: 5',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Container(
                                      //this container will hold all the products one by one
                                      height: //add bussiness logic here if one item in the list, then height will be for 0.4 or it will be 0.6
                                          MediaQuery.of(context).size.width *
                                              0.6,
                                      child: ListView.builder(
                                        itemCount: 2,
                                        itemBuilder: ((context, index) {
                                          return Container(
                                            width: MediaQuery.of(context)
                                                    .size
                                                    .width *
                                                02,
                                            child: Card(
                                              shape: RoundedRectangleBorder(
                                                borderRadius:
                                                    BorderRadius.circular(10.0),
                                              ),
                                              child: Row(
                                                children: [
                                                  Expanded(
                                                    child: Column(
                                                      crossAxisAlignment:
                                                          CrossAxisAlignment
                                                              .start,
                                                      children: [
                                                        Text(
                                                          'Product Name',
                                                          style: TextStyle(
                                                              fontSize: 18,
                                                              fontWeight:
                                                                  FontWeight
                                                                      .bold),
                                                        ),
                                                        SizedBox(height: 5),
                                                        Text(
                                                          'Product Price',
                                                          style: TextStyle(
                                                              fontSize: 16),
                                                        ),
                                                      ],
                                                    ),
                                                  ),
                                                  SizedBox(
                                                    width: 120,
                                                    height: 120,
                                                    child: Card(
                                                        child: Image.asset(
                                                            'assets/images/logo1.jpg')
                                                        // Image.network(
                                                        //   'https://example.com/image.png',
                                                        //   fit: BoxFit.cover,
                                                        // ),
                                                        ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          );
                                        }),
                                      ),
                                    ),
                                    Divider(
                                      color: Colors.grey,
                                      height: 20,
                                      thickness: 1,
                                      indent: 20,
                                      endIndent: 20,
                                    ),
                                     SizedBox(height: 8),
                                    Container(
                                      child: Text("Shiping address"),
                                    ),
                                    Container(
                                      padding: EdgeInsets.all(16),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          SizedBox(height: 10),
                                          Text(
                                            "rudresh sisodiya",
                                            // "${shipping_address['first_name']} ${shipping_address['last_name']}",
                                            style: TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          SizedBox(height: 5),
                                          Text(
                                            // shipping_address['email'],

                                            "rudranrajput@gmail.com",
                                            style: TextStyle(
                                              fontSize: 16,
                                            ),
                                          ),
                                          SizedBox(height: 5),
                                          Text(
                                            // shipping_address['phone'],
                                            "9839485839",
                                            style: TextStyle(
                                              fontSize: 16,
                                            ),
                                          ),
                                          SizedBox(height: 10),
                                          Text(
                                            // shipping_address['address'],
                                            "Pimpalgaon (Go), Jamner,",
                                            style: TextStyle(
                                              fontSize: 16,
                                            ),
                                          ),
                                          SizedBox(height: 5),
                                          Text(
                                            // shipping_address['address2'],
                                            "Jamner Pachora Highway, Jamner",
                                            style: TextStyle(
                                              fontSize: 16,
                                            ),
                                          ),
                                          SizedBox(height: 5),
                                          Text(
                                            // "${shipping_address['city']}, ${shipping_address['state']}, ${shipping_address['pincode']}",
                                            "Jamner, Maharashtra, 424206",
                                            style: TextStyle(
                                              fontSize: 16,
                                            ),
                                          ),
                                          SizedBox(height: 5),
                                          Text(
                                            // shipping_address['country'],
                                            "India (Bharat)",
                                            style: TextStyle(
                                              fontSize: 16,
                                            ),
                                          ),
                                          SizedBox(height: 10),
                                          // Divider(
                                          //   color: Colors.grey[600],
                                          //   thickness: 1,
                                          // ),
                                          Divider(
                                      color: Colors.grey,
                                      height: 20,
                                      thickness: 1,
                                      // indent: 20,
                                      // endIndent: 20,
                                    ),
                                        ],
                                      ),
                                    ),
                                    Container(
                                      child: Text("Price details"),
                                    ),
                                    Container(
                                      padding: EdgeInsets.all(16),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.stretch,
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                'List price',
                                                style: TextStyle(fontSize: 16),
                                              ),
                                              Text(
                                                '\₹37299.00',
                                                style: TextStyle(fontSize: 16),
                                              ),
                                            ],
                                          ),
                                          SizedBox(height: 8),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                'Discount',
                                                style: TextStyle(fontSize: 16),
                                              ),
                                              Text(
                                                '\₹2350.00',
                                                style: TextStyle(fontSize: 16),
                                              ),
                                            ],
                                          ),
                                          SizedBox(height: 8),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                'Total Products',
                                                style: TextStyle(fontSize: 16),
                                              ),
                                              Text(
                                                '2',
                                                style: TextStyle(fontSize: 16),
                                              ),
                                            ],
                                          ),
                                          SizedBox(height: 8),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                'Order Date',
                                                style: TextStyle(fontSize: 16),
                                              ),
                                              Text(
                                                '2023-02-22',
                                                style: TextStyle(fontSize: 16),
                                              ),
                                            ],
                                          ),
                                          SizedBox(height: 8),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                'Status',
                                                style: TextStyle(fontSize: 16),
                                              ),
                                              Text(
                                                'Ordered',
                                                style: TextStyle(fontSize: 16),
                                              ),
                                            ],
                                          ),
                                          SizedBox(height: 8),
                                           Divider(
                                              height: 1.2,
                                              thickness: 0.5,
                                              color: Colors.grey[400],
                                              // indent: 2,
                                              // endIndent: 2,
                                              
                                            ),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                'Total',
                                                style: TextStyle(
                                                    fontSize: 20,
                                                    fontWeight:
                                                        FontWeight.bold),
                                              ),
                                              Text(
                                                '\$34949.00',
                                                style: TextStyle(
                                                    fontSize: 20,
                                                    fontWeight:
                                                        FontWeight.bold),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                );
                              },
                            ),
                    ],
                  ),
                );
              }),
        )
      ]),
      bottomNavigationBar: BottomMenu(selectedMenu: MenuState.home),
    );
  }
}
