
//modules imports below
import validator from "validator";
import bcrypt from 'bcrypt';
import { Op, Sequelize, where } from "sequelize";
import jwt from "jsonwebtoken";
import moment from 'moment';
import { CommonService } from "../services/common.service";
require('dotenv').config();
import path from "path";
import pug from "pug";
import fs from "fs";

//local imports below
import { DesktopEmployeeLoginModel } from "../abstractions/classes/interfaces/desktop-employee-login-model";
import  UserTableModel from "../abstractions/models/user-table-model";
import EmployeeTableModel from "../abstractions/models/employee-table-model";
import CompanyTableModel from "../abstractions/models/company-table-model";
import UserAttendanceTableModel from "../abstractions/models/attendance-table-model";
import RoleTableModel from "../abstractions/models/role-table-model";
import ResourceTableModel from "../abstractions/models/resource-table-model";
import { LoginResponse } from "../abstractions/classes/interfaces/user-login-response-model";
import { CompanyData, configuration } from "../abstractions/classes/interfaces/company-model";

import ActionTableModel from "../abstractions/models/action-table-model";
import * as SMTP from "../services/smtp-mail.service";
import { DesktopEmployeeAttendanceData } from "../abstractions/classes/interfaces/desktop-employee-attendance-model";

import { EmployeeData } from "../abstractions/classes/interfaces/employee-model";
import sequelize from "../utilities/database-connect";
import sharp from "sharp";
import AttendanceTableModel from "../abstractions/models/attendance-table-model";
import EmployeeDeviceModel from "../abstractions/models/employee-device-model";

