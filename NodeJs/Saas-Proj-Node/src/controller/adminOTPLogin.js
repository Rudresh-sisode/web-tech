const Admin = require('../models/admin.model');
const Roles = require('../models/role.model');
const adminLoginService = require("../services/adminLogin.services");
const jwt = require('jsonwebtoken');
const SMTP = require('../services/smtp.service');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const pug = require('pug');
const moment = require('moment');


exports.hello = async ()=>{
    let abc = [{text:"~Hello Mr. Rudresh & Mr. Adil~",
    views: 123},{text:"~Hello Mr. Dipak & Mr. Umesh~",
    views: 123}]
    return  abc
}

exports.adminSignIn = async({adminSignInInput},req)=>{

    let step = 1;
    try{

        const {email:emailId,otp:userOTP} = adminSignInInput;
        if(!emailId || !validator.isEmail(emailId) || !userOTP || !validator.isLength(userOTP,{min:6,max:6})){
            throw new Error("Invalid Input!");
        }

        let foundResult = await Admin.findOne({email:emailId,is_deleted:false,is_active:true}).select("email name _id role_value password cmp_id password_life");
        if(!foundResult || foundResult === null){
            throw new Error("Not Found!");
        }

        let isAuth = await bcrypt.compare(userOTP,foundResult.password);
        const nowTimes = moment().utc().toString()
        if(!isAuth || moment(nowTimes).isAfter(foundResult.password_life)){
            throw new Error("Email or OTP is incorrect, try again!");
        }

        let foundedRolesResult = await Roles.find({role_value:foundResult.role_value,is_deleted:false}).select("resource_value action_value");
        if(!foundedRolesResult.length || foundedRolesResult == null){
            throw new Error("No roles assigned yet, try again later!");
        }

        const accessToken = jwt.sign({emailId:foundResult.email,userName:foundResult.name,userId:foundResult._id,cmpId:foundResult.cmp_id,roleValue:foundResult.role_value,resources:foundedRolesResult,expiredTimes:moment().add(10,'hours')},process.env.JWT_TOKEN_KEY);
        const refressToken = jwt.sign({emailId:foundResult.email,userId:foundResult._id,resource:foundedRolesResult,expiredTimes:moment().add(14,'hours')},process.env.JWT_TOKEN_KEY);

        let resourceData = adminLoginService.sortResourceData(foundedRolesResult);
        let userData = {
            emailId:foundResult.email,
            userName:foundResult.name,
            userId:foundResult._id,
            role:foundResult.role_value,
            companyId:foundResult.cmp_id
        }

        return {
            accToken:accessToken,
            refToken:refressToken,
            data:{
                resourceData:resourceData,
                userData:userData
            },
            status:'success',
        }

    }
    catch(error){
        console.log("error ",error);
        throw error;
    }
}

exports.loginOtpGenerate = async ({adminInput},req)=>{

    let step = 1;
    try{
        console.log(adminInput, typeof adminInput);
        //need to add more validator inside this
        if(!adminInput.streamName){
            errors.push({message:"Invalid Input!"})
        }

        let streamName = adminInput.streamName;
        let streamType = [...streamName].indexOf('@') !== -1 ? 'email' : 'phone';
        
        if(streamType === 'email' && validator.isEmail(streamName)){
            let adminResult = await Admin.findOne({email:streamName});
            if(!adminResult || adminResult === null){
                const error = new Error("Not Found");
                throw error;
            }

            const tokenOTP = Math.floor(100000 + Math.random() * 900000);
            const secureOTP = await bcrypt.hash(tokenOTP.toString(),12);
            let updateResult = await Admin.updateOne({email:adminResult.email,is_deleted:false,is_active:true},{password:secureOTP,password_life:moment().add(10,'M').utc().toString(),updatedAt:moment()},{upsert:false});
            if(updateResult.acknowledged === true && updateResult.modifiedCount === 1){
                let emailId = adminResult.email;
                let smtp = new SMTP();
                let htmlFilePath = `${process.env.CONTENT_DIR}/user-email-reset-password.html`;

                let htmlToSend = pug.renderFile(htmlFilePath,{
                    REDIRECT_PATH :" lsls",
                    userOTP:tokenOTP,
                    projectLogoUrl:"www.gunadhyasoft.com",
                    projectSupportEmail:"priya.rane@gunadhyasoft.com",
                    projectName:"Career Portal"
                })

                let isMailSend = await smtp.sendMail(emailId,'rakesh.ganeshwade@gunadhyasoft.com',htmlToSend,'Email OTP');

                if(isMailSend){
                    return {
                        message:"mail has been send"
                    }
                }
                else{
                    throw new Error("Failed, Try Again!");
                }
            }
            else{
                const error = new Error("Failed, Try again!");
                throw error;
            }

            console.log('your token ',token);

        }
        else if(streamType === 'phone'){


        }
        else{
            //error go
        }

        return {
            message:adminInput.name
        }
    }
    catch(error){
        console.log(error);
        throw error;
    }
    
}


