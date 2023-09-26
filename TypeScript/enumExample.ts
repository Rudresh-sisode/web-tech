enum Admin {
    Admin,
    Employee,
    HR
};

let abc  = {
    name :"rudresh",
    role:Admin.Employee
}

console.log(abc.role == Admin.Admin)