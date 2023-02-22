import 'package:ecomm_app/checkout_widget.dart';
import 'package:ecomm_app/components/default_button.dart';
import 'package:ecomm_app/components/form_error.dart';
import 'package:ecomm_app/components/global_snack_bar.dart';
import 'package:ecomm_app/components/keyboard.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/providers/delivery-address.dart';
import 'package:ecomm_app/screens/widgets/payment.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';

import 'dart:convert';

import '../../models/delivery-address.dart';

class ShippingForm extends StatefulWidget {
  @override
  _ShippingFormState createState() => _ShippingFormState();
}

class _ShippingFormState extends State<ShippingForm> {
  final _formKey = GlobalKey<FormState>();
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
      await Provider.of<DeliveryAddress>(context, listen: false).addingShippingAddress();

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

        String pinCodeErrorMessage = newErrorMessage.containsKey("pincode") ? newErrorMessage["pincode"].toString() : "";

        

        String finalErrorMessage = finalEmailErrorMessage.isNotEmpty
            ? finalEmailErrorMessage
            : finalPhoneErrorMessage.isNotEmpty
                ? finalPhoneErrorMessage
                : pinCodeErrorMessage.isNotEmpty ? pinCodeErrorMessage : errorRes["message_type"];

          GlobalSnackBar.show(context, finalErrorMessage);
        // _showErrorDialog(finalErrorMessage);
      }
    }
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
      Provider.of<DeliveryAddress>(context, listen: false).editingAddressData = editAddressData;

      await Provider.of<DeliveryAddress>(context, listen: false).editingShippingAddress();
      Navigator.pop(context);
      Navigator.pushNamed(context, CheckoutWidget.routeName);


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

        String pinCodeErrorMessage = newErrorMessage.containsKey("pincode") ? newErrorMessage["pincode"].toString() : "";

        

        String finalErrorMessage = finalEmailErrorMessage.isNotEmpty
            ? finalEmailErrorMessage
            : finalPhoneErrorMessage.isNotEmpty
                ? finalPhoneErrorMessage
                : pinCodeErrorMessage.isNotEmpty ? pinCodeErrorMessage : errorRes["message_type"];

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
          buildPincodeFormField(),
          SizedBox(height: 30),
          buildCityFormField(),
          SizedBox(height: 30),
          buildStateFormField(),
          SizedBox(height: 30),
          buildCountyFormField(),
          SizedBox(height: 30),
          FormError(errors: errors),
          SizedBox(height: 20),
          ElevatedButton(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  _formKey.currentState!.save();
                  // if all are valid then go to success screen
                  if(Provider.of<DeliveryAddress>(context, listen: false)
                          .addressType ==
                      AddressType.ADD){
                        shippingAddress();
                      }
                      else if(Provider.of<DeliveryAddress>(context, listen: false)
                          .addressType ==
                      AddressType.EDIT){
                        editShippingAddress();
                        
                      }
                  
                  // KeyboardUtil.hideKeyboard(context);
                  // Navigator.pushNamed(context, Payment.routeName);
                }
              },
              child: Provider.of<DeliveryAddress>(context, listen: false)
                          .addressType ==
                      AddressType.ADD
                  ? const Text("Save & Continue")
                  : const Text("Edit & Continue"))
          // DefaultButton(
          //   text: "Save & Continue",
          //   press: () {
          //     if (_formKey.currentState!.validate()) {
          //       _formKey.currentState!.save();
          //       // if all are valid then go to success screen
          //       shippingAddress();
          //       // KeyboardUtil.hideKeyboard(context);
          //       // Navigator.pushNamed(context, Payment.routeName);
          //     }
          //   },
          // ),
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
          removeError(error: kAddressNullError);
        } else {
          return null;
        }
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kAddressNullError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
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
          removeError(error: kAddressNullError);
        } else {
          return null;
        }
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kAddressNullError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
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
          removeError(error: kCityNullError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kCityNullError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
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
          removeError(error: kStateNullError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kStateNullError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
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
          removeError(error: kCountyNullError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kCountyNullError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
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
          removeError(error: kPincodeNullError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kPincodeNullError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        border: OutlineInputBorder(),
        labelText: "Pincode",
        hintText: "Enter your name",
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
          removeError(error: kNamelNullError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kNamelNullError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
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
          removeError(error: kEmailNullError);
        } else if (emailValidatorRegExp.hasMatch(value)) {
          removeError(error: kInvalidEmailError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kEmailNullError);
          return "";
        } else if (!emailValidatorRegExp.hasMatch(value)) {
          addError(error: kInvalidEmailError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
        border: OutlineInputBorder(),
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
          removeError(error: kPhoneNumberNullError);
        }
        return null;
      },
      validator: (value) {
        if (value!.isEmpty) {
          addError(error: kPhoneNumberNullError);
          return "";
        }
        return null;
      },
      decoration: const InputDecoration(
        contentPadding: EdgeInsets.all(12.0),
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
