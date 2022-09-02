const UserLogin = require('../models/user-login.model');
const SMTP = require('../services/smtp.service');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const pug = require('pug');
const moment = require('moment');

exports.loginOtpGenerate = async ({userInput},req)=>{

    let step = 1;
    try{
        //need to add more validator inside this
        if(!userInput.streamName){
            throw new Error("Invalid Input!");
        }

        let streamName = userInput.streamName;
        let streamType = [...streamName].indexOf('@') !== -1 ? 'email' : 'phone';
        
        if(streamType === 'email' && validator.isEmail(streamName)){
            let userResult = await UserLogin.findOne({email:streamName});
            if(!userResult || userResult === null){
                const error = new Error("Not Found");
                throw error;
            }

            const tokenOTP = Math.floor(100000 + Math.random() * 900000);
            const secureOTP = await bcrypt.hash(tokenOTP.toString(),12);
            let updateResult = await UserLogin.updateOne({email:userResult.email,is_deleted:false,is_active:true},{password:secureOTP,password_life:moment().add(10,'M').utc().toString(),updatedAt:moment()},{upsert:false});
            if(updateResult.acknowledged === true && updateResult.modifiedCount === 1){
                let emailId = userResult.email;
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
        }
        else if(streamType === 'phone'){

        }
        else{
            //error go
            throw new Error("Invalid Input, Try again!");
        }
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

exports.userSignIn = async({userSignInInput},req)=>{

    let step = 1;

    try{

        const {email:emailId,otp:userOTP} = userSignInInput;
        if(!emailId || !validator.isEmail(emailId) || !userOTP || !validator.isLength(userOTP,{min:6,max:6})){
            throw new Error("Invalid Input!");
        }
        step = 2;
        let foundResult = await UserLogin.findOne({email:emailId,is_deleted:false,is_active:true}).select("email name _id role_value password cmp_id password_life");
        if(!foundResult || foundResult === null){
            throw new Error("Not Found!");
        }
        step = 3
        let isAuth = await bcrypt.compare(userOTP,foundResult.password);
        const nowTimes = moment().utc().toString()
        if(!isAuth || moment(nowTimes).isAfter(foundResult.password_life)){
            throw new Error("Timeout, try again!");
        }
        step = 4;
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
        console.log("error ",error, "step ",step);
        throw error;
    }
}
