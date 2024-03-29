import 'package:ecomm_app/checkout_widget.dart';
import 'package:ecomm_app/components/default_button.dart';
import 'package:ecomm_app/components/form_error.dart';
import 'package:ecomm_app/components/global_snack_bar.dart';
import 'package:ecomm_app/components/keyboard.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/providers/auth-checker.dart';
import 'package:ecomm_app/providers/delivery-address.dart';
import 'package:ecomm_app/screens/widgets/payment.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';

import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';

import 'dart:convert';

import '../../models/delivery-address.dart';
import '../../models/guestAddress.dart';
import '../../providers/cart.dart';
import '../auth/auth_screen.dart';

class ShippingForm extends StatefulWidget {
  @override
  _ShippingFormState createState() => _ShippingFormState();
}

class _ShippingFormState extends State<ShippingForm> {
  final _formKey = GlobalKey<FormState>();
  bool locationLoader = false;
  String email = "kedar.ahirrao@gunadhyasoft.com";
  String userName = "Kunal Ahirrao";
  String mobile = "7656755768";
  String fullAddress = "Baramati Aadda,";
  String fullAddress2 = "Sakanika galli";
  String pinCode = "424209";
  String state = "Maharashtra";
  String country = "India";
  String city = "Dhule";

  late TextEditingController emailController;
  late TextEditingController userNameController;
  late TextEditingController mobileController;
  late TextEditingController fullAddressController;
  late TextEditingController fullAddress2Controller;
  late TextEditingController pinCodeController;
  late TextEditingController stateController;
  late TextEditingController countryController;
  late TextEditingController cityController;

  var errorValidation = null;
  String? _currentAddress;
  Position? _currentPosition;

  final List<String?> errors = [];

  @override
  void initState() {
    super.initState();
    //get the available addresss.
    if (Provider.of<DeliveryAddress>(context, listen: false).addressType ==
        AddressType.ADD) {
      emailController = TextEditingController(text: email);
      userNameController = TextEditingController(text: userName);
      mobileController = TextEditingController(text: mobile);
      fullAddressController = TextEditingController(text: fullAddress);
      fullAddress2Controller = TextEditingController(text: fullAddress2);
      pinCodeController = TextEditingController(text: pinCode);
      stateController = TextEditingController(text: state);
      countryController = TextEditingController(text: country);
      cityController = TextEditingController(text: city);
    } else {
      //provide the editing address value
      CustomerDeliveryAddress editingValue =
          Provider.of<DeliveryAddress>(context, listen: false)
              .editingAddressData;
      emailController = TextEditingController(text: editingValue.email);
      userNameController = TextEditingController(
          text: editingValue.firstName + " " + editingValue.lastName);
      mobileController = TextEditingController(text: editingValue.phone);
      fullAddressController = TextEditingController(text: editingValue.address);
      fullAddress2Controller =
          TextEditingController(text: editingValue.address2);
      pinCodeController = TextEditingController(text: editingValue.pincode);
      stateController = TextEditingController(text: editingValue.state);
      countryController = TextEditingController(text: editingValue.country);
      cityController = TextEditingController(text: editingValue.city);
    }

    SchedulerBinding.instance.addPostFrameCallback((_) {
      /**
         * ##Algo##
         * call the get api on address id
         * passed it's value to the controller
         */
      // final otpMessage =
      // Provider.of<Auth>(context, listen: false).userRegMessage;
      // GlobalSnackBar.show(context, otpMessage);
    });
  }

  void addGuestAddress() {
    GuestAddress guestAddressData = GuestAddress(
      name: userName.split(" ")[0]+userName.split(" ")[1],
      address: fullAddress,
      mobile: mobile,
      address2: fullAddress2,
      country: country,
      state: state,
      city: city,
      pincode: pinCode,
      email: email);

    Provider.of<Cart>(context, listen: false).guestAddressData = guestAddressData;
    Provider.of<Cart>(context, listen: false).preparedGuestCheckout();
    Navigator.pushNamed(context,Payment.routeName);


  }
  
