import validator from "validator";
import bcrypt from 'bcrypt';
import { Op, Sequelize } from "sequelize";
import jwt from "jsonwebtoken";
import moment from 'moment';
import * as SMTP from "../../services/smtp-mail.service";
require('dotenv').config();
import path from "path";
import pug from "pug";

import AdministrationTableModel from "../../abstractions/models/administration-model";
import { AdmineLoginData, AddNewAdminData } from "../../abstractions/classes/interfaces/admin-auth-model";
import sequelize from "../../utilities/database-connect";
import { AdministratorValidator } from "../../abstractions/errors/validation-errors";

const adminSignIn = async (req:any,res:any,next:any) =>{
    let status = 200, step = 1;
    try{
        let adminLoginData:AdmineLoginData = req.body;
        if(!adminLoginData || adminLoginData == null || adminLoginData == undefined || validator.isEmpty(adminLoginData.adminId.trim()) || !validator.isLength(adminLoginData.adminPassword,{min:8,max:20})){
            status = 400;
            throw new Error("Invalid Input!");
        }

        step = 2;
        //find the admin
        let getAdminData:any = await AdministrationTableModel.findOne({where:{email:adminLoginData.adminId.trim().toLowerCase(),is_deleted:false},raw:true,attributes:['id','email',['first_name','firstName'],['last_name','lastName'],'password','is_deleted']});

        if(!getAdminData){
            status = 404;
            throw new Error("Invalid credential!");
        }

        step = 3;
        //checking if password is correct or not
        const isPasswordCorrect = await bcrypt.compare(adminLoginData.adminPassword,getAdminData.password);
        if(!isPasswordCorrect){
            status = 400;
            throw new Error("Invalid credentials!");
        }

        step = 4;
        //generate jwt token
        const jwtToken = jwt.sign({adminId:getAdminData.id,admin:getAdminData.email,tokenTime:moment().add(1,'days').utc().toISOString()},process.env.JWT_TOKEN_KEY as string,{expiresIn:"1d"});
        if(!jwtToken || jwtToken == null || jwtToken == undefined){
            status = 500;
            throw new Error("Token generation failed!");
        }

        return res.status(status).json({
            status:"success",
            message:"Admin logged in successfully!",
            data:{
                firstName:getAdminData.firstName,
                lastName:getAdminData.lastName,
                email:getAdminData.email,
                token:jwtToken
            }
        });

    }
    catch(error:any){
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
}

const addNewAdmin = async (req:any,res:any,next:any) =>{
    let status = 200, step = 1;
    //start transaction
    const transaction = await sequelize.transaction();
    try{
        const adminData:AddNewAdminData = req.body;
        
        //check if admin already exist
        const adminExist = await AdministrationTableModel.findOne({where:{email:adminData.email,is_deleted:false},raw:true});
        if(adminExist){
            status = 400;
            throw new Error("Admin already exist!");
        }

        const hashedPassword = await bcrypt.hash(adminData.password,12);
        await AdministrationTableModel.create({
            first_name:adminData.firstName,
            last_name:adminData.lastName,
            email:adminData.email,
            password:hashedPassword,
            mobile:adminData.mobile || null,
            created_by: req.hasOwnProperty("adminEmail") ? req.adminEmail : null,
            created_at:moment().utc().toISOString(),
        },{transaction:transaction});

        if(AdministratorValidator.adminErrors.length > 0){
            console.log(AdministratorValidator.adminErrors);
            status = 400;
            throw new Error(AdministratorValidator.adminErrors.join(", "));
        }

        await transaction.commit();
        return res.status(status).json({
            status:"success",
            message:"Admin added successfully!"
        });

    }
    catch(error:any){
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
}


// ***************************************************
const adminForgetPasswordRequest = async (req:any,res:any,next:any) => {
    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{
        const adminId:string = req.body.adminId;
        if(!adminId || adminId == null || adminId == undefined || validator.isEmpty(adminId)){
            status = 400;
            throw new Error("Invalid Input!");
        }

        let streamType:string = [...adminId].indexOf('@') > -1 ? "email" : "phone";
        //checking if email or phone number is valid
        if(streamType == "email" && !validator.isEmail(adminId)){
            status = 400;
            throw new Error("Invalid Email!");
        }
        if(streamType == "phone" && !validator.isMobilePhone(adminId,"en-IN")){
            status = 400;
            throw new Error("Invalid Phone Number!");
        }

        if(streamType == "email"){
            //check if email exists
            step = 2;
            const isEmailExist:any = await AdministrationTableModel.findOne({where:{email:adminId.trim().toLowerCase(),is_deleted:false},raw:true});
            if(!isEmailExist || isEmailExist == null || isEmailExist == undefined){
                status = 404;
                throw new Error("Email does not exist!");
            }

            //generate 6 digit otp
            step = 3;
            const otp:string = Math.floor(100000 + Math.random() * 900000).toString();
            //encripting otp with bcrypt
            const otpHash:string = await bcrypt.hash(otp,12);
            // update otp in the database
            step = 4;
            const updateOtp:any = await AdministrationTableModel.update({temporary_password:otpHash,temporary_password_expiry_date:moment().add(10,'m').utc().toISOString(),updated_at: moment().utc().toISOString(),updated_by:adminId},{where:{email:adminId.trim().toLowerCase(),is_deleted:false},transaction:tscn});
            if(!('0' in updateOtp) || updateOtp['0'] == null || updateOtp['0'] == undefined || updateOtp['0'] == 0){
                status = 500;
                throw new Error("Otp generate failed!");
            }

            let htmlFilePath:string = path.join(__dirname,'../..','emails','login-email-template.html');
            
            let htmlContent = pug.renderFile(htmlFilePath,{
                userOTP:otp,
                userName:isEmailExist ? isEmailExist.first_name +" "+ isEmailExist.last_name +"(Admin)": "Admin",
                expiryTime:"10 minutes, at "+moment().add(10,'m').format("HH:mm:ss") ,//moment().add(10,'m').utc().toISOString(),//moment().add(10,'m').format("DD-MM-YYYY HH:mm:ss")
                teamName:process.env.PROJECT_SUPPORT_EMAIL
            });

            new SMTP.SmtpService().sendMail(isEmailExist.email,htmlContent,"Time Tango | Reset Password OTP");
            

            //commit the transaction
            await tscn.commit();

            res.status(status).json({
                status:"success",
                message:"Otp sent to your email!",
            });

        }
        else{
            /**
             * @pending
             * @todo
             * 
             * send the otp to the phone number
             * 
             */
        }

    }
    catch(error:any){
        //rollback the transaction
        await tscn.rollback();

        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
}

const adminValidatePasswordRequest = async (req:any,res:any,next:any) => {

    let step = 1, status = 200;
    try{

        //get the opt from the request body
        // let {otp,userId} = req.body;
        let otp:string = req.body.otp;
        let adminId:string = req.body.adminId;
        if(validator.isEmpty(otp) || !validator.isNumeric(otp) || otp.length != 6 ||  validator.isEmpty(adminId)){
            status = 400;
            throw new Error("Invalid Input!");
        }

        //check is user exists and active
        step = 2;
        let getAdminData:any = await AdministrationTableModel.findOne({where:{email:adminId.toLowerCase(),is_deleted:false},raw:true});
        if(!getAdminData || getAdminData == null || getAdminData == undefined){
            status = 404;
            throw new Error("Admin does not exist!");
        }

        //check if otp is valid
        step = 3;
        const isOtpValid:boolean = await bcrypt.compare(otp,getAdminData.temporary_password as string);
        if(!isOtpValid){
            status = 400;
            throw new Error("Invalid OTP!");
        }

        //check if otp is expired
        step = 4;
        const isOtpExpired:boolean = moment().isAfter(moment(getAdminData.temporary_password_expiry).utc().toISOString());
        if(isOtpExpired){
            status = 400;
            throw new Error("OTP expired!");
        }

        //generate jwt token
        step = 5;
        const jwtToken:string = jwt.sign({adminId:getAdminData.id,adminMail:getAdminData.email,tokenTime:moment().add(5,'m').utc().toISOString()},process.env.JWT_TOKEN_KEY as string);
        if(!jwtToken || jwtToken == null || jwtToken == undefined){
            status = 500;
            throw new Error("Token generation failed!");
        }

        res.status(status).json({
            status:"success",
            message:"OTP validated successfully!",
            data:{
                authKey:jwtToken
            }
        });

    }
    catch(error:any){
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
}

const adminResetPasswordRequest = async (req:any,res:any,next:any) => {

    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{

        //get token value from the request body
        const {adminToken,password,comPassword} = req.body;
        if(validator.isEmpty(adminToken) || !validator.isJWT(adminToken) || validator.isEmpty(password) || validator.isEmpty(comPassword)){
            status = 400;
            throw new Error("Invalid Input!");
        }
        //check is both password are same
        if(password != comPassword){
            status = 400;
            throw new Error("Password does not match!");
        }

        //verify the jwt token
        step = 2;
        const jwtTokenData:any = jwt.verify(adminToken,process.env.JWT_TOKEN_KEY as string);
        if(!jwtTokenData || jwtTokenData == null || jwtTokenData == undefined){
            status = 400;
            throw new Error("Invalid token key!");
        }

        //check if token is expired
        step = 3;
        const isTokenExpired:boolean = moment().isAfter(moment(jwtTokenData.tokenTime).utc().toISOString());
        if(isTokenExpired){
            status = 400;
            throw new Error("OTP session expired, try again!");
        }

        //check if user exists and active
        step = 4;
        let getAdminData:any = await AdministrationTableModel.findOne({where:{id:jwtTokenData.adminId,email:jwtTokenData.adminMail,is_deleted:false},raw:true});
        if(!getAdminData || getAdminData == null || getAdminData == undefined){
            status = 404;
            throw new Error("User does not exist!");
        }

        //update the user password
        step = 5;
        const hashedPassword = await bcrypt.hash(password,12);
        if(!hashedPassword || hashedPassword == null || hashedPassword == undefined){
            status = 500;
            throw new Error("Password hash failed!");
        }

        //update the user password
        step = 6;
        const updatePassword:any = await AdministrationTableModel.update({password:hashedPassword,temporaryPassword:null,temporaryPasswordExpiry:null},{where:{id:jwtTokenData.adminId},transaction:tscn});// as unknown as [number,UserData[]]
        if(!('0' in updatePassword) || updatePassword['0'] == null || updatePassword['0'] == undefined || updatePassword['0'] == 0){
            status = 500;
            throw new Error("Password updation failed!");
        }

        //commit the transaction
        await tscn.commit();

        res.status(status).json({
            status:"success",
            message:"Password updated successfully!"
        });

    }
    catch(error:any){
        //rollback the transaction
        await tscn.rollback();
        
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
}

export { adminSignIn, addNewAdmin, adminForgetPasswordRequest, adminValidatePasswordRequest, adminResetPasswordRequest };


