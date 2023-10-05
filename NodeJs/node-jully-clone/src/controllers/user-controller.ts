//files imports below
import CompanyTableModel from "../abstractions/models/company-table-model";
import UserTableModel from "../abstractions/models/user-table-model";
import AttendanceTableModel from "../abstractions/models/attendance-table-model";
import EmployeeTableModel from "../abstractions/models/employee-table-model";
import DepartmentTableModel from "../abstractions/models/department-table-model";
import DesignationTableModel from "../abstractions/models/designation-table-model";
import RoleTableModel from "../abstractions/models/role-table-model";
import { UserSignUpData } from "../abstractions/classes/interfaces/user-sign-up-model";
import { UserEditData } from "../abstractions/classes/interfaces/user-edit-data-model";

//modules imports below
import validator from "validator";
import bcrypt from 'bcrypt';
import { Op, Sequelize } from "sequelize";
import jwt from "jsonwebtoken";
import moment from 'moment';
require('dotenv').config();
import path from "path";
import pug from "pug";


import ResourceTableModel from "../abstractions/models/resource-table-model";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";
import { UserLoginData } from "../abstractions/classes/interfaces/user-login-model";
import { UserData } from "../abstractions/classes/interfaces/user-model";
import { EmployeeData } from "../abstractions/classes/interfaces/employee-model";
import { LoginResponse } from "../abstractions/classes/interfaces/user-login-response-model";
import ActionTableModel from "../abstractions/models/action-table-model";
import * as SMTP from "../services/smtp-mail.service";
import sequelize from "../utilities/database-connect";
import { generatePassword } from "../services/generate-password.service";
import HistoryTableModel from "../abstractions/models/history-log-info-model";
import { ContactUs } from "../abstractions/classes/interfaces/contact-us-model";

require('dotenv').config();

//defining types
type PrivilegesData = {
    privileges:{
        resourceId: string;
        actionId: string;
       }[];
};

type UserEmployeeRegisterData = {
    workMode: string;
    name: string;
    employeeId: string;
    email: string;
}[];