  Future<void> shippingAddress() async {
    CustomerDeliveryAddress newAddressData = CustomerDeliveryAddress(
        id: "id",
        firstName: userName.split(" ")[0],
        lastName: userName.split(" ")[1],
        address: fullAddress,
        phone: mobile,
        address2: fullAddress2,
        country: country,
        state: state,
        city: city,
        pincode: pinCode,
        email: email);
    Provider.of<DeliveryAddress>(context, listen: false).addingAddressDAta =
        newAddressData;
    try {
      await Provider.of<DeliveryAddress>(context, listen: false)
          .addingShippingAddress();

      Navigator.pop(context);
      Navigator.pushReplacementNamed(context, CheckoutWidget.routeName);

      // Navigator.pop(context);
      // ignore: use_build_context_synchronously
      // Navigator.pushNamed(context, ProfileScreen.routeName);
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
          newErrorMessage[key] = value[0];
          // }
        });

        String finalEmailErrorMessage = newErrorMessage.containsKey("error")
            ? newErrorMessage["error"].toString()
            : newErrorMessage.containsKey("email")
                ? newErrorMessage["email"].toString()
                : "";

        String finalPhoneErrorMessage = newErrorMessage.containsKey("phone")
            ? newErrorMessage["phone"].toString()
            : "";

        String pinCodeErrorMessage = newErrorMessage.containsKey("pincode")
            ? newErrorMessage["pincode"].toString()
            : "";

        String finalErrorMessage = finalEmailErrorMessage.isNotEmpty
            ? finalEmailErrorMessage
            : finalPhoneErrorMessage.isNotEmpty
                ? finalPhoneErrorMessage
                : pinCodeErrorMessage.isNotEmpty
                    ? pinCodeErrorMessage
                    : errorRes["message_type"];

