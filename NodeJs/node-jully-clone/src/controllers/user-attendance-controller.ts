
//modules imports below
import validator from "validator";
import bcrypt from 'bcrypt';
import { Op, Sequelize,fn } from "sequelize";
import jwt from "jsonwebtoken";
import moment from 'moment';
import tz from 'moment-timezone';

require('dotenv').config();
import path from "path";
import fs from "fs";
import pug from "pug";

//local imports below
import { AttendanceData } from "../abstractions/classes/interfaces/attendance-model";
import UserTableModel from "../abstractions/models/user-table-model";
import UserAttendanceTableModel from "../abstractions/models/attendance-table-model";
import CompanyTableModel from "../abstractions/models/company-table-model";
import * as SMTP from "../services/smtp-mail.service";
import { CompanyData, configuration } from "../abstractions/classes/interfaces/company-model";
import EmployeeTableModel from "../abstractions/models/employee-table-model";
import { EmployeeData } from "../abstractions/classes/interfaces/employee-model";
import sequelize from "../utilities/database-connect";
import sharp from "sharp";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";
import { CommonService } from "../services/common.service";
import EmployeeLeaveModel from "../abstractions/models/employee-leave-model";


const checkInUserAttendance = async (req: AttendanceData, res: any,next:any) => {
    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{
        //getting data from request body
        const attendanceData:AttendanceData = req.body;
        //validating attendance data
        if(validator.isEmpty(attendanceData.deviceId)){
            status = 400;
            throw new Error("Device information is not provided!");
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
        
        // let images:any = [];
        // picturesArray.forEach((x:any) => {
        //   images.push(x);
        // })

        // attendanceData.picture = images;

        //get the emplyee data from the database
        step = 3;
        const employeeDataResult:any = await EmployeeTableModel.findOne({where:{user_id:req.keyId,company_id:req.companyId,is_deleted:false},attributes:[["id","empId"],["first_name","firstName"],["middle_name","middleName"],["last_name","lastName"],["date_of_birth","dateOfBirth"],["joining_date","joiningDate"],["personal_email","personalEmail"],["mobile","mobile"],["current_address","currentAddress"],["permanent_address","permanentAddress"],["emergency_contact","emergencyContact"],["is_active","isActive"],["both_address_same","bothAddressSame"],["company_id","companyId"],["department_id","departmentId"],["designation_id","designationId"]],raw:true});
        if(!employeeDataResult || employeeDataResult == null || employeeDataResult == undefined){
          status = 404;
          throw new Error("Employee does not exist!");
        }
        
        step = 6;
        // check if already checked in or not
        const isAlreadyCheckedIn:any = await UserAttendanceTableModel.findOne({where:{user_id:req.keyId,is_deleted:false,date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')},attributes:[["date","attendanceDate"]],raw:true});
  
        if(isAlreadyCheckedIn != null){
            status = 404;
            throw new Error("Already checked in!");
        }

        let momentDate:string =  moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
        const imageDir = path.join(__dirname, '..', 'public', 'images',req.companyId,momentDate,req.keyId); // Set the directory to save the image
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true }); // Create the directory if it doesn't exist
        }

        let images: any = [];
        if (picturesArray) {
          for (const picture of picturesArray) {
            const pictureName = `${Date.now()}-in-${picture.originalname}`;
            const picturePath = path.join(imageDir, pictureName);
            // await picture.mv(picturePath);
            await fs.promises.writeFile(picturePath, picture.buffer);
            images.push(`/images/${req.companyId}/${momentDate}/${req.keyId}/${pictureName}`);
          }
        }
        attendanceData.picture = images[0];

        step = 7;
        //add attendance data
        await UserAttendanceTableModel.create({
            device_id:attendanceData.deviceId,
            // picutres:images[0],
            date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
            check_in_time:moment().format("HH:mm:ss"),
            company_id:req.companyId,
            check_in_path:attendanceData.picture,
            user_id:req.keyId,
            employee_id:employeeDataResult.empId,
            check_in_location:attendanceData.checkInLocation,
            is_deleted:false,
            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
            created_by: req.keyId
        },{transaction:tscn});
        
        await tscn.commit();
        res.status(200).json({
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


const checkOutUserAttendance = async (req: AttendanceData, res: any,next:any) => {  

    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{
        const attendanceData:AttendanceData = req.body;
        //validating attendance data
        if(validator.isEmpty(attendanceData.deviceId)){
            status = 400;
            throw new Error("Device information is not provided!");
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
        if (!req.isBlob) {
            status = 403;
            throw new Error("Invalid input of picture file!")
        }
        //@ts-ignore
        const picturesArray = Array.isArray(req.files.picture) ? req.files.picture.flat() : null;
        
        step = 5;
        //get the employee detail from the database
        const employeeDataResult:any = await EmployeeTableModel.findOne({where:{user_id:req.keyId,company_id:req.companyId,is_deleted:false},attributes:[["first_name","firstName"],["middle_name","middleName"],["last_name","lastName"],["date_of_birth","dateOfBirth"],["joining_date","joiningDate"],["personal_email","personalEmail"],["mobile","mobile"],["current_address","currentAddress"],["permanent_address","permanentAddress"],["emergency_contact","emergencyContact"],["is_active","isActive"],["both_address_same","bothAddressSame"],["company_id","companyId"],["department_id","departmentId"],["designation_id","designationId"]]});
        if(!employeeDataResult || employeeDataResult == null || employeeDataResult == undefined){
            status = 404;
            throw new Error("Employee does not exist!");
        }

        let employeeData:EmployeeData = employeeDataResult.dataValues;
        if(employeeData.isActive == false){
            status = 403;
            throw new Error("Employee is not active!");
        }

        step = 5.5;
        //check if already checked in or not
        const isAlreadyCheckedIn:any = await UserAttendanceTableModel.findOne({where:{user_id:req.keyId,is_deleted:false,date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')},attributes:[["check_in_time","checkInTime"]],raw:true});
        if(isAlreadyCheckedIn == null){
            status = 404;
            throw new Error("You need to check in first!");
        }

        step = 6;
        //check if already checked out or not
        const isAlreadyCheckedOut:any = await UserAttendanceTableModel.findOne({where:{user_id:req.keyId,is_deleted:false,date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')},attributes:[["check_out_time","checkOutTime"]],raw:true});
        if(isAlreadyCheckedOut.checkOutTime != null){
            status = 404;
            throw new Error("Already checked out!");
        }

        // inserrt
        let momentDate:string =  moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
        const imageDir = path.join(__dirname, '..', 'public', 'images',req.companyId,momentDate,req.keyId); // Set the directory to save the image
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true }); // Create the directory if it doesn't exist
        }

        let images: any = [];
        if (picturesArray) {
          for (const picture of picturesArray) {
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

        step = 7;
        //update attendance data
        const updateAttendanceData:any = await UserAttendanceTableModel.update(
          {check_out_path:images[0],
            check_out_time:moment().format("HH:mm:ss"),
            total_worked_hours:`${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
            updated_at: moment().utc().toString(),
            updated_by:req.keyId
          },
            {where:
              {user_id:req.keyId,date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
              is_deleted:false}
              ,transaction:tscn});
        if(!('0' in updateAttendanceData) || updateAttendanceData['0'] == null || updateAttendanceData['0'] == undefined || updateAttendanceData['0'] == 0){
            status = 500;
            throw new Error("Checkout failed!");
        }
        await tscn.commit();

        res.status(200).json({
            status:"success",
            message:"Attendance checked out successfully"
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

const userAttendanceList = async (req: AttendanceData, res: any,next:any) => {
 
     let step = 1, status = 200;
     try{
         const pageSize:string = req.query.pageSize as string;
         const currentPage:string = req.query.currentPage as string;
         const date = req.query.date as string || "";
         const isExport = req.query.export as string || "false";
 
         if(!pageSize || pageSize == null || pageSize == undefined || validator.isEmpty(pageSize) || !validator.isNumeric(pageSize) || !currentPage || currentPage == null || currentPage == undefined || validator.isEmpty(currentPage) || !validator.isNumeric(currentPage)){
             status = 400;
             throw new Error("Invalid Input!");
         }

         let dateFormat = 'YYYY-MM';
         if (moment(date, 'YYYY-MM', true).isValid()) {
           dateFormat = 'YYYY-MM';
         } else if (moment(date, 'YYYY-MM-DD', true).isValid()) {
           dateFormat = 'YYYY-MM-DD';
         }
         else{
          dateFormat = 'No Date';
         }
 
         const offset:number = (+currentPage - 1) * +pageSize;
         const limit:number = +pageSize;
         let countedCollectionData:number = 0;
         let usersAttendanceDataList:any = [];

         if(dateFormat == "YYYY-MM"){
          let startDate:string = moment(date,"YYYY-MM").startOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
          let endDate:string = moment(date,"YYYY-MM").endOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
          let where:any = {
            company_id:req.companyId,
            is_deleted:false,
            user_id:req.keyId,
            date: {
              [Op.between]: [startDate, endDate]
            }
          };
          if(isExport === 'true'){

            countedCollectionData = await countLoginEmployeeAttendance(where);
            if(countedCollectionData <= 0){
                return res.status(status).json({
                    status: "success",
                    data: "No attendance found, yet."
                });
            }
            //get the attendance data from the database
            usersAttendanceDataList = await findLoginEmployeesAllAttendance(where,offset,limit);  

          }
          else{
            countedCollectionData = await countLoginEmployeeAttendance(where);
            if(countedCollectionData <= 0){
                return res.status(status).json({
                    status: "success",
                    data: "No attendance found, yet."
                });
            }
            //get the attendance data from the database
            usersAttendanceDataList = await findLoginEmployeesAllAttendance(where,offset,limit,true);  
          }
         }
         else if(dateFormat == "YYYY-MM-DD"){
          let startDate:string = moment(date,"YYYY-MM-DD").startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
          let where:any = {
            company_id:req.companyId,
            is_deleted:false,
            user_id:req.keyId,
            date: startDate
          };

          if(isExport === 'true'){

            countedCollectionData = await countLoginEmployeeAttendance(where);
            if(countedCollectionData <= 0){
                return res.status(status).json({
                    status: "success",
                    data: "No attendance found, yet."
                });
            }
            //get the attendance data from the database
            usersAttendanceDataList = await findLoginEmployeesAllAttendance(where,offset,limit);  
            
          }
          else{

            countedCollectionData = await countLoginEmployeeAttendance(where);
            if(countedCollectionData <= 0){
                return res.status(status).json({
                    status: "success",
                    data: "No attendance found, yet."
                });
            }
            //get the attendance data from the database
            usersAttendanceDataList = await findLoginEmployeesAllAttendance(where,offset,limit,true);  
                        
          }
         }
         else{
          let where:any = {
            company_id:req.companyId,
            is_deleted:false,
            user_id:req.keyId
          };
          if(isExport === 'true'){

            countedCollectionData = await countLoginEmployeeAttendance(where);
            if(countedCollectionData <= 0){
                return res.status(status).json({
                    status: "success",
                    data: "No attendance found, yet."
                });
            }
            //get the attendance data from the database
            usersAttendanceDataList = await findLoginEmployeesAllAttendance(where,offset,limit);  
            
          }
          else{

            countedCollectionData = await countLoginEmployeeAttendance(where);
            if(countedCollectionData <= 0){
                return res.status(status).json({
                    status: "success",
                    data: "No attendance found, yet."
                });
            }
            //get the attendance data from the database
            usersAttendanceDataList = await findLoginEmployeesAllAttendance(where,offset,limit,true);  
                        
          }
         }

        return res.status(status).json({
             status:"success",
             message:"Attendance data fetched successfully!",
             data:usersAttendanceDataList,
             totalCountedAttendance:countedCollectionData
        });
 
     }
     catch(error:any){
         console.log(`step ${step} error: ${error}`);
         return res.status(status === 200 ? 500 : status).json({
             status:"error",
             message:error.message
         });
     }
 };

const countLoginEmployeeAttendance = async (where:any):Promise<number>  => {
  let countedCollectionData = await UserAttendanceTableModel.count({
      where
  });
  return countedCollectionData;
}

const findLoginEmployeesAllAttendance = async (where:any,offset:number,limit:number,pagination:boolean = false):Promise<any>  => {
  let usersAttendanceDataList = await UserAttendanceTableModel.findAll({
    where,
    attributes:[['total_worked_hours','totalWorkedHours'],["check_in_path","checkInImagePath"],["check_out_path","checkOutImagePath"],["device_id","deviceId"],["date","attendanceDate"],["check_in_time","checkInTime"],["check_out_time","checkOutTime"]],
   include:[
    {
      model: EmployeeTableModel,
      attributes:[["emp_id","empId"]]
    }
   ],
   limit: pagination ? limit : undefined, // Add limit only if pagination is enabled
   offset: pagination ? offset : undefined, //same withe offset
   raw:true,
   order:[["created_at","DESC"]]});

   usersAttendanceDataList = usersAttendanceDataList.map((x:any) => {
    let empId = x["employee_table.empId"];
    delete x["employee_table.empId"];
    return {
      ...x,
      empId:empId
    }
  });

  return usersAttendanceDataList;

}

const companyRequestForSignInFromDevice = async (req: AttendanceData, res: any,next:any) => {
    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{
        const compId:string = req.body.compId;
        if(!compId || compId == null || compId == undefined || validator.isEmpty(compId)){
            status = 400;
            throw new Error("Invalid Input!");
        }

        let streamType:string = [...compId].indexOf('@') > -1 ? "email" : "phone";
        //checking if email or phone number is valid
        if(streamType == "email" && !validator.isEmail(compId)){
            status = 400;
            throw new Error("Invalid Email!");
        }

        //checking if the string has only characters
        const regex = RegExp('^[a-zA-Z ]*$');
        
        if(streamType == "phone" && !validator.isMobilePhone(compId,"en-IN")){
            status = 400;
            throw new Error("Invalid company id!");
        }

        if(streamType == "email"){
            //check if email exists
            step = 2;
            const isEmailExist:any = await CompanyTableModel.findOne({where:{company_email:compId.toLowerCase(),is_deleted:false},raw:true});
            if(!isEmailExist || isEmailExist == null || isEmailExist == undefined){
                status = 404;
                throw new Error("Company does not exist!");
            }

            //generate 6 digit otp
            step = 3;
            const otp:string = Math.floor(100000 + Math.random() * 900000).toString();
            //encripting otp with bcrypt
            const otpHash:string = await bcrypt.hash(otp,12);
            // update otp in the database
            step = 4;
            const updateOtp:any = await CompanyTableModel.update({temporary_password:otpHash,temporary_password_expiry_date:moment().add(10,'m').utc().toString(),updated_at: moment().utc().toString()},{where:{company_email:compId.toLowerCase(),is_deleted:false},transaction:tscn});
            if(!('0' in updateOtp) || updateOtp['0'] == null || updateOtp['0'] == undefined || updateOtp['0'] == 0){
                status = 500;
                throw new Error("Otp generate failed!");
            }

            let htmlFilePath:string = path.join(__dirname,'..','emails','company-login-email-template.html');
            
            let htmlContent = pug.renderFile(htmlFilePath,{
                orgOTP:otp,
                orgName:isEmailExist.company_name ? isEmailExist.company_name : "Company Admin",
                expiryTime:moment().add(10,'m').format("DD-MM-YYYY HH:mm:ss"),
                // expiryTime:moment().tz("Asia/Kolkata").add(10,'m').format("DD-MM-YYYY HH:mm:ss"),
                teamName:process.env.PROJECT_SUPPORT_EMAIL
            });

            // let mailSend = 
             new SMTP.SmtpService().sendMail(compId,htmlContent,"Time Tango | Company Login OTP");
            // if(!mailSend){
            //     status = 500;
            //     throw new Error("OTP Mail send failed!");
            // }

            await tscn.commit();

            res.status(status).json({
                status:"success",
                message:"Otp sent to your email!",
            });

        }
        else{
            //mobile controller is in pending
            if(streamType == "phone" && validator.isMobilePhone(compId,"en-IN")){
                status = 400;
                throw new Error("Please provide email address!");
            }
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
        await tscn.rollback();
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
};


const validateCompanyRequestForSignInFromDeviceWithOtp = async (req: AttendanceData, res: any,next:any) => {
    let step = 1, status = 200;
    try{

        //get the opt from the request body
        const {otp,compId} = req.body;
        if(!otp || otp == null || otp == undefined || validator.isEmpty(otp) || !validator.isNumeric(otp) || otp.length != 6 || !compId || compId == null || compId == undefined || validator.isEmpty(compId)){
            status = 400;
            throw new Error("Invalid Input!");
        }

        //check is user exists and active
        step = 2;
        let getCompanyData:CompanyData = await CompanyTableModel.findOne({where:{[Op.or]:[{company_email:compId.toLowerCase()},{company_phone:compId}],[Op.and]:[{is_deleted:false}]},raw:true,attributes:[["id","compId"],["company_name","compName"],["company_email","compEmail"],["temporary_password","temporaryPassword"],["temporary_password_expiry_date","temporaryPasswordExpiry"],["company_address1","companyAddress1"],["company_phone","companyPhone"],["company_website","companyWebsite"],["company_logo","companyLogo"],["company_fax","companyFax"],["office_number","officeNumber"],["configuration","companyConfiguration"]]}) as unknown as CompanyData;
        if(!getCompanyData || getCompanyData == null || getCompanyData == undefined){
            status = 404;
            throw new Error("Company does not exist!");
        }

        step = 2.5;
        if(getCompanyData.temporaryPassword == null || getCompanyData.temporaryPassword == undefined || getCompanyData.temporaryPassword == "" || getCompanyData.temporaryPasswordExpiry == null || getCompanyData.temporaryPasswordExpiry == undefined || getCompanyData.temporaryPasswordExpiry == ""){
            status = 404;
            throw new Error("OTP does not exist!");
        }

        step = 3;
        const isOtpExpired:boolean = moment().isAfter(moment(getCompanyData.temporaryPasswordExpiry).utc());
        if(isOtpExpired){
            status = 400;
            throw new Error("OTP expired!");
        }

        //check if otp is valid
        step = 4;
        const isOtpValid:boolean = await bcrypt.compare(otp,getCompanyData.temporaryPassword as string);
        if(!isOtpValid){
            status = 400;
            throw new Error("Invalid OTP!");
        }

        //generate jwt token
        step = 5;
        const jwtToken:string = jwt.sign({compId:getCompanyData.compId,compEmail:getCompanyData.compEmail,tokenTime:moment().add(4,'Q')},process.env.JWT_TOKEN_KEY as string);
        if(!jwtToken || jwtToken == null || jwtToken == undefined){
            status = 500;
            throw new Error("Token generation failed!");
        }

        res.status(status).json({
            status:"success",
            message:"Validated successfully!",
            data:{
                compAuthKey:jwtToken
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
};

const deviceCheckInUserAttendance = async (req: AttendanceData, res: any,next:any) => {
    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{
        //getting data from request body
        const attendanceData:AttendanceData = req.body;
        //validating attendance data
        if(validator.isEmpty(attendanceData.deviceId) || attendanceData.deviceId == null || attendanceData.deviceId == undefined || validator.isEmpty(attendanceData.empId as string)){
            status = 400;
            throw new Error("Invalid Input!");
        }

        //checking if checkInLocation is valid
        if(("checkInLocation" in attendanceData)){
          if(!validator.isEmpty(attendanceData.checkInLocation as string)){

              //conver the string to json
            try{
              attendanceData.checkInLocation = JSON.parse(attendanceData.checkInLocation as string);
            }
            catch(error){
              status = 406;
              throw new Error("Invalid JSON for location, please provide latitude, longitude, address");
            }
            
            let obj:any = attendanceData.checkInLocation; 
            //check if latitude, longitude, address is provided
            if (!new CommonService().isGPSLocation(attendanceData.checkInLocation)) {
              status = 406;
              throw new Error('Invalid location data, please provide latitude, longitude, address with values');
            }

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
        
        step = 3;
        //check is company exist or not
        let isCompanyExist:any = await CompanyTableModel.findOne({where:{id:req.compId,is_deleted:false},raw:true});
        if(!isCompanyExist || isCompanyExist == null || isCompanyExist == undefined){
            status = 404;
            throw new Error("Company does not exist!");
        }

        step = 4;
        //get the employee detail from the database
        const employeeDataResult:any = await EmployeeTableModel.findOne({where:{emp_id:attendanceData.empId,company_id:req.compId,is_deleted:false},attributes:[["id","empId"],["user_id", "userId"],["first_name","firstName"],["middle_name","middleName"],["last_name","lastName"],["date_of_birth","dateOfBirth"],["joining_date","joiningDate"],["personal_email","personalEmail"],["mobile","mobile"],["current_address","currentAddress"],["permanent_address","permanentAddress"],["emergency_contact","emergencyContact"],["is_active","isActive"],["both_address_same","bothAddressSame"],["company_id","companyId"],["department_id","departmentId"],["designation_id","designationId"]]}) as unknown as EmployeeData;
        if(!employeeDataResult || employeeDataResult == null || employeeDataResult == undefined){
            status = 404;
            throw new Error("Employee does not exist!");
        }

        const employeeData:EmployeeData = employeeDataResult.dataValues;
        console.log('emp data ',employeeData);


        if(employeeData.isActive == false){
            status = 403;
            throw new Error("Employee is not active!");
        }


        step = 5;
        //check is user exist or not
        const isEmailExist:any = await UserTableModel.findOne({where:{id:employeeData.userId,is_deleted:false,is_active:true},raw:true});
        if(!isEmailExist || isEmailExist == null || isEmailExist == undefined){
            status = 404;
            throw new Error("Employee does not exist!");
        }

        step = 6;
        //check if already checked in or not
        const isAlreadyCheckedIn:any = await UserAttendanceTableModel.findOne({where:{user_id:employeeData.userId,is_deleted:false,date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')},attributes:[["date","attendanceDate"]],raw:true});
  
        if(isAlreadyCheckedIn != null){
            status = 404;
            throw new Error("Already checked in!");
        }



        step = 7;
        let momentDate:string =  moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
        const imageDir = path.join(__dirname, '..', 'public', 'images',req.compId as string,momentDate,employeeData.userId as string); // Set the directory to save the image
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
            images.push(`/images/${req.compId as string}/${momentDate}/${employeeData.userId as string}/${pictureName}`);
          }
        }
        attendanceData.picture = images[0];

        step = 8;
        //add attendance data
        await UserAttendanceTableModel.create({
            device_id:attendanceData.deviceId,
            // picutres:images[0],
            check_in_path:images[0],
            date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
            check_in_time:moment().format("HH:mm:ss"),
            company_id:req.compId,
            user_id:employeeData.userId,
            employee_id:employeeData.empId,
            check_in_location: attendanceData.checkInLocation ,
            is_deleted:false,
            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
            created_by: req.keyId
        },{transaction:tscn});

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

//Admin or hr can modify or add attendance checkin of employee for a particular date
const adminHandlerCheckInUserAttendance = async (req: AttendanceData, res: any,next:any) => {
    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{
        const dateFormat = 'DD-MM-YYYY';
        const isTimeFormatValid = (time: string): boolean => {
            return validator.matches(time, /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/);
        };

        //getting data from request body
        const attendanceData:AttendanceData = req.body;
        //validating attendance data
        if(validator.isEmpty(attendanceData.deviceId) || !validator.isDate(attendanceData.attendanceDate as string, { format: dateFormat }) || !isTimeFormatValid(attendanceData.checkIntime as string) || !validator.isUUID(attendanceData.empId as string) || !validator.isUUID(attendanceData.userId as string)){
            status = 400;
            throw new Error("Invalid input!");
        }

        step = 2;
        //@ts-ignore
        if (!req.isBlob) {
            status = 403;
            throw new Error("Invalid input of picture file!")
        }
        //@ts-ignore
        const picturesArray = Array.isArray(req.files.picture) ? req.files.picture.flat() : null;
        
        let images:any = [];
        picturesArray.forEach((x:any) => {
            images.push(x.buffer);
        })

        attendanceData.picture = images;

        step = 3;
        //check is user exist or not
        const isEmailExist:any = await UserTableModel.findOne({where:{email:req.email.toLowerCase(),is_deleted:false,is_active:true},raw:true});
        if(!isEmailExist || isEmailExist == null || isEmailExist == undefined){
            status = 404;
            throw new Error("User does not active!");
        }

        step = 4;
        //check is company exist or not
        const isCompanyExist:any = await CompanyTableModel.findOne({where:{id:isEmailExist.company_id,is_deleted:false},raw:true});
        if(!isCompanyExist || isCompanyExist == null || isCompanyExist == undefined){
            status = 404;
            throw new Error("Company does not exist!");
        }

        step = 6;
        // check if already checked in or not
        const isAlreadyCheckedIn:any = await UserAttendanceTableModel.findOne({where:{user_id:attendanceData.userId,company_id:isCompanyExist.id,is_deleted:false,date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')},attributes:[["date","attendanceDate"]],raw:true});
  
        if(isAlreadyCheckedIn != null){
            status = 404;
            throw new Error("Already checked in!");
        }

        step = 7;
        //add attendance data
        await UserAttendanceTableModel.create({
            device_id:attendanceData.deviceId,
            picutres:images[0],
            date:moment(attendanceData.attendanceDate,'DD-MM-YYYY').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
            check_in_time:attendanceData.checkIntime,
            company_id:isEmailExist.company_id,
            user_id:attendanceData.userId,
            employee_id:attendanceData.empId,
            is_deleted:false,
            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
            created_by: req.keyId
        },{transaction:tscn});
        
        await tscn.commit();
        res.status(200).json({
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
//Admin or hr can modify or add attendance checkout of employee for a particular date
const adminHandlerCheckOutUserAttendance = async (req: AttendanceData, res: any, next: any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try {
    const dateFormat = 'DD-MM-YYYY';
    const isTimeFormatValid = (time: string): boolean => {
      return validator.matches(time, /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/);
    };

    //getting data from request body
    const attendanceData: AttendanceData = req.body;
    //validating attendance data
    if (validator.isEmpty(attendanceData.deviceId) || !validator.isDate(attendanceData.attendanceDate as string, { format: dateFormat }) || !isTimeFormatValid(attendanceData.checkOuttime as string) || !validator.isUUID(attendanceData.empId as string) || !validator.isUUID(attendanceData.userId as string)) {
      status = 400;
      throw new Error("Invalid input!");
    }

    step = 2;
    //@ts-ignore
    if (!req.isBlob) {
      status = 403;
      throw new Error("Invalid input of picture file!")
    }
    //@ts-ignore
    const picturesArray = Array.isArray(req.files.picture) ? req.files.picture.flat() : null;

    let images: any = [];
    picturesArray.forEach((x: any) => {
      images.push(x.buffer);
    })

    attendanceData.picture = images;

    step = 3;
    //check is user exist or not
    const isEmailExist: any = await UserTableModel.findOne({ where: { email: req.email.toLowerCase(), is_deleted: false, is_active: true }, raw: true });
    if (!isEmailExist || isEmailExist == null || isEmailExist == undefined) {
      status = 404;
      throw new Error("User does not active!");
    }

    step = 4;
    //check is company exist or not
    const isCompanyExist: any = await CompanyTableModel.findOne({ where: { id: isEmailExist.company_id, is_deleted: false }, raw: true });
    if (!isCompanyExist || isCompanyExist == null || isCompanyExist == undefined) {
      status = 404;
      throw new Error("Company does not exist!");
    }

    step = 6;
    // check if already checked in or not
    const isAlreadyCheckedIn: any = await UserAttendanceTableModel.findOne({ where: { user_id: attendanceData.userId, company_id: isCompanyExist.id, is_deleted: false, date: moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ') }, attributes: [["date", "attendanceDate"],"id"], raw: true });

    if (isAlreadyCheckedIn == null) {
      status = 404;
      throw new Error("User has not checked in yet!");
    }

    step = 7;
    //update attendance data
    const updateResult = await UserAttendanceTableModel.update({
      check_out_time: attendanceData.checkOuttime,
      pictures: images[0],
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      updated_by: req.keyId
    }, { where: { id: isAlreadyCheckedIn.id }, transaction: tscn });

    if(!('0' in updateResult) || updateResult['0'] == null || updateResult['0'] == undefined || updateResult['0'] == 0){
        status = 500;
        throw new Error("Checkout failed!");
    }


    await tscn.commit();
    res.status(200).json({
      status: "success",
      message: "Attendance checked out successfully",
    });

  }
  catch (error: any) {
    await tscn.rollback();
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
};


const deviceEmployeeList = async (req: AttendanceData, res: any,next:any) => {
    let step = 1, status = 200;
    try {
        const { date } = req.params;
        const dateFormat = 'DD-MM-YYYY';
        console.log('date ',validator.isDate(date, { format: dateFormat }));
        if (!validator.isDate(date, { format: dateFormat }) || validator.isEmpty(date)) {
            throw new Error('Date is required');
        }

        /**
         * @Pending
         * Mobile level pagination will be added later on specified constraints
         */


         let countedCollectionData = await EmployeeTableModel.count({
             where: Sequelize.literal(`company_id = '${req.compId}' and is_active = true and is_deleted = false`)
         });
 
         if(countedCollectionData <= 0){
             return res.status(status).json({
                 status: "success",
                 data: "No employee found, yet."
             });
         }
        
        step = 4;
        //getting employee list
        const employeeAttendanceList = await EmployeeTableModel.findAll({
          where: {
            company_id: req.compId,
            is_deleted:false,
            is_active:true
          },
          attributes: [
            ['emp_id', 'empId'],
            ['first_name', 'firstName'],
            ['last_name', 'lastName'],
          ],
          include: [
            {
              model: UserAttendanceTableModel,
              attributes: [
                ['check_in_time', 'checkInTime'],
                ['check_out_time', 'checkOutTime'],
                // ['picutres', 'employeePicture'],
                // ['checkout_picutres', 'employeeCheckoutPicture'],
              ],
              where: {
                is_deleted: false,
                date: moment(date, 'DD-MM-YYYY').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
              },
              required: false, // Set required to false to return empty attendance for employees who don't have attendance on the specified date
            },
          ],
          raw: true,
        });

        const employeeAttendanceListWithEmptyAttendance = await Promise.all(employeeAttendanceList.map(async (employeeAttendance: any) => {
        const { empId, firstName, lastName } = employeeAttendance;
        // if (employeeAttendance['attendance_tables.employeePicture'] != null) {
        //     employeeAttendance['attendance_tables.employeePicture'] = await sharp(employeeAttendance['attendance_tables.employeePicture']).resize({ width: Math.round(Math.sqrt(employeeAttendance['attendance_tables.employeePicture'].length / 4)), height: Math.round(Math.sqrt(employeeAttendance['attendance_tables.employeePicture'].length / 4)) }).toBuffer();
        // }
        // if (employeeAttendance['attendance_tables.employeeCheckoutPicture'] != null) {
        //     employeeAttendance['attendance_tables.employeeCheckoutPicture'] = await sharp(employeeAttendance['attendance_tables.employeeCheckoutPicture']).resize({ width: Math.round(Math.sqrt(employeeAttendance['attendance_tables.employeeCheckoutPicture'].length / 4)), height: Math.round(Math.sqrt(employeeAttendance['attendance_tables.employeeCheckoutPicture'].length / 4)) }).toBuffer();
        // }

        return {
            empId,
            firstName,
            lastName,
            checkInTime: employeeAttendance['attendance_tables.checkInTime'],
            checkOutTime: employeeAttendance['attendance_tables.checkOutTime'],
            // employeePicture: employeeAttendance['attendance_tables.employeePicture'],
            // employeeCheckoutPicture: employeeAttendance['attendance_tables.employeeCheckoutPicture'],
        };
        }));
        
        res.status(200).json({
          status: 'success',
          message: 'Employee attendance list retrieved successfully',
          data: employeeAttendanceListWithEmptyAttendance,
          totalCount: countedCollectionData,
        });
      } catch(error:any){
        
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
};

const singleEmployeesMonthAttendanceList = async (req: any, res: any, next: any) => {
  let step = 1,
    status = 200;
  try {
    const {employeeId} = req.params;
    if(validator.isUUID(employeeId) == false){
        status = 400;
        throw new Error("Invalid employee id");
    }

    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get the page size from the query parameters, default to 10
    const offset = (page - 1) * limit; // Calculate the offset

    const employeeCount = await EmployeeTableModel.count({
        where: {
          company_id: req.companyId,
        //   user_id: req.keyId,
          id: employeeId,
          // is_deleted: false,
          // is_active: true,
        },
        include: [
          {
            model: UserAttendanceTableModel,
            where: {
              is_deleted: false,
              date: {
                [Op.gte]: moment().startOf('month').toDate(),
                [Op.lte]: moment().endOf('month').toDate(),
                // [Op.gte]: moment().subtract(1, 'month').startOf('month').toDate(),
                // [Op.lte]: moment().subtract(1, 'month').endOf('month').toDate(),
              },
            },
            required: true,
          },
        ],
      });

        if (employeeCount <= 0) {
            return res.status(status).json({
                status: "success",
                data: "No employee found, yet."
            });
        }

    const employee:any = await EmployeeTableModel.findAll({
      where: {
        company_id: req.companyId,
        user_id: req.keyId, // Filter by the logged in user's ID
        // is_deleted: false,
        // is_active: true,
      },
      attributes: [
        ['emp_id', 'empId'],
        ['first_name', 'firstName'],
        ['last_name', 'lastName'],
        ["id", "employeeId"]
      ],
      include: [
        {
          model: UserAttendanceTableModel,
          attributes: [
            ['check_in_time', 'checkInTime'],
            ['check_out_time', 'checkOutTime'],
            ['picutres', 'employeePicture'],
            ['checkout_picutres', 'employeeCheckoutPicture'],
            "date",
            ["employee_id", "employeeId"]
          ],
          where: {
            is_deleted: false,
            date: {
              [Op.gte]: moment().startOf('month').toDate(),
              [Op.lte]: moment().endOf('month').toDate(),
            // [Op.gte]: moment().subtract(1, 'month').startOf('month').toDate(),
            // [Op.lte]: moment().subtract(1, 'month').endOf('month').toDate(),
            },
          },
          required: false, // Set required to false to return empty attendance for employees who don't have attendance on the specified date
        },
      ],
      order: [[{ model: UserAttendanceTableModel, as: 'attendance_tables' }, 'date', 'DESC']],
      raw: true,
      offset, // Add the offset to the query
      limit, // Add the limit to the query
      subQuery: false,
    });

    if (!employee) {
      return res.status(status).json({
        status: 'success',
        data: 'No employee found for the logged in user.',
      });
    }

    const employeeAttendanceListWithEmptyAttendance =  await Promise.all(
      employee.map(async (attendance: any) => {
 
        let employeePicture:any = null;
        let employeeCheckoutPicture:any = null;

        if (attendance["attendance_tables.employeePicture"] != null) {
          employeePicture = await sharp(attendance["attendance_tables.employeePicture"])
            .resize({
              width: Math.round(Math.sqrt(attendance["attendance_tables.employeePicture"].length / 4)),
              height: Math.round(Math.sqrt(attendance["attendance_tables.employeePicture"].length / 4)),
            })
            .toBuffer();
        }
        if (attendance["attendance_tables.employeeCheckoutPicture"] != null) {
          employeeCheckoutPicture = await sharp(attendance["attendance_tables.employeeCheckoutPicture"])
            .resize({
              width: Math.round(Math.sqrt(attendance["attendance_tables.employeeCheckoutPicture"].length / 4)),
              height: Math.round(Math.sqrt(attendance["attendance_tables.employeeCheckoutPicture"].length / 4)),
            })
            .toBuffer();
        }
        let attendanceDay = moment(attendance["attendance_tables.date"]).format('YYYY-MM-DD');

        
        return {
        
          checkInTime: attendance["attendance_tables.checkInTime"],
          checkOutTime: attendance["attendance_tables.checkOutTime"],
          employeePicture,
          employeeCheckoutPicture,
          attendanceDay,
        };
      })
    );

    res.status(200).json({
      status: 'success',
      message: 'Employee attendance list retrieved successfully',
      data: employeeAttendanceListWithEmptyAttendance,
      totalCount: employeeCount,
    });
  } catch (error: any) {
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: 'error',
      message: error.message,
    });
  }
};


const employeesCurrentMonthList = async (req: any, res: any, next: any) => {
  let step = 1, status = 200;

  try {
    let isExport: string = req.query.isExport || "false";
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get the page size from the query parameters, default to 10
    const offset = (page - 1) * limit;
    
    let startDate: string = moment().startOf('month').format('YYYY-MM-DD HH:mm:ssZ');
    let endDate: string = moment().endOf('month').format('YYYY-MM-DD HH:mm:ssZ');
    const isCurrentMonth = moment().isSame(startDate, 'month');

    let where = {
      company_id: req.companyId,
      is_deleted: false,
      is_active: true,
    }
    
    let where2:any = {
      is_deleted: false,    
    }

    // If the month is the current month, exclude today's attendance record
    if (isCurrentMonth) {
      where2.date = {
        [Op.between]: [startDate, moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ssZ')]
      };
    }
    else{
      where2.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    let returnData:any;
    if(isExport == "true"){
      returnData = await employeeCurrentMonthListCountAndFound(where,where2,limit,offset);
    }
    else{
      returnData = await employeeCurrentMonthListCountAndFound(where,where2,limit,offset,true);
    }
  
    return res.status(200).json({
      status: 'success',
      message: 'Employee attendance list of this month retrieved successfully',
      data: returnData,
      currentPage: isExport == "false" ? page : undefined, // Add the current page to the response
      totalPages: isExport == "false" ? Math.ceil(returnData.totalCount / limit) : undefined, // Add the total number of pages to the response
    });
  } catch (error: any) {
  console.log(`step ${step} error: ${error}`);
  return res.status(status === 200 ? 500 : status).json({
  status: 'error',
  message: error.message,
  });
  }
 };

const employeeCurrentMonthListCountAndFound = async (where:any,where2:any,limit:number,offset:number,pagination:boolean = false) =>{
  let yesterday = moment().subtract(1, 'day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
  let today = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
  
  const employeeCount = await EmployeeTableModel.count({
    where,
    include: [
      {
        model: UserAttendanceTableModel,
        where:where2,
        required: true,
      },
    ],
  });


  // let attendanceDate = moment(attDate).format('YYYY-MM-DD');

  const employeeAttendanceList = await EmployeeTableModel.findAll({
    where,
    attributes: [
      ['emp_id', 'empId'],
      ['first_name', 'firstName'],
      // ['last_name', 'lastName'],
      ["id", "employeeId"]
    ],
    include: [
      {
        model: UserAttendanceTableModel,
        attributes: [
          ['id', 'attendanceId'],
          ['check_in_time', 'checkInTime'],
          ['check_out_time', 'checkOutTime'],
          ['check_in_path', 'checkInPath'],
          ['check_out_path', 'checkOutPath'],
          ['picutres', 'employeePicture'],
          ['checkout_picutres', 'employeeCheckoutPicture'],
          ['total_worked_hours', 'totalWorkedHours'],
          'date',
          ["employee_id", "employeeId"],
          [sequelize.literal(`CASE WHEN date ='${today}' THEN true ELSE false END`), 'isResetAttendance'],
          [sequelize.literal(`CASE WHEN date ='${today}' OR date ='${yesterday}' THEN true ELSE false END`), 'isEditAttendance'] // Add the custom column

        ],
        where:where2,
        required: true,
      },
    ],
    raw: true,
    order: [[{ model: UserAttendanceTableModel, as: 'attendance_tables' }, 'date', 'DESC'],
    [{ model: UserAttendanceTableModel, as: 'attendance_tables' }, 'check_in_time', 'DESC']],
    offset: pagination ? offset : undefined, // Add the offset to the query
    limit: pagination ? limit : undefined, // Add the limit to the query
    subQuery: false,
  });

  const employeeAttendanceListWithEmptyAttendance =
    await Promise.all(
      employeeAttendanceList.map(async (employeeAttendance: any) => {
        const { empId, firstName, lastName } = employeeAttendance;
        if (employeeAttendance['attendance_tables.employeePicture'] != null) {
          employeeAttendance['attendance_tables.employeePicture'] = await sharp(
            employeeAttendance['attendance_tables.employeePicture']
          )
            .resize({
              width: Math.round(Math.sqrt(employeeAttendance['attendance_tables.employeePicture'].length / 4)),
              height: Math.round(Math.sqrt(employeeAttendance['attendance_tables.employeePicture'].length / 4)),
            })
            .toBuffer();
        }
        if (employeeAttendance['attendance_tables.employeeCheckoutPicture'] != null) {
          employeeAttendance['attendance_tables.employeeCheckoutPicture'] = await sharp(
            employeeAttendance['attendance_tables.employeeCheckoutPicture']
          )
            .resize({
              width: Math.round(Math.sqrt(employeeAttendance['attendance_tables.employeeCheckoutPicture'].length / 4)),
              height: Math.round(Math.sqrt(employeeAttendance['attendance_tables.employeeCheckoutPicture'].length / 4)),
            })
            .toBuffer();
        }

        return {
          attendanceId: employeeAttendance['attendance_tables.attendanceId'],
          empId,
          firstName,
          // lastName,
          date: moment(employeeAttendance['attendance_tables.date']).format('YYYY-MM-DD'),
          checkInImagePath: employeeAttendance['attendance_tables.checkInPath'],
          checkOutImagePath: employeeAttendance['attendance_tables.checkOutPath'],
          checkInTime: employeeAttendance['attendance_tables.checkInTime'],
          checkOutTime: employeeAttendance['attendance_tables.checkOutTime'],
          // employeePicture: employeeAttendance['attendance_tables.employeePicture'],
          // employeeCheckoutPicture: employeeAttendance['attendance_tables.employeeCheckoutPicture'],
          isResetAttendance: employeeAttendance["attendance_tables.isResetAttendance"],
          isEditAttendance: employeeAttendance["attendance_tables.isEditAttendance"],
          totalWorkedHours: employeeAttendance["attendance_tables.totalWorkedHours"]
        };
      })
    );

    return {
      totalCount: employeeCount,
      data: employeeAttendanceListWithEmptyAttendance
    }
}

const attendanceBasedOnAttendanceId = async (req: any, res: any, next: any) => {
  let status = 200, step = 1;
  try{

    const {attendanceId} = req.params;
    if(!validator.isUUID(attendanceId)){
        status = 400;
        throw new Error("Invalid attendance id");
    }

    let yesterday = moment().subtract(1, 'day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
    let today = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');

    //check if attendance exist or not
    const isAttendanceExist:any = await UserAttendanceTableModel.findOne({where:{id:attendanceId,is_deleted:false},attributes:[
      ['id', 'attendanceId'],
      ['check_in_time', 'checkInTime'],
      ['check_out_time', 'checkOutTime'],
      ['check_in_path','checkInPath'],
      ['check_out_path','checkOutPath'],
      ['total_worked_hours','totalWorkedHours'],
  
      'date',
      ["employee_id", "employeeId"],
      [sequelize.literal(`CASE WHEN date ='${today}' THEN true ELSE false END`),'isResetAttendance'],
      [sequelize.literal(`CASE WHEN date ='${today}' OR date ='${yesterday}' THEN true ELSE false END`),'isEditAttendance'] // Add the custom column
      
    ],raw:true});

    if(!isAttendanceExist || isAttendanceExist == null || isAttendanceExist == undefined){
        status = 404;
        throw new Error("Attendance does not exist!");
    }

    return res.status(status).json({
        status:"success",
        data:isAttendanceExist
    });


  }
  catch(error:any){
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: 'error',
      message: error.message,
    });
  }

}

const adminSideAttendanceListBasedOnDate = async (req: any, res: any, next: any) => {
  let step = 1, status = 200;
  try {
    const { date } = req.params; // Get the date from the request body
    let isExport:string = req.query.isExport || "false";
   
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters, default to 1
      const limit = parseInt(req.query.limit) || 10; // Get the page size from the query parameters, default to 10
      const offset = (page - 1) * limit;
      //check if the date is valid
      if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid date format, please use YYYY-MM-DD format',
        });
      }

      console.log(moment(date).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'));
      console.log(moment(date).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'))
      let where = {
        company_id: req.companyId,
      }
      let where2 = {
        is_deleted: false,
        date: moment(date).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')
      }

      let availableData:any;
      if(isExport == "true"){
        availableData = await adminSideAttendanceListBasedOnDateTotalCountAndFind(where,where2,limit,offset);
      }
      else{
        availableData = await adminSideAttendanceListBasedOnDateTotalCountAndFind(where,where2,limit,offset,true);
      }
      return res.status(200).json({
        status: 'success',
        message: 'Employee attendance',
        data: availableData,
      });
       
  } catch (error: any) {

    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
};

const adminSideAttendanceListBasedOnDateTotalCountAndFind =async (where:any,where2:any,limit:number,offset:number,pagination:boolean = false) => {
  
  let countedCollectionData = await UserTableModel.count({
    where,
    include: [
      {
        model: EmployeeTableModel,
        where,
        include: [
          {
            model: UserAttendanceTableModel,
            where:where2,
            required: true, // Set required to false to return empty attendance for employees who don't have attendance on the specified date
          },
        ],
      },
    ]
  });

  
  let yesterday = moment().subtract(1, 'day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
  let today = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');

 
  //getting employee list
  const employeeAttendanceList: any = await UserTableModel.findAll({
    where,
    include: [
      {
        model: EmployeeTableModel,
        where,
        attributes: [
          ['emp_id', 'empId'],
          ['first_name', 'firstName'],
        ],
        include: [
          {
            model: UserAttendanceTableModel,
            attributes: [
              ['id','attendanceId'],
              ['check_in_time', 'checkInTime'],
              ['check_out_time', 'checkOutTime'],
              // ['picutres', 'employeePicture'],
              // ['checkout_picutres', 'employeeCheckoutPicture'],
              'created_at',
              ['check_in_path','checkInPath'],
              ['check_out_path','checkOutPath'],
              ['total_worked_hours','totalWorkedHours'],
              'date',
              [sequelize.literal(`CASE WHEN date ='${today}' THEN true ELSE false END`),'isResetAttendance'],
              [sequelize.literal(`CASE WHEN date ='${today}' OR date ='${yesterday}' THEN true ELSE false END`),'isEditAttendance'] // Add the custom column
        
            ],
            where:where2,
            required: true, // Set required to false to return empty attendance for employees who don't have attendance on the specified date
          },
        ],
      
      },
    ],
    order: [
      [sequelize.col('employee_table->attendance_tables.check_in_time'), 'DESC']
    ],
    raw: true,
    offset: pagination ? offset : undefined, // Add the offset to the query
    limit:pagination ? limit : undefined, // Add the limit to the query
    subQuery: false,
  });

  const employeeAttendanceListWithEmptyAttendance = 
  await Promise.all(
      employeeAttendanceList.map( async (employeeAttendance: any) => {
        // const { empId, firstName, lastName } = employeeAttendance;
        let empId:string = employeeAttendance["employee_table.empId"];
        let firstName:string = employeeAttendance["employee_table.firstName"];
        // let lastName:string = employeeAttendance["employee_table.lastName"];
      
        return {
            attendanceId: employeeAttendance['employee_table.attendance_tables.attendanceId'],
            empId,
            firstName,
            date: moment(employeeAttendance['employee_table.attendance_tables.date']).format('YYYY-MM-DD'),
            checkInImagePath: employeeAttendance['employee_table.attendance_tables.checkInPath'],
            checkOutImagePath: employeeAttendance['employee_table.attendance_tables.checkOutPath'],
            checkInTime: employeeAttendance['employee_table.attendance_tables.checkInTime'],
            checkOutTime: employeeAttendance['employee_table.attendance_tables.checkOutTime'],
            
            isResetAttendance: employeeAttendance["employee_table.attendance_tables.isResetAttendance"],
            isEditAttendance: employeeAttendance["employee_table.attendance_tables.isEditAttendance"],
            totalWorkedHours: employeeAttendance["employee_table.attendance_tables.totalWorkedHours"]
        };
      })
    );

    return {
      totalCount:countedCollectionData,
      data:employeeAttendanceListWithEmptyAttendance
    }
}

const adminSideCheckInOutResetEditableOnTodayAndYesterday = async (req:UserRequest,res:any,next:any)=>{
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try{
    let resetFilter = req.query.reset as string;
    let attendanceId = req.query.attendanceId as string;
    if(validator.isEmpty(resetFilter)){
      status = 400;
      throw new Error("reset filter is required, [checkin,checkout,both] provide any of them");
    }
    if(validator.isEmpty(attendanceId) || !validator.isUUID(attendanceId)){
      status = 400;
      throw new Error("attendanceId is required");
    }

    let today = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');

    const isAttendanceExist:any = await UserAttendanceTableModel.findOne({where:{id:attendanceId,is_deleted:false},raw:true});      
    if(!isAttendanceExist || isAttendanceExist == null || isAttendanceExist == undefined){
      status = 404;
      throw new Error("Attendance does not exist!");
    }
    let atteDate = moment(isAttendanceExist.date).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
    if( atteDate != today){
      status = 400;
      throw new Error("Attendance is not today's attendance!");
    }

    if(resetFilter.trim().toLowerCase() == "checkin"){

      //check if attendance exist or not
      

      //destroy the entry
      const updatedResult: any = await UserAttendanceTableModel.update(
        { is_deleted: true },
        {
          where: {
            id: isAttendanceExist.id,
            company_id: req.companyId,
          },
          transaction: tscn,
        }
      );

      if("0" in updatedResult && updatedResult['0'] > 1){
        //read the check_in_path then find it in the file path and remove it
        let checkInPath = isAttendanceExist.check_in_path;
        if(checkInPath != null){
          try{
             let checkInPathArray = checkInPath.split("/");
            let checkInPathFileName = checkInPathArray[checkInPathArray.length - 1];
            let checkInPathFilePath = checkInPath.replace(checkInPathFileName,"");
            let filePath = path.join(__dirname, '..', 'public',checkInPathFilePath + checkInPathFileName)
            fs.unlinkSync(filePath);
            //if folder is empty remove it
            let folderPath = path.join(__dirname, '..', 'public',checkInPathFilePath);
            if(fs.readdirSync(folderPath).length == 0){
              fs.rmdirSync(folderPath);
            }
          }
          catch(error:any){
            const momentDate = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
            const errorLogPath = path.join(__dirname, '..', 'public', 'log-error',`${req.companyId}`, momentDate);
            if (fs.existsSync(errorLogPath)) {
              await fs.promises.appendFile(path.join(errorLogPath, 'error.log'),"\n"+new Date()+"\n"+ error.message);
            } else {
              fs.mkdirSync(errorLogPath, { recursive: true });
              await fs.promises.writeFile(path.join(errorLogPath, 'error.log'), error.message);
            }
          }

        }

      }
      else{
        status = 500;
        throw new Error("deletion failed!");
      }
      
      await tscn.commit();
      return res.status(200).json({
        status: "success",
        message: "Employee attendance reset successfully"
      });

    }
    else if(resetFilter.trim().toLowerCase() == "checkout"){
      
      //update the check out time and check out path
      const updatedEmployeeAttendance = await UserAttendanceTableModel.update({
        check_out_path:null,
        check_out_time:null,
        total_worked_hours:null,
        updated_at:moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
        updated_by:req.keyId
      },{
        where:{
          id:isAttendanceExist.id,
          company_id:req.companyId,
        },
        transaction:tscn
      });

      if(!('0' in updatedEmployeeAttendance) || updatedEmployeeAttendance['0'] == null || updatedEmployeeAttendance['0'] == undefined || updatedEmployeeAttendance['0'] == 0){
        status = 500;
        throw new Error("updation failed!");
      }

      let checkOutPath = isAttendanceExist.check_out_path;
      try{
          if(checkOutPath != null){
            let checkInPathArray = checkOutPath.split("/");
            let checkInPathFileName = checkInPathArray[checkInPathArray.length - 1];
            let checkInPathFilePath = checkOutPath.replace(checkInPathFileName,"");
            let filePath = path.join(__dirname, '..', 'public',checkInPathFilePath + checkInPathFileName)
            fs.unlinkSync(filePath);
          }
      }
      catch(error:any){
        const momentDate = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
        const errorLogPath = path.join(__dirname, '..', 'public', 'log-error',`${req.companyId}`, momentDate);
        if (fs.existsSync(errorLogPath)) {
          await fs.promises.appendFile(path.join(errorLogPath, 'error.log'),"\n"+new Date()+"\n"+ error.message);
        } else {
          fs.mkdirSync(errorLogPath, { recursive: true });
          await fs.promises.writeFile(path.join(errorLogPath, 'error.log'), error.message);
        }
      }

      await tscn.commit();
      return res.status(200).json({
        status: "success",
        message: "attendance reset successfully"
      });

    }
    else if(resetFilter.trim().toLowerCase() == "both"){

      //destroy the entry
      const deletedResult:any = await UserAttendanceTableModel.destroy({
        where:{
          id:isAttendanceExist.id,
          company_id:req.companyId,
        },
        transaction:tscn
      });

      if(deletedResult == 1){
        //read the check_in_path then find it in the file path and remove it
        let checkInPath = isAttendanceExist.check_in_path;
        try{
  
          if(checkInPath != null){
            let checkInPathArray = checkInPath.split("/");
            let checkInPathFileName = checkInPathArray[checkInPathArray.length - 1];
            let checkInPathFilePath = checkInPath.replace(checkInPathFileName,"");
            let filePath = path.join(__dirname, '..', 'public',checkInPathFilePath + checkInPathFileName)
            fs.unlinkSync(filePath);
          }

          let checkOutPath = isAttendanceExist.check_out_path;
          if(checkOutPath != null){
            let checkInPathArray = checkOutPath.split("/");
            let checkInPathFileName = checkInPathArray[checkInPathArray.length - 1];
            let checkInPathFilePath = checkOutPath.replace(checkInPathFileName,"");
            let filePath = path.join(__dirname, '..', 'public',checkInPathFilePath + checkInPathFileName)
            fs.unlinkSync(filePath);
            //if folder is empty remove it
            let folderPath = path.join(__dirname, '..', 'public',checkInPathFilePath);
            if(fs.readdirSync(folderPath).length == 0){
              fs.rmdirSync(folderPath);
            }
          }

        }
        catch(error:any){
          const momentDate = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
          const errorLogPath = path.join(__dirname, '..', 'public', 'log-error',`${req.companyId}`, momentDate);
          if (fs.existsSync(errorLogPath)) {
            await fs.promises.appendFile(path.join(errorLogPath, 'error.log'),"\n"+new Date()+"\n"+ error.message);
          } else {
            fs.mkdirSync(errorLogPath, { recursive: true });
            await fs.promises.writeFile(path.join(errorLogPath, 'error.log'), error.message);
          }
        }
       
      }
      else{
        status = 500;
        throw new Error("deletion failed!");
      }
      
      await tscn.commit();
      return res.status(200).json({
        status: "success",
        message: "employee attendance reset successfully"
      });

    }
    else{
      status = 400;
      throw new Error("reset filter is required, [checkin,checkout,both] provide any of them");
    }

  }
  catch(error:any){
    await tscn.rollback();
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
}

const adminSideCheckInOutEditableOnTodayAndYesterday = async (req:UserRequest,res:any,next:any)=>{
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try{

      const {attendanceId,checkInTime,checkOutTime} = req.body;
      if(!validator.isUUID(attendanceId) || validator.isEmpty(attendanceId)){
        return res.status(400).json({
          status: "error",
          message: "Invalid attendance id"
        });
      }

      //find the attendance data based on id
      const attendanceData:any = await UserAttendanceTableModel.findOne({
        where:{
          id:attendanceId,
          company_id:req.companyId,
          is_deleted:false,
        },raw:true});

      if(attendanceData == null){
        status = 400;
        throw new Error("attendance data not found");
      }

      // moment().format("HH:mm:ss")
      //check checkInTime format is HH:mm:ss
     
      //check if the date is today or yesterday
      let attDate = moment(attendanceData.date).format('YYYY-MM-DD');
      let attendanceDate = moment(attDate).format('YYYY-MM-DD');
      let yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
      let today = moment().format('YYYY-MM-DD');

    
      if(attendanceDate == yesterday){

        if(validator.isEmpty(checkInTime) || validator.isEmpty(checkOutTime)){
          status = 400;
          throw new Error("checkInTime and checkOutTime is required");
        }

        if(!moment(checkInTime,"HH:mm:ss").isValid()){
          return res.status(400).json({
            status: "error",
            message: "checkInTime format is invalid, 24 hour's HH:mm:ss format required."
          });
        }

        if(!moment(checkOutTime,"HH:mm:ss").isValid()){
          return res.status(400).json({
            status: "error",
            message: "checkInTime format is invalid, 24 hour's HH:mm:ss format required."
          });
        }
  
        //check checkOutTime greater then checkInTime
        if(!moment(checkOutTime,"HH:mm:ss A").isAfter(moment(checkInTime,"HH:mm:ss A"))){
          status = 400;
          throw new Error("check out time must be greater then check in time");
        }

          //calculate the total hour, minutes, seconds 
        let calculatedCheckInTime:any = moment(checkInTime, "HH:mm:ss"); // format will be HH:MM:SS
        let calculatedCheckOutTime:any = moment(checkOutTime,"HH:mm:ss");
        let duration:any = moment.duration(calculatedCheckOutTime.diff(calculatedCheckInTime));
        let hours:any = parseInt(duration.asHours());
        let minutes:any = parseInt(duration.asMinutes()) - hours * 60;
        let seconds:any = parseInt(duration.asSeconds()) - hours * 60 * 60 - minutes * 60;
        
        const updatedEmployeeAttendance = await UserAttendanceTableModel.update({
          check_in_time:checkInTime,
          check_out_time:checkOutTime,
          total_worked_hours:`${hours}:${minutes}:${seconds}`,//`${hours}:${minutes}:${seconds}`
          updated_at:moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
          edit_by:req.email,
          updated_by:req.keyId
        },{
          where:{
            id:attendanceData.id,
            company_id:req.companyId,
          },
          transaction:tscn
        });
        
        if(!('0' in updatedEmployeeAttendance) || updatedEmployeeAttendance['0'] == null || updatedEmployeeAttendance['0'] == undefined || updatedEmployeeAttendance['0'] == 0){
          status = 500;
          throw new Error("updation failed!");
        }
  
        await tscn.commit();
        return res.status(200).json({
          status: "success",
          message: "employee attendance updated successfully"
        });
  
      }
      else if( attendanceDate == today){

        if(!validator.isEmpty(checkOutTime)){

          if(validator.isEmpty(checkInTime) || validator.isEmpty(checkOutTime)){
            status = 400;
            throw new Error("checkInTime and checkOutTime is required");
          }

          if(!moment(checkInTime,"HH:mm:ss").isValid()){
            return res.status(400).json({
              status: "error",
              message: "checkInTime format is invalid, 24 hour's HH:mm:ss format required."
            });
          }

          if(!moment(checkOutTime,"HH:mm:ss").isValid()){
            return res.status(400).json({
              status: "error",
              message: "checkInTime format is invalid, 24 hour's HH:mm:ss format required."
            });
          }
    
          //check checkOutTime greater then checkInTime
          if(!moment(checkOutTime,"HH:mm:ss A").isAfter(moment(checkInTime,"HH:mm:ss A"))){
            status = 400;
            throw new Error("check out time must be greater then check in time");
          }

            //calculate the total hour, minutes, seconds 
          let calculatedCheckInTimeheckInTime:any = moment(checkInTime, "HH:mm:ss"); // format will be HH:MM:SS
          let calculatedCheckOutTime:any = moment(checkOutTime,"HH:mm:ss");
          let duration:any = moment.duration(calculatedCheckOutTime.diff(calculatedCheckInTimeheckInTime));
          let hours:any = parseInt(duration.asHours());
          let minutes:any = parseInt(duration.asMinutes()) - hours * 60;
          let seconds:any = parseInt(duration.asSeconds()) - hours * 60 * 60 - minutes * 60;

          const updatedEmployeeAttendance = await UserAttendanceTableModel.update({
            check_in_time:checkInTime,
            check_out_time:checkOutTime,
            edit_by:req.email,
            total_worked_hours:`${hours}:${minutes}:${seconds}`,
            updated_at:moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
            updated_by:req.keyId
          },{
            where:{
              id:attendanceData.id,
              company_id:req.companyId,
            },
            transaction:tscn
          });
          
          if(!('0' in updatedEmployeeAttendance) || updatedEmployeeAttendance['0'] == null || updatedEmployeeAttendance['0'] == undefined || updatedEmployeeAttendance['0'] == 0){
            status = 500;
            throw new Error("updation failed!");
          }
    
          await tscn.commit();
          return res.status(200).json({
            status: "success",
            message: "employee attendance updated successfully"
          });
        }
        else{

          if(validator.isEmpty(checkInTime)){
            status = 400;
            throw new Error("checkInTime is required");
          }

          if(!moment(checkInTime,"HH:mm:ss").isValid()){
            return res.status(400).json({
              status: "error",
              message: "checkInTime format is invalid, 24 hour's HH:mm:ss format required."
            });
          }


          //check out time available
          if(attendanceData.check_out_time != null){

              //calculate the total hour, minutes, seconds 
            let calculatedCheckInTime:any = moment(checkInTime, "HH:mm:ss"); // format will be HH:MM:SS
            let calculatedCheckOutTime:any = moment(attendanceData.check_out_time,"HH:mm:ss");

            //check out time is greater then check in time
            if(!moment(calculatedCheckOutTime).isAfter(moment(calculatedCheckInTime))){
              status = 400;
              throw new Error("check out time isn't greater then check in time");
            }

            let duration:any = moment.duration(calculatedCheckOutTime.diff(calculatedCheckInTime));
            let hours:any = parseInt(duration.asHours());
            let minutes:any = parseInt(duration.asMinutes()) - hours * 60;
            let seconds:any = parseInt(duration.asSeconds()) - hours * 60 * 60 - minutes * 60;

            const updatedEmployeeAttendance = await UserAttendanceTableModel.update({
              check_in_time:checkInTime,
              total_worked_hours:`${hours}:${minutes}:${seconds}`,
              edit_by:req.email,
              updated_at:moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
              updated_by:req.keyId
            },{
              where:{
                id:attendanceData.id,
                company_id:req.companyId,
              },
              transaction:tscn
            });
            
            if(!('0' in updatedEmployeeAttendance) || updatedEmployeeAttendance['0'] == null || updatedEmployeeAttendance['0'] == undefined || updatedEmployeeAttendance['0'] == 0){
              status = 500;
              throw new Error("updation failed!");
            }
      
            await tscn.commit();
            return res.status(200).json({
              status: "success",
              message: "employee attendance updated successfully"
            });
          }
          else{
            const updatedEmployeeAttendance = await UserAttendanceTableModel.update({
              check_in_time:checkInTime,
              edit_by:req.email,
              updated_at:moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
              updated_by:req.keyId
            },{
              where:{
                id:attendanceData.id,
                company_id:req.companyId,
              },
              transaction:tscn
            });
            
            if(!('0' in updatedEmployeeAttendance) || updatedEmployeeAttendance['0'] == null || updatedEmployeeAttendance['0'] == undefined || updatedEmployeeAttendance['0'] == 0){
              status = 500;
              throw new Error("updation failed!");
            }
      
            await tscn.commit();
            return res.status(200).json({
              status: "success",
              message: "employee attendance updated successfully"
            });
          }
        }
      }
      else{
        status=400;
        throw new Error("attendance's date neither today nor yesterday");
      }
  }
  catch(error:any){
    await tscn.rollback();
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
}

const currentDateDeviceEmployeeList = async (req: AttendanceData, res: any,next:any) => {
    let step = 1, status = 200;
    try {

        /**
         * @Pending
         * Mobile level pagination, will be added in the future with required contraints
         */

         let countedCollectionData = await EmployeeTableModel.count({
             where: Sequelize.literal(`company_id = '${req.compId}' and is_active = true and is_deleted = false`)
         });
         if(countedCollectionData <= 0){
             return res.status(status).json({
                 status: "success",
                 data: "No employee found, yet."
             });
         }
        
        step = 2;
        //getting employee list
        const employeeAttendanceList:any = await EmployeeTableModel.findAll({
          where: {
            company_id: req.compId,
            is_deleted:false,
            is_active:true
          },
          attributes: [
            ['emp_id', 'empId'],
            ['first_name', 'firstName'],
            ['last_name', 'lastName'],
          ],
          include: [
            {
              model: UserAttendanceTableModel,
              attributes: [
                ['check_in_time', 'checkInTime'],
                ['check_out_time', 'checkOutTime'],
                'date'
                // ['picutres', 'employeePicture'],
                // ['checkout_picutres', 'employeeCheckoutPicture'],
              ],
              // 
              where: {
                is_deleted: false,
                date: moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
              },
              required: false, // Set required to false to return empty attendance for employees who don't have attendance on the specified date
              order: [[{ model: UserAttendanceTableModel, as: 'attendance_tables' }, 'date', 'DESC'],
                      [{ model: UserAttendanceTableModel, as: 'attendance_tables' }, 'check_in_time', 'DESC']],
            },
            {
              model:UserTableModel,
              attributes:[
                'work_mode'
              ],
              where:{
                work_mode:{
                  [Op.ne]:"wfh"
                }
              }
            }
          ],
          raw: true,
        });
    
        

        const employeeAttendanceListWithEmptyAttendance = employeeAttendanceList.map( (employeeAttendance: any) => {
            const { empId, firstName, lastName } = employeeAttendance;
          
            return {
              empId,
              firstName,
              lastName,
              checkInTime: employeeAttendance['attendance_tables.checkInTime'],
              checkOutTime: employeeAttendance['attendance_tables.checkOutTime'],
            };
          });
    
        res.status(200).json({
          status: 'success',
          message: 'Employee attendance list retrieved successfully',
          data: employeeAttendanceListWithEmptyAttendance,
          totalCount: countedCollectionData,
        });
      } catch(error:any){
        
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
};

const deviceCheckInUsersAttendanceList = async(req: AttendanceData, res: any,next:any) => {
    let step = 1, status = 200;
    try {

        const { date } = req.params;
        const dateFormat = 'DD-MM-YYYY';
        console.log('date ',validator.isDate(date, { format: dateFormat }));
        if (!validator.isDate(date, { format: dateFormat }) || validator.isEmpty(date)) {
            throw new Error('Date is required');
        }
        
        step = 2;
        let attendanceList:any = await UserAttendanceTableModel.findAll({
            where: {
              date: moment(date,'DD-MM-YYYY').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
              company_id: req.compId,
              is_deleted: false,
            },
            attributes: [
                ['check_in_time', 'checkInTime'],
                ['check_out_time', 'checkOutTime'],
                // ['picutres','employeePicture'],
                // ['checkout_picutres','employeeCheckoutPicture'],
            ],
            include: [
              {
                model: EmployeeTableModel,
                attributes: [
                  ['emp_id', 'empId'],
                  ['first_name', 'firstName'],
                  ['last_name', 'lastName'],
                ],
                include: [
                  {
                    model: UserTableModel,
                    attributes: [['email', 'email']],
                  },
                ],
              },
            ],
            raw: true,
          });

        step = 3;
        if (!attendanceList || attendanceList == null || attendanceList == undefined) {
            status = 404;
            throw new Error('No attendance found');
        }
        console.log("attendanceList ",attendanceList);

        //transforming data
        step = 4;
   

        attendanceList =
        //  await Promise.all(
          attendanceList.map(async (attendance: any) => {
        const { checkInTime, checkOutTime, empId, firstName, lastName, email } = attendance;
        // let { employeePicture, employeeCheckoutPicture } = attendance;

        // if (employeePicture != null) {
        //     employeePicture = await sharp(employeePicture)
        //     .resize({ width: Math.round(Math.sqrt(employeePicture.length / 4)), height: Math.round(Math.sqrt(employeePicture.length / 4)) })
        //     .toBuffer();
        // }

        // if (employeeCheckoutPicture != null) {
        //     employeeCheckoutPicture = await sharp(employeeCheckoutPicture)
        //     .resize({ width: Math.round(Math.sqrt(employeeCheckoutPicture.length / 4)), height: Math.round(Math.sqrt(employeeCheckoutPicture.length / 4)) })
        //     .toBuffer();
        // }

        return {
            checkInTime,
            checkOutTime,
            // employeePicture,
            // employeeCheckoutPicture,
            empId,
            firstName,
            lastName,
            email,
        };
        })
        // );

    
        res.status(status).json({
          status: 'success',
          message:"Attendance checked in data received successfully",
          data: attendanceList,
        });

      } catch(error:any){
        
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
}

const deviceCheckOutUserAttendance = async (req: AttendanceData, res: any,next:any) => {
    
    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{
        //getting data from request body
        const attendanceData:AttendanceData = req.body;
        //validating attendance data
        if(validator.isEmpty(attendanceData.deviceId) || attendanceData.deviceId == null || attendanceData.deviceId == undefined || validator.isEmpty(attendanceData.empId as string)){
            status = 400;
            throw new Error("Invalid Input!");
        }

        //checking if checkInLocation is valid
        if(("checkOutLocation" in attendanceData)){
          if(validator.isEmpty(attendanceData.checkOutLocation as string)){

            //convert the string to json
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
         

        }
        else{
          attendanceData.checkOutLocation = '';
        }

        step = 2;
        //@ts-ignore
        if (!req.isBlob){
            status = 403;
            throw new Error("Invalid input of picture file!")
        }
        //@ts-ignore
        const picturesArray = Array.isArray(req.files.picture) ? req.files.picture.flat() : null;
        
        step = 3;
        //check is company exist or not
        const isCompanyExist:any = await CompanyTableModel.findOne({where:{id:req.compId,is_deleted:false},raw:true}) as unknown as CompanyData;
        if(!isCompanyExist || isCompanyExist == null || isCompanyExist == undefined){
            status = 404;
            throw new Error("Company does not exist!");
        }

        step = 4;
        //get the employee detail from the database
        const employeeDataResult:any = await EmployeeTableModel.findOne({where:{emp_id:attendanceData.empId,company_id:req.compId,is_deleted:false},raw:true,attributes:[["user_id", "userId"],["first_name","firstName"],["middle_name","middleName"],["last_name","lastName"],["date_of_birth","dateOfBirth"],["joining_date","joiningDate"],["personal_email","personalEmail"],["mobile","mobile"],["current_address","currentAddress"],["permanent_address","permanentAddress"],["emergency_contact","emergencyContact"],["is_active","isActive"],["both_address_same","bothAddressSame"],["company_id","companyId"],["department_id","departmentId"],["designation_id","designationId"]]});
        if(!employeeDataResult || employeeDataResult == null || employeeDataResult == undefined){
            status = 404;
            throw new Error("Employee does not exist!");
        }

        let employeeData:EmployeeData = employeeDataResult;

        if(employeeData.isActive == false){
            status = 403;
            throw new Error("Employee is not active!");
        }

        step = 5;
        //check is user exist or not
        const isEmailExist:any = await UserTableModel.findOne({where:{id:employeeData.userId,is_deleted:false,is_active:true},raw:true});
        if(!isEmailExist || isEmailExist == null || isEmailExist == undefined){
            status = 404;
            throw new Error("User is not active");
        }

        //check if already checked in or not
        const isAlreadyCheckIn:any = await UserAttendanceTableModel.findOne({where:{user_id:employeeData.userId,is_deleted:false,date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')},raw:true});
        if(isAlreadyCheckIn == null){
            status = 404;
            throw new Error("You need to check in first!");
        }

        step = 6;
        //check if already checked out or not
        const isAlreadyCheckedIn:any = await UserAttendanceTableModel.findOne({where:{user_id:employeeData.userId,is_deleted:false,date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')},attributes:[["check_out_time","checkOutTime"],["check_in_time","checkInTime"]],raw:true});
        if(isAlreadyCheckedIn.checkOutTime != null){
            status = 404;
            throw new Error("Already checked out!");
        }

        step = 7;
        let momentDate:string =  moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
        const imageDir = path.join(__dirname, '..', 'public', 'images',req.compId as string,momentDate,employeeData.userId as string); // Set the directory to save the image
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
            images.push(`/images/${req.compId as string}/${momentDate}/${employeeData.userId as string}/${pictureName}`);
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
        let formattedHours: string = hours.toString().padStart(2, '0');
        let formattedMinutes: string = minutes.toString().padStart(2, '0');
        let formattedSeconds: string = seconds.toString().padStart(2, '0');

        step = 7;
        //update attendance data
        const updateAttendanceData:any = await UserAttendanceTableModel.update(
          {
            check_out_path:images[0],
            total_worked_hours:`${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
            check_out_time:moment().format("HH:mm:ss"),updated_at: moment().utc().toString(),
            check_out_location:validator.isEmpty(attendanceData.checkOutLocation as string) ? {} : attendanceData.checkOutLocation,
            updated_by:employeeData.userId
          },
          {where:
            {user_id:employeeData.userId,
              date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
              is_deleted:false
            },transaction:tscn});
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

const absentEmployeeList = async (req: UserRequest | any, res: any,next:any) => {
  let status = 200, step = 1;
  try{

    const {date} = req.params;
     
    const dateFormat = 'YYYY-MM-DD';
    if (!validator.isDate(date, { format: dateFormat }) || validator.isEmpty(date)) {
        throw new Error('Date is required');
    }

    //if date is future date then throw error
    if(moment(date).isAfter(moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'))){
      status = 400;
      throw new Error("Date is future date!");
    }
      
    let givenDate = moment(date,"YYYY-MM-DD").startOf('day').utcOffset('+05:30').format('YYYY-MM-DD')

    /**
     * 
     [Op.and]:[
              sequelize.where(sequelize.fn('date_trunc', 'day', sequelize.col('date')), testDate),
              {
                company_id:req.companyId,
              },
              {
                is_deleted:false
              }
            ]
     */
    let where: any = {
      [Op.and]:[
        {
          is_deleted: false,
        },
        {
          company_id: req.companyId,
        },
        sequelize.where(sequelize.fn('date_trunc', 'day', sequelize.col('user_table.created_at')), {
          [Op.lte]:givenDate,
        }),

      ],
            
      
    };
    // sequelize.where(sequelize.fn('date_trunc', 'day', sequelize.col('date')), testDate),
    //check if date is yesterday then excludes today's created employee
    // if(moment(date).isSame(moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'))){
    //   where.created_at = {
    //     [Op.lte]:givenDate,
    //   }
    // }
    // else{
    //   //if today's date then also include today's created employee
    //   where.created_at = {
    //     [Op.lte]:givenDate,
    //   }
    // }

    //also check in where condition that employee created_at date is older than given date


    let employeeList:any = await UserTableModel.findAll({
      where,
      attributes: [
        ['id','userId'],
        'email',
        [sequelize.literal('CASE WHEN "attendance_tables"."user_id" IS NOT NULL THEN true ELSE false END'), 'isAttendance'],
      ],
      include: [
        {
          model: UserAttendanceTableModel,
          where: {
            is_deleted: false,
            date: givenDate,
          },
          attributes: [
            'date',
            ['check_in_time', 'checkInTime'],
            ['check_out_time', 'checkOutTime'],
            ['check_in_path','checkInPath'],
            ['check_out_path','checkOutPath'],
            ['total_worked_hours','totalWorkedHours'],
          ],
          required: false,
        },
        {
          model: EmployeeTableModel,
          attributes: [
            ['first_name', 'firstName'],
            ['emp_id', 'empId']
          ],
        },
      ],
      raw: true,
    });

    //if employeeList is empty then return empty array
    if(employeeList.length == 0){
      return res.status(status).json({
        status:"success",
        message:"No absent employee found",
        data:[],
        totalCount:0
      });
    }

    employeeList = employeeList.map((employee:any) => {
      return {
        userId: employee.userId,
        email: employee.email,
        firstName: employee["employee_table.firstName"],
        empId: employee["employee_table.empId"],
        isAttendance: employee.isAttendance,
        date: employee["attendance_tables.date"] ? moment(employee["attendance_tables.date"]).format('YYYY-MM-DD') : null,
        checkInTime: employee["attendance_tables.checkInTime"],
        checkOutTime: employee["attendance_tables.checkOutTime"],
        checkInPath: employee["attendance_tables.checkInPath"],
        checkOutPath: employee["attendance_tables.checkOutPath"],
      }
    })

    let absentEmployeeList:any;

    //if date is yesterday, also count those who has checked in but not checked out
    if(moment(date).isSame(moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'))){
      absentEmployeeList = employeeList.filter((employee:any) => (!employee.isAttendance) || (employee.isAttendance));
    }
    else{ //if date is today's also return employee who has done check in
      absentEmployeeList = employeeList.filter((employee:any) => (!employee.isAttendance) || (employee.checkInTime != null) );
    }
    
      return res.status(status).json({
        status:"success",
        message:"Absent employee list retrieved successfully",
        data:absentEmployeeList,
        totalCount:absentEmployeeList.length
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

const addAbsentEmployeeAttendance = async (req: AttendanceData, res: any,next:any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try{
      //getting data from request body
      const attendanceData:AttendanceData = req.body;

      const dateFormat = 'YYYY-MM-DD';
        if(!validator.isDate(attendanceData.attendanceDate as string, { format: dateFormat }) || validator.isEmpty(attendanceData.attendanceDate as string)){
          status = 400;
          throw new Error("Invalid date, date format should be YYYY-MM-DD");
        }
      //validating attendance data
     
      //check if the date is today or yesterday
      let attDate = moment(attendanceData.attendanceDate).format('YYYY-MM-DD');
      let attendanceDate = moment(attDate).format('YYYY-MM-DD');
      let yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
      //moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')
      let today = moment().format('YYYY-MM-DD');

      //if date is future date then throw error
      if(moment(attendanceDate).isAfter(moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'))){
        status = 400;
        throw new Error("Future date not allow! Please select today or yesterday date");
      }

      if(attendanceDate == yesterday){
        if(validator.isEmpty(attendanceData.deviceId)){
          status = 400;
          throw new Error("Device information is not provided!");
        }
        
        if(validator.isEmpty(attendanceData.userId as string) || !validator.isUUID(attendanceData.userId as string)){
            status = 400;
            throw new Error("Invalid user id!");
        }

        if(validator.isEmpty(attendanceData.checkIntime as string) || !moment(attendanceData.checkIntime as string,"HH:mm:ss").isValid() || validator.isEmpty(attendanceData.checkOuttime as string) || !moment(attendanceData.checkOuttime as string,"HH:mm:ss").isValid()){
          status = 400;
          throw new Error("Invalid check in time or check out time, time format should be HH:mm:ss");
        }

        //check checkOutTime greater then checkInTime
        if(!moment(attendanceData.checkOuttime as string,"HH:mm:ss A").isAfter(moment(attendanceData.checkIntime as string,"HH:mm:ss A"))){
          status = 400;
          throw new Error("check out time must be greater then check in time");
        }
 
        //get company's config working hours
        let listOfCompany:any = await CompanyTableModel.findOne({ where:{is_deleted: false, is_active : true, id:req.companyId}, raw:true})
        let complainceHours = listOfCompany.configuration['work_hours'];
        let halfHours = Math.round(new CommonService().calculateTotalHours(complainceHours) / 2);
        complainceHours = new CommonService().calculateTotalHours(complainceHours);

        //check if the user's attendance is already added or not
        const isAlreadyAdded:any = await UserAttendanceTableModel.findOne({where:{user_id:attendanceData.userId,date:moment(attendanceData.attendanceDate as string).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),is_deleted:false},attributes:[["id","attendanceId"],["check_out_time","checkOutTime"],["check_in_time", "checkInTime"],["user_id","userId"],["employee_id","employeeId"]],raw:true});
        if(isAlreadyAdded != null){
          // if(isAlreadyAdded.checkOutTime == null && isAlreadyAdded.checkInTime != null){

            // if(!moment(attendanceData.checkOuttime as string,"HH:mm:ss A").isAfter(moment(attendanceData.checkInTime as string,"HH:mm:ss A"))){
            //   status = 400;
            //   throw new Error("check out time must be greater then check in time");
            // }
            //calculate the total hour, minutes, seconds 
            let checkInTime:any = moment(attendanceData.checkIntime as string, "HH:mm:ss"); // format will be HH:MM:SS
            let checkOutTime:any = moment(attendanceData.checkOuttime as string,"HH:mm:ss");
            let duration:any = moment.duration(checkOutTime.diff(checkInTime));
            let hours:any = parseInt(duration.asHours());
            let minutes:any = parseInt(duration.asMinutes()) - hours * 60;
            let seconds:any = parseInt(duration.asSeconds()) - hours * 60 * 60 - minutes * 60;
            let formattedHours: string = hours.toString().padStart(2, '0');
            let formattedMinutes: string = minutes.toString().padStart(2, '0');
            let formattedSeconds: string = seconds.toString().padStart(2, '0');

            //calculating the total hours
            let totalHours:number = new CommonService().calculateTotalHours(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);


            const publicPath = path.join(__dirname, '..', 'public');
            let filePath = path.join(publicPath, 'admin', '/defaultAttendanceImage.png');
            const relativePath ="/"+path.relative(publicPath, filePath);
            if (fs.existsSync(filePath)) {
              // const fileData = fs.readFileSync(filePath);
              console.log(`File path: ${filePath}`);
              // console.log(`File data: ${fileData}`);
            } else {
              console.log(`File does not exist: ${filePath}`);
              filePath = "null";
            }

            const updatedEmployeeAttendance = await UserAttendanceTableModel.update({
              check_in_time:attendanceData.checkIntime,
              check_out_time:attendanceData.checkOuttime,
              check_out_path:relativePath,
              total_worked_hours:`${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
              edit_by:req.keyId,
              updated_at:moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
              updated_by:req.keyId
            },{
              where:{
                id:isAlreadyAdded.attendanceId,
                company_id:req.companyId,
              },
              transaction:tscn
            });
            
            if(!('0' in updatedEmployeeAttendance) || updatedEmployeeAttendance['0'] == null || updatedEmployeeAttendance['0'] == undefined || updatedEmployeeAttendance['0'] == 0){
              status = 500;
              throw new Error("updation failed!");
            }

            //check if attendance id exist in leave tables
            const leaveData:any = await EmployeeLeaveModel.findOne({where:{attendance_id:isAlreadyAdded.attendanceId,is_deleted:false},raw:true});
            if(leaveData != null){
              //updating the existing or removing leave entry
              
              
              //check if totalHours is between 5 to 6
              if(totalHours >= halfHours && totalHours < complainceHours){
                //half day work
                let updateResult = await EmployeeLeaveModel.update(
                  {
                    status: 'HALF-DAY',
                    check_in: true,
                    check_out: true,
                    reason: 'Half day work',
                    updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.keyId,
                  },
                  {
                    where: {
                      attendance_id: isAlreadyAdded.attendanceId,
                    },
                    transaction:tscn
                  },
                );

                if(!('0' in updateResult) || updateResult['0'] == null || updateResult['0'] == undefined || updateResult['0'] == 0){
                  status = 500;
                  throw new Error("Employee leave's update failed!");
                }
              }
              else if(totalHours < halfHours){
                let updateResult = await EmployeeLeaveModel.update(
                  {
                    status: 'LEAVE',
                    check_in: true,
                    check_out: true,
                    reason: 'Half day compliance missed',
                    updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.keyId,
                  },
                  {
                    where: {
                      attendance_id: isAlreadyAdded.attendanceId,
                    },
                    transaction:tscn
                  },
                );

                if(!('0' in updateResult) || updateResult['0'] == null || updateResult['0'] == undefined || updateResult['0'] == 0){
                  status = 500;
                  throw new Error("Employee leave's update failed!");
                }
              }
              else{
                //remove leave entry
                let updateResult:any = await EmployeeLeaveModel.update(
                  {
                    is_deleted:true,
                    updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: req.keyId,
                  },
                  {
                    where: {
                      attendance_id: isAlreadyAdded.attendanceId,
                    },
                    transaction:tscn
                  },
                );

                if(!('0' in updateResult) || updateResult['0'] == null || updateResult['0'] == undefined || updateResult['0'] == 0){
                  status = 500;
                  throw new Error("Employee leave's update failed!");
                }

              }

            }
            else{
              //check if user's data available check must be on date 
              const leaveDataAvailable:any = await EmployeeLeaveModel.findOne({
                where:{
                  date: moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                  company_id: req.companyId,
                  user_id: isAlreadyAdded.userId,
                  employee_id: isAlreadyAdded.employeeId,
                  is_deleted:false
                }
              });

              if(leaveDataAvailable != null){
                if(totalHours >= halfHours && totalHours < complainceHours){

                  //updating the existing or removing leave entry
                  let updateResult = await EmployeeLeaveModel.update(
                    {
                      // date: yesterday,
                      attendance_id:isAlreadyAdded.attendanceId,
                      status: 'HALF-DAY',
                      check_in: true,
                      check_out: true,
                      reason: 'Half day work',
                      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                      updated_by: req.keyId,
                    },
                    {
                      where: {
                        date: moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                        company_id: req.companyId,
                        user_id: isAlreadyAdded.userId,
                        employee_id: isAlreadyAdded.employeeId,
                      },
                      transaction:tscn
                    },
                  );
        
                  if(!('0' in updateResult) || updateResult['0'] == null || updateResult['0'] == undefined || updateResult['0'] == 0){
                    status = 500;
                    throw new Error("Employee leave's update failed!");
                  }
        
                  //create new leave entry
                  //new leave entry
        
                }
                else if(totalHours < halfHours){
                  
                  //updating the existing or removing leave entry
                  let updateResult = await EmployeeLeaveModel.update(
                    {
                      // date: yesterday,
                      attendance_id:isAlreadyAdded.attendanceId,
                      status: 'LEAVE',
                      check_in: true,
                      check_out: true,
                      reason: 'Half day compliance missed',
                      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                      updated_by: req.keyId,
                    },
                    {
                      where: {
                        date: moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                        company_id: req.companyId,
                        user_id: isAlreadyAdded.userId,
                        employee_id: isAlreadyAdded.employeeId,
                      },
                      transaction:tscn
                    },
                  );
        
                  if(!('0' in updateResult) || updateResult['0'] == null || updateResult['0'] == undefined || updateResult['0'] == 0){
                    status = 500;
                    throw new Error("Employee leave's update failed!");
                  }
        
                }
                else{
        
                  //updating the existing or removing leave entry
                  let updateResult = await EmployeeLeaveModel.update(
                    {
                      // date: yesterday,
                      attendance_id:isAlreadyAdded.attendanceId,
                      is_deleted:true,
                      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                      updated_by: req.keyId,
                    },
                    {
                      where: {
                        date: moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                        company_id: req.companyId,
                        user_id: isAlreadyAdded.userId,
                        employee_id: isAlreadyAdded.employeeId,
                      },
                      transaction:tscn
                    },
                  );
        
                  if(!('0' in updateResult) || updateResult['0'] == null || updateResult['0'] == undefined || updateResult['0'] == 0){
                    status = 500;
                    throw new Error("Employee leave's update failed!");
                  }
                }
              }
              else{
                //present to half-day new entry
                if(totalHours >= halfHours && totalHours < complainceHours){
                  await EmployeeLeaveModel.create(
                    {
                      attendance_id:isAlreadyAdded.attendanceId,
                      is_deleted:false,
                      status: 'HALF-DAY',
                      check_in: true,
                      check_out: true,
                      reason: 'Half day work',
                      date: moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                      company_id: req.companyId,
                      user_id: isAlreadyAdded.userId,
                      employee_id: isAlreadyAdded.employeeId,
                      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                      created_by: req.keyId,
                    },
                    {
                      transaction:tscn
                    },
                  );
                }
                else if(totalHours < halfHours){ //if below then half day then leave new entry
                  await EmployeeLeaveModel.create(
                    {
                      attendance_id:isAlreadyAdded.attendanceId,
                      is_deleted:false,
                      status: 'LEAVE',
                      check_in: true,
                      check_out: true,
                      reason: 'Half day compliance missed',
                      date: moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                      company_id: req.companyId,
                      user_id: isAlreadyAdded.userId,
                      employee_id: isAlreadyAdded.employeeId,
                      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                      created_by: req.keyId,
                    },
                    {
                      transaction:tscn
                    },
                  );
                }
              }
            }

            await tscn.commit();
            return res.status(200).json({
              status: "success",
              message: "employee attendance updated successfully"
            });
          // }

        }
        
        //get the userEmployee data
        const employeeDataResult:any = await EmployeeTableModel.findOne({where:{user_id:attendanceData.userId,is_deleted:false},raw:true});
        if(!employeeDataResult || employeeDataResult == null || employeeDataResult == undefined){
          status = 404;
          throw new Error("Employee does not exist!");
        }

        //check if image exist in public/admin folder or not
        // let filePath = path.join(__dirname, '..', 'public', 'admin', 'defaultAttendanceImage.png');
        const publicPath = path.join(__dirname, '..', 'public');
        let filePath = path.join(publicPath, 'admin', '/defaultAttendanceImage.png');
        const relativePath ="/"+path.relative(publicPath, filePath) ;
        if (fs.existsSync(filePath)) {
          // const fileData = fs.readFileSync(filePath);
          console.log(`File path: ${filePath}`);
          // console.log(`File data: ${fileData}`);
        } else {
          console.log(`File does not exist: ${filePath}`);
          filePath = "null";
        }

        let totalWorkedHours:any = new CommonService().calculateDurationOnCheckInCheckOut(attendanceData.checkIntime as string,attendanceData.checkOuttime as string);

        //add attendance data
        let insertedData:any = await UserAttendanceTableModel.create({
            device_id:attendanceData.deviceId,
            date:moment(attendanceData.attendanceDate as string).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
            check_in_time:attendanceData.checkIntime,
            check_out_time:attendanceData.checkOuttime,
            company_id:req.companyId,
            user_id:attendanceData.userId,
            is_deleted:false,
            employee_id:employeeDataResult.id,
            total_worked_hours:totalWorkedHours,
            check_in_path:relativePath,
            check_out_path:relativePath,
            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
            created_by: req.keyId,
            added_by:req.keyId
        },{transaction:tscn});


        console.log('inserted id\t',insertedData.id);
        //calculating the total hours
        let totalHours:number = new CommonService().calculateTotalHours(totalWorkedHours);

        if(totalHours >= halfHours && totalHours < complainceHours){

          //updating the existing or removing leave entry
          let updateResult = await EmployeeLeaveModel.update(
            {
              // date: yesterday,
              attendance_id:insertedData.id,
              status: 'HALF-DAY',
              check_in: true,
              check_out: true,
              reason: 'Half day work',
              updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
              updated_by: req.keyId,
            },
            {
              where: {
                date: moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                company_id: req.companyId,
                user_id: insertedData.user_id,
                employee_id: insertedData.employee_id,
              },
              transaction:tscn
            },
          );

          if(!('0' in updateResult) || updateResult['0'] == null || updateResult['0'] == undefined || updateResult['0'] == 0){
            status = 500;
            throw new Error("Employee leave's update failed!");
          }

          //create new leave entry
          //new leave entry

        }
        else if(totalHours < halfHours){
           //updating the existing or removing leave entry
           let updateResult = await EmployeeLeaveModel.update(
            {
              attendance_id:insertedData.id,
              status: 'LEAVE',
              check_in: true,
              check_out: true,
              reason: 'Half day compliance missed',
              updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
              updated_by: req.keyId,
            },
            {
              where: {
                date: moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                company_id: req.companyId,
                user_id: insertedData.user_id,
                employee_id: insertedData.employee_id,
              },
              transaction:tscn
            },
          );
 
          if(!('0' in updateResult) || updateResult['0'] == null || updateResult['0'] == undefined || updateResult['0'] == 0){
            status = 500;
            throw new Error("Employee leave's update failed!");
          }
        }
        else{

           //updating the existing or removing leave entry
           let updateResult = await EmployeeLeaveModel.update(
            {
              // date: yesterday,
              // date:moment(yesterday).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
              attendance_id:insertedData.id,
              is_deleted:true,
              updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
              updated_by: req.keyId,
            },
            {
              where: {
                date: moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                company_id: req.companyId,
                user_id: insertedData.user_id,
                employee_id: insertedData.employee_id,
              },
              transaction:tscn
            },
          );

          if(!('0' in updateResult) || updateResult['0'] == null || updateResult['0'] == undefined || updateResult['0'] == 0){
            status = 500;
            throw new Error("Employee leave's update failed!\nMake sure you have leave data available.");
          }

        }

        await tscn.commit();
        res.status(200).json({
            status:"success",
            message:"Attendance added successfully",
        });

      }
      else if(attendanceDate == today){
        if(validator.isEmpty(attendanceData.deviceId)){
          status = 400;
          throw new Error("Device information is not provided!");
        }
        
        if(validator.isEmpty(attendanceData.userId as string) || !validator.isUUID(attendanceData.userId as string)){
            status = 400;
            throw new Error("Invalid user id!");
        }

        const dateFormat = 'YYYY-MM-DD';
        if(!validator.isDate(attendanceData.attendanceDate as string, { format: dateFormat }) || validator.isEmpty(attendanceData.attendanceDate as string)){
          status = 400;
          throw new Error("Invalid date, date format should be YYYY-MM-DD");
        }

        if(validator.isEmpty(attendanceData.checkIntime as string) || !moment(attendanceData.checkIntime as string,"HH:mm:ss").isValid()){
          status = 400;
          throw new Error("Invalid check in time format should be HH:mm:ss");
        }

        //if checkInTime is greater than current time then throw error
        if(moment(attendanceData.checkIntime as string,"HH:mm:ss").isAfter(moment())){
          status = 400;
          throw new Error("Check in time is greater than current time!");
        }

        //check if the user's attendance is already added or not
        // const isAlreadyAdded:any = await UserAttendanceTableModel.findOne({where:{user_id:attendanceData.userId,date:moment(attendanceData.attendanceDate as string).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),is_deleted:false},attributes:[["id","attendanceId"]],raw:true});
        // if(isAlreadyAdded != null){
        //   status = 404;
        //   throw new Error("Attendance exist!");
        // }

        //get the userEmployee data
        const employeeDataResult:any = await EmployeeTableModel.findOne({where:{user_id:attendanceData.userId,is_deleted:false},raw:true});
        if(!employeeDataResult || employeeDataResult == null || employeeDataResult == undefined){
          status = 404;
          throw new Error("Employee does not exist!");
        }

        //check if image exist in public/admin folder or not
        const publicPath = path.join(__dirname, '..', 'public');
        let filePath = path.join(publicPath, 'admin', '/defaultAttendanceImage.png');
        const relativePath = "/"+path.relative(publicPath, filePath);
        if (fs.existsSync(filePath)) {
          // const fileData = fs.readFileSync(filePath);
          console.log(`File path: ${filePath}`);
          // console.log(`File data: ${fileData}`);
        } else {
          console.log(`File does not exist: ${filePath}`);
          filePath = "null";
        }

        //check if user attendance is exist
        const isUserAttendanceExist:any = await UserAttendanceTableModel.findOne({
          where:{user_id:attendanceData.userId,date:moment(attendanceData.attendanceDate as string).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
          is_deleted:false},
          raw:true});
        
        //if exist update it
        if(isUserAttendanceExist){
          const updateAttendanceData:any = await UserAttendanceTableModel.update(
            {
              check_in_time:attendanceData.checkIntime,
              check_in_path:relativePath,
              edit_by:req.keyId,
              updated_at:moment().format('YYYY-MM-DD HH:mm:ss'),
              updated_by:req.keyId
            },
            {where:
              {user_id:attendanceData.userId,
                date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                is_deleted:false
              },transaction:tscn});
            if(!('0' in updateAttendanceData) || updateAttendanceData['0'] == null || updateAttendanceData['0'] == undefined || updateAttendanceData['0'] == 0){
                status = 500;
                throw new Error("Check in failed!");
            }

            await tscn.commit();
            res.status(200).json({
                status:"success",
                message:"Attendance updated successfully",
            });
        }
        else{
          
            //add attendance data
            await UserAttendanceTableModel.create({
              device_id:attendanceData.deviceId,
              date:moment(attendanceData.attendanceDate as string).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
              check_in_time:attendanceData.checkIntime,
              // check_out_time:attendanceData.checkOuttime,
              company_id:req.companyId,
              user_id:attendanceData.userId,
              is_deleted:false,
              employee_id:employeeDataResult.id,
              check_in_path:relativePath,
              // check_out_path:relativePath,
              created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
              created_by: req.keyId,
              added_by:req.keyId
          });

          await tscn.commit();
          res.status(200).json({
              status:"success",
              message:"Attendance added successfully",
          });

        }

      }
      else{
        status = 400;
        throw new Error("Only yesterday and today date allowed!");
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
}

const beforeCheckInCheckOutDeviceOtp = async (req: AttendanceData, res: any,next:any) => {

  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try{

    const employeeIdentityData:string = req.body.empId;
    const mode = req.body.mode;

    if(mode == "checkin"){
      if(validator.isEmpty(employeeIdentityData) || employeeIdentityData == null || employeeIdentityData == undefined){
        status = 400;
        throw new Error("Employee identity number is required!");
      }

      step = 2;
      //check is employee exists
      const employeeDataResult:any = await EmployeeTableModel.findOne({where:{emp_id:employeeIdentityData.trim(),company_id:req.compId,is_deleted:false},raw:true});
      if(!employeeDataResult || employeeDataResult == null || employeeDataResult == undefined){
        status = 404;
        throw new Error("Employee not found!");
      }

      step = 3;
      //check if already checked in or not
      // const isAlreadyCheckedIn:any = await UserAttendanceTableModel.findOne({where:{company_id:req.compId,user_id:employeeDataResult.user_id,is_deleted:false,date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')},raw:true});

      // if(isAlreadyCheckedIn != null){
      //     status = 404;
      //     throw new Error("Already checked in!");
      // }

      //generate 6 digit otp
      step = 4;
      const otp:string = Math.floor(100000 + Math.random() * 900000).toString();

      //get user email id
      const userEmail:any = await UserTableModel.findOne({where:{id:employeeDataResult.user_id,is_deleted:false,is_active:true,company_id:req.compId},raw:true});
      if(!userEmail || userEmail == null || userEmail == undefined){
          status = 404;
          throw new Error("Employee doesn't found!");
      }

      step = 5;
      //update the otp in attendance table
      const updateOtp:any = await EmployeeTableModel.update({otp:otp, otp_date:moment().utc().toString(), updated_at: moment().utc().toString(), updated_by:employeeDataResult.user_id},{where:{company_id:req.compId,user_id:employeeDataResult.user_id,is_deleted:false},transaction:tscn});
      if(!('0' in updateOtp) || updateOtp['0'] == null || updateOtp['0'] == undefined || updateOtp['0'] == 0){
          status = 500;
          throw new Error("Otp update failed!");
      }

      let htmlFilePath:string = path.join(__dirname,'..','emails','company-employee-otp-email-template.html');
              
      let htmlContent = pug.renderFile(htmlFilePath,{
          orgOTP:otp,
          employeeName:employeeDataResult.first_name,
          teamName:process.env.PROJECT_SUPPORT_EMAIL
      });

      step = 6;
      // let mailSend = 
       new SMTP.SmtpService().sendMail(userEmail.email, htmlContent, "Time Tango | Employee Check-in OTP");
      // if(!mailSend){
      //     status = 500;
      //     throw new Error("OTP Mail send failed!");
      // }

      await tscn.commit();
      res.status(200).json({
          status:"success",
          message:"OTP sent to your mail successfully",
      });    
    }
    else if(mode == "checkout"){

      step = 7;
      if(validator.isEmpty(employeeIdentityData) || employeeIdentityData == null || employeeIdentityData == undefined){
        status = 400;
        throw new Error("Employee identity number is required!");
      }

      step = 8;
      //check is employee exists
      const employeeDataResult:any = await EmployeeTableModel.findOne({where:{emp_id:employeeIdentityData.trim(),company_id:req.compId,is_deleted:false},raw:true});
      if(!employeeDataResult || employeeDataResult == null || employeeDataResult == undefined){
        status = 404;
        throw new Error("Employee doesn't found!");
      }

      step = 9;
      const userEmail:any = await UserTableModel.findOne({where:{id:employeeDataResult.user_id,is_deleted:false,is_active:true,company_id:req.compId},raw:true});
      if(!userEmail || userEmail == null || userEmail == undefined){
          status = 404;
          throw new Error("Employee doesn't found!");
      }

      step = 10;
      //check if already checked out or not
      const isAlreadyCheckedIn:any = await UserAttendanceTableModel.findOne({where:{user_id:employeeDataResult.user_id,is_deleted:false,company_id:req.compId,date:moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),check_out_time:{[Op.ne]:null}},raw:true});

      if(isAlreadyCheckedIn != null){
          status = 404;
          throw new Error("Already checked out!");
      }

      //get the user otp from attendance table
      step = 11;
      const userOtp:any = await EmployeeTableModel.findOne({where:{user_id:employeeDataResult.user_id,company_id:req.compId,is_deleted:false},raw:true});
      if(!userOtp || userOtp == null || userOtp == undefined){
          status = 404;
          throw new Error("Otp not found!");
      }

      let htmlFilePath:string = path.join(__dirname,'..','emails','company-employee-otp-email-template.html');
              
      let htmlContent = pug.renderFile(htmlFilePath,{
          orgOTP:userOtp.otp,
          employeeName:employeeDataResult.first_name,
          teamName:process.env.PROJECT_SUPPORT_EMAIL
      });

      step = 12;
      // let mailSend =
        new SMTP.SmtpService().sendMail(userEmail.email, htmlContent, "Time Tango | Employee Check-in OTP");
      // if(!mailSend){
      //     status = 500;
      //     throw new Error("OTP Mail send failed!");
      // }

      await tscn.commit();
      res.status(200).json({
          status:"success",
          message:"OTP sent to your mail successfully",
      }); 

    }
    else{
      status = 400;
      throw new Error("Invalid mode, provide either checkout or checkin!");
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
}

const beforeCheckInCheckOutDeviceOtpValidation = async(req:any,res:any,next:any)=>{

  let step = 1, status = 200;

  try{

    const empId:string = req.body.empId+"";
    const otp:string = req.body.otp+"";

    if(validator.isEmpty(empId) || empId == null || empId == undefined){
      status = 400;
      throw new Error("Employee identity number is required!");
    }

    //check is otp is 6 digit or not
    if(!validator.isLength(otp,{min:6,max:6})){
      status = 400;
      throw new Error("Invalid otp!");
    }

    //check is otp is number or not
    if(!validator.isNumeric(otp)){
      status = 400;
      throw new Error("OTP must be in 6 digit number!");
    }

    //check is otp today's otp or not in the employee table
    const employeeDataResult:any = await EmployeeTableModel.findOne({where:{emp_id:empId.trim(),company_id:req.compId,is_deleted:false},raw:true});
    if(!employeeDataResult || employeeDataResult == null || employeeDataResult == undefined){
      status = 404;
      throw new Error("Employee doesn't found!");
    }

    //check if otp is valid or not
    if(employeeDataResult.otp != otp && employeeDataResult.otp_date != moment().utc().toString()){
      status = 400;
      throw new Error("Invalid OTP!");
    }

    return res.status(status).json({
      status:"success",
      message:"OTP verified successfully",
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

const getCompanyConfigurationApp = async (req:AttendanceData,res: any,next:any) => {
  let step = 1, status = 200;
  try {

      if(!req.compId || req.compId == null || req.compId == undefined || validator.isEmpty(req.compId)){
          status = 400;
          throw new Error("Invalid Input!");
      }

      step = 2;
      let getCompanyData:any = await CompanyTableModel.findOne({where:{[Op.and]:[{id:req.compId, is_deleted:false}]},raw:true,attributes:[["id","compId"],["configuration","companyConfiguration"]]});
      if(!getCompanyData || getCompanyData == null || getCompanyData == undefined) {
        status = 404;
        throw new Error("Company does not exist!");
      }

      // let companyConfiguration:any = getCompanyData.companyConfiguration.app ? getCompanyData.companyConfiguration.app : {};
      let companyConfiguration:any = {app:getCompanyData.companyConfiguration.app,visitors:getCompanyData.companyConfiguration.visitors};

      res.status(200).json({
        status: 'success',
        message: 'Company configuration retrieved successfully',
        data: {
          companyConfiguration
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

const getCompanyConfigurationWeb = async (req:AttendanceData,res: any,next:any) => {
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
      
      let companyConfiguration:configuration = getCompanyData.companyConfiguration.web ? getCompanyData.companyConfiguration.web : {};

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

const adminGetCompanyConfiguration = async (req:AttendanceData,res: any,next:any) => {
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
      
      let companyConfiguration:configuration = getCompanyData.companyConfiguration ? getCompanyData.companyConfiguration : {};

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

const adminUpdateCompanyConfiguration = async (req: AttendanceData, res: any, next: any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try {
    //getting data from request body
    const attendanceData: AttendanceData = req.body;
    //validating configuration data
    const requiredKeys = ['configuration'];
    
    // Check if the required keys are present in the JSON body
    for (const key of requiredKeys) {
      if (!(key in req.body)) {
        // return res.status(400).json({ error: `Missing key: ${key}` });
        status = 400;
        throw new Error("Invalid input!");
      }
    }
    
    // Check the types and structure of nested objects
    const { configuration } = req.body;

    // Validate the "work_hours" format using a regular expression
    // const workHoursRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

    if (!validator.isEmpty(new CommonService().companyConfigValidation(configuration))) {
      status = 400;
      throw new Error(new CommonService().companyConfigValidation(configuration));
    }

    step = 2;
    //update attendance data
    const updateResult = await CompanyTableModel.update({
      configuration: attendanceData.configuration,
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      updated_by: req.keyId
    }, { where: { id: req.companyId }, transaction: tscn });

    if(!('0' in updateResult) || updateResult['0'] == null || updateResult['0'] == undefined || updateResult['0'] == 0){
        status = 500;
        throw new Error("Update company configuration failed!");
    }


    await tscn.commit();
    res.status(200).json({
      status: "success",
      message: "Company configuration updated successfully",
    });

  }
  catch (error: any) { 
    await tscn.rollback();
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
};


const reportFilter = async (req:any,res: any,next:any) => {
  let status = 200, step = 1;
  try{
    const date = req.query.date as string || "";
    const userEmployeeName = req.query.name as string || "";
    const isExport = req.query.export as string || "false";
    const page = req.query.page as string || "1";
    let limit = req.query.limit as string || "10";

    //check page and limit are positive integer or not
    if(!validator.isInt(page,{min:1})){
      status = 400;
      throw new Error("Invalid page value! Page value must be positive integer");
    }
    if(!validator.isInt(limit,{min:1})){
      status = 400;
      throw new Error("Invalid limit value! Limit value must be positive integer");
    }

    const offset:number = (+page - 1) * +limit;
    
    //if date is not empty and name is empty
    if(!validator.isEmpty(date) && validator.isEmpty(userEmployeeName)){
      //check if date is valid or not
      if(!moment(date,'YYYY-MM',true).isValid() && !moment(date,'YYYY-MM-DD',true).isValid()){
        status = 400;
        throw new Error("Invalid date format! Date format must be YYYY-MM-DD or YYYY-MM");
      }

      let dateFormat = 'YYYY-MM';
      if (moment(date, 'YYYY-MM', true).isValid()) {
        dateFormat = 'YYYY-MM';
      } else if (moment(date, 'YYYY-MM-DD', true).isValid()) {
        dateFormat = 'YYYY-MM-DD';
      } else {
        status = 400;
        throw new Error('Invalid date format! Date format must be YYYY-MM-DD or YYYY-MM');
      }

      if(dateFormat == "YYYY-MM"){
        //get all the data of the month
        let startDate:string = moment(date,"YYYY-MM").startOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
        let endDate:string = moment(date,"YYYY-MM").endOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
        const isCurrentMonth = moment().isSame(startDate, 'month');

        // Define the where clause for the query
        const where = {
          company_id: req.companyId,
          is_deleted: false,
          date: {
            [Op.between]: [startDate, endDate]
          }
        };

        // If the month is the current month, exclude today's attendance record
        if (isCurrentMonth) {
          where.date = {
            [Op.between]: [startDate, moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ssZ')]
          };
        }

        if(isExport === 'true'){

          let where2 = {
            company_id:req.companyId
          };

          let employeeAttendanceCount = await countsUserAttendance(where,where,"Report Filter",step,req.companyId);

          let employeeAttendanceList:any = await findsUserEmployeeAttendance(where,where2,"Report Filter",step,+limit,offset);

        
          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              totalCount:employeeAttendanceCount,
              employeeAttendanceList:employeeAttendanceList
            }
          });

        }
        else{
          //with pagination
          let where2 = {
            company_id:req.companyId
          };
          let employeeAttendanceCount = await countsUserAttendance(where,where2,"Report Filter",step,req.companyId);

          let employeeAttendanceList:any = await findsUserEmployeeAttendance(where,where2,"Report Filter",step,+limit,offset,true);

          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              totalCount:employeeAttendanceCount,
              employeeAttendanceList:employeeAttendanceList
            }
          });
        }
      }
      else if(dateFormat == "YYYY-MM-DD"){

        //get all data of single date
        let startDate:string = moment(date,"YYYY-MM-DD").startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
        //moment date in YYYY-MM-DD format only
        let testDate = moment(date,"YYYY-MM-DD").format('YYYY-MM-DD');

        if(isExport === 'true'){
          
          let where2 = {
            company_id:req.companyId
          }
          //count total number of employee attendance
          let employeeAttendanceCount:number = await countsUserAttendance({
            company_id:req.companyId,
            is_deleted:false,
            date:startDate              
          },where2, "Report Filter",step,req.companyId);
         

          let employeeAttendanceList:any = await findsUserEmployeeAttendance({
            [Op.and]:[
              sequelize.where(sequelize.fn('date_trunc', 'day', sequelize.col('date')), testDate),
              {
                company_id:req.companyId,
              },
              {
                is_deleted:false
              }
            ]
          },where2, "Report Filter",step,+limit,offset);
          
          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              totalCount:employeeAttendanceCount,
              employeeAttendanceList:employeeAttendanceList
            }
          });
        }
        else{

          let where2= {
            company_id:req.companyId
          }

          //count total number of employee attendance
          let employeeAttendanceCount:number = await countsUserAttendance({
            company_id:req.companyId,
            is_deleted:false,
            date:startDate              
          },where2, "Report Filter",step,req.companyId);

          let employeeAttendanceList:any = await findsUserEmployeeAttendance({
            [Op.and]:[
              sequelize.where(sequelize.fn('date_trunc', 'day', sequelize.col('date')), testDate),
              {
                company_id:req.companyId,
              },
              {
                is_deleted:false
              }
            ]
          },where2,"Report Filter",step,+limit,offset,true);


          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              totalCount:employeeAttendanceCount,
              employeeAttendanceList:employeeAttendanceList
            }
          });          
        }
      }
      else{
        status = 400;
        throw new Error("Invalid date format! Date format must be YYYY-MM-DD or YYYY-MM");
      }

    }
    //if name is not empty and date is empty
    else if(!validator.isEmpty(userEmployeeName) && validator.isEmpty(date)){

      let todaysSkipDate:string = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');

      // --------------------------------------------------------
      let where:any = {
        company_id:req.companyId,
        is_deleted:false,
        date:{
          [Op.lt]:todaysSkipDate
        }           
      }

      let isEmployeeValue = await new CommonService().getValidateUUIDWithEmployee(userEmployeeName,req.companyId);
      if(typeof isEmployeeValue == "string"){
        status = 404;
        throw new Error(isEmployeeValue);
      }

      if(isExport === 'true'){

        let employeeAttendanceCount:number = await countsUserAttendance(where,
        {
          company_id:req.companyId,
          // first_name:{
          //   [Op.iLike]:`%${userEmployeeName}%`
          // }
          user_id:userEmployeeName
        }, "Report Filter",step,req.companyId);
         
        let employeeAttendanceList:any = await findsUserEmployeeAttendance(where,
        {
          company_id:req.companyId,
          // first_name:{
          //   [Op.iLike]:`%${userEmployeeName}%`
          // }
          user_id:userEmployeeName
        }, "Report Filter",step,+limit,offset);

        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            totalCount:employeeAttendanceCount,
            employeeAttendanceList:employeeAttendanceList
          }
        });
      }
      else{
        
        let employeeAttendanceCount:any = await countsUserAttendance(where,{
          company_id:req.companyId,
          // first_name:{
          //   [Op.iLike]:`%${userEmployeeName}%`
          // }
          user_id:userEmployeeName

        }, "Report Filter",step,req.companyId);
        
  
        let employeeAttendanceList:any = await findsUserEmployeeAttendance(where,{
          company_id:req.companyId,
          // first_name:{
          //   [Op.iLike]:`%${userEmployeeName}%`
          // }
          user_id:userEmployeeName
        }, "Report Filter",step,+limit,offset,true);
        
        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            totalCount:employeeAttendanceCount,
            employeeAttendanceList:employeeAttendanceList
          }
        });

      }
      
    }
    //if name and date both are not empty
    else if(!validator.isEmpty(date) && !validator.isEmpty(userEmployeeName)){
      //check if date is valid or not
      if(!moment(date,'YYYY-MM',true).isValid() && !moment(date,'YYYY-MM-DD',true).isValid()){
        status = 400;
        throw new Error("Invalid date format! Date format must be YYYY-MM-DD or YYYY-MM");
      }

      let dateFormat = 'YYYY-MM';
      if (moment(date, 'YYYY-MM', true).isValid()) {
        dateFormat = 'YYYY-MM';
      } else if (moment(date, 'YYYY-MM-DD', true).isValid()) {
        dateFormat = 'YYYY-MM-DD';
      } else {
        status = 400;
        throw new Error('Invalid date format! Date format must be YYYY-MM-DD or YYYY-MM');
      }

      let isEmployeeValue = await new CommonService().getValidateUUIDWithEmployee(userEmployeeName,req.companyId);
      if(typeof isEmployeeValue == "string"){
        status = 404;
        throw new Error(isEmployeeValue);
      }

      if(dateFormat == "YYYY-MM"){
        //get all the data of the month
        let startDate:string = moment(date,"YYYY-MM").startOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
        let endDate:string = moment(date,"YYYY-MM").endOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
        if(isExport === 'true'){

          //count total number of employee attendance
          let employeeAttendanceCount:any =  await countsUserAttendance({
            company_id:req.companyId,
            is_deleted:false,
            date:{
              [Op.between]:[startDate,endDate]
            }
          },{
            company_id:req.companyId,
            // first_name:{
            //   [Op.iLike]:`%${userEmployeeName}%`
            // }
            user_id:userEmployeeName
          }, "Report Filter",step,req.companyId);


          let employeeAttendanceList:any = await findsUserEmployeeAttendance({
            company_id:req.companyId,
            is_deleted:false,
            date:{
              [Op.between]:[startDate,endDate]
            }
          },{
            company_id:req.companyId,
            // first_name:{
            //   [Op.iLike]:`%${userEmployeeName}%`
            // }
            user_id:userEmployeeName
          }, "Report Filter",step,+limit,offset);

          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              totalCount:employeeAttendanceCount,
              employeeAttendanceList:employeeAttendanceList
            }
          });

        }
        //with pagination
        else{
          //count total number of employee attendance
          let employeeAttendanceCount:any = 
          await countsUserAttendance({
            company_id:req.companyId,
            is_deleted:false,
            date:{
              [Op.between]:[startDate,endDate]
            }
          },{
            company_id:req.companyId,
            // first_name:{
            //   [Op.iLike]:`%${userEmployeeName}%`
            // }
            user_id:userEmployeeName

          },"Report Filter",step,req.companyId);


          let employeeAttendanceList:any = await findsUserEmployeeAttendance({
            company_id:req.companyId,
            is_deleted:false,
            date:{
              [Op.between]:[startDate,endDate]
            }
          },{
            company_id:req.companyId,
            // first_name:{
            //   [Op.iLike]:`%${userEmployeeName}%`
            // }
            user_id:userEmployeeName
          }, "Report Filter",step,+limit,offset,true);

          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              totalCount:employeeAttendanceCount,
              employeeAttendanceList:employeeAttendanceList
            }
          });
        }
      }
      else if(dateFormat == "YYYY-MM-DD"){

        //get all data of single date
        let startDate:string = moment(date,"YYYY-MM-DD").startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
        //moment date in YYYY-MM-DD format only
        let testDate = moment(date,"YYYY-MM-DD").format('YYYY-MM-DD');

        if(isExport === 'true'){

          //count total number of employee attendance
          let employeeAttendanceCount:any = await countsUserAttendance({
            company_id:req.companyId,
            is_deleted:false,
            date:startDate              
          },{
            is_deleted:false,
            is_active:true,
            company_id:req.companyId,
            // first_name:{
            //   [Op.iLike]:`%${userEmployeeName}%`
            // }
            user_id:userEmployeeName

          },"Report Filter",step,req.companyId);

         
          let employeeAttendanceList:any = await findsUserEmployeeAttendance({
            [Op.and]:[
              sequelize.where(sequelize.fn('date_trunc', 'day', sequelize.col('date')), testDate),
              {
                company_id:req.companyId,
              },
              {
                is_deleted:false
              }
            ]
          },{
            company_id:req.companyId,
            first_name:{
              [Op.iLike]:`%${userEmployeeName}%`
            }
          }, "Report Filter",step,+limit,offset);

          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              totalCount:employeeAttendanceCount,
              employeeAttendanceList:employeeAttendanceList
            }
          });
        }
        //with pagination
        else{

          //count total number of employee attendance
          let employeeAttendanceCount:any = await countsUserAttendance({
            company_id:req.companyId,
            is_deleted:false,
            date:startDate              
          },{
            is_deleted:false,
            is_active:true,
            company_id:req.companyId,
            // first_name:{
            //   [Op.iLike]:`%${userEmployeeName}%`
            // }
            user_id:userEmployeeName

          },"Report Filter",step,req.companyId);

          let employeeAttendanceList:any = await findsUserEmployeeAttendance({
            [Op.and]:[
              sequelize.where(sequelize.fn('date_trunc', 'day', sequelize.col('date')), testDate),
              {
                company_id:req.companyId,
              },
              {
                is_deleted:false
              }
            ]
          },{
            company_id:req.companyId,
            first_name:{
              [Op.iLike]:`%${userEmployeeName}%`
            }
          }, "Report Filter",step,+limit,offset,true);

          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              totalCount:employeeAttendanceCount,
              employeeAttendanceList:employeeAttendanceList
            }
          });          
        }
      }
      else{
        status = 400;
        throw new Error("Invalid date format! Date format must be YYYY-MM-DD or YYYY-MM");
      }
      
    }
    //if name and date both are empty
    else if(validator.isEmpty(date) && validator.isEmpty(userEmployeeName)){
      let todaysSkipDate:string = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');

      // --------------------------------------------------------
      let where:any = {
        company_id:req.companyId,
        is_deleted:false,
        date:{
          [Op.lt]:todaysSkipDate
        }           
      }
      if(isExport === 'true'){

        //count total number of employee attendance
        let employeeAttendanceCount:any = await countsUserAttendance(where,{
          company_id:req.companyId,
        },"Report Filter",step,req.companyId);

        let employeeAttendanceList:any = await findsUserEmployeeAttendance(where,{
          company_id:req.companyId,
        }, "Report Filter",step,+limit,offset);


        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            totalCount:employeeAttendanceCount,
            employeeAttendanceList:employeeAttendanceList
          }
        });

      }
      //with pagination
      else{
        //count total number of employee attendance
        let employeeAttendanceCount:any = await countsUserAttendance(where,{
          company_id:req.companyId,
        },"Report Filter",step,req.companyId);

        let employeeAttendanceList:any = await findsUserEmployeeAttendance(where,{
          company_id:req.companyId,
        }, "Report Filter",step,+limit,offset,true);

        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            totalCount:employeeAttendanceCount,
            employeeAttendanceList:employeeAttendanceList
          }
        });
      }
      // status = 400;
      // throw new Error("Invalid Input! Provide either date or name");
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



const countsUserAttendance = async (where1:any,where2:any,controller:string,step:number,companyId:string):Promise<number> => {

  try{
    let employeeAttendanceCount:number = await UserAttendanceTableModel.count({
      where:where1,
      include:[
        {
          model:EmployeeTableModel,
          where:where2
        }
      ]
    });

    return employeeAttendanceCount;
  }
  catch(error:any){
    console.log(`step ${step} error: ${error} on controller ${controller}`);
    return 0;
  }

}

const findsUserEmployeeAttendance = async (where1:any,where2:any,controller:string,step:number,limit:number,offset:number,pagination:boolean = false):Promise<any> => {
  try{
    let employeeAttendanceList:any = await UserAttendanceTableModel.findAll({
      where:where1,
      attributes:[
        ['check_in_time','checkInTime'],
        ['check_out_time','checkOutTime'],
        [sequelize.literal(`to_char(date, 'YYYY-MM-DD')`), 'date'],
        ['check_in_path','checkInPath'],
        ['check_out_path','checkOutPath'],
      ],
      include:[
        {
          model:EmployeeTableModel,
          attributes:[
            ['emp_id','empId'],
            ['first_name','firstName'],
          ],
          where:where2
        }
      ],
      order:[['date','ASC'],['check_in_time','DESC']],
      //  order: [
    //   [sequelize.col('employee_table->attendance_tables.check_in_time'), 'DESC']
    // ]
      limit: pagination ? limit : undefined, // Add limit only if pagination is enabled
      offset: pagination ? offset : undefined, //same withe offset
      raw:true
    });

    employeeAttendanceList = employeeAttendanceList.map((x:any) => {
      x.empId = x['employee_table.empId'];
      x.firstName = x['employee_table.firstName']
      delete x['employee_table.empId'];
      delete x['employee_table.firstName'];
      return x;
    });

    return employeeAttendanceList;

  }
  catch(error:any){
    console.log(`step ${step} error: ${error} on controller ${controller}`);
    return [];
  }
}

const attendanceComplainceReport = async (req: any, res: any, next: any) => {

  let status = 200, step = 1;
  try{
    const date = req.query.date as string || "";
    const isExport = req.query.export as string || "false";
    const page = req.query.page as string || "1";
    const name = req.query.name as string || "";
    let limit = req.query.limit as string || "10";
    let camplainceStatus = req.query.camplaince as string || "all";

    //check page and limit are positive integer or not
    if(!validator.isInt(page,{min:1})){
      status = 400;
      throw new Error("Invalid page value! Page value must be positive integer");
    }
    if(!validator.isInt(limit,{min:1})){
      status = 400;
      throw new Error("Invalid limit value! Limit value must be positive integer");
    }

    const offset:number = (+page - 1) * +limit;

    //get companies camplaince hours
    let companyCamplainceHours:any = await CompanyTableModel.findOne({
      where:{
        id:req.companyId
      },
      attributes:['configuration'],
      raw:true
    });
    let camplainceHours = companyCamplainceHours.configuration["work_hours"];


    // let complainceHours = companyConfig.configuration['work_hours'];
    let halfHours = Math.round(new CommonService().calculateTotalHours(camplainceHours) / 2);
    camplainceHours = new CommonService().calculateTotalHours(camplainceHours);

    //user employee tables where clause
    // let where3:any = {
    //   company_id:req.companyId
    // }
    // let where3:any = {
    //   company_id:req.companyId,
    //   user_id:name
    // }
    let where3:any;
    if(name == ''){
      where3= {
      company_id:req.companyId,
    }
    }else{
      where3= {
        company_id:req.companyId,
        user_id:name
      }
    }
    // if(!validator.isEmpty(name)){
    //   where3.first_name = {
    //     [Op.iLike]:`%${name}%`
    //   }
    // }
 // [Op.iLike]:`%${name}%`
    //user attendance table where clause
    let where2:any = {
      company_id:req.companyId,
      is_deleted:false,
    }

    //user table where clause
    let where:any = {
      company_id: req.companyId,
      is_deleted: false,
      is_active: true,
      [Op.and]: [
        Sequelize.literal(`employee_leaves.date IS NOT NULL OR attendance_tables.date IS NOT NULL`),
      ]
      // date: {
      //   [Op.between]: [startDate, endDate]
      // }
    };



    //if date is not empty
    if(!validator.isEmpty(date)){
      //check if date is valid or not
      if(!moment(date,'YYYY-MM',true).isValid() && !moment(date,'YYYY-MM-DD',true).isValid()){
        status = 400;
        throw new Error("Invalid date format! Date format must be YYYY-MM-DD or YYYY-MM");
      }

      let dateFormat = 'YYYY-MM';
      if (moment(date, 'YYYY-MM', true).isValid()) {
        dateFormat = 'YYYY-MM';
      } else if (moment(date, 'YYYY-MM-DD', true).isValid()) {
        dateFormat = 'YYYY-MM-DD';
      } else {
        status = 400;
        throw new Error('Invalid date format! Date format must be YYYY-MM-DD or YYYY-MM');
      }



      if(dateFormat == "YYYY-MM"){
        let startDate:string = moment(date,"YYYY-MM").startOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
        let endDate:string = moment(date,"YYYY-MM").endOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
        const isCurrentMonth = moment().isSame(startDate, 'month');

         // Define the where clause for the query
         
        

        // If the month is the current month, exclude today's attendance record
        if (isCurrentMonth) {
          where2.date = {
            [Op.between]: [startDate, moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ssZ')]
          };
        }
        else{
          where2.date = {
            [Op.between]: [startDate, endDate]
          };
        }
        // [sequelize.literal(`CASE WHEN COALESCE(total_worked_hours, '') = '' THEN true WHEN CAST(total_worked_hours AS TIME) < CAST('${company[i].configuration["work_hours"]}' AS TIME) THEN true ELSE false END`), 'isComplianceMissed']
        
        if (camplainceStatus === "complete") {
          // where.total_worked_hours = sequelize.literal(`CAST(total_worked_hours AS TIME) >= CAST('${camplainceHours}' AS TIME)`);
          where = {
            ...where,
            [Op.and]: [
              Sequelize.literal(`attendance_tables.date IS NOT NULL`),
              Sequelize.literal(`attendance_tables.check_out_time IS NOT NULL`),
              Sequelize.literal(`
                (
                  SUBSTRING(attendance_tables.total_worked_hours, 1, 2)::INTEGER * 3600 +
                  SUBSTRING(attendance_tables.total_worked_hours, 4, 2)::INTEGER * 60 +
                  SUBSTRING(attendance_tables.total_worked_hours, 7, 2)::INTEGER
                ) / 3600.0 >= ${camplainceHours}
              `),
    
            ],
          }
        }
        else if(camplainceStatus == "incomplete"){

          // where.total_worked_hours = sequelize.literal(`CAST(total_worked_hours AS TIME) < CAST('${camplainceHours}' AS TIME)`);
          // where.total_worked_hours = {}
          // let orCondition 

          //user table where clause
          where = {
            ...where,
            [Op.or]: [
              Sequelize.literal(`attendance_tables.date IS NULL`),
              Sequelize.literal(`attendance_tables.check_out_time IS NULL`),
              Sequelize.literal(`
                (
                  SUBSTRING(attendance_tables.total_worked_hours, 1, 2)::INTEGER * 3600 +
                SUBSTRING(attendance_tables.total_worked_hours, 4, 2)::INTEGER * 60 +
                SUBSTRING(attendance_tables.total_worked_hours, 7, 2)::INTEGER) / 3600.0 >= 0
                 AND 
                (
                  SUBSTRING(attendance_tables.total_worked_hours, 1, 2)::INTEGER * 3600 +
                SUBSTRING(attendance_tables.total_worked_hours, 4, 2)::INTEGER * 60 +
                SUBSTRING(attendance_tables.total_worked_hours, 7, 2)::INTEGER
                ) / 3600.0 < ${camplainceHours}
              `),
    
            ],
          }
        }

        if(isExport === 'true'){
          // let employeeAttendanceCount:any = await countsUserAttendance(where,where2,"Complaince Filter",step,req.companyId);
        
          let employeeAttendanceList:any = await findsUserEmployeesComplainceReports(where,where2,where3,"attendanceComplainceReport",step,+limit,offset);
         
          return res.status(status).json({
            status:"success",
            message:"Attendance compliance report data received successfully",
            data:{
              // employeeAttendanceCount,
              employeeAttendanceList
            }
          });
        }
        else{
          // let employeeAttendanceCount:any = await countsUserAttendance(where,where2,"Complaince Filter",step,req.companyId);

          let employeeAttendanceList:any = 
          await findsUserEmployeesComplainceReports(where,where2,where3,"Complaince Filter",step,+limit,offset,true);
          
          return res.status(status).json({
            status:"success",
            message:"Attendance compliance report data received successfully",
            data:{
              // employeeAttendanceCount,
              employeeAttendanceList
            }
          });
        }

      }
      else if(dateFormat == "YYYY-MM-DD"){
        let startDate:string = moment(date,"YYYY-MM-DD").startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');

        where2.date = startDate              
        

        if (camplainceStatus === "complete") {
          // where.total_worked_hours = sequelize.literal(`CAST(total_worked_hours AS TIME) >= CAST('${camplainceHours}' AS TIME)`);
          where = {
            ...where,
            [Op.and]: [
              Sequelize.literal(`attendance_tables.date IS NOT NULL`),
              Sequelize.literal(`attendance_tables.check_out_time IS NOT NULL`),
              Sequelize.literal(`
                (
                  SUBSTRING(attendance_tables.total_worked_hours, 1, 2)::INTEGER * 3600 +
                  SUBSTRING(attendance_tables.total_worked_hours, 4, 2)::INTEGER * 60 +
                  SUBSTRING(attendance_tables.total_worked_hours, 7, 2)::INTEGER
                ) / 3600.0 >= ${camplainceHours}
              `),
    
            ],
          }
        }
        else if(camplainceStatus == "incomplete"){

          // where.total_worked_hours = sequelize.literal(`CAST(total_worked_hours AS TIME) < CAST('${camplainceHours}' AS TIME)`);
          // where.total_worked_hours = {}
          // let orCondition 

          //user table where clause
          where = {
            ...where,
            [Op.or]: [
              Sequelize.literal(`attendance_tables.date IS NULL`),
              Sequelize.literal(`attendance_tables.check_out_time IS NULL`),
              Sequelize.literal(`
                (
                  SUBSTRING(attendance_tables.total_worked_hours, 1, 2)::INTEGER * 3600 +
                SUBSTRING(attendance_tables.total_worked_hours, 4, 2)::INTEGER * 60 +
                SUBSTRING(attendance_tables.total_worked_hours, 7, 2)::INTEGER) / 3600.0 >= 0
                  AND 
                (
                  SUBSTRING(attendance_tables.total_worked_hours, 1, 2)::INTEGER * 3600 +
                SUBSTRING(attendance_tables.total_worked_hours, 4, 2)::INTEGER * 60 +
                SUBSTRING(attendance_tables.total_worked_hours, 7, 2)::INTEGER
                ) / 3600.0 < ${camplainceHours}
              `),
    
            ],
          }
        }
        //all the attendanc data 
        if(isExport == "true"){
          //get all data of single date
         
          //count total number of employee attendance
          // let employeeAttendanceCount:any = await countsUserAttendance(where,where2,"Complaince Filter",step,req.companyId);
          
        
          // let findS
          let employeeAttendanceList:any = await findsUserEmployeesComplainceReports(where,where2,where3,"Complaince Filter",step,+limit,offset);

          return res.status(status).json({
            status:"success",
            message:"Attendance compliance report data received successfully",
            data:{
              // employeeAttendanceCount,
              employeeAttendanceList
            }
          });
        }
        else{
          //count total number of employee attendance
          // let employeeAttendanceCount:any = await countsUserAttendance(where,where2,"Complaince Filter",step,req.companyId);

        
          let employeeAttendanceList:any = 
          await findsUserEmployeesComplainceReports(where,where2,where3,"Complaince Filter",step,+limit,offset,true);

          return res.status(status).json({
            status:"success",
            message:"Attendance compliance report data received successfully",
            data:{
              // employeeAttendanceCount,
              employeeAttendanceList
            }
          });
        }
      }
      else{
        status = 400;
        throw new Error("Invalid date format! Date format must be YYYY-MM-DD or YYYY-MM");
      }

    }
    else{

      let todaysDate:string = moment().subtract(1,'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');

      // --------------------------------------------------------
      where2.date = todaysDate;        
      
      if (camplainceStatus === "complete") {
        // where.total_worked_hours = sequelize.literal(`CAST(total_worked_hours AS TIME) >= CAST('${camplainceHours}' AS TIME)`);
        where = {
          ...where,
          [Op.and]: [
            Sequelize.literal(`attendance_tables.date IS NOT NULL`),
            Sequelize.literal(`attendance_tables.check_out_time IS NOT NULL`),
            Sequelize.literal(`
              (
                SUBSTRING(attendance_tables.total_worked_hours, 1, 2)::INTEGER * 3600 +
                SUBSTRING(attendance_tables.total_worked_hours, 4, 2)::INTEGER * 60 +
                SUBSTRING(attendance_tables.total_worked_hours, 7, 2)::INTEGER
              ) / 3600.0 >= ${camplainceHours}
            `),
  
          ],
        }
      }
      else if(camplainceStatus == "incomplete"){

        // where.total_worked_hours = sequelize.literal(`CAST(total_worked_hours AS TIME) < CAST('${camplainceHours}' AS TIME)`);
        // where.total_worked_hours = {}
        // let orCondition 

        //user table where clause
        where = {
          ...where,
          [Op.or]: [
            Sequelize.literal(`attendance_tables.date IS NULL`),
            Sequelize.literal(`attendance_tables.check_out_time IS NULL`),
            Sequelize.literal(`
              (
                SUBSTRING(attendance_tables.total_worked_hours, 1, 2)::INTEGER * 3600 +
              SUBSTRING(attendance_tables.total_worked_hours, 4, 2)::INTEGER * 60 +
              SUBSTRING(attendance_tables.total_worked_hours, 7, 2)::INTEGER) / 3600.0 >= 0
                AND 
              (
                SUBSTRING(attendance_tables.total_worked_hours, 1, 2)::INTEGER * 3600 +
              SUBSTRING(attendance_tables.total_worked_hours, 4, 2)::INTEGER * 60 +
              SUBSTRING(attendance_tables.total_worked_hours, 7, 2)::INTEGER
              ) / 3600.0 < ${camplainceHours}
            `),
  
          ],
        }
      }


      //all the attendanc data 
      if(isExport == "true"){

  
        //count total number of employee attendance
        // let employeeAttendanceCount:any =
        // await countsUserAttendance(where,where2,"Complaince Filter",step,req.companyId);

        let employeeAttendanceList:any =await findsUserEmployeesComplainceReports(where,where2,where3,"Complaince Filter",step,+limit,offset);

        return res.status(status).json({
          status:"success",
          message:"Attendance compliance report data received successfully",
          data:{
            // employeeAttendanceCount,
            employeeAttendanceList
          }
        });
      }
      else{
        //pagination

          //count total number of employee attendance
          // let employeeAttendanceCount:any = await countsUserAttendance(where,where2,"Complaince Filter",step,req.companyId);

          let employeeAttendanceList:any = await findsUserEmployeesComplainceReports(where,where2,where3,"Complaince Filter",step,+limit,offset,true);
          
          return res.status(status).json({
            status:"success",
            message:"Attendance compliance report data received successfully",
            data:{
              // employeeAttendanceCount,
              employeeAttendanceList
            }
          });
      }
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

const findsUserEmployeesComplainceReports = async (where1:any,where2:any,where3:any,controller:string,step:number,limit:number,offset:number,pagination:boolean = false):Promise<any> => {
  try{
    let employeeAttendanceList:any = ""
    
    // await UserAttendanceTableModel.findAll({
    //   where:where1,
    //   attributes:[
    //     ['check_in_time','checkInTime'],
    //     ['check_out_time','checkOutTime'],
    //     [sequelize.literal(`to_char(date, 'YYYY-MM-DD')`), 'date'],
    //     ['check_in_path','checkInPath'],
    //     ['check_out_path','checkOutPath'],
    //     ['total_worked_hours','totalWorkedHours'],
    //   ],
    //   include:[
    //     {
    //       model:EmployeeTableModel,
    //       attributes:[
    //         ['emp_id','empId'],
    //         ['first_name','firstName'],
    //       ],
    //       where:where2,
    //       include:[
    //         {
    //           model:UserTableModel,
    //           attributes:[
    //             ['work_mode','workMode']
    //           ],
    //           where:where3,
    //           required:false
    //         },
    //       ],
    //       right:true
    //     },
    //   ],
    
      // order:[['date','DESC'],['check_in_time','ASC']],
      // limit: pagination ? limit : undefined, // Add limit only if pagination is enabled
      // offset: pagination ? offset : undefined, //same withe offset
      // raw:true
    // });
    

    // get the company config
    let companyConfig:any = await CompanyTableModel.findOne({
      where:{
        id:where1.company_id
      },
      attributes:['configuration'],
      raw:true
    });
 
    let complainceHours = companyConfig.configuration['work_hours'];
    let halfHours = Math.round(new CommonService().calculateTotalHours(complainceHours) / 2);
    complainceHours = new CommonService().calculateTotalHours(complainceHours);

    let where2Date = ''
    console.log(typeof where2.date)
    if(typeof where2.date === 'object'){
      where2Date = " BETWEEN '" + where2.date[Op.between][0]+"' AND '" + where2.date[Op.between][1] + "'";
    }else{
      where2Date = " = '" + where2.date + "'";
    }

    let totalCount:any = await UserTableModel.findAll({
      where: where1,
      attributes:[["work_mode","workMode"]],
      include: [
        {
          model: UserAttendanceTableModel,
          where: where2,
          attributes: [
            [
              sequelize.literal(`CASE WHEN attendance_tables.date IS NULL THEN 'ABSENT' WHEN check_out_time IS NULL THEN 'LEAVE' WHEN (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600.0 >= 0 AND (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600.0 < ${halfHours} THEN 'LEAVE'  WHEN (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600.0 >= ${halfHours} AND (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600.0 < ${complainceHours} THEN 'HALF-DAY' ELSE 'PRESENT' END`),
              'leaveStatus',
            ],
            ['check_in_time','checkInTime'],
            ['check_out_time','checkOutTime'],
            [sequelize.literal(`to_char(attendance_tables.date, 'YYYY-MM-DD')`), 'date'],
            ['total_worked_hours',"totalWorkedHours"],
          ],
          required: false,
        },
        {
          model:EmployeeTableModel,
          attributes:[
            ["first_name","employeeName"],
            ["emp_id","empId"],
          ],
          where:where3
          // where:{
          //   [Op.or]:where3
          // }
        },
        {
          model:EmployeeLeaveModel,
          attributes:[
            [sequelize.literal(`to_char(employee_leaves.date, 'YYYY-MM-DD')`), 'leaveDate'],
            'reason',
            'status',
            ["check_in","checkIn"],
            ["check_out","checkOut"],
          ],
          required: false,
          where:{
            [Op.and]:[
              Sequelize.literal(`employee_leaves.date = attendance_tables.date OR (attendance_tables.date IS NULL AND employee_leaves.date `+where2Date+`)`),
              // Sequelize.literal(`employee_leaves.is_deleted = false OR employee_leaves.is_deleted IS NULL`),
            ],
            [Op.or]:[
             { is_deleted:false },
             { is_deleted: null }
            ]
          }
          
        }
      ],
      // attributes: ['email', 'id'],
      subQuery: false,
      
      raw:true
    });

    
    //getting all absent employee list along with check-out missed and half day completed
    let allAbsentEmployeeLists: any = await UserTableModel.findAll({
      where: where1,
      attributes:[["work_mode","workMode"]],
      include: [
        {
          model: UserAttendanceTableModel,
          where: where2,
          attributes: [
            [
              sequelize.literal(`CASE WHEN attendance_tables.date IS NULL THEN 'ABSENT' WHEN check_out_time IS NULL THEN 'LEAVE' WHEN (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600.0 >= 0 AND (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600.0 < ${halfHours} THEN 'LEAVE'  WHEN (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600.0 >= ${halfHours} AND (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600.0 < ${complainceHours} THEN 'HALF-DAY' ELSE 'PRESENT' END`),
              'leaveStatus',
            ],
            ['check_in_time','checkInTime'],
            ['check_out_time','checkOutTime'],
            [sequelize.literal(`to_char(attendance_tables.date, 'YYYY-MM-DD')`), 'date'],
            ['total_worked_hours',"totalWorkedHours"],
          ],
          required: false,
        },
        {
          model:EmployeeTableModel,
          attributes:[
            ["first_name","employeeName"],
            ["emp_id","empId"],
          ],
          where:where3
          // where:{
          //   [Op.or]:where3
          // }
        },
        {
          model:EmployeeLeaveModel,
          attributes:[
            [sequelize.literal(`to_char(employee_leaves.date, 'YYYY-MM-DD')`), 'leaveDate'],
            'reason',
            'status',
            ["check_in","checkIn"],
            ["check_out","checkOut"],
          ],
          required: false,
          where:{
            [Op.and]:[
              Sequelize.literal(`employee_leaves.date = attendance_tables.date OR (attendance_tables.date IS NULL AND employee_leaves.date `+where2Date+`)`),
              // Sequelize.literal(`employee_leaves.is_deleted = false OR employee_leaves.is_deleted IS NULL`),
            ],
            [Op.or]:[
             { is_deleted:false },
             { is_deleted: null }
            ]
          }
          
        }
      ],
      // attributes: ['email', 'id'],
      subQuery: false,
      
      limit: pagination ? limit : undefined, // Add limit only if pagination is enabled
      offset: pagination ? offset : undefined, //same withe offset
      order:[
        // [sequelize.literal(`employee_leaves.date`), 'DESC'],
        // [sequelize.literal(`attendance_tables.date`), 'DESC'],
        [sequelize.literal(`CASE WHEN attendance_tables.DATE is null then employee_leaves.DATE ELSE attendance_tables.DATE END`), 'DESC']
        
    ],
      raw:true
    });

    allAbsentEmployeeLists = allAbsentEmployeeLists.map((x:any) => {
      
      x.leaveStatus = x['attendance_tables.leaveStatus'];
      delete x['attendance_tables.leaveStatus'];
      x.checkInTime = x['attendance_tables.checkInTime'] ? moment(x['attendance_tables.checkInTime'],"HH:mm:ss").format("hh:mm A") : null;
      delete x['attendance_tables.checkInTime'];
      x.checkOutTime = x['attendance_tables.checkOutTime'] ? moment(x['attendance_tables.checkOutTime'],"HH:mm:ss").format("hh:mm A") : null;
      delete x['attendance_tables.checkOutTime'];
      x.totalWorkHours = x['attendance_tables.totalWorkedHours'];
      delete x['attendance_tables.totalWorkedHours'];
      x.attendanceDate = x['attendance_tables.date'];
      delete x['attendance_tables.date'];
      x.employeeName = x['employee_table.employeeName'];
      delete x['employee_table.employeeName'];
      x.empId = x['employee_table.empId'];
      delete x['employee_table.empId'];
      x.leaveDate = x['employee_leaves.leaveDate'];
      delete x['employee_leaves.leaveDate'];
      x.reason = x['employee_leaves.reason'];
      delete x['employee_leaves.reason'];
      x.status = x['employee_leaves.status'];
      delete x['employee_leaves.status'];
      x.checkIn = x['employee_leaves.checkIn'];
      delete x['employee_leaves.checkIn'];
      x.checkOut = x['employee_leaves.checkOut'];
      delete x['employee_leaves.checkOut'];
      

      return x;
    });

    //  let allAbsentEmployeeList: any = await UserTableModel.findAll({
    //     where:
    //      {
    //       is_deleted: false,
    //       is_active: true,
    //       company_id: where1.company_id,
          
    //     },
    //     include: [
    //       {
    //         model: UserAttendanceTableModel,
    //         where: where1,
    //         // {
    //         //   date: today,
    //         //   company_id: listOfCompany[company].id,
    //         // },
    //         attributes: [
    //           [
    //             sequelize.literal(`CASE WHEN date IS NULL THEN 'ABSENT' WHEN check_out_time IS NULL THEN 'LEAVE' WHEN (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600 >= 0 AND (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600 < ${halfHours} THEN 'LEAVE'  WHEN (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600 >= ${halfHours} AND (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600 < ${complainceHours} THEN 'HALF-DAY' ELSE 'PRESENT' END`),
    //             'leaveStatus',
    //           ],
    //           ["id","attendanceId"],
    //           ['check_in_time','checkInTime'],
    //           ['check_out_time','checkOutTime'],
    //           [sequelize.literal(`to_char(attendance_tables.date, 'YYYY-MM-DD')`), 'date'],
    //           ['check_in_path','checkInPath'],
    //           ['check_out_path','checkOutPath'],
    //           ['total_worked_hours','totalWorkedHours'],
    //         ],
    //         required: false,
    //       },
    //       {
    //         model:EmployeeTableModel,
    //         attributes:[
    //           ["first_name","employeeName"],
    //           ['emp_id','empId'],
    //         ],
    //         where:where2
    //       },
    //       {
    //         model:EmployeeLeaveModel,
    //         attributes:[
    //           [sequelize.literal(`to_char(employee_leaves.date, 'YYYY-MM-DD')`), 'leaveDate'],
    //           'reason',
    //           'status',
    //           ['check_in','checkIn'],
    //           ['check_out','checkOut'],

    //         ],
    //         where: where1,
    //       }
    //     ],
    //     subQuery: false,
    //     attributes: [ ['id','userId'], ['work_mode','workMode']],
    //     limit: pagination ? limit : undefined, // Add limit only if pagination is enabled
    //     offset: pagination ? offset : undefined, //same withe offset
    //     order: [[sequelize.literal(`attendance_tables.date`), 'ASC']],
    //     raw: true,
        
    //   });
      
    // employeeAttendanceList = allAbsentEmployeeList.map((x:any) => {
    //   x.empId = x['employee_table.empId'];
    //   delete x['employee_table.empId'];
    //   x.firstName = x['employee_table.employeeName'];
    //   delete x['employee_table.employeeName'];
    //   x.checkInTime = x['attendance_tables.checkInTime'] ? moment(x['attendance_tables.checkInTime'],"HH:mm:ss").format("hh:mm A") : null;
    //   x.checkOutTime = x['attendance_tables.checkOutTime'] ? moment(x['attendance_tables.checkOutTime'],"HH:mm:ss").format("hh:mm A") : null;
    //   delete x['attendance_tables.checkOutTime'];
    //   delete x['attendance_tables.checkInTime'];  
    //   x.date = x['attendance_tables.date'];
    //   delete x['attendance_tables.date'];
    //   x.totalWorkedHours = x['attendance_tables.totalWorkedHours'];
    //   delete x['attendance_tables.totalWorkedHours'];
    //   x.checkInPath = x['attendance_tables.checkInPath'];
    //   delete x['attendance_tables.checkInPath'];
    //   x.checkOutPath = x['attendance_tables.checkOutPath'];
    //   delete x['attendance_tables.checkOutPath'];
    //   x.leaveStatus = x['attendance_tables.leaveStatus'];
    //   delete x['attendance_tables.leaveStatus'];
    //   x.attendanceId = x['attendance_tables.attendanceId'];
    //   delete x['attendance_tables.attendanceId'];
    //   return x;

    // });

    return {allAbsentEmployeeLists,totalList:totalCount.length};

  }

  catch(error:any){
    console.log(error)
    console.log(`step ${step} error: ${error} on controller ${controller}`);
    return [];
  }
}

export {absentEmployeeList,addAbsentEmployeeAttendance,reportFilter,attendanceComplainceReport,attendanceBasedOnAttendanceId,adminSideCheckInOutResetEditableOnTodayAndYesterday,adminSideCheckInOutEditableOnTodayAndYesterday,beforeCheckInCheckOutDeviceOtpValidation,beforeCheckInCheckOutDeviceOtp,singleEmployeesMonthAttendanceList, employeesCurrentMonthList, adminHandlerCheckOutUserAttendance, adminHandlerCheckInUserAttendance, currentDateDeviceEmployeeList, userAttendanceList, deviceEmployeeList, deviceCheckOutUserAttendance, deviceCheckInUserAttendance, validateCompanyRequestForSignInFromDeviceWithOtp, companyRequestForSignInFromDevice,checkInUserAttendance, checkOutUserAttendance, deviceCheckInUsersAttendanceList, adminSideAttendanceListBasedOnDate, getCompanyConfigurationApp, getCompanyConfigurationWeb, adminGetCompanyConfiguration, adminUpdateCompanyConfiguration};