const bulkRegisterUserEmployee = async (req:UserRequest,res:any,next:any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try{
      let userEmployeeData:UserEmployeeRegisterData = req.body;
      const fileName = req.query.fileName as string;

      //check if file name is provided
      if(!fileName){
          status = 400;
          throw new Error("Please provide file name!");
      }

      //check every record has the required keys
      if(!userEmployeeData.every((employeeData)=>Object.keys(employeeData).includes('workMode') && Object.keys(employeeData).includes('name') && Object.keys(employeeData).includes('employeeId') && Object.keys(employeeData).includes('email'))){
          status = 400;
          throw new Error("Please provide data in correct format! (workMode,name,employeeId,email)");
      }
     
      if(userEmployeeData.length == 0){
          status = 400;
          throw new Error("Empty records found!");
      }
      
      //find the role 
      const roleResult:any = await RoleTableModel.findOne({where:{role_name:'EMPLOYEE',is_deleted:false},attributes:["id"],raw:true});
             
      //checking validation for each record
      // userEmployeeData.forEach((employeeData,index)=>{
      //     if(validator.isEmpty(employeeData.workMode) || !['hybrid','wfh','office'].includes(employeeData.workMode.toLowerCase()) || validator.isEmpty(employeeData.name) || validator.isEmpty(employeeData.employeeId) || validator.isEmpty(employeeData.email) || !validator.isEmail(employeeData.email.trim().toLowerCase())){
      //         status = 400;
      //         throw new Error(`Invalid employee data at index ${index}!`);
      //     }
      // });

      
      let insertTraceIndex = 0;
      let insertFailsRecord:any = [];
      let insertFailsRecordErrorMessage:any =[];
      //failed record management ############AS_PER_NEW_NORMS##################
      for(let i = 0; i <userEmployeeData.length; i++){
          let employeeData = userEmployeeData[i];
          let reasonArray:string[] = [];
          if(!['hybrid','wfh','office'].includes(employeeData.workMode.toLowerCase())){
              reasonArray.push("Invalid work mode! (work mode must be 'hybrid', 'wfh' or 'office')");
              insertFailsRecord.push({record:employeeData,index:i});
              insertFailsRecordErrorMessage.push({reason:reasonArray,index:i});
          }
          if(validator.isEmpty(employeeData.name)){
              reasonArray.push("Invalid name!");
              if(insertFailsRecord[i]){
                insertFailsRecordErrorMessage[i].reason = reasonArray;
              }
              else{
                insertFailsRecord.push({record:employeeData,index:i});
                insertFailsRecordErrorMessage.push({reason:reasonArray,index:i});
              }
          }
          if(validator.isEmpty(employeeData.employeeId)){
              reasonArray.push("Invalid employee id!");
              if(insertFailsRecord[i]){
                insertFailsRecordErrorMessage[i].reason = reasonArray;
              }
              else{
                insertFailsRecord.push({record:employeeData,index:i});
                insertFailsRecordErrorMessage.push({reason:reasonArray,index:i});
              }
          }
          if(validator.isEmpty(employeeData.email) || !validator.isEmail(employeeData.email.trim().toLowerCase())){
              reasonArray.push("Invalid email!");
              if(insertFailsRecord[i]){
                insertFailsRecordErrorMessage[i].reason = reasonArray;
              }
              else{
                insertFailsRecord.push({record:employeeData,index:i});
                insertFailsRecordErrorMessage.push({reason:reasonArray,index:i});
              }
          }
          //check if employeeId is exist in database
          const isEmployeeIdExist: any = await EmployeeTableModel.findOne({ where: { emp_id: employeeData.employeeId.trim(), is_deleted: false, company_id: req.companyId }, raw: true });
          if (isEmployeeIdExist) {
              reasonArray.push("Employee id already registered!");
              if(insertFailsRecord[i]){
                insertFailsRecordErrorMessage[i].reason = reasonArray;
              }
              else{
                insertFailsRecord.push({record:employeeData,index:i});
                insertFailsRecordErrorMessage.push({reason:reasonArray,index:i});
              }
          }
          //check if email is exist in database
          const isEmailExist: any = await UserTableModel.findOne({ where: { email: employeeData.email.trim().toLowerCase(), is_deleted: false, company_id: req.companyId }, raw: true });
          if (isEmailExist) {
              reasonArray.push("Email already registered!");
              if(insertFailsRecord[i]){
                insertFailsRecordErrorMessage[i].reason = reasonArray;
              }
              else{
                insertFailsRecord.push({record:employeeData,index:i});
                insertFailsRecordErrorMessage.push({reason:reasonArray,index:i});
              }
          }
          //check if email exist in other company
          const isEmailExistInOtherCompany: any = await UserTableModel.findOne({ where: { email: employeeData.email.trim().toLowerCase(), is_deleted: false,company_id:{[Op.not]:req.companyId} }, raw: true });
          if (isEmailExistInOtherCompany){
              reasonArray.push("Email already registered in other company!");
              if(insertFailsRecord[i]){
                insertFailsRecordErrorMessage[i].reason = reasonArray;
              }
              else{
                insertFailsRecord.push({record:employeeData,index:i});
                insertFailsRecordErrorMessage.push({reason:reasonArray,index:i});
              }
          }
          if(!insertFailsRecord[i]){
              insertFailsRecord.push(null);
              insertFailsRecordErrorMessage.push(null);
          }
      }

      //check if duplicate record found
      let isDubplicateRecordFound:boolean = false;
      userEmployeeData.forEach((employeeData,index)=>{
          //checking is employeeId is duplicate
          const firstIndex = userEmployeeData.findIndex((employeeData2) => employeeData2.employeeId == employeeData.employeeId);
          if(firstIndex !== index && firstIndex !== -1){
            if(insertFailsRecord[index]){
              isDubplicateRecordFound = true;
              insertFailsRecordErrorMessage[index].reason.push("Duplicate employeeId record found!");
            }
            else{
              isDubplicateRecordFound = true;
              insertFailsRecord.push({record:userEmployeeData[index],index:index});
              insertFailsRecordErrorMessage.push({reason:["Duplicate employeeId record found!"],index:index});
            }
          }
          //checking is email is duplicate
          const secondIndex = userEmployeeData.findIndex((employeeData2) => employeeData2.email == employeeData.email);
          if(secondIndex !== index && secondIndex !== -1){
            if(insertFailsRecord[index]){
              isDubplicateRecordFound = true;
              insertFailsRecordErrorMessage[index].reason.push("Duplicate email record found!");
            }
            else{
              isDubplicateRecordFound = true;
              insertFailsRecord.push({record:userEmployeeData[index],index:index});
              insertFailsRecordErrorMessage.push({reason:["Duplicate email record found!"],index:index});
            }
          }
      });

      //remove null from insertFailsRecord and insertFailsRecordErrorMessage
      insertFailsRecord = insertFailsRecord.filter((record:any)=>record !== null);
      insertFailsRecordErrorMessage = insertFailsRecordErrorMessage.filter((record:any)=>record !== null);


      //sort array if duplicate record found
      if(isDubplicateRecordFound){
        //sort the insertFailsRecord and insertFailsRecordErrorMessage in ascending order
        insertFailsRecord.sort((a:any,b:any)=>a.index - b.index);
        insertFailsRecordErrorMessage.sort((a:any,b:any)=>a.index - b.index);
      }

      let insertSucceedRecord:any = [];
      //inserting bulk data
      for (let i = 0; i < userEmployeeData.length; i++) {
          const employeeData = userEmployeeData[i];
          //avoid failed record to insert
          const shallRemove = insertFailsRecordErrorMessage.find((record:any)=>record.index === i);
          if(shallRemove){
              continue;
          }

          // // check if email is already registered
          // const isEmailExist: any = await UserTableModel.findOne({ where: { email: employeeData.email.trim().toLowerCase(), is_deleted: false, is_active: true, company_id: req.companyId }, raw: true });
          // if (isEmailExist) {
          //     insertFailsRecord.push({record:employeeData,reason:"Email already registered!"});
          //     continue;
          // }

          // check if employee id is already registered
          // const isEmployeeIdExist: any = await EmployeeTableModel.findOne({ where: { emp_id: employeeData.employeeId, is_deleted: false, is_active: true,company_id: req.companyId }, raw: true });
          // if (isEmployeeIdExist) {
          //     insertFailsRecord.push({record:employeeData,reason:"Employee id already registered!"});
          //     continue;
          // }

          //inserting user data
          if(employeeData.workMode.toLowerCase() === "office"){

              let userResult:any = await UserTableModel.create({
                  email:employeeData.email.trim().toLowerCase(),
                  company_id:req.companyId,
                  work_mode:employeeData.workMode.toLowerCase(),
                  is_deleted:false,
                  is_active:true,
                  role_id:roleResult ? roleResult.id : null,
                  created_at:moment().utc().toISOString(),
                  created_by: req.keyId
              },{raw:true,transaction:tscn});

              //inserting employee data
              await EmployeeTableModel.create({
                  emp_id:employeeData.employeeId,
                  first_name:employeeData.name,
                  company_id:req.companyId,
                  user_id:userResult.id,
                  is_deleted:false,
                  created_at:moment().utc().toISOString(),
                  created_by: req.keyId
              },{transaction:tscn});
                  
              let htmlFilePath:string = path.join(__dirname,'..','emails','user-work-from-office-registration-template.html');
          
              let htmlContent = pug.renderFile(htmlFilePath,{
                  compName:req.companyName,
                  userFullName:employeeData.name,
                  employeeID:employeeData.employeeId,
                  userEmail:employeeData.email.toLowerCase(),
                  teamName:process.env.PROJECT_SUPPORT_EMAIL
              });

              insertSucceedRecord.push({record:employeeData});
      
               new SMTP.SmtpService().sendMail(employeeData.email.toLowerCase(),htmlContent,"Time Tango | User Registration");
              // if(!mailSend){
              //     status = 500;
              //     throw new Error("Mail send failed!");
              // }

          }
          else if(employeeData.workMode.toLowerCase() === "wfh"){

              //create a login token with jwt
              // let token = jwt.sign({email:employeeData.email.trim().toLowerCase(),employeeId:employeeData.employeeId,companyId: req.companyId},process.env.TOKEN_JWT_KEY as string);
              const randomPassword = generatePassword();
              const hashedPassword = await bcrypt.hash(randomPassword,12);
              let userResult:any = await UserTableModel.create({
                  email:employeeData.email.trim().toLowerCase(),
                  password:hashedPassword,
                  company_id:req.companyId,
                  work_mode:employeeData.workMode.toLowerCase(),
                  is_deleted:false,
                  is_active:true,
                  role_id:roleResult ? roleResult.id : null,
                  // login_token:token,
                  created_at:moment().utc().toISOString(),
                  created_by: req.keyId
              },{raw:true,transaction:tscn});

              //inserting employee data
              await EmployeeTableModel.create({
                  emp_id:employeeData.employeeId,
                  first_name:employeeData.name,
                  company_id:req.companyId,
                  user_id:userResult.id,
                  is_deleted:false,
                  created_at:moment().utc().toISOString(),
                  created_by: req.keyId
              },{transaction:tscn});
                  
              // let htmlFilePath:string = path.join(__dirname,'..','emails','user-work-from-home-registration-template.html');
          
              // let htmlContent = pug.renderFile(htmlFilePath,{
              //     userFullName:employeeData.name,
              //     employeeID:employeeData.employeeId,
              //     passwordLink:`${process.env.FRONTEND_ONETIMEPASSGENRATE_URL}/login?token=${token}`,
              //     userEmail:employeeData.email.toLowerCase(),
              //     teamName:process.env.PROJECT_SUPPORT_EMAIL
              // });
              let htmlFilePath:string = path.join(__dirname,'..','emails','user-registration-template.html');
          
              let htmlContent = pug.renderFile(htmlFilePath,{
                  userFullName:employeeData.name,
                  compName:req.companyName,
                  employeeID: employeeData.employeeId,
                  userPassword:randomPassword,
                  userEmail: employeeData.email.toLowerCase(),
                  teamName:process.env.PROJECT_SUPPORT_EMAIL
              });
              
              insertSucceedRecord.push({record:employeeData});
            
              new SMTP.SmtpService().sendMail(employeeData.email.toLowerCase(),htmlContent,"Time Tango | User Registration");
              // if(!mailSend){
              //     status = 500;
              //     throw new Error("Mail send failed!");
              // }
          }
          else if(employeeData.workMode.toLowerCase() === "hybrid"){
              // let token = jwt.sign({email:employeeData.email.trim().toLowerCase(),employeeId:employeeData.employeeId,companyId: req.companyId},process.env.TOKEN_JWT_KEY as string);
              const randomPassword = generatePassword();
              const hashedPassword = await bcrypt.hash(randomPassword,12);
              let userResult:any = await UserTableModel.create({
                  email:employeeData.email.trim().toLowerCase(),
                  company_id:req.companyId,
                  password:hashedPassword,
                  work_mode:employeeData.workMode.toLowerCase(),
                  is_deleted:false,
                  is_active:true,
                  role_id:roleResult ? roleResult.id : null,
                  // login_token:token,
                  created_at:moment().utc().toISOString(),
                  created_by: req.keyId
              },{raw:true,transaction:tscn});

              //inserting employee data
              await EmployeeTableModel.create({
                  emp_id:employeeData.employeeId,
                  first_name:employeeData.name,
                  company_id:req.companyId,
                  user_id:userResult.id,
                  is_deleted:false,
                  created_at:moment().utc().toISOString(),
                  created_by: req.keyId
              },{transaction:tscn});
                  
              // let htmlFilePath:string = path.join(__dirname,'..','emails','user-work-from-home-registration-template.html');
          
              // let htmlContent = pug.renderFile(htmlFilePath,{
              //     userFullName:employeeData.name,
              //     employeeID:employeeData.employeeId,
              //     passwordLink:`${process.env.FRONTEND_ONETIMEPASSGENRATE_URL}/login?token=${token}`,
              //     userEmail:employeeData.email.toLowerCase(),
              //     teamName:process.env.PROJECT_SUPPORT_EMAIL
              // });

              let htmlFilePath:string = path.join(__dirname,'..','emails','user-registration-template.html');
          
              let htmlContent = pug.renderFile(htmlFilePath,{
                  userFullName:employeeData.name,
                  compName:req.companyName,
                  employeeID: employeeData.employeeId,
                  userPassword:randomPassword,
                  userEmail: employeeData.email.toLowerCase(),
                  teamName:process.env.PROJECT_SUPPORT_EMAIL
              });

              insertSucceedRecord.push({record:employeeData});
      
              new SMTP.SmtpService().sendMail(employeeData.email.toLowerCase(),htmlContent,"Time Tango | User Registration");
              // if(!mailSend){
              //     status = 500;
              //     throw new Error("Mail send failed!");
              // }
          }
          else{
              continue;
          }
       
      }

      //count the distinct index in insertFailsRecord
      const uniqueIndices = new Set<number>();
      let distinctCount = 0;

      for (const record of insertFailsRecord) {
        if (!uniqueIndices.has(record.index)) {
          uniqueIndices.add(record.index);
          distinctCount++;
        }
      }

      //inserting data into history table
      await HistoryTableModel.create({
          file_name:fileName,
          action_table:"user_table",
          inserted_data:insertSucceedRecord,
          failed_data:insertFailsRecord,
          succeed_count:insertSucceedRecord.length,
          failed_count:distinctCount,
          failed_message_data:insertFailsRecordErrorMessage,
          action_type:"bulk-insert",
          company_id:req.companyId,
          created_at:moment().utc().toISOString(),
          created_by: req.keyId
      },{transaction:tscn});
        
      
      await tscn.commit();
      return res.status(status).json({
          status:"success",
          message:insertSucceedRecord.length > 0 ? "Employee data inserted successfully!" : "No employee data inserted!",
          errorRecord:{
              succeedRecord:insertSucceedRecord.length,
              failedRecord:distinctCount,
              insertFailsRecord:insertFailsRecord,
              insertFailsRecordErrorMessage:insertFailsRecordErrorMessage,
              // duplicateRecord:duplicateRecord
          }      
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

const createUserEmployee = async (req: UserRequest, res: any, next: any) => {
  const tscn = await sequelize.transaction();
  try {
    const {workMode,name,employeeId,email} = req.body;

    if (
      validator.isEmpty(workMode.trim()) ||
      !["hybrid", "wfh", "office"].includes(workMode.toLowerCase()) ||
      validator.isEmpty(name) ||
      validator.isEmpty(employeeId) ||
      validator.isEmpty(email) ||
      !validator.isEmail(email.trim().toLowerCase())
    ) {
      throw new Error(`Invalid employee data!`);
    }

    // check if email is already registered
    const isEmailExist: any = await UserTableModel.findOne({
      where: {[Op.or]:[{
          email: email.trim().toLowerCase(),
        is_deleted: false,
        is_active: true,
        company_id: req.companyId,
      },
      {
        email: email.trim().toLowerCase(),
        is_deleted: false,
        is_active: false,
        company_id: req.companyId,
      }]
      },
      raw: true,
    });
    if (isEmailExist) {
      throw new Error("Email already registered!");
    }

    // check if employee id is already registered
    const isEmployeeIdExist: any = await EmployeeTableModel.findOne({
      where: {[Op.or]:[
        {
        emp_id: employeeId,
        is_deleted: false,
        is_active: true,
        company_id: req.companyId,
      },{
        emp_id: employeeId,
        is_deleted: false,
        is_active: false,
        company_id: req.companyId,
      }]},
      raw: true,
    });
    if (isEmployeeIdExist) {
      throw new Error("Employee id already registered!");
    }

    //check if email is exist in other company
    const isEmailExistInOtherCompany: any = await UserTableModel.findOne({
      where: {
        email: email.trim().toLowerCase(),
        is_deleted: false,
        company_id: { [Op.not]: req.companyId },
      },
      raw: true,
    });
    if (isEmailExistInOtherCompany) {
      throw new Error("Email already registered in other company!");
    }

    let userResult: any = null;
    if (workMode.toLowerCase() === "office") {
      //find the role 
      const roleResult:any = await RoleTableModel.findOne({where:{role_name:'EMPLOYEE',is_deleted:false},attributes:["id"],raw:true});

      userResult = await UserTableModel.create(
        {
          email: email.trim().toLowerCase(),
          company_id: req.companyId,
          work_mode: workMode.toLowerCase(),
          is_deleted: false,
          is_active: true,
          role_id: roleResult ? roleResult.id : null,
          created_at: moment().utc().toISOString(),
          created_by: req.keyId,
        },
        { raw: true, transaction: tscn }
      );

      await EmployeeTableModel.create(
        {
          emp_id: employeeId,
          first_name: name,
          company_id: req.companyId,
          user_id: userResult.id,
          is_deleted: false,
          created_at: moment().utc().toISOString(),
          created_by: req.keyId,
        },
        { transaction: tscn }
      );

      let htmlFilePath: string = path.join(
        __dirname,
        "..",
        "emails",
        "user-work-from-office-registration-template.html"
      );

      let htmlContent = pug.renderFile(htmlFilePath, {
        userFullName: name,
        compName:req.companyName,
        employeeID: employeeId,
        userEmail: email.toLowerCase(),
        teamName: process.env.PROJECT_SUPPORT_EMAIL,
      });

      new SMTP.SmtpService().sendMail(
        email.toLowerCase(),
        htmlContent,
        "Time Tango | User Registration"
      );
      // if (!mailSend) {
      //   throw new Error("Mail send failed!");
      // }

      await tscn.commit();
    } else if (workMode.toLowerCase() === "wfh") {
      //create a login token with jwt
      let token = jwt.sign(
        {
          email: email.trim().toLowerCase(),
          employeeId: employeeId,
          companyId: req.companyId,
        },
        process.env.TOKEN_JWT_KEY as string
      );

      const randomPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(randomPassword,12);
     //find the role 
     const roleResult:any = await RoleTableModel.findOne({where:{role_name:'EMPLOYEE',is_deleted:false},attributes:["id"],raw:true});

      userResult = await UserTableModel.create(
        {
          email: email.trim().toLowerCase(),
          password:hashedPassword,
          company_id: req.companyId,
          work_mode: workMode.toLowerCase(),
          is_deleted: false,
          is_active: true,
          role_id: roleResult ? roleResult.id : null,
          // login_token: token,
          created_at: moment().utc().toISOString(),
          created_by: req.keyId,
        },
        { raw: true, transaction: tscn }
      );

      await EmployeeTableModel.create(
        {
          emp_id: employeeId,
          first_name: name,
          company_id: req.companyId,
          user_id: userResult.id,
          is_deleted: false,
          created_at: moment().utc().toISOString(),
          created_by: req.keyId,
        },
        { transaction: tscn }
      );

      // let htmlFilePath: string = path.join(
      //   __dirname,
      //   "..",
      //   "emails",
      //   "user-work-from-home-registration-template.html"
      // );

      // let htmlContent = pug.renderFile(htmlFilePath, {
      //   userFullName: name,
      //   employeeID: employeeId,
      //   passwordLink: `${process.env.FRONTEND_ONETIMEPASSGENRATE_URL}/login?token=${token}`,
      //   userEmail: email.toLowerCase(),
      //   teamName: process.env.PROJECT_SUPPORT_EMAIL,
      // });

      let htmlFilePath:string = path.join(__dirname,'..','emails','user-registration-template.html');
            
        let htmlContent = pug.renderFile(htmlFilePath,{
            userFullName:name,
            employeeID: employeeId,
            userPassword:randomPassword,
            compName: req.companyName,
            workMode:workMode.toLowerCase(),
            userEmail: email.toLowerCase(),
            teamName:process.env.PROJECT_SUPPORT_EMAIL
        });

       new SMTP.SmtpService().sendMail(
        email.toLowerCase(),
        htmlContent,
        "Time Tango | User Registration"
      );
      // if (!mailSend) {
      //   throw new Error("Mail send failed!");
      // }
      await tscn.commit();
    } else if (workMode.toLowerCase() === "hybrid") {
      
      const randomPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(randomPassword,12);
      //find the role 
      const roleResult:any = await RoleTableModel.findOne({where:{role_name:'EMPLOYEE',is_deleted:false},attributes:["id"],raw:true});

      userResult = await UserTableModel.create(
        {
          email: email.trim().toLowerCase(),
          password:hashedPassword,
          company_id: req.companyId,
          work_mode: workMode.toLowerCase(),
          is_deleted: false,
          is_active: true,
          role_id: roleResult ? roleResult.id : null,
          created_at: moment().utc().toISOString(),
          created_by: req.keyId,
        },
        { raw: true, transaction: tscn }
      );

      await EmployeeTableModel.create(
        {
          emp_id: employeeId,
          first_name: name,
          company_id: req.companyId,
          user_id: userResult.id,
          is_deleted: false,
          created_at: moment().utc().toISOString(),
          created_by: req.keyId,
        },
        { transaction: tscn }
      );

      // let htmlFilePath: string = path.join(
      //   __dirname,
      //   "..",
      //   "emails",
      //   "user-work-from-home-registration-template.html"
      // );

      // let htmlContent = pug.renderFile(htmlFilePath, {
      //   userFullName: name,
      //   employeeID: employeeId,
      //   passwordLink: `${process.env.FRONTEND_ONETIMEPASSGENRATE_URL}/login?token=${token}`,
      //   userEmail: email.toLowerCase(),
      //   teamName: process.env.PROJECT_SUPPORT_EMAIL,
      // });

      let htmlFilePath:string = path.join(__dirname,'..','emails','user-registration-template.html');
            
      let htmlContent = pug.renderFile(htmlFilePath,{
          userFullName:name,
          compName: req.companyName,
          employeeID: employeeId,
          userPassword:randomPassword,
          userEmail: email.toLowerCase(),
          workMode:workMode.toLowerCase(),
          teamName:process.env.PROJECT_SUPPORT_EMAIL
      });


      new SMTP.SmtpService().sendMail(email.toLowerCase(),
        htmlContent,
        "Time Tango | User Registration"
      );
      // if (!mailSend) {
      //   throw new Error("Mail send failed!");
      // }

      await tscn.commit();
    } else {
      throw new Error("Invalid work mode!");
    }

    return res.status(200).json({
      status: "success",
      message: "Employee register successfully!"
    });
  } catch (error: any) {
    //rollback the transaction
    await tscn.rollback();
    console.log(`error: ${error}`);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


const editUser = async (req:UserRequest,res:any,next:any) => {
    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{
        let userData:UserEditData = req.body;
        if(!userData || userData == null || userData == undefined  || validator.isEmpty(userData.userEmail) || validator.isEmpty(userData.userName) || validator.isEmpty(userData.roleId) || validator.isEmpty(userData.departmentId) || validator.isEmpty(userData.designationId)){
            status = 400;
            throw new Error("Invalid Input!");
        }

        step = 2;
        //check if user exists
        let isUserExist = await UserTableModel.findOne({where:{id:userData.userId,is_deleted:false},raw:true});
        if(!isUserExist || isUserExist == null || isUserExist == undefined){
            status = 404;
            throw new Error("User does not exist!");
        }

        step = 3;
        //check if employee exists
        let isEmployeeExist = await EmployeeTableModel.findOne({where:{user_id:userData.userId,is_deleted:false},raw:true});
        if(!isEmployeeExist || isEmployeeExist == null || isEmployeeExist == undefined){
            status = 404;
            throw new Error("Employee does not exist!");
        }

        step = 4;
        //check if role exists
        let isRoleExist = await RoleTableModel.findOne({where:{id:userData.roleId,is_deleted:false},raw:true});
        if(!isRoleExist || isRoleExist == null || isRoleExist == undefined){
            status = 404;
            throw new Error("Role does not exist!");
        }


        step = 7;
        //create new password
        // const randomPassword = generatePassword();

        step = 8;
        //creat new user
        // const hashedPassword = await bcrypt.hash(randomPassword,12);
        let userUpdateResult = await UserTableModel.update({
            email:userData.userEmail.toLowerCase(),
            username:userData.userName,
            // password:hashedPassword,
            role_id:userData.roleId,
            department_id:userData.departmentId,
            designation_id:userData.designationId,
            is_deleted:false,
            is_active:userData.isActive,
            updated_at :moment().utc().toISOString(),
            updated_by: req.keyId
        },{where:{id:userData.userId,is_deleted:false},transaction:tscn});

        step = 9;
        //check if user updated
        if (!('0' in userUpdateResult) || userUpdateResult['0'] == null || userUpdateResult['0'] == undefined || userUpdateResult['0'] == 0) {
            status = 500;
            throw new Error("User updation failed");
        }

        step = 10;
        //update employee
        let employeeUpdateResult = await EmployeeTableModel.update({
            department_id:userData.departmentId,
            designation_id:userData.designationId,
            updated_at :moment().utc().toISOString(),
            updated_by: req.keyId
        },{where:{user_id:userData.userId},transaction:tscn});

        step = 11;
        //check if employee updated
        if (!('0' in employeeUpdateResult) || employeeUpdateResult['0'] == null || employeeUpdateResult['0'] == undefined || employeeUpdateResult['0'] == 0) {
            status = 500;
            throw new Error("Employee updation failed");
        }

        step = 11.5;
        //get employee data
        let employeeData:any = await EmployeeTableModel.findOne({where:{user_id:userData.userId,is_deleted:false},raw:true});
        if(!employeeData || employeeData == null || employeeData == undefined){
            status = 404;
            throw new Error("Employee data not found!");
        }

        step = 12;
        let htmlFilePath:string = path.join(__dirname,'..','emails','user-registration-template.html');
        //send mail
        let htmlContent = pug.renderFile(htmlFilePath,{
            userFullName:employeeData.first_name,
            company_id:req.companyId,
            employeeID:employeeData.emp_id,
            userEmail:userData.userEmail.toLowerCase(),
            // userPassword:randomPassword,
            userName:userData.userName,
            expiryTime:moment().add(10,'m').utc().toISOString(),
            teamName:process.env.PROJECT_SUPPORT_EMAIL
        });

        await tscn.commit();

        new SMTP.SmtpService().sendMail(userData.userEmail.toLowerCase(),htmlContent,"Time Tango | User Updated Registration");
        // if(!mailSend){
        //     status = 500;
        //     throw new Error("Mail send failed!");
        // }

        return res.status(status).json({
            status:"success",
            message:"User updated successfully!"
        });

    }
    catch(error:any){
        await tscn.rollback();
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
}

const deleteUser = async (req:UserRequest,res:any,next:any) => {
    let status = 200,step = 1;

  const tscn = await sequelize.transaction();
  try {
    const userId = req.params.userId;

    step = 2;
    // check if user exists
    const user = await UserTableModel.findOne({
      where: { id: userId, is_deleted: false },
    });
    if (!user) {
      status = 404;
      throw new Error("User does not exist!");
    }

    step = 3;
    // delete user
    const userDeleteResult = await UserTableModel.update(
      { is_deleted: true },
      { where: { id: userId }, transaction: tscn }
    );

    // check if user deleted
    if (
      !("0" in userDeleteResult) ||
      userDeleteResult["0"] == null ||
      userDeleteResult["0"] == undefined ||
      userDeleteResult["0"] == 0
    ) {
      status = 500;
      throw new Error("User deletion failed");
    }

    step = 4;
    // delete employee
    const employeeDeleteResult = await EmployeeTableModel.update(
      { is_deleted: true },
      { where: { user_id: userId }, transaction: tscn }
    );

    // check if employee deleted
    if (
      !("0" in employeeDeleteResult) ||
      employeeDeleteResult["0"] == null ||
      employeeDeleteResult["0"] == undefined ||
      employeeDeleteResult["0"] == 0
    ) {
      status = 500;
      throw new Error("Employee deletion failed");
    }

    await tscn.commit();

    return res.status(status).json({
      status: "success",
      message: "User deleted successfully!",
    });

  } catch (error: any) {
    await tscn.rollback();
    console.log(`error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message,
    });
  }
}

const userSignIn = async (req:any,res:any,next:any) => {

    let status = 200, step = 1;
    try{

        let userLoginData:UserLoginData = req.body;
        if(!userLoginData || userLoginData == null || userLoginData == undefined || validator.isEmpty(userLoginData.userId) || !validator.isLength(userLoginData.userPassword,{min:8,max:20})){
            status = 400;
            throw new Error("Invalid Input!");
        }

        //check if user exists
        step = 2;
        let getUserData:any = await UserTableModel.findOne({
          where:{email:userLoginData.userId.toLowerCase(),
            is_deleted:false,is_active:true},raw:true,
            attributes:[["email","userEmail"],["username","userName"],["password","userPassword"],["id","userId"],["is_active","isActive"],["company_id","companyId"],["role_id","roleId"],["department_id","departmentId"],["designation_id","designationId"],["work_mode","workMode"]],
            include:[{
            model: DepartmentTableModel,
            attributes: [["id", "departmentId"], ["department_name", "departmentName"]],
        },
        {
            model: DesignationTableModel,
            attributes: [["id", "designationId"], ["designation_name", "designationName"]],
        },
        {
          model:RoleTableModel,
          attributes:[["id","roleId"],["role_name","roleName"],["role_value","roleValue"]]
        }
      ]});
    
        if(!getUserData || getUserData == null || getUserData == undefined){
            status = 404;
            throw new Error("User does not exist!");
        }
        //arrenging the data
        getUserData["department"] = {id:getUserData["department_table.departmentId"],name:getUserData["department_table.departmentName"]};
        getUserData["designation"] = {id:getUserData["designation_table.designationId"],name:getUserData["designation_table.designationName"]};
        delete getUserData["department_table.departmentId"];
        delete getUserData["department_table.departmentName"];
        delete getUserData["designation_table.designationId"];
        delete getUserData["designation_table.designationName"];

        if(getUserData.workMode.toLowerCase() == "office" && getUserData["role_table.roleName"] == "EMPLOYEE"){
          status = 500;
          throw new Error("You don't have login credential!");
          }

        //check if password is correct
        step = 3;
        const isPasswordCorrect = await bcrypt.compare(userLoginData.userPassword,getUserData.userPassword);
        if(!isPasswordCorrect){
            status = 401;
            throw new Error("Invalid credentials!");
        }

        //check if company exists
        step = 4;
        const isCompanyExist:any = await CompanyTableModel.findOne({where:{id:getUserData.companyId,is_deleted:false},raw:true});
        if(!isCompanyExist || isCompanyExist == null || isCompanyExist == undefined){
            status = 404;
            throw new Error("Company does not exist!");
        }
        if(!isCompanyExist.is_active){
          status = 503;
          throw new Error("The application service is being stopped for your organization!\nPlease contact your organization's administrator for more information.");
        }

        //check if role exists
        step = 5;
        const isRoleExist:any = await RoleTableModel.findOne({where:{id:getUserData.roleId,is_deleted:false},raw:true});
        if(!isRoleExist || isRoleExist == null || isRoleExist == undefined){
            status = 404;
            throw new Error("Role does not exist!");
        }

        //check if employee exists
        step = 6;
        const isEmployeeExist:any = await EmployeeTableModel.findOne({where:{user_id:getUserData.userId,is_deleted:false,is_active:true},raw:true,attributes:[['id','employeeId'],["emp_id","empId"],["first_name","firstName"],["date_of_birth","dateOfBirth"],["joining_date","joiningDate"],["personal_email","personalEmail"],["mobile","mobile"],["current_address","currentAddress"],["permanent_address","permanentAddress"],["emergency_contact","emergencyContact"],["is_active","isActive"],["both_address_same","bothAddressSame"],["company_id","companyId"]]});
        if(!isEmployeeExist || isEmployeeExist == null || isEmployeeExist == undefined){
            status = 404;
            throw new Error("Employee does not exist!");
        }

        //generate token
        step = 7;
        const jwtToken:string = jwt.sign({employeeId:isEmployeeExist.employeeId,companyId:getUserData.companyId,emailId:getUserData.userEmail,name:getUserData.userName,sKey:getUserData.userId,roleKey:getUserData.roleId,tokenTime:moment().add(1,'days').utc().toISOString()},process.env.JWT_TOKEN_KEY as string,{expiresIn:"1d"});         
        if(!jwtToken || jwtToken == null || jwtToken == undefined){
            status = 500;
            throw new Error("Token generation failed!");
        }

        /**
         * @pending
         * @todo
         * update last login time
         */

        isEmployeeExist["companyName"] = isCompanyExist.company_name;
        let responseData:LoginResponse = {
          userName:getUserData.userName,
          userEmail:getUserData.userEmail,
          employeeId:getUserData.emp_id,
          tokenData:jwtToken,
          employeeData:isEmployeeExist,
        }

        step = 8;
        //look for the user's role
        const roleData: any = await RoleTableModel.findOne({
            where: { id: getUserData.roleId, is_deleted: false },
            raw: true,
            attributes: [['id','roleId'], 'role_name', 'role_value', 'privileges']
          });
      
          if (!roleData || roleData == null || roleData == undefined) {
            status = 404;
            throw new Error("Role not found!");
          }
          
          step = 9;
          //sorted the role's privilege data uniquely
          const result: any = Object.values(roleData["privileges"].reduce((acc: {}, { resourceId, actionId }: any) => {
            if (acc[resourceId]) {
              acc[resourceId].actions.push(actionId);
            } else {
              acc[resourceId] = { resourceId, actions: [actionId] };
            }
            return acc;
          }, {}));
      
          roleData["privileges"] = result;
      
          //formatting the data in readable and understandable way
          for (let j = 0; j < roleData["privileges"].length; j++) {
            const resourceData: any = await ResourceTableModel.findOne({
              where: { id: roleData["privileges"][j]["resourceId"], is_deleted: false },
              raw: true,
              attributes: ['resource_name']
            });
            roleData["privileges"][j]["resourceName"] = resourceData.resource_name;
            for (let k = 0; k < roleData["privileges"][j]["actions"].length; k++) {
              const actionData: any = await ActionTableModel.findOne({
                where: { id: roleData["privileges"][j]["actions"][k], is_deleted: false },
                raw: true,
                attributes: ['action_name']
              });
              roleData["privileges"][j]["actions"][k] = { actionName: actionData.action_name, actionId: roleData["privileges"][j]["actions"][k] };
            }
          }

          const roleInfo = {
            roleId: roleData.roleId,
            roleName: roleData.role_name,
            resourceData:roleData["privileges"]
          }
      
        res.status(status).json({
            status:"success",
            message:"successfully logged in!",
            data:responseData,
            roleData:roleInfo,
            department:getUserData["department"],
            designation:getUserData["designation"]
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

const userForgetPasswordRequest = async (req:any,res:any,next:any) => {
    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{
        const userId:string = req.body.userId;
        if(!userId || userId == null || userId == undefined || validator.isEmpty(userId)){
            status = 400;
            throw new Error("Invalid Input!");
        }

        let streamType:string = [...userId].indexOf('@') > -1 ? "email" : "phone";
        //checking if email or phone number is valid
        if(streamType == "email" && !validator.isEmail(userId)){
            status = 400;
            throw new Error("Invalid Email!");
        }
        if(streamType == "phone" && !validator.isMobilePhone(userId,"en-IN")){
            status = 400;
            throw new Error("Invalid Phone Number!");
        }

        if(streamType == "email"){
            //check if email exists
            step = 2;
            const isEmailExist:any = await UserTableModel.findOne({where:{email:userId.toLowerCase(),is_deleted:false,is_active:true},raw:true});
            if(!isEmailExist || isEmailExist == null || isEmailExist == undefined){
              return res.status(status).json({
                status:"success",
                message:"Otp sent to your email!",
            });
            }

            //generate 6 digit otp
            step = 3;
            const otp:string = Math.floor(100000 + Math.random() * 900000).toString();
            //encripting otp with bcrypt
            const otpHash:string = await bcrypt.hash(otp,12);
            // update otp in the database
            step = 4;
            const updateOtp:any = await UserTableModel.update({temporary_password:otpHash,temporary_password_expiry_date:moment().add(10,'m').utc().toISOString(),updated_at: moment().utc().toISOString(),updated_by:userId},{where:{email:userId.toLowerCase(),is_deleted:false,is_active:true},transaction:tscn});
            if(!('0' in updateOtp) || updateOtp['0'] == null || updateOtp['0'] == undefined || updateOtp['0'] == 0){
                status = 500;
                throw new Error("Otp generate failed!");
            }

            let htmlFilePath:string = path.join(__dirname,'..','emails','login-email-template.html');
            
            let htmlContent = pug.renderFile(htmlFilePath,{
                userOTP:otp,
                userName:isEmailExist.username ? isEmailExist.username : "Employee",
                expiryTime:moment().add(10,'m').format("DD-MM-YYYY HH:mm:ss"),//moment().add(10,'m').utc().toISOString(),//moment().add(10,'m').format("DD-MM-YYYY HH:mm:ss")
                teamName:process.env.PROJECT_SUPPORT_EMAIL
            });

            // let mailSend =
            
             new SMTP.SmtpService().sendMail(isEmailExist.email,htmlContent,"Time Tango | Reset Password OTP");
            // if(!mailSend){
            //     status = 500;
            //     throw new Error("Mail send failed!");
            // }

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

const userValidatePasswordRequest = async (req:any,res:any,next:any) => {

    let step = 1, status = 200;
    try{

        //get the opt from the request body
        // let {otp,userId} = req.body;
        let otp:string = req.body.otp;
        let userId:string = req.body.userId;
        if(!otp || otp == null || otp == undefined || validator.isEmpty(otp) || !validator.isNumeric(otp) || otp.length != 6 || !userId || userId == null || userId == undefined || validator.isEmpty(userId)){
            status = 400;
            throw new Error("Invalid user or password!");
        }

        //check is user exists and active
        step = 2;
        let getUserData:any = await UserTableModel.findOne({where:{email:userId.trim().toLowerCase(),[Op.and]:[{is_deleted:false,is_active:true}]},raw:true,attributes:[["email","userEmail"],["username","userName"],["password","userPassword"],["id","userId"],["is_active","isActive"],["company_id","companyId"],["role_id","roleId"],["department_id","departmentId"],["designation_id","designationId"],["temporary_password","temporaryPassword"],["temporary_password_expiry_date","temporaryPasswordExpiry"],["work_mode","workMode"]]});
        if(!getUserData || getUserData == null || getUserData == undefined){
            status = 401;
            throw new Error("Invalid credentials!");
        }

        if(getUserData.workMode.toLowerCase() == "office" && getUserData["role_table.role_name"] == "EMPLOYEE"){
          status = 500;
          throw new Error("You don't have login credential!");
        }


        //check if otp is valid
        step = 3;
        const isOtpValid:boolean = await bcrypt.compare(otp,getUserData.temporaryPassword as string);
        if(!isOtpValid){
            status = 400;
            throw new Error("Invalid OTP!");
        }

        //check if otp is expired
        step = 4;
        const isOtpExpired:boolean = moment().isAfter(moment(getUserData.temporaryPasswordExpiry).utc().toISOString());
        if(isOtpExpired){
            status = 400;
            throw new Error("OTP expired!");
        }

        //generate jwt token
        step = 5;
        const jwtToken:string = jwt.sign({userId:getUserData.userId,companyId:getUserData.companyId,roleId:getUserData.roleId,departmentId:getUserData.departmentId,designationId:getUserData.designationId,tokenTime:moment().add(5,'m').utc().toISOString()},process.env.JWT_TOKEN_KEY as string);
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

const userResetPasswordRequest = async (req:any,res:any,next:any) => {

    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{

        //get token value from the request body
        const {userToken,password,comPassword} = req.body;
        if(!userToken || userToken == null || userToken == undefined || validator.isEmpty(userToken) || !validator.isJWT(userToken) || !password || password == null || password == undefined || validator.isEmpty(password) || !comPassword || comPassword == null || comPassword == undefined || validator.isEmpty(comPassword)){
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
        const jwtTokenData:any = jwt.verify(userToken,process.env.JWT_TOKEN_KEY as string);
        if(!jwtTokenData || jwtTokenData == null || jwtTokenData == undefined){
            status = 400;
            throw new Error("Invalid input!");
        }

        //check if token is expired
        step = 3;
        const isTokenExpired:boolean = moment().isAfter(moment(jwtTokenData.tokenTime).utc().toISOString());
        if(isTokenExpired){
            status = 400;
            throw new Error("OTP expired, try again!");
        }

        //check if user exists and active
        step = 4;
        let getUserData:any = await UserTableModel.findOne({where:{id:jwtTokenData.userId,is_deleted:false,is_active:true},raw:true,attributes:[["email","userEmail"],["username","userName"],["password","userPassword"],["id","userId"],["is_active","isActive"],["company_id","companyId"],["role_id","roleId"],["department_id","departmentId"],["designation_id","designationId"],["temporary_password","temporaryPassword"],["temporary_password_expiry_date","temporaryPasswordExpiry"]]});
        if(!getUserData || getUserData == null || getUserData == undefined){
            status = 404;
            throw new Error("Invalid credentials!");
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
        const updatePassword:any = await UserTableModel.update({password:hashedPassword,temporaryPassword:null,temporaryPasswordExpiry:null},{where:{id:jwtTokenData.userId},transaction:tscn});// as unknown as [number,UserData[]]
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

const signInUserResetPassword = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();

  try {
    let currentPassword: string = req.body.currentPassword;
    let newPassword: string = req.body.password;
    let confirmPassword: string = req.body.conformPassword;

    if (!currentPassword || validator.isEmpty(currentPassword) ||
        !newPassword || validator.isEmpty(newPassword) ||
        !confirmPassword || validator.isEmpty(confirmPassword)) {
      status = 400;
      throw new Error("Invalid input!");
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      status = 400;
      throw new Error("Password must be same!");
    }

    if (!validator.isLength(newPassword, { min: 8, max: 16 })) {
      status = 400;
      throw new Error("Password must be 8 to 16 characters!");
    }

    // Check if the current password matches the stored password
    step = 2;
    const user:any = await UserTableModel.findOne({
      where: { id: req.keyId, company_id: req.companyId, is_active: true, is_deleted: false },
      attributes: ['password']
    });

    if (!user) {
      status = 404;
      throw new Error("Invalid credentials!");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      status = 400;
      throw new Error("Invalid credentials!");
    }

    // Update the user password
    step = 3;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    if (!hashedPassword) {
      status = 500;
      throw new Error("Password hash failed!");
    }

    const updatePassword: any = await UserTableModel.update(
      { password: hashedPassword, temporaryPassword: null, temporaryPasswordExpiry: null },
      { where: { id: req.keyId, company_id: req.companyId, is_active: true, is_deleted: false }, transaction: tscn }
    );

    if (!('0' in updatePassword) || updatePassword['0'] == 0) {
      status = 500;
      throw new Error("Password updation failed!");
    }

    // Commit the transaction
    await tscn.commit();

    res.status(status).json({
      status: "success",
      message: "Password updated successfully!"
    });
  } catch (error: any) {
    // Rollback the transaction
    await tscn.rollback();

    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
}

const contactUs = async (req: any, res: any, next: any) => {
  let status = 200, step = 1;
  try{
    let contactData:ContactUs = req.body;
    if(!validator.isEmail(contactData.email)){
      //error but still continue that mail has been sent
      return res.status(200).json({
        status:"success",
        message:"mail sent successfully!"
      });
    }
    else{
      let htmlFilePath:string = path.join(__dirname,'..','emails','contact-us-template.html');
      let htmlContent = pug.renderFile(htmlFilePath,{
        name:contactData.name,
        email:contactData.email,
        phone:contactData.phone,
        subject:contactData.subject,
        message:contactData.message,
        teamName:process.env.PROJECT_SUPPORT_EMAIL
      });
      new SMTP.SmtpService().sendMail(process.env.PROJECT_SUPPORT_EMAIL as string ,htmlContent,"Time Tango | Contact Us");
      
      return res.status(status).json({
        status:"success",
        message:"Thank you for contacting us!"
      });
    }
  }
  catch(error:any){
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status:"error",
      message:error.message == "Expected a string but received a undefined" ? "Invalid Input!" : error.message
    });
  }
}


export {contactUs,createUserEmployee,bulkRegisterUserEmployee,signInUserResetPassword, userSignIn,editUser,deleteUser, userForgetPasswordRequest, userValidatePasswordRequest, userResetPasswordRequest};