        GlobalSnackBar.show(context, finalErrorMessage);
        // _showErrorDialog(finalErrorMessage);
      }
    }
  }

    Future<bool> _handleLocationPermission() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text(
              'Location services are disabled. Please enable the services')));
      return false;
    }
    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Location permissions are denied')));
        return false;
      }
    }
    if (permission == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text(
              'Location permissions are permanently denied, we cannot request permissions.')));
      return false;
    }
    return true;
  }

    Future<void> _getCurrentPosition() async {

      setState(() {
        locationLoader = true;
      });
    
    final hasPermission = await _handleLocationPermission();

    if (!hasPermission) return;
    await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high)
        .then((Position position) {
      setState(() => _currentPosition = position);
      _getAddressFromLatLng(_currentPosition!);
    }).catchError((e) {
      debugPrint(e);
    });
   
  }

   Future<void> _getAddressFromLatLng(Position position) async {
    await placemarkFromCoordinates(
            _currentPosition!.latitude, _currentPosition!.longitude)
        .then((List<Placemark> placemarks) {
      Placemark place = placemarks[0];

      setState(() {
        _currentAddress =
            '${place.street}, ${place.subLocality}, ${place.subAdministrativeArea}, ${place.postalCode}';
        fullAddress = place.subLocality ?? "";
        fullAddressController = TextEditingController(text: fullAddress);

        pinCode = place.postalCode ?? "";
        pinCodeController = TextEditingController(text: pinCode);

        state = place.administrativeArea ?? "";
        stateController = TextEditingController(text: state);

        city = place.locality ?? "";
        cityController = TextEditingController(text: city);

        locationLoader = false;


      });
    }).catchError((e) {
      debugPrint(e);
    });
  }

  Future<void> editShippingAddress() async {
    CustomerDeliveryAddress editAddressData = CustomerDeliveryAddress(
        id: "id",
        firstName: userName.split(" ")[0],
        lastName: userName.split(" ")[1],
        address: fullAddress,
        phone: mobile,
        address2: fullAddress2,
        country: country,
        state: state,
        city: city,
        pincode: pinCode,
        email: email);

    try {
      Provider.of<DeliveryAddress>(context, listen: false).editingAddressData =
          editAddressData;

      await Provider.of<DeliveryAddress>(context, listen: false)
          .editingShippingAddress();
      Navigator.pop(context);
      Navigator.pushReplacementNamed(context, CheckoutWidget.routeName);
      // Navigator.pushNamed(context, CheckoutWidget.routeName);

      // Navigator.pop(context);
      // ignore: use_build_context_synchronously
      // Navigator.pushNamed(context, ProfileScreen.routeName);
    } on FormatException catch (_, error) {
      GlobalSnackBar.show(context, error.toString());
      // _showErrorDialog(error.toString());
    } catch (error) {
      Map<String, dynamic> errorRes = json.decode(error.toString());
      Map<String, dynamic> errorMessage = {};
      if (errorRes["message"] is String) {
        GlobalSnackBar.show(context, errorRes["message"]);
        if (errorRes["message"] == "Unauthenticated token.") {
          Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => AuthScreen()),
              (route) => false);
        }
      } else if (errorRes["message"] is Map<String, dynamic>) {
        errorMessage = errorRes["message"];
        Map<String, String> newErrorMessage = {};
        errorMessage.forEach((key, value) {
          // for (int i = 0; i < value.length; i++) {
          newErrorMessage[key] = value[0];
          // }
        });

        String finalEmailErrorMessage = newErrorMessage.containsKey("error")
            ? newErrorMessage["error"].toString()
            : newErrorMessage.containsKey("email")
                ? newErrorMessage["email"].toString()
                : "";

        String finalPhoneErrorMessage = newErrorMessage.containsKey("phone")
            ? newErrorMessage["phone"].toString()
            : "";

        String pinCodeErrorMessage = newErrorMessage.containsKey("pincode")
            ? newErrorMessage["pincode"].toString()
            : "";

        String finalErrorMessage = finalEmailErrorMessage.isNotEmpty
            ? finalEmailErrorMessage
            : finalPhoneErrorMessage.isNotEmpty
                ? finalPhoneErrorMessage
                : pinCodeErrorMessage.isNotEmpty
                    ? pinCodeErrorMessage
                    : errorRes["message_type"];

        GlobalSnackBar.show(context, finalErrorMessage);
        // _showErrorDialog(finalErrorMessage);
      }
    }
  }

  void addError({String? error}) {
    if (!errors.contains(error))
      setState(() {
        errors.add(error);
      });
  }

  void removeError({String? error}) {
    if (errors.contains(error))
      setState(() {
        errors.remove(error);
      });
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          buildUserNameFormField(),
          SizedBox(height: 30),
          buildMobileFormField(),
          SizedBox(height: 30),
          buildEmailFormField(),
          SizedBox(height: 30),
          buildfullAddressFormField(),
          SizedBox(height: 30),
          buildfullAddressFormField2(),
          SizedBox(height: 30),
          Row(
            
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Expanded(child: buildPincodeFormField()),
              // MediaQuery.of(context).size.width * 0.95,
              SizedBox(width:MediaQuery.of(context).size.width * 0.08 ),
              // Spacer(),
             ElevatedButton(
              onPressed: () {
                _getCurrentPosition();
              },
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.all(kPrimaryColor),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.location_on_outlined),
                    SizedBox(width: MediaQuery.of(context).size.width * 0.01),
                    Text(locationLoader ? "Please wait..." : "Use my location"),
                  ],
                ),
              )
            ],
          ),
          SizedBox(height: 30),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
            
            Expanded(child: buildCityFormField()) ,
            SizedBox(width:MediaQuery.of(context).size.width * 0.07 ),
            Expanded(child:buildStateFormField())
          ],),
          // buildPincodeFormField(),
          // SizedBox(height: 30),
          // buildCityFormField(),
          // SizedBox(height: 30),
          // buildStateFormField(),
          SizedBox(height: 30),
          buildCountyFormField(),
          SizedBox(height: 30),
          FormError(errors: errors),
          SizedBox(height: 20),
          ElevatedButton(
              style: const ButtonStyle(
                backgroundColor: MaterialStatePropertyAll(kPrimaryColor),
              ),
              onPressed: () {
                if(Provider.of<AuthChecker>(context,listen: false).isAuth){
                  if (_formKey.currentState!.validate()) {
                  _formKey.currentState!.save();
                  // if all are valid then go to success screen
                  if (Provider.of<DeliveryAddress>(context, listen: false)
                          .addressType ==
                      AddressType.ADD) {
                    shippingAddress();
                  } else if (Provider.of<DeliveryAddress>(context,
                              listen: false)
                          .addressType ==
                      AddressType.EDIT) {
                      editShippingAddress();
                    }

                    // KeyboardUtil.hideKeyboard(context);
                    // Navigator.pushNamed(context, Payment.routeName);
                  }
                }else{
                  //guest delivery
                  addGuestAddress();
                }
                
              },
              child: Provider.of<AuthChecker>(context,listen: false).isAuth ? 
               Provider.of<DeliveryAddress>(context, listen: false)
                          .addressType ==
                      AddressType.ADD
                  ? const Text("Save & Continue")
                  : const Text("Edit & Continue") : const Text("Deliver here."),)
        ],
      ),
    );
  }

  TextFormField buildfullAddressFormField() {
    return TextFormField(
      controller: fullAddressController,
      onSaved: (newValue) => fullAddress = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            errorValidation = null;
          });
        } else if (value.length < 10) {
          setState(() {
            errorValidation = null;
          });
        }

        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return "please don't leave an empty field";
        } else if (value.length < 10) {
          return "please provide convenient/reacheable address";
        }

        return errorValidation;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "Full address",
        hintText: "Enter your full address",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildfullAddressFormField2() {
    return TextFormField(
      controller: fullAddress2Controller,
      onSaved: (newValue) => fullAddress2 = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            errorValidation = null;
          });
        } else if (value.length < 10) {
          setState(() {
            errorValidation = null;
          });
        }

        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return "please don't leave an empty field";
        } else if (value.length < 10) {
          return "please provide convenient/reacheable address";
        }
        return errorValidation;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "Landmark",
        hintText: "Landmark, Near area",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildCityFormField() {
    return TextFormField(
      controller: cityController,
      onSaved: (newValue) => city = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            errorValidation = null;
          });
        }
        return errorValidation;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return "please don't leave an empty field";
        }
        return errorValidation;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "City",
        hintText: "Enter your city",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildStateFormField() {
    return TextFormField(
      controller: stateController,
      keyboardType: TextInputType.text,
      onSaved: (newValue) => state = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            errorValidation = null;
          });
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return "please don't leave en empty field";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "State",
        hintText: "Enter your state",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildCountyFormField() {
    return TextFormField(
      controller: countryController,
      keyboardType: TextInputType.text,
      onSaved: (newValue) => country = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            errorValidation = null;
          });
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return "please don't leave an empty field";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "Country",
        hintText: "Enter your country name",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildPincodeFormField() {
    return TextFormField(
      controller: pinCodeController,
      keyboardType: TextInputType.text,
      onSaved: (newValue) => pinCode = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            errorValidation = null;
          });
        }

        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return "please don't leave an empty field";
        }
        final pincodeRegExp = RegExp(r'^[0-9]{6}$');
        if (!pincodeRegExp.hasMatch(value)) {
          return 'Invalid pincode';
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "Pincode",
        hintText: "Enter your pincode",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildUserNameFormField() {
    return TextFormField(
      controller: userNameController,
      onSaved: (newValue) => userName = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            errorValidation = null;
          });
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return "please don't leave an empty field";
        }
        List<String> names = value.split(" ");
        if (names.length != 2) {
          return "provide name accordingly, (firstname lastname)";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "Name",
        hintText: "Enter your name",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildEmailFormField() {
    return TextFormField(
      controller: emailController,
      keyboardType: TextInputType.emailAddress,
      onSaved: (newValue) => email = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            errorValidation = null;
          });
        }

        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return "please don't leave an empty field";
        } else if (!emailValidatorRegExp.hasMatch(value)) {
          return "please provide valid email id";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        border: OutlineInputBorder(),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        labelText: "Email",
        hintText: "Enter your email",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
    );
  }

  TextFormField buildMobileFormField() {
    return TextFormField(
      controller: mobileController,
      keyboardType: TextInputType.emailAddress,
      onSaved: (newValue) => mobile = newValue.toString(),
      onChanged: (value) {
        if (value.isNotEmpty) {
          setState(() {
            errorValidation = null;
          });
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          return kPhoneNumberNullError;
        }

        final numericRegExp = RegExp(r'^[0-9]+$');
        if (!numericRegExp.hasMatch(value)) {
          return 'Invalid number';
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        labelStyle: TextStyle(
          color: kPrimaryColor,
        ),
        border: OutlineInputBorder(),
        labelText: "Mobile",
        hintText: "Enter your mobile",
        // If  you are using latest version of flutter then lable text and hint text shown like this
        // if you r using flutter less then 1.20.* then maybe this is not working properly
        floatingLabelBehavior: FloatingLabelBehavior.auto,
      ),
    );
  }
}
