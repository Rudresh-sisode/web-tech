const validator = require('validator');
const Company = require('../models/company.model');
const User = require('../models/user-login.model');
const companyServices = require("../services/company.service");
const moment = require("moment");

exports.companyRegistration = async( {companyInput},req)=>{

    let step = 1;
    try{

        const {companyName,companyEmail,companyAddress,city,zipcode,stateKey,officeNumber,userName,userEmail} = companyInput;
        
        if(validator.isEmpty(companyName) || validator.isEmpty(companyEmail) || !validator.isEmail(companyEmail) || validator.isEmpty(companyAddress) || validator.isEmpty(city) || validator.isEmpty(zipcode) || !validator.isLength(zipcode,{min:6,max:6}) || !validator.isMongoId(stateKey) || validator.isEmpty(officeNumber) || validator.isEmpty(userName) || !validator.isEmail(userEmail)){
            throw new Error("Invalid Input. Try again!");
        }

        
        step = 2;
        let findUser = await User.findOne({email:userEmail}).select("email").populate("cmp_id","cmp_name cmp_email");
        if(findUser || findUser !== null){
            const error = new Error("Already registered!");
            throw error;
        }

        console.log('your user ',findUser);
        step = 3;
        const companyResult = await Company.create({cmp_name:companyName,
            cmp_email:companyEmail,
            cmp_address:companyAddress,
            city:city,
            zipcode:zipcode,
            state_key:stateKey,
            office_number:officeNumber,
            is_active:false,
            createdAt:moment().utc().toString(),
            createdBy:"self"
            });

        step = 4;
        if(companyResult === null || !companyResult){
            throw new Error("Registred Fail, try again!");
        }
//is_active
        step = 5;
        const userResult = await User.create({
            name:userName,
            email:userEmail,
            is_active:false,
            role_name:"super_admin",
            role_value:"Super Admin",
            cmp_id:companyResult,
            createdAt:moment().utc().toString(),
            createdBy:"self"
        })

        if(!userResult || userResult === null){
            throw new Error("Not registred, try again!")
        }

        //now user created then send email to user

        return {
            message:"Registred Successfully!",
            cmpEmail:companyResult.cmp_email,
            userEmail:userResult.email
        }
    }
    catch(error){
        console.log('company registraion :', error);
        throw error;
    }

}

exports.inactiveCompanyLog = async({},req)=>{
    let step = 1;
    try{

        if(!req.isAuth){
            throw new Error("Not Authorized!");
        }

        if(!req.hasRoleAccess){
            throw new Error("Access Denied!");
        }

        const companyResult = await Company.find({is_active:false,is_deleted:false}).select("cmp_name cmp_email cmp_address city zipcode state_key office_number is_active createdAt createdBy is_deleted").lean();
        if(companyResult.length === 0 || !companyResult){
            throw new Error("No Record!");
        }

        let companyCustomeResult = companyServices.sortInactiveCompanyData(companyResult);

        // return companyCustomeResult
        return {
            status:"success",
            message:" ",
            data:companyCustomeResult,
            statusCode:200
        }
    }
    catch(error){
        console.log(`step ${step} error ${error}`);
        throw error;
    }
}