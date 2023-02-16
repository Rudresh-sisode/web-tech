import 'package:ecomm_app/components/default_button.dart';
import 'package:ecomm_app/components/form_error.dart';
import 'package:ecomm_app/components/keyboard.dart';
import 'package:ecomm_app/const_error_msg.dart';
import 'package:ecomm_app/providers/delivery-address.dart';
import 'package:ecomm_app/screens/widgets/payment.dart';
import 'package:ecomm_app/size_config.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'dart:convert';

import '../../models/delivery-address.dart';

class ShippingForm extends StatefulWidget {
  @override
  _ShippingFormState createState() => _ShippingFormState();
}

class _ShippingFormState extends State<ShippingForm> {




  final _formKey = GlobalKey<FormState>();
  String  email = "kedar.ahirrao@gunadhyasoft.com";
  String userName = "Kunal Ahirrao";
  String mobile= "7656755768";
  String fullAddress= "Baramati Aadda,";
  String fullAddress2 = "Sakanika galli";
  String pinCode= "424209";
  String state= "Maharashtra";
  String country = "India";
  String city= "Dhule";

  late TextEditingController emailController ;
  late TextEditingController userNameController;
  late TextEditingController mobileController ;
  late TextEditingController fullAddressController = TextEditingController(text: fullAddress);
  late TextEditingController fullAddress2Controller = TextEditingController(text: fullAddress2);
  late TextEditingController pinCodeController = TextEditingController(text: pinCode);
  late TextEditingController stateController = TextEditingController(text: state);
  late TextEditingController countryController = TextEditingController(text: country);
  late TextEditingController cityController = TextEditingController(text: city);

  final List<String?> errors = [];


    @override
    void initState() {
      super.initState();
      emailController = TextEditingController(text: email);
      userNameController = TextEditingController(text: userName);
      mobileController = TextEditingController(text: mobile);
      
    }

    
  Future<void> shippingAddress() async {

    CustomerDeliveryAddress addressData = CustomerDeliveryAddress(id: "id", firstName: userName.split(" ")[0], lastName: userName.split(" ")[1], address: fullAddress, phone: mobile, address2: fullAddress2, country: country, state: state, city: city, pincode: pinCode, email: email);

    try {
      await Provider.of<DeliveryAddress>(context, listen: false);

      // Navigator.pop(context);
      // ignore: use_build_context_synchronously
      // Navigator.pushNamed(context, ProfileScreen.routeName);
      
    } on FormatException catch (_, error) {
      // _showErrorDialog(error.toString());
    } catch (error)  {
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
          SizedBox(height: getProportionateScreenHeight(30)),
          buildMobileFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildEmailFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildfullAddressFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildfullAddressFormField2(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildPincodeFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildCityFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildStateFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          buildCountyFormField(),
          SizedBox(height: getProportionateScreenHeight(30)),
          FormError(errors: errors),
          SizedBox(height: getProportionateScreenHeight(20)),
          DefaultButton(
            text: "Save & Continue",
            press: () {
              if (_formKey.currentState!.validate()) {
                _formKey.currentState!.save();
                // if all are valid then go to success screen
                shippingAddress();
                // KeyboardUtil.hideKeyboard(context);
                // Navigator.pushNamed(context, Payment.routeName);
              }
            },
          ),
        ],
      ),
    );
  }

  TextFormField buildfullAddressFormField() {
    return TextFormField(
      
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
      keyboardType: TextInputType.text,
      onSaved: (newValue) => country = newValue.toString(),
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