const desktopEmployeeSignIn = async (req:any,res:any,next:any) => {
  let status = 200, step = 1;
  try{
    const tscn = await sequelize.transaction();

      let DesktopEmployeeLoginModel:DesktopEmployeeLoginModel = req.body;
      if(!DesktopEmployeeLoginModel || DesktopEmployeeLoginModel == null || DesktopEmployeeLoginModel == undefined || validator.isEmpty(DesktopEmployeeLoginModel.userId) || validator.isEmpty(DesktopEmployeeLoginModel.userPassword) || validator.isEmpty(DesktopEmployeeLoginModel.deviceId)){
          status = 401;
          throw new Error("Invalid Credentials");
      }

      //check if user exists
      step = 2;
      let getUserData:any = await UserTableModel.findOne({
          where:{
            email:DesktopEmployeeLoginModel.userId.toLowerCase(),
            [Op.and]:[
              {
                is_deleted:false,
                is_active:true
              }]
          },
          raw:true,
          attributes:[
            ["email","userEmail"],
            ["password","userPassword"],
            ["id","userId"],
            ["is_active","isActive"],
            ["company_id","companyId"],
            ["role_id","roleId"],
            ["work_mode","workMode"]
          
          ]
        });
  
      if(!getUserData || getUserData == null || getUserData == undefined){
          status = 401;
          throw new Error("Invalid Credentials");
      }

      //check if password is correct
      step = 3;
      const isPasswordCorrect = await bcrypt.compare(DesktopEmployeeLoginModel.userPassword,getUserData.userPassword);
      if(!isPasswordCorrect){
          status = 401;
          throw new Error("Invalid credentials!");
      }

      //check if company exists
      step = 4;
      const isCompanyExist:any = await CompanyTableModel.findOne({
        where:{
          id:getUserData.companyId,
          is_deleted:false
        },
        raw:true
      });

      if(!isCompanyExist || isCompanyExist == null || isCompanyExist == undefined){
          status = 404;
          throw new Error("Company does not exist!");
      }

      if(isCompanyExist.is_active == false){
          status = 403;
          throw new Error("Company is not active!");
      }
          
      //check if employee exists
      step = 5;
      const employeeData:any = await EmployeeTableModel.findOne({
        where:{
          user_id:getUserData.userId,
          is_deleted:false,
          is_active:true
        },
        raw:true,
        attributes:[
          ["emp_id","empId"],
          ["first_name","firstName"],
          ["company_id","companyId"]
        ]
      });

      if(!employeeData || employeeData == null || employeeData == undefined){
          status = 404;
          throw new Error("Employee does not exist!");
      }

      //check if employee has authentication to login with desktop application
      step = 6;
      if(getUserData.workMode == 'office'){
        status = 401;
        throw new Error("You don't have authentication to login with desktop application.");
      }

      //check if user has already registered with device
      step = 7;
      let isUserExistWithDeviceId:any = await EmployeeDeviceModel.findOne({
        where:{ 
          user_id:getUserData.userId,
          device_id:{
            [Op.ne]:DesktopEmployeeLoginModel.deviceId
          },
          is_verified:true,
          is_deleted:false,

        },
        raw:true,
      })

      if(isUserExistWithDeviceId){
        status = 401;
        throw new Error("You have already registered with another device. Please check with admin for reset device authentication");
      }

      //check if already registered device id
      let isExistsDeviceId:any = await EmployeeDeviceModel.findAll({
        where:{
          device_id:DesktopEmployeeLoginModel.deviceId,
          is_verified:true,
          is_deleted:false,
          [Op.not]:{
            user_id:getUserData.userId
          }
        },
        raw:true,
      })

      if(isExistsDeviceId && isExistsDeviceId.length > 0 && isExistsDeviceId != null && isExistsDeviceId != undefined){
        status = 401;
        throw new Error("Device already registered with another user. Please check with admin.");
      }

      //check if already registered device id
      let isRequested:any = await EmployeeDeviceModel.findAll({
        where:{
          device_id:DesktopEmployeeLoginModel.deviceId,
          is_verified:false,
          is_deleted:false,
          user_id:getUserData.userId
          // user_id:getUserData.userId
        },
        raw:true,
      })

      if(isRequested && isRequested.length > 0 && isRequested != null && isRequested != undefined){
        status = 409;
        throw new Error("Device already requested! Please wait to confirmation from admin.");
      }

      //check if user device is verified
      let isRequestedVarified:any = await EmployeeDeviceModel.findOne({
        where:{
          device_id:DesktopEmployeeLoginModel.deviceId,
          is_verified:true,
          is_deleted:false,
          user_id:getUserData.userId
        },
        raw:true,
      })
      //if user's device verified, then generate token and send response
      if(isRequestedVarified && isRequestedVarified != null && isRequestedVarified != undefined){
        if(isRequestedVarified.device_id == DesktopEmployeeLoginModel.deviceId){
          if(isRequestedVarified.is_verified == true){
            //generate token
            step = 12;
            const jwtToken:string = jwt.sign({
                deviceEntryId:isRequestedVarified.id,
                companyId:getUserData.companyId,
                emailId:getUserData.userEmail,
                name:getUserData.userName,
                sKey:getUserData.userId,
                roleKey:getUserData.roleId,
                workMode:getUserData.workMode,
                deviceId:isRequestedVarified.device_id,
                tokenTime:moment().add(1,'days').utc().toISOString()
              },
              process.env.JWT_TOKEN_KEY as string,
              {expiresIn:"1d"}
            );

            if(!jwtToken || jwtToken == null || jwtToken == undefined){
                status = 500;
                throw new Error("Token generation failed!");
            }

            /**
             * @pending
             * @todo
             * update last login time
             */
            step = 13;
            employeeData["companyName"] = isCompanyExist.company_name;
            let responseData:LoginResponse = {
              userName:getUserData.userName,
              userEmail:getUserData.userEmail,
              employeeId:employeeData.empId,
              tokenData:jwtToken,
              employeeData:employeeData
            }
            step = 14;
            //look for the user's role
            const roleData: any = await RoleTableModel.findOne({
              where: { id: getUserData.roleId, is_deleted: false },
              raw: true,
              attributes: [['id','roleId'], 'role_name', 'role_value', 'privileges']
            });
          
            if (!roleData || roleData == null || roleData == undefined){
              status = 404;
              throw new Error("Role not found!");
            }
            step = 15;
            //sorted the role's privilege data uniquely
            const result: any = Object.values(roleData["privileges"].reduce((acc: {}, { resourceId, actionId }: any) => {
                if (acc[resourceId]){
                  acc[resourceId].actions.push(actionId);
                } else {
                  acc[resourceId] = { resourceId, actions: [actionId] };
                }
                return acc;
              }, 
              {}
            ));
          
            roleData["privileges"] = result;
            step = 16;
            //formatting the data in readable and understandable way
            for (let j = 0; j < roleData["privileges"].length; j++){
              const resourceData: any = await ResourceTableModel.findOne({
                where: { id: roleData["privileges"][j]["resourceId"], is_deleted: false },
                raw: true,
                attributes: ['resource_name']
              });
              roleData["privileges"][j]["resourceName"] = resourceData.resource_name;
              for (let k = 0; k < roleData["privileges"][j]["actions"].length; k++){
                const actionData: any = await ActionTableModel.findOne({
                  where: { id: roleData["privileges"][j]["actions"][k], is_deleted: false},
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

            //commit the transaction
            await tscn.commit();
            step = 17;
            return res.status(status).json({
                status:"success",
                message:"successfully logged in!",
                data:responseData,
                roleData:roleInfo
            });
          } else{
            status = 401;
            throw new Error("Still not verified your device. Please check with admin for vefication of device");
          }
        } else {
          if(isRequestedVarified.is_active == true){
            status = 401;
            throw new Error("You have already logged in other device. Please check with admin for reset device authentication");
          } else {
            status = 208;
            throw new Error("You have already requested for another device. Please check with admin for reset device authentication");
          }
          
        }
      }
      
      if(isRequested.length == 0 && isExistsDeviceId.length == 0){
        //create the user's device entry with required data and let the admin know via email
        await EmployeeDeviceModel.create({
          device_id: DesktopEmployeeLoginModel.deviceId,
          user_id: getUserData.userId,
          manufacturer: DesktopEmployeeLoginModel.manufacturer,
          model: DesktopEmployeeLoginModel.model,
          company_id : getUserData.companyId,
          is_verified: false,
          is_deleted: false,
          created_at: moment().utc().toISOString(),
          created_by: getUserData.userId
        }, {transaction:tscn});
        const superAdminRole:any = await RoleTableModel.findOne({
          where: {
            role_value: 'super-admin',
            is_deleted: false
          },
          raw:true,
          attributes:[
            [sequelize.fn('array_agg', sequelize.col('id')), 'role_ids']
          ]
        });
        // console.log(superAdminRole.role_ids);
        step = 9;
        const superAdminUsers:any = await UserTableModel.findAll({
          where: {
            role_id: {
              [Op.in]: superAdminRole.role_ids          
            },
            company_id: getUserData.companyId,
            is_deleted: false,
            is_active: true
          },
          raw:true,
          attributes: [
            ['email', 'adminEmail']
          ],
          order: [
            ['email', 'ASC']
          ]
        });
        // console.log(superAdminUsers)
        let to:string = '';
        let cc:string[] = [];
        for (let i = 0; i < superAdminUsers.length; i++){
          if(i == 0){
            to = ""+superAdminUsers[i]['adminEmail'];
            // to = "rakesh.ganeshwade@gunadhyasoft.com";
          } else {
            cc.push(superAdminUsers[i]['adminEmail']);
            // cc.push("rakesh.ganeshwade@gmail.com");
          }          
        }
        step = 10;
        let htmlFilePath:string = path.join(__dirname,'..','emails','employee-device-authentication-template.html');
            
        let htmlContent = pug.renderFile(htmlFilePath,{
          userId: DesktopEmployeeLoginModel.userId,
          empId: employeeData.empId,
          deviceId: DesktopEmployeeLoginModel.deviceId,
        });
        
        new SMTP.SmtpService().sendMail("rudresh.sisodiya@gunadhyasoft.com"/**to.toLowerCase() */, htmlContent, "Time Tango | User Device Authentication", ["rudresh.sisodiya@gunadhyasoft.com"] /**cc*/);
        
        //commit the transaction
        await tscn.commit();
        step = 11;
        return res.status(202).json({
          status:"success",
          message:"Authentication request sent to admin. After authentication you are able to login!"
        });
        
      }
    
    }
  catch(error:any){
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
        status:"error",
        message:error.message
    });
  }
}

const getDesktopEmployeeTodaysAttendanceDetails = async (req:DesktopEmployeeAttendanceData,res: any,next:any) => {
  let step = 1, status = 200;
  try {

    let DesktopEmployeeAttendanceData:DesktopEmployeeAttendanceData = req.body;

      if(!req.companyId || req.companyId == null || req.companyId == undefined || validator.isEmpty(req.companyId) || !req.keyId || req.keyId == null || req.keyId == undefined || validator.isEmpty(req.keyId) || !DesktopEmployeeAttendanceData.deviceId || DesktopEmployeeAttendanceData.deviceId == null || DesktopEmployeeAttendanceData.deviceId == undefined || validator.isEmpty(DesktopEmployeeAttendanceData.deviceId)){
          status = 400;
          throw new Error("Invalid Input!");
      }
      
      //check if user exists
      step = 2;
      let getUserData:any = await UserTableModel.findOne({
        where:{
          [Op.and]:[{
            id:req.keyId,
            is_deleted:false,
            is_active:true
          }]
        },
        raw:true,
        attributes:[
          ["email","userEmail"],
          ["username","userName"],
          ["password","userPassword"],
          ["id","userId"],
          ["is_active","isActive"],
          ["company_id","companyId"],
          ["role_id","roleId"],
          ["work_mode","workMode"],
          ["device_id","deviceId"],
          ["is_device_verified","isDeviceVerified"],
        ]
      });
  
      if(!getUserData || getUserData == null || getUserData == undefined){
          status = 404;
          throw new Error("Employee does not exist!");
      }

      //check if employee has authentication to login with desktop application
      step = 3;
      if(getUserData.workMode == 'office'){
        status = 401;
        throw new Error("You don't have authentication to login with desktop application.");
      }

      //check if match device id
      // step = 4;
      // if(getUserData.deviceId != req.tokenDeviceId || DesktopEmployeeAttendanceData.deviceId != getUserData.deviceId){
      //   status = 404;
      //   throw new Error("Your device not registred with us. Please check with admin for reset device authentication");
      // }

      //check if company exists
      step = 5;
      const isCompanyExist:any = await CompanyTableModel.findOne({
        where:{
          id:getUserData.companyId,
          is_deleted:false
        },
        raw:true
      });

      if(!isCompanyExist || isCompanyExist == null || isCompanyExist == undefined){
          status = 404;
          throw new Error("Company does not exist!");
      }

      // Fetch employee details and attendance for today
      step = 6;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysAttendanceData : any = await EmployeeTableModel.findOne({
        where: { 
          user_id: req.keyId, 
          is_active:true 
        },
        attributes: [
          ["emp_id","empId"],
          ['first_name', 'empName']
        ],
        include: [
          {
            model: UserAttendanceTableModel,
            where: {
              date: today,
            },
            required: false,
            attributes: [
              ["id","attendanceId"],
              "date",
              [sequelize.literal('CASE WHEN "check_in_time" IS NULL THEN NULL ELSE "check_in_time" END'), 'checkInTime'],
              ['check_in_path',"checkInImagePath"],
              [sequelize.literal('CASE WHEN "check_out_time" IS NULL THEN NULL ELSE "check_out_time" END'), 'checkOutTime'],
              ['check_out_path',"checkOutImagePath"],
            ],
          },
        ],
         raw: true,
         subQuery: false,
      });

      const attendanceData = {
        empId: todaysAttendanceData["empId"],
        empName: todaysAttendanceData["empName"],
        attendanceId: todaysAttendanceData['attendance_tables.attendanceId']!=null?todaysAttendanceData['attendance_tables.attendanceId']:"",
        date: todaysAttendanceData['attendance_tables.date']!=null?todaysAttendanceData['attendance_tables.date']:"",
        checkInTime: todaysAttendanceData['attendance_tables.checkInTime']!=null?todaysAttendanceData['attendance_tables.checkInTime']:"",
        checkInImagePath: todaysAttendanceData['attendance_tables.checkInImagePath']!=null?todaysAttendanceData['attendance_tables.checkInImagePath']:"",
        checkOutTime: todaysAttendanceData['attendance_tables.checkOutTime']!=null?todaysAttendanceData['attendance_tables.checkOutTime']:"",
        checkOutImagePath: todaysAttendanceData['attendance_tables.checkOutImagePath']!=null?todaysAttendanceData['attendance_tables.checkOutImagePath']:"",
      };

      res.status(status).json({
        status:"success",
        message:"Todays attendance data retrieved successfully",
        data:attendanceData
      });

    } catch(error:any){
      console.log(`step ${step} error: ${error}`);
      return res.status(status === 200 ? 500 : status).json({
          status:"error",
          message:error.message
    });
  }
}

const desktopEmployeeCheckin = async (req: DesktopEmployeeAttendanceData, res: any,next:any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try{
      //getting data from request body
      const attendanceData:DesktopEmployeeAttendanceData = req.body;
      //validating attendance data
      if(validator.isEmpty(attendanceData.deviceId) || attendanceData.deviceId == null || attendanceData.deviceId == undefined){
          status = 400;
          throw new Error("Invalid Input!");
      }

      //checking if checkInLocation is valid
      if(("checkInLocation" in attendanceData)){
        //conver the string to json
        try{
          attendanceData.checkInLocation = JSON.parse(attendanceData.checkInLocation as string);
        }
        catch(error){
          status = 406;
          throw new Error("Invalid JSON for location, please provide latitude, longitude, address");
        }
        
        //check if latitude, longitude, address is provided
        if (!new CommonService().isGPSLocation(attendanceData.checkInLocation)) {
          status = 406;
          throw new Error('Invalid location data, please provide latitude, longitude, address with values');
        }

      }
      // else{
      //     status = 406;
      //     throw new Error("Check in location is not provided!");
      // }

      step = 2;
      //@ts-ignore
      if (!req.isBlob){
          status = 403;
          throw new Error("Invalid input of picture file!")
      }
      //@ts-ignore
      const picturesArray = Array.isArray(req.files.picture) ? req.files.picture.flat() : null;

      //check if user exists
      step = 3;
      let getUserData:any = await UserTableModel.findOne({
        where:{
          [Op.and]:[{
            id:req.keyId,
            is_deleted:false,
            is_active:true
          }]
        },
        include:[
          {
            model:EmployeeTableModel,
            where:{
              company_id:req.companyId,
              is_deleted:false
            },
            attributes:[
              ["id","empId"],
              ["user_id", "userId"],
              ["first_name","firstName"],
              ["middle_name","middleName"],
              ["last_name","lastName"],
              ["date_of_birth","dateOfBirth"],
              ["joining_date","joiningDate"],
              ["personal_email","personalEmail"],
              ["mobile","mobile"],
              ["current_address","currentAddress"],
              ["permanent_address","permanentAddress"],
              ["emergency_contact","emergencyContact"],
              ["is_active","isActive"],
              ["both_address_same","bothAddressSame"],
              ["company_id","companyId"],
              ["department_id","departmentId"],
              ["designation_id","designationId"]
            ]
          }
        ],
        attributes:[
          ["email","userEmail"],
          ["username","userName"],
          ["password","userPassword"],
          ["id","userId"],
          ["is_active","isActive"],
          ["company_id","companyId"],
          ["role_id","roleId"],
          ["work_mode","workMode"],
          ["device_id","deviceId"],
          ["is_device_verified","isDeviceVerified"],
        ],
        raw:true,
      });
  
      if(!getUserData || getUserData == null || getUserData == undefined){
          status = 404;
          throw new Error("Employee does not exist!");
      }

  
      
      step = 8;
      //check if already checked in or not
      const isAlreadyCheckedIn:any = await UserAttendanceTableModel.findOne({
        where:{
          user_id:getUserData["employee_table.userId"],
          is_deleted:false,
          date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')
        },
        attributes:[
          ["date","attendanceDate"]
        ],
        raw:true
      });

      if(isAlreadyCheckedIn != null){
          status = 404;
          throw new Error("Already checked in!");
      }

      step = 9;
      let momentDate:string =  moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
      const imageDir = path.join(__dirname, '..', 'public', 'images',req.companyId,momentDate,req.keyId); // Set the directory to save the image
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true }); // Create the directory if it doesn't exist
      }

      let images: any = [];
      if (picturesArray) {
        for (const picture of picturesArray){
          const pictureName = `${Date.now()}-in-${picture.originalname}`;
          const picturePath = path.join(imageDir, pictureName);
          // await picture.mv(picturePath);
          await fs.promises.writeFile(picturePath, picture.buffer);
          images.push(`/images/${req.companyId}/${momentDate}/${req.keyId}/${pictureName}`);
        }
      }
      attendanceData.picture = images[0];

      step = 10;
      //add attendance data
      await UserAttendanceTableModel.create({
          device_id:attendanceData.deviceId,
          // picutres:images[0],
          check_in_path:attendanceData.picture,
          date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
          check_in_time:moment().format("HH:mm:ss"),
          company_id:req.companyId,
          check_in_location:attendanceData.checkInLocation,
          user_id:getUserData["employee_table.userId"],
          employee_id:getUserData["employee_table.empId"],
          is_deleted:false,
          created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
          created_by: req.keyId
      },
      {
        transaction:tscn
      });

      await tscn.commit();
      
      res.status(status).json({
          status:"success",
          message:"Attendance checked in successfully",
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
};


const desktopEmployeeCheckout = async (req: DesktopEmployeeAttendanceData, res: any,next:any) => {
    
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try{
      //getting data from request body
      const attendanceData:DesktopEmployeeAttendanceData = req.body;
      //validating attendance data
      if(validator.isEmpty(attendanceData.deviceId) || attendanceData.deviceId == null || attendanceData.deviceId == undefined ){
          status = 400;
          throw new Error("Invalid Input of device id!");
      }

       //checking if checkInLocation is valid
       if(("checkOutLocation" in attendanceData)){
        //conver the string to json
        try{
          attendanceData.checkOutLocation = JSON.parse(attendanceData.checkOutLocation as string);
        }
        catch(error){
          status = 406;
          throw new Error("Invalid JSON for location, please provide latitude, longitude, address");
        }
        
        //check if latitude, longitude, address is provided
        if (!new CommonService().isGPSLocation(attendanceData.checkOutLocation)) {
          status = 406;
          throw new Error('Invalid location data, please provide latitude, longitude, address with values');
        }

      }
      // else{
      //     status = 406;
      //     throw new Error("Check out location is not provided!");
      // }

      step = 2;
      //@ts-ignore
      if (!req.isBlob){
          status = 403;
          throw new Error("Invalid input of picture file!")
      }
      //@ts-ignore
      const picturesArray = Array.isArray(req.files.picture) ? req.files.picture.flat() : null;

      //check if user exists
       //check if user exists
       step = 3;
       let getUserData:any = await UserTableModel.findOne({
         where:{
           [Op.and]:[{
             id:req.keyId,
             is_deleted:false,
             is_active:true
           }]
         },
         include:[
           {
             model:EmployeeTableModel,
             where:{
               company_id:req.companyId,
               is_deleted:false
             },
             attributes:[
               ["id","empId"],
               ["user_id", "userId"],
               ["first_name","firstName"],
               ["middle_name","middleName"],
               ["last_name","lastName"],
               ["date_of_birth","dateOfBirth"],
               ["joining_date","joiningDate"],
               ["personal_email","personalEmail"],
               ["mobile","mobile"],
               ["current_address","currentAddress"],
               ["permanent_address","permanentAddress"],
               ["emergency_contact","emergencyContact"],
               ["is_active","isActive"],
               ["both_address_same","bothAddressSame"],
               ["company_id","companyId"],
               ["department_id","departmentId"],
               ["designation_id","designationId"]
             ]
           }
         ],
         attributes:[
           ["email","userEmail"],
           ["username","userName"],
           ["password","userPassword"],
           ["id","userId"],
           ["is_active","isActive"],
           ["company_id","companyId"],
           ["role_id","roleId"],
           ["work_mode","workMode"],
           ["device_id","deviceId"],
           ["is_device_verified","isDeviceVerified"],
         ],
         raw:true,
       });
  
      if(!getUserData || getUserData == null || getUserData == undefined){
          status = 404;
          throw new Error("Employee does not exist!");
      }

      step = 8;
      //check if already checked out or not
      const isAlreadyCheckedIn:any = await UserAttendanceTableModel.findOne({
        where:{
          user_id:getUserData["employee_table.userId"],
          is_deleted:false,
          date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')
        },
        attributes:[
          ["check_out_time","checkOutTime"],
          ["check_in_time","checkInTime"]
        ],
        raw:true
      });

      if(isAlreadyCheckedIn.checkOutTime != null){
          status = 404;
          throw new Error("Already checked out!");
      }

      step = 9;
      let momentDate:string =  moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
      const imageDir = path.join(__dirname, '..', 'public', 'images',req.companyId,momentDate,req.keyId); // Set the directory to save the image
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true }); // Create the directory if it doesn't exist
      }

      let images: any = [];
      if (picturesArray) {
        for (const picture of picturesArray){
          const pictureName = `${Date.now()}-out-${picture.originalname}`;
          const picturePath = path.join(imageDir, pictureName);
          // await picture.mv(picturePath);
          await fs.promises.writeFile(picturePath, picture.buffer);
          images.push(`/images/${req.companyId}/${momentDate}/${req.keyId}/${pictureName}`);
        }
      }
      attendanceData.picture = images[0];
      //calculate the total hour, minutes, seconds 
      let checkInTime:any = moment(isAlreadyCheckedIn.checkInTime, "HH:mm:ss"); // format will be HH:MM:SS
      let checkOutTime:any = moment();
      let duration:any = moment.duration(checkOutTime.diff(checkInTime));
      let hours:any = parseInt(duration.asHours());
      let minutes:any = parseInt(duration.asMinutes()) - hours * 60;
      let seconds:any = parseInt(duration.asSeconds()) - hours * 60 * 60 - minutes * 60;
      // Format the hours, minutes, and seconds variables
      let formattedHours: string = hours.toString().padStart(2, '0');
      let formattedMinutes: string = minutes.toString().padStart(2, '0');
      let formattedSeconds: string = seconds.toString().padStart(2, '0');

      step = 10;
      //update attendance data
      const updateAttendanceData:any = await UserAttendanceTableModel.update({
        check_out_path:images[0],
        total_worked_hours:`${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
        check_out_time:moment().format("HH:mm:ss"),
        check_out_location:attendanceData.checkOutLocation,
        updated_at: moment().utc().toString(),
        updated_by:getUserData["employee_table.userId"]
      },
      {
        where:{
          user_id:getUserData["employee_table.userId"],
          date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
          is_deleted:false
        },
        transaction:tscn
      });

      if(!('0' in updateAttendanceData) || updateAttendanceData['0'] == null || updateAttendanceData['0'] == undefined || updateAttendanceData['0'] == 0){
          status = 500;
          throw new Error("Checkout failed!");
      }

      await tscn.commit();
      res.status(200).json({
          status:"success",
          message:"Attendance checked out successfully",  
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
};


const getDesktopEmployeeAttendanceList = async (req:DesktopEmployeeAttendanceData,res: any,next:any) => {
  let step = 1, status = 200;
  try {

    let DesktopEmployeeAttendanceData:DesktopEmployeeAttendanceData = req.body;

      if(!req.companyId || req.companyId == null || req.companyId == undefined || validator.isEmpty(req.companyId) || !req.keyId || req.keyId == null || req.keyId == undefined || validator.isEmpty(req.keyId) || !DesktopEmployeeAttendanceData.deviceId || DesktopEmployeeAttendanceData.deviceId == null || DesktopEmployeeAttendanceData.deviceId == undefined || validator.isEmpty(DesktopEmployeeAttendanceData.deviceId)){
          status = 400;
          throw new Error("Invalid Input!");
      }
      
      //check if user exists
      step = 2;
      let getUserData:any = await UserTableModel.findOne({
        where:{
          [Op.and]:[{
            id:req.keyId,
            is_deleted:false,
            is_active:true
          }]
        },
        raw:true,
        attributes:[
          ["email","userEmail"],
          ["username","userName"],
          ["password","userPassword"],
          ["id","userId"],
          ["is_active","isActive"],
          ["company_id","companyId"],
          ["role_id","roleId"],
          ["work_mode","workMode"],
          ["device_id","deviceId"],
          ["is_device_verified","isDeviceVerified"],
        ]
      });
  
      if(!getUserData || getUserData == null || getUserData == undefined){
          status = 404;
          throw new Error("Employee does not exist!");
      }

      //check if employee has authentication to login with desktop application
      step = 3;
      if(getUserData.workMode != req.workMode || getUserData.workMode == 'office'){
        status = 404;
        throw new Error("You don't have authentication to login with desktop application.");
      }

      //check if match device id
      // step = 4;
      // if(getUserData.deviceId != req.tokenDeviceId || DesktopEmployeeAttendanceData.deviceId != getUserData.deviceId){
      //   status = 404;
      //   throw new Error("Your device not registred with us. Please check with admin for reset device authentication");
      // }

      //check if company exists
      step = 5;
      const isCompanyExist:any = await CompanyTableModel.findOne({
        where:{
          id:getUserData.companyId,
          is_deleted:false
        },
        raw:true
      });

      if(!isCompanyExist || isCompanyExist == null || isCompanyExist == undefined){
          status = 404;
          throw new Error("Company does not exist!");
      }

      // Fetch employee details and attendance
      step = 6;
      // const today = new Date();
      // today.setHours(0, 0, 0, 0);

      const dsktopEmployeeAttendanceData : any = await EmployeeTableModel.findAll({
        where: { 
          user_id: req.keyId, 
          is_active:true 
        },
        attributes: [
          ["emp_id","empId"],
          ['first_name', 'empName']
        ],
        include: [
          {
            model: UserAttendanceTableModel,
            // where: {
            //   [Op.not] :{
            //     date: today
            //   },
            // },
            required: false,
            attributes: [
              ["id","attendanceId"],
              "date",
              [sequelize.literal('CASE WHEN "check_in_time" IS NULL THEN NULL ELSE "check_in_time" END'), 'checkInTime'],
              ['check_in_path',"checkInImagePath"],
              [sequelize.literal('CASE WHEN "check_out_time" IS NULL THEN NULL ELSE "check_out_time" END'), 'checkOutTime'],
              ['check_out_path',"checkOutImagePath"],
            ],
          },
        ],
        raw: true,
        subQuery: false,
        order: [
          [{ model: UserAttendanceTableModel, as: 'attendance_tables' }, 'date', 'DESC'],
          [{ model: UserAttendanceTableModel, as: 'attendance_tables' }, 'check_in_time', 'DESC'],
          [{ model: UserAttendanceTableModel, as: 'attendance_tables' }, 'check_out_time', 'DESC']
        ]
      
      });


      const attendanceDataLists = 
      await Promise.all(
        dsktopEmployeeAttendanceData.map( async (attendanceData: any) => {
          return {
            empId: attendanceData["empId"],
            empName: attendanceData["empName"],
            attendanceId: attendanceData['attendance_tables.attendanceId']!=null?attendanceData['attendance_tables.attendanceId']:"",
            date: attendanceData['attendance_tables.date']!=null?attendanceData['attendance_tables.date']:"",
            checkInTime: attendanceData['attendance_tables.checkInTime']!=null?attendanceData['attendance_tables.checkInTime']:"",
            checkInImagePath: attendanceData['attendance_tables.checkInImagePath']!=null?attendanceData['attendance_tables.checkInImagePath']:"",
            checkOutTime: attendanceData['attendance_tables.checkOutTime']!=null?attendanceData['attendance_tables.checkOutTime']:"",
            checkOutImagePath: attendanceData['attendance_tables.checkOutImagePath']!=null?attendanceData['attendance_tables.checkOutImagePath']:"",
          };
        })
      );

      res.status(status).json({
        status:"success",
        message:"Attendance data retrieved successfully",
        data:attendanceDataLists
      });

    } catch(error:any){
      console.log(`step ${step} error: ${error}`);
      return res.status(status === 200 ? 500 : status).json({
          status:"error",
          message:error.message
    });
  }
}

const desktopEmployeeDeviceAuthRequests = async (req:any,res: any,next:any) => {
  let step = 1, status = 200;
  try {

    const search = req.query.search ? req.query.search : '';
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get the page size from the query parameters, default to 10
    const offset = (page - 1) * limit; // Calculate the offset

      if(!req.companyId || req.companyId == null || req.companyId == undefined || validator.isEmpty(req.companyId) || !req.keyId || req.keyId == null || req.keyId == undefined || validator.isEmpty(req.keyId)){
          status = 400;
          throw new Error("Invalid Input!");
      }
      
      const newEmployeeAuthRequestList = await EmployeeDeviceModel.findAndCountAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                {
                  device_id: {
                    [Op.iLike]: `%${search}%`,
                  },
                },
                {
                  manufacturer: {
                    [Op.iLike]: `%${search}%`,
                  },
                },
                {
                  model: {
                    [Op.iLike]: `%${search}%`,
                  },
                },
                {
                  "$user_table.employee_table.first_name$": {
                    [Op.iLike]: `%${search}%`,
                  },
                },
                {
                  "$user_table.employee_table.emp_id$": {
                    [Op.iLike]: `%${search}%`,
                  },
                },
              ],
            },
            {is_deleted:false},
            {
              "$user_table.company_id$": `${req.companyId}`,
            },
          ],
        },
        limit,
        offset,
        raw: true,
        attributes: [
          ["id", "requestId"],
          ["device_id", "deviceId"],
          ["is_verified", "isVerified"],
          "manufacturer",
          "model",
        ],
        
        include: [
          {
            model: UserTableModel,
            where: {
              is_deleted: false,
            },
            attributes: ["email", "company_id"],
            include: [
              {
                model: EmployeeTableModel,
                attributes: [
                  ["first_name", "empName"],
                  ["emp_id", "empId"],
                ],
              },
            ],
          },
        ],
      });

      const authRequestData = 
        newEmployeeAuthRequestList.rows.map( (employeeAuthRequest: any) => {
          const {requestId, deviceId, isVerified, manufacturer, model } = employeeAuthRequest;
          return {
            requestId,
            deviceId,
            isVerified,
            manufacturer,
            model,
            empName: employeeAuthRequest['user_table.employee_table.empName'],
            empId: employeeAuthRequest['user_table.employee_table.empId']
          };
        })

      res.status(status).json({
        status:"success",
        message:"Device authentication request retrieved",
        data:authRequestData,
        totalRowCount: newEmployeeAuthRequestList.count,
      });

    } catch(error:any){
      console.log(`step ${step} error: ${error}`);
      return res.status(status === 200 ? 500 : status).json({
          status:"error",
          message:error.message
    });
  }
}

const desktopEmployeeDeviceAuthRequestStatusChange = async (req: DesktopEmployeeAttendanceData, res: any,next:any) => {
    
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try{
      //getting data from request body
      const { requestId, isVerified } = req.body;

      //requestId isn't uuid and isVerified isn't boolean throw error
      if(!validator.isUUID(requestId) || typeof(isVerified) != 'boolean'){
          status = 400;
          throw new Error("please provide valid input for UUID and Boolean!");
      }
      
      //read the request device id on requestId and check if there any active device id then throw error
      const isDeviceExist:any = await EmployeeDeviceModel.findOne({
        where:{

          device_id:{
            [Op.eq]:
           Sequelize.literal(`(SELECT device_id FROM employee_devices WHERE id = '${requestId}')`)
          },
          is_verified:true,
          is_deleted:false,
          company_id : req.companyId
        },
        raw:true,
        attributes:[
          ["device_id","deviceId"]
        ]
      });

      if(isDeviceExist && isVerified){
        status = 403;
        throw new Error("Already varified. Can't processed this request!");
      }

      //requestId isn't present in EmployeeDeviceModel throw error
      const isRequestExist:any = await EmployeeDeviceModel.findOne({
        where:{
          id:requestId,
          is_deleted:false
        },
        include:[
          { 
            model:UserTableModel,
            where:{
              is_deleted:false,
              is_active:true,
              work_mode:{
                [Op.not] : 'office'
              },              
            },
            include:[
              {
                model:EmployeeTableModel,
                attributes:[["first_name","firstName"]]
              }
            ]
          },
          {
            model:CompanyTableModel,
            where:{
              is_deleted:false
            }
          }
        ],
        raw:true,
      });

      if(!isRequestExist || isRequestExist == null || isRequestExist == undefined){
          status = 404;
          throw new Error("Request Failed, Device Request not found!");
      }

      //if already verified throw error
      if(isRequestExist.is_verified == true && isVerified != false ){
        status = 208;
        throw new Error("Already verified!");
      }
      
      step = 7;
      if( isVerified == true){
        //update device auth data
        const updateAuthRequestData : any = await EmployeeDeviceModel.update({
          is_verified : isVerified,
          updated_at : moment().utc().toString(),
          updated_by : req.keyId
        },
        {
          where:{
            id : requestId,
          },
          transaction : tscn
        });

        if(!('0' in updateAuthRequestData) || updateAuthRequestData['0'] == null || updateAuthRequestData['0'] == undefined || updateAuthRequestData['0'] == 0){
            status = 500;
            throw new Error("Device authentication status update failed!");
        }

        let htmlFilePath:string = path.join(__dirname,'..','emails','device-authentication-status-template.html');
            
        let htmlContent = pug.renderFile(htmlFilePath,{
          userName: isRequestExist["user_table.employee_table.firstName"],
          message: 'Your device authentication verified successfully. Now you are able to login with desktop application.'
        });
        
        new SMTP.SmtpService().sendMail(isRequestExist["user_table.email"],htmlContent,"Time Tango | Device Authentication Status Updated By Admin");
        
        //commit the transaction
        await tscn.commit();
        res.status(200).json({
            status:"success",
            message:"Device authentication status updated successfully",  
        });
        
      } else {

        //destroy

        const destroyAuthRequestData:any = await EmployeeDeviceModel.update({
          is_verified : false,
          is_deleted:true,
          updated_at:moment().utc().toString(),
          updated_by:req.keyId
        },{
          where:{
            id:requestId,
          },
          transaction:tscn
        });


        if(!('0' in destroyAuthRequestData) || destroyAuthRequestData['0'] == null || destroyAuthRequestData['0'] == undefined || destroyAuthRequestData['0'] == 0){
          status = 500;
          throw new Error("update failed!");
        }
        else{
          let htmlFilePath:string = path.join(__dirname,'..','emails','device-authentication-status-template.html');
              
          let htmlContent = pug.renderFile(htmlFilePath,{
            userName: isRequestExist["user_table.employee_table.firstName"],
            message: 'Your device authentication rejected.'
          });

          new SMTP.SmtpService().sendMail(isRequestExist["user_table.email"],htmlContent,"Time Tango | Device Authentication Status Updated By Admin");
          
            //commit the transaction
            await tscn.commit();
            res.status(200).json({
                status:"success",
                message:"Device authentication status updated successfully",  
            });
          
        }
        
         
      }
      
  }
  catch(error:any){
      await tscn.rollback();
      console.log(`step ${step} error: ${error}`);
      return res.status(status === 200 ? 500 : status).json({
          status:"error",
          message:error.message
      });
  }
};

const getCompanyConfigurationDesktop = async (req:DesktopEmployeeAttendanceData,res: any,next:any) => {
  let step = 1, status = 200;
  try {

      if(!req.companyId || req.companyId == null || req.companyId == undefined || validator.isEmpty(req.companyId)){
          status = 400;
          throw new Error("Invalid Input!");
      }

      step = 2;
      let getCompanyData:any = await CompanyTableModel.findOne({where:{[Op.and]:[{id:req.companyId, is_deleted:false}]},raw:true,attributes:[["id","compId"],["configuration","companyConfiguration"]]});
      if(!getCompanyData || getCompanyData == null || getCompanyData == undefined) {
        status = 404;
        throw new Error("Company does not exist!");
      }

      let companyConfiguration:configuration = getCompanyData.companyConfiguration.desktop ? getCompanyData.companyConfiguration.desktop : {};
      res.status(200).json({
        status: 'success',
        message: 'Company configuration retrieved successfully',
        data: {
          configuration: companyConfiguration
        }
        
      });
    } catch(error:any){
      
      console.log(`step ${step} error: ${error}`);
      return res.status(status === 200 ? 500 : status).json({
          status:"error",
          message:error.message
      });
  }
}

export {desktopEmployeeSignIn, getDesktopEmployeeTodaysAttendanceDetails, desktopEmployeeCheckin, desktopEmployeeCheckout, getDesktopEmployeeAttendanceList, desktopEmployeeDeviceAuthRequests, desktopEmployeeDeviceAuthRequestStatusChange, getCompanyConfigurationDesktop};