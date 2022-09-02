const AdminLogin = require('../controller/adminOTPLogin');
const Company = require("../controller/company");
const UserLogin = require("../controller/userOTPLogin");
const Department = require("../controller/department");
const Designation = require("../controller/designation");
const Skill = require("../controller/skill");

module.exports ={
    hello: AdminLogin.hello,
    AdminOtpGenerate: AdminLogin.loginOtpGenerate,
    AdminSignIn:AdminLogin.adminSignIn,
    RegisterCompany:Company.companyRegistration,
    UserOtpGenerate:UserLogin.loginOtpGenerate,
    UserSignIn:UserLogin.userSignIn,
    InactiveCompanyLog:Company.inactiveCompanyLog,
    AddDepartment:Department.addDepartment,
    AddDesignation:Designation.addDesignation,
    AddMultiSkill:Skill.addMultipleSkill
}


// module.exports = {
//     hello:()=>{
//         return {
//             text:"~Hello Rudresh & Adil~",
//             views: 123
//         }
//     }
// }