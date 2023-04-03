import 'dart:convert';
class Sort {
  int userId;
  String firstName;
  String lastName;
 
  Sort({required this.userId, required this.firstName, required this.lastName});
 
  static List<Sort> getUsers() {
    return <Sort>[
      Sort(userId: 1, firstName: "Aaron", lastName: "Jackson"),
      Sort(userId: 2, firstName: "Ben", lastName: "John"),
      Sort(userId: 3, firstName: "Carrie", lastName: "Brown"),
      Sort(userId: 4, firstName: "Deep", lastName: "Sen"),
      Sort(userId: 5, firstName: "Emily", lastName: "Jane"),
    ];
  }
}