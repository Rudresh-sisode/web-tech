
//modules imports below
import validator from "validator";
import bcrypt from 'bcrypt';
import { Op, Sequelize } from "sequelize";
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
import AttendanceTableModel from "../abstractions/models/attendance-table-model";

const getEmployeeLeavesReport = async (req:any,res: any,next:any) => {
    let status = 200, step = 1;
    try{
      const date = req.query.date as string || "";
      const employeeName = req.query.name as string || "";
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
    if(!validator.isEmpty(date) && validator.isEmpty(employeeName)){
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

          // let employeeAttendanceCount = await countsUserAttendance(where,where2,"Report Filter",step,req.companyId);

          let employeeAttendanceList:any = await getTotalEmployeeLeavesReport(where,where2,"Report Filter",step,+limit,offset);

        
          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              // totalCount:employeeAttendanceCount,
              employeeAttendanceList:employeeAttendanceList
            }
          });

        }
        else{
          //with pagination
          let where2 = {
            company_id:req.companyId
          };
          // let employeeAttendanceCount = await countsUserAttendance(where,where2,"Report Filter",step,req.companyId);

          let employeeAttendanceList:any = await getTotalEmployeeLeavesReport(where,where2,"Report Filter",step,+limit,offset,true);

          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              // totalCount:employeeAttendanceCount,
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

          let employeeAttendanceList:any = await getTotalEmployeeLeavesReport({
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
              // totalCount:employeeAttendanceCount,
              employeeAttendanceList:employeeAttendanceList
            }
          });
        }
        else{

          let where2= {
            company_id:req.companyId
          }

          let employeeAttendanceList:any = await getTotalEmployeeLeavesReport({
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
              // totalCount:employeeAttendanceCount,
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
    else if(!validator.isEmpty(employeeName) && validator.isEmpty(date)){

      let todaysSkipDate:string = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');

      // --------------------------------------------------------
      let where:any = {
        company_id:req.companyId,
        is_deleted:false,
        date:{
          [Op.lt]:todaysSkipDate
        }           
      }

      let isEmployeeValue = await new CommonService().getValidateUUIDWithEmployee(employeeName,req.companyId);
      if(typeof isEmployeeValue == "string"){
        status = 404;
        throw new Error(isEmployeeValue);
      }

      if(isExport === 'true'){

        let employeeAttendanceList:any = await getTotalEmployeeLeavesReport(where,
        {
          company_id:req.companyId,
          // first_name:{
          //   [Op.iLike]:`%${employeeName}%`
          // }
          user_id:employeeName
        }, "Report Filter",step,+limit,offset);

        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            // totalCount:employeeAttendanceCount,
            employeeAttendanceList:employeeAttendanceList
          }
        });
      }
      else{
    
        let employeeAttendanceList:any = await getTotalEmployeeLeavesReport(where,{
          company_id:req.companyId,
          // first_name:{
          //   [Op.iLike]:`%${employeeName}%`
          // }
          user_id:employeeName
        }, "Report Filter",step,+limit,offset,true);
        
        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            // totalCount:employeeAttendanceCount,
            employeeAttendanceList:employeeAttendanceList
          }
        });

      }
      
    }
    //if name and date both are not empty
    else if(!validator.isEmpty(date) && !validator.isEmpty(employeeName)){
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

      let isEmployeeValue = await new CommonService().getValidateUUIDWithEmployee(employeeName,req.companyId);
      if(typeof isEmployeeValue == "string"){
        status = 404;
        throw new Error(isEmployeeValue);
      }

      if(dateFormat == "YYYY-MM"){
        //get all the data of the month
        let startDate:string = moment(date,"YYYY-MM").startOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
        let endDate:string = moment(date,"YYYY-MM").endOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
        if(isExport === 'true'){

          let employeeAttendanceList:any = await getTotalEmployeeLeavesReport({
            company_id:req.companyId,
            is_deleted:false,
            date:{
              [Op.between]:[startDate,endDate]
            }
          },{
            company_id:req.companyId,
            // first_name:{
            //   [Op.iLike]:`%${employeeName}%`
            // }
            user_id:employeeName
          }, "Report Filter",step,+limit,offset);

          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              // totalCount:employeeAttendanceCount,
              employeeAttendanceList:employeeAttendanceList
            }
          });

        }
        //with pagination
        else{
      
          let employeeAttendanceList:any = await getTotalEmployeeLeavesReport({
            company_id:req.companyId,
            is_deleted:false,
            date:{
              [Op.between]:[startDate,endDate]
            }
          },{
            company_id:req.companyId,
            // first_name:{
            //   [Op.iLike]:`%${employeeName}%`
            // }
            user_id:employeeName
          }, "Report Filter",step,+limit,offset,true);

          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              // totalCount:employeeAttendanceCount,
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

      
          let employeeAttendanceList:any = await getTotalEmployeeLeavesReport({
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
            // first_name:{
            //   [Op.iLike]:`%${employeeName}%`
            // }
            user_id:employeeName
          }, "Report Filter",step,+limit,offset);

          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              // totalCount:employeeAttendanceCount,
              employeeAttendanceList:employeeAttendanceList
            }
          });
        }
        //with pagination
        else{


          let employeeAttendanceList:any = await getTotalEmployeeLeavesReport({
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
            // first_name:{
            //   [Op.iLike]:`%${employeeName}%`
            // }
            user_id:employeeName 
          }, "Report Filter",step,+limit,offset,true);

          return res.status(200).json({
            status:"success",
            message:"Attendance data received successfully",
            data:{
              // totalCount:employeeAttendanceCount,
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
    else if(validator.isEmpty(date) && validator.isEmpty(employeeName)){
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
        // let employeeAttendanceCount:any = await countsUserAttendance(where,{
        //   company_id:req.companyId,
        // },"Report Filter",step,req.companyId);

        let employeeAttendanceList:any = await getTotalEmployeeLeavesReport(where,{
          company_id:req.companyId,
        }, "Report Filter",step,+limit,offset);


        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            // totalCount:employeeAttendanceCount,
            employeeAttendanceList:employeeAttendanceList
          }
        });

      }
      //with pagination
      else{
        //count total number of employee attendance
        // let employeeAttendanceCount:any = await countsUserAttendance(where,{
        //   company_id:req.companyId,
        // },"Report Filter",step,req.companyId);

        let employeeAttendanceList:any = await getTotalEmployeeLeavesReport(where,{
          company_id:req.companyId,
        }, "Report Filter",step,+limit,offset,true);

        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
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



const getEmployeeLeavesDetails = async (req:any,res: any,next:any) => {
  let status = 200, step = 1;
  try{
    const date = req.query.date as string || "";
    const employeeName = req.query.name as string || "";
    const isExport = req.query.export as string || "false";
    const page = req.query.page as string || "1";
    let limit = req.query.limit as string || "10";
    const userId = req.query.userId as string || "";

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
  if(!validator.isEmpty(date) && validator.isEmpty(employeeName)){
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

    // Define the where clause for the query
    let where:any = {
      company_id: req.companyId,
      is_deleted: false,
      
    };

    if(!validator.isEmpty(userId)){
      if(!validator.isUUID(userId)){
        status = 400;
        throw new Error("Invalid user id");
      }
      else{
        where.user_id = userId;
      }
    }

    if(dateFormat == "YYYY-MM"){
      //get all the data of the month
      let startDate:string = moment(date,"YYYY-MM").startOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
      let endDate:string = moment(date,"YYYY-MM").endOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
      const isCurrentMonth = moment().isSame(startDate, 'month');

      where.date = {
        [Op.between]: [startDate, endDate]
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

        // let employeeAttendanceCount = await countsUserAttendance(where,where2,"Report Filter",step,req.companyId);

        let employeeAttendanceList:any = await getTotalEmployeeLeavesDetails(where,where2,"Report Filter",step,+limit,offset);

      
        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            // totalCount:employeeAttendanceCount,
            employeeAttendanceList:employeeAttendanceList
          }
        });

      }
      else{
        //with pagination
        let where2 = {
          company_id:req.companyId
        };
        // let employeeAttendanceCount = await countsUserAttendance(where,where2,"Report Filter",step,req.companyId);

        let employeeAttendanceList:any = await getTotalEmployeeLeavesDetails(where,where2,"Report Filter",step,+limit,offset,true);

        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            // totalCount:employeeAttendanceCount,
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

        where = {
          date:startDate
        }

        let employeeAttendanceList:any = await getTotalEmployeeLeavesDetails(where,where2, "Report Filter",step,+limit,offset);
        
        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            // totalCount:employeeAttendanceCount,
            employeeAttendanceList:employeeAttendanceList
          }
        });
      }
      else{

        let where2= {
          company_id:req.companyId
        }

        let employeeAttendanceList:any = await getTotalEmployeeLeavesDetails(where,where2,"Report Filter",step,+limit,offset,true);

        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            // totalCount:employeeAttendanceCount,
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
  else if(!validator.isEmpty(employeeName) && validator.isEmpty(date)){

    let todaysSkipDate:string = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');

    // --------------------------------------------------------
    let where:any = {
      company_id:req.companyId,
      is_deleted:false,
      date:{
        [Op.lt]:todaysSkipDate
      }           
    }

    let isEmployeeValue = await new CommonService().getValidateUUIDWithEmployee(employeeName,req.companyId);
      if(typeof isEmployeeValue == "string"){
        status = 404;
        throw new Error(isEmployeeValue);
      }

    if(isExport === 'true'){

      let employeeAttendanceList:any = await getTotalEmployeeLeavesDetails(where,
      {
        company_id:req.companyId,
        // first_name:{
        //   [Op.iLike]:`%${employeeName}%`
        // }
        user_id:employeeName
      }, "Report Filter",step,+limit,offset);

      return res.status(200).json({
        status:"success",
        message:"Attendance data received successfully",
        data:{
          // totalCount:employeeAttendanceCount,
          employeeAttendanceList:employeeAttendanceList
        }
      });
    }
    else{
  
      let employeeAttendanceList:any = await getTotalEmployeeLeavesDetails(where,{
        company_id:req.companyId,
        // first_name:{
        //   [Op.iLike]:`%${employeeName}%`
        // }
        user_id:employeeName
      }, "Report Filter",step,+limit,offset,true);
      
      return res.status(200).json({
        status:"success",
        message:"Attendance data received successfully",
        data:{
          // totalCount:employeeAttendanceCount,
          employeeAttendanceList:employeeAttendanceList
        }
      });

    }
    
  }
  //if name and date both are not empty
  else if(!validator.isEmpty(date) && !validator.isEmpty(employeeName)){
    //check if date is valid or not
    if(!moment(date,'YYYY-MM',true).isValid() && !moment(date,'YYYY-MM-DD',true).isValid()){
      status = 400;
      throw new Error("Invalid date format! Date format must be YYYY-MM-DD or YYYY-MM");
    }

     // Define the where clause for the query
    let where:any = {
      company_id: req.companyId,
      is_deleted: false,
    };

    let isEmployeeValue = await new CommonService().getValidateUUIDWithEmployee(employeeName,req.companyId);
      if(typeof isEmployeeValue == "string"){
        status = 404;
        throw new Error(isEmployeeValue);
      }


    if(!validator.isEmpty(userId)){
      if(!validator.isUUID(userId)){
        status = 400;
        throw new Error("Invalid user id");
      }
      else{
        where.user_id = userId;
      }
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

      where.date = {
        [Op.between]: [startDate, endDate]
      };
      

      // If the month is the current month, exclude today's attendance record
      if (isCurrentMonth) {
        where.date = {
          [Op.between]: [startDate, moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ssZ')]
        };
      }

      let where2:any = {
        company_id: req.companyId,
        // first_name: {
        //   [Op.iLike]: `%${employeeName}%`
        // }
        user_id:employeeName
      }
      


      if(isExport === 'true'){

        let employeeAttendanceList:any = await getTotalEmployeeLeavesDetails(where,where2, "Report Filter",step,+limit,offset);

        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            // totalCount:employeeAttendanceCount,
            employeeAttendanceList:employeeAttendanceList
          }
        });

      }
      //with pagination
      else{
    
        let employeeAttendanceList:any = await getTotalEmployeeLeavesDetails(where,where2, "Report Filter",step,+limit,offset,true);

        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            // totalCount:employeeAttendanceCount,
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

      where.date = startDate;

      let where2:any = {
        company_id: req.companyId,
        // first_name: {
        //   [Op.iLike]: `%${employeeName}%`
        // }
        user_id:employeeName
      }

      if(isExport === 'true'){

    
        let employeeAttendanceList:any = await getTotalEmployeeLeavesDetails(where,where2, "Report Filter",step,+limit,offset);

        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            // totalCount:employeeAttendanceCount,
            employeeAttendanceList:employeeAttendanceList
          }
        });
      }
      //with pagination
      else{


        let employeeAttendanceList:any = await getTotalEmployeeLeavesDetails(where,where2, "Report Filter",step,+limit,offset,true);

        return res.status(200).json({
          status:"success",
          message:"Attendance data received successfully",
          data:{
            // totalCount:employeeAttendanceCount,
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
  else if(validator.isEmpty(date) && validator.isEmpty(employeeName)){
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
      // let employeeAttendanceCount:any = await countsUserAttendance(where,{
      //   company_id:req.companyId,
      // },"Report Filter",step,req.companyId);

      let employeeAttendanceList:any = await getTotalEmployeeLeavesDetails(where,{
        company_id:req.companyId,
      }, "Report Filter",step,+limit,offset);


      return res.status(200).json({
        status:"success",
        message:"Attendance data received successfully",
        data:{
          // totalCount:employeeAttendanceCount,
          employeeAttendanceList:employeeAttendanceList
        }
      });

    }
    //with pagination
    else{
      //count total number of employee attendance
      // let employeeAttendanceCount:any = await countsUserAttendance(where,{
      //   company_id:req.companyId,
      // },"Report Filter",step,req.companyId);

      let employeeAttendanceList:any = await getTotalEmployeeLeavesDetails(where,{
        company_id:req.companyId,
      }, "Report Filter",step,+limit,offset,true);

      return res.status(200).json({
        status:"success",
        message:"Attendance data received successfully",
        data:{
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

const getTotalEmployeeLeavesDetails = async (where1:any,where2:any,controller:string,step:number,limit:number,offset:number,pagination:boolean = false):Promise<any> =>  {
  try{


    //count the record
    let totalEmployeeLeaveList:any = await EmployeeLeaveModel.count({
      where:where1,
      include:[{
          model:EmployeeTableModel,
          attributes:[
            ['emp_id','empId'],
            ['first_name','firstName'],
          ],
          where:where2
      }]
    });
    
    let employeeLeaveList:any = await EmployeeLeaveModel.findAll({
      where:where1,
      attributes:[
        'reason',
        [sequelize.literal(`to_char(date, 'YYYY-MM-DD')`), 'date'],
        ['check_in','checkIn'],
        ['check_out','checkOut'],
        'status',
        [sequelize.fn('COUNT', sequelize.literal(`CASE 
            WHEN employee_leave.status = 'ABSENT' THEN 1
            END`)), 'absentCount'],
        [sequelize.fn('COUNT', sequelize.literal(`CASE 
            WHEN employee_leave.status = 'HALF-DAY' THEN 1
            END`)), 'halfDayCount'],
        [sequelize.fn('COUNT', sequelize.literal(`CASE 
            WHEN employee_leave.status = 'LEAVE' THEN 1
            END`)), 'leaveCount'],
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
      order:[['date','ASC']],
      group: [
        'employee_table.emp_id',
        'employee_table.first_name',
        'date',
        'employee_leave.check_in',
        'employee_leave.check_out',
        'employee_leave.status',
        'employee_leave.reason'
      ],
      limit: pagination ? limit : undefined, // Add limit only if pagination is enabled
      offset: pagination ? offset : undefined, //same withe offset
      raw:true
    });

    if(employeeLeaveList.count == 0){
      return {
        total:0,
        data:[]
      };
    }

    let employeeTotalLeaveList = employeeLeaveList.map((x:any) => {
      x.empId = x['employee_table.empId'];
      x.firstName = x['employee_table.firstName']
      delete x['employee_table.empId'];
      delete x['employee_table.firstName'];
      return x;
    });
    return {
      total:totalEmployeeLeaveList,
      data:employeeTotalLeaveList
    };

  }
  catch(error:any){
    console.log(`step ${step} error: ${error} on controller ${controller}`);
    return [];
  }
}

const getTotalEmployeeLeavesReport = async (where1:any,where2:any,controller:string,step:number,limit:number,offset:number,pagination:boolean = false):Promise<any> =>  {
  try{

    // let employeeLeaveList:any = await EmployeeLeaveModel.findAndCountAll({
    //   where:where1,
    //   attributes:[
    //     'reason',
    //     [sequelize.literal(`to_char(date, 'YYYY-MM-DD')`), 'date'],
    //     ['check_in','checkIn'],
    //     ['check_out','checkOut'],
    //     'status'
    //   ],
    //   include:[
    //     {
    //       model:EmployeeTableModel,
    //       attributes:[
    //         ['emp_id','empId'],
    //         ['first_name','firstName'],
    //       ],
    //       where:where2
    //     }
    //   ],
    //   order:[['date','ASC']],

    //   limit: pagination ? limit : undefined, // Add limit only if pagination is enabled
    //   offset: pagination ? offset : undefined, //same withe offset
    //   raw:true
    // });


    let totalEmployeeLeaveList:any = await EmployeeLeaveModel.findAll({
      where:where1,
      attributes: [
  
        [sequelize.col('employee_table.emp_id'), 'employee_table.empId'],
        [sequelize.col('employee_table.first_name'), 'employee_table.firstName'],
        [sequelize.fn('SUM', sequelize.literal(`CASE 
            WHEN employee_leave.status = 'LEAVE' THEN 1
            WHEN employee_leave.status = 'ABSENT' THEN 1
            WHEN employee_leave.status = 'HALF-DAY' THEN 0.5
            ELSE 0
          END`)), 'totalLeaveDays']
      ],
      include:[
        {
          model:EmployeeTableModel,
          attributes:[
            ['user_id','userId'],
            ['emp_id','empId'],
            ['first_name','firstName'],
          ],
          where:where2
        }
      ],
      // order:[['date','ASC']],
      group: ['employee_table.emp_id', 'employee_table.first_name','employee_table.user_id'],
     
      raw:true
    });

    let employeeLeaveList:any = await EmployeeLeaveModel.findAll({
      where:where1,
      attributes: [
        // []
        // [sequelize.literal(`to_char(date, 'YYYY-MM-DD')`), 'date'],
        [sequelize.col('employee_table.emp_id'), 'employee_table.empId'],
        [sequelize.col('employee_table.first_name'), 'employee_table.firstName'],
        [sequelize.fn('SUM', sequelize.literal(`CASE 
            WHEN employee_leave.status = 'LEAVE' THEN 1
            WHEN employee_leave.status = 'ABSENT' THEN 1
            WHEN employee_leave.status = 'HALF-DAY' THEN 0.5
            ELSE 0
          END`)), 'totalLeaveDays']
      ],
      include:[
        {
          model:EmployeeTableModel,
          attributes:[
            ['user_id','userId'],
            ['emp_id','empId'],
            ['first_name','firstName'],
          ],
          where:where2
        }
      ],
      // order:[['date','ASC']],
      group: ['employee_table.emp_id', 'employee_table.first_name','employee_table.user_id'],
      limit: pagination ? limit : undefined, // Add limit only if pagination is enabled
      offset: pagination ? offset : undefined, //same withe offset
      raw:true
    });

    

    let employeeTotalLeaveList = employeeLeaveList.map((x:any) => {
      x.empId = x['employee_table.empId'];
      x.firstName = x['employee_table.firstName']
      x.userId = x['employee_table.userId'];
      delete x['employee_table.userId'];
      delete x['employee_table.empId'];
      delete x['employee_table.firstName'];
      return x;
    });

    return {
      total:totalEmployeeLeaveList.length,
      data:employeeTotalLeaveList
    };

  }
  catch(error:any){
    console.log(`step ${step} error: ${error} on controller ${controller}`);
    return [];
  }
}

const employeeLeaveDetailsByUserId = async (where1:any,where2:any,controller:string,step:number,limit:number,offset:number,pagination:boolean = false):Promise<any> =>  {
  try{

    //count all
    let totalEmployeeLeaveList:any = await EmployeeLeaveModel.count({
      where:where1,
      include:[
        {
          model:EmployeeTableModel,
          attributes:[
            ['user_id','userId'],
            ['emp_id','empId'],
            ['first_name','firstName'],
          ],
          where:where2
        }
      ],
    });


    let employeeLeaveList:any = await EmployeeLeaveModel.findAll({
      where:where1,
      attributes: [
        [sequelize.col('employee_table.emp_id'), 'employee_table.empId'],
        [sequelize.col('employee_table.first_name'), 'employee_table.firstName'],
        [sequelize.fn('COUNT', sequelize.literal(`CASE 
            WHEN employee_leave.status = 'ABSENT' THEN 1
            END`)), 'absentCount'],
        [sequelize.fn('COUNT', sequelize.literal(`CASE 
            WHEN employee_leave.status = 'HALF-DAY' THEN 1
            END`)), 'halfDayCount'],
        [sequelize.fn('COUNT', sequelize.literal(`CASE 
            WHEN employee_leave.status = 'LEAVE' THEN 1
            END`)), 'leaveCount'],
        [sequelize.fn('to_char', sequelize.col('date'), 'YYYY-MM-DD'), 'date'],
        [sequelize.col('employee_leave.check_in'), 'checkIn'],
        [sequelize.col('employee_leave.check_out'), 'checkOut'],
        [sequelize.col('employee_leave.status'), 'status'],
      ],
      include:[
        {
          model:EmployeeTableModel,
          attributes:[
            ['user_id','userId'],
            ['emp_id','empId'],
            ['first_name','firstName'],
          ],
          where:where2
        }
      ],
      // order:[['date','ASC']],
      group: [
        'employee_table.emp_id',
        'employee_table.first_name',
        'date',
        'employee_leave.check_in',
        'employee_leave.check_out',
        'employee_leave.status',
      ],
      limit: pagination ? limit : undefined, // Add limit only if pagination is enabled
      offset: pagination ? offset : undefined, //same withe offset
      order: [['date', 'ASC']],
      raw:true
    });

    

    let employeeTotalLeaveList = employeeLeaveList.map((x:any) => {
      x.empId = x['employee_table.empId'];
      x.firstName = x['employee_table.firstName']
      delete x['employee_table.empId'];
      delete x['employee_table.firstName'];
      return x;
    });

    return {
      total:totalEmployeeLeaveList,
      data:employeeTotalLeaveList
    };

  }
  catch(error:any){
    console.log(`step ${step} error: ${error} on controller ${controller}`);
    return [];
  }
}

const everyDayLeavesCronJobOfCompanies = async (req:UserRequest, res: any, next:any) => {

  let step = 1, status = 200;
  
  const tscn = await sequelize.transaction();
  try{

    let yesterday = moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');

 

      //getting all absent employee list along with check-out missed and half day completed
      let allAbsentEmployeeList: any = await UserTableModel.findAll({
        where: {
          is_deleted: false,
          is_active: true,
          company_id: req.companyId,
          // [Op.or]: [
          //   Sequelize.literal(`attendance_tables.date IS NULL`),
          //   Sequelize.literal(`attendance_tables.check_out_time IS NULL`),
          //   Sequelize.literal(`(
          //     (SUBSTRING(attendance_tables.total_worked_hours, 1, 2)::INTEGER * 3600 +
          //     SUBSTRING(attendance_tables.total_worked_hours, 4, 2)::INTEGER * 60 +
          //     SUBSTRING(attendance_tables.total_worked_hours, 7, 2)::INTEGER) / 3600 BETWEEN 5 AND 6
          //   )`)
          // ]
        },
        include: [
          {
            model: AttendanceTableModel,
            where: {
              date: yesterday,
              company_id: req.companyId,
            },
            attributes: [
              [
                sequelize.literal(`CASE WHEN date IS NULL THEN 'ABSENT' WHEN check_out_time IS NULL THEN 'LEAVE' WHEN (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600 >= 5 AND (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600 <= 6 THEN 'HALF-DAY' ELSE 'PRESENT' END`),
                'leaveStatus',
              ],
              ["id","attendanceId"]
            ],
            required: false,
          },
          {
            model:EmployeeTableModel,
            attributes:[
              ["first_name","employeeName"],
              "id"
            ]
          }
        ],
        attributes: ['email', 'id'],
        raw: true,
      });

      //get all the leaves data on yesterday
      const employeeLeaveList:any = await EmployeeLeaveModel.findAll({
        where: {
          company_id: req.companyId,
          date: yesterday,
          is_deleted: false,
        },
        attributes: ['user_id','attendance_id','status'],
        raw: true,
      });

      for(let i = 0; i < allAbsentEmployeeList.length; i++){
        //find attendance id in employee leave list


        // if()
      }

      for (const leaveData of allAbsentEmployeeList) {

        let employeeLeave = employeeLeaveList.find((leave:any) => leave.attendance_id === leaveData['attendance_tables.attendanceId']);
        if(employeeLeave != undefined){

          const employeeLeaveIndex = employeeLeaveList.findIndex((leave:any) => leave.attendance_id === leaveData['attendance_tables.attendanceId']);

          if(leaveData['attendance_tables.leaveStatus'] == 'PRESENT'){
            
            let updateResult = await EmployeeLeaveModel.update(
              {
                is_deleted: true,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_by: req.keyId,
              },
              {
                where: {
                  date: yesterday,
                  company_id: req.companyId,
                  user_id: leaveData.id,
                  employee_id: leaveData['employee_table.id'],
                  attendance_id: leaveData['attendance_tables.attendanceId'],
                },
                transaction:tscn
              },
            );

          }
          else if(leaveData['attendance_tables.leaveStatus'] == 'HALF-DAY' && employeeLeaveList[employeeLeaveIndex]['status'] != 'HALF-DAY'){
            //status will be half-day with

            let updateResult = await EmployeeLeaveModel.update(
              {
                status: leaveData['attendance_tables.leaveStatus'],
                check_in: true,
                check_out: true,
                reason: 'Half day work',
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_by: req.keyId,
              },
              {
                where: {
                  date: yesterday,
                  company_id: req.companyId,
                  user_id: leaveData.id,
                  employee_id: leaveData['employee_table.id'],
                  attendance_id: leaveData['attendance_tables.attendanceId'],
                },
                transaction:tscn
              },
            );

           
          }

        }
        else if(leaveData['attendance_tables.leaveStatus'] == 'HALF-DAY'){
          //new entry for half day
          await EmployeeLeaveModel.create({
            date: yesterday,
            company_id: req.companyId,
            user_id: leaveData.id,
            employee_id: leaveData['employee_table.id'],
            attendance_id: leaveData['attendance_tables.attendanceId'],
            status: leaveData['attendance_tables.leaveStatus'],
            check_in: true,
            check_out: true,
            reason: 'Half day work',
            is_deleted: false,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_by: req.keyId,
          },{transaction:tscn});
        }
        else if(leaveData['attendance_tables.leaveStatus'] == 'LEAVE'){
          //new entry for check-out missed
          await EmployeeLeaveModel.create({
            date: yesterday,
            company_id: req.companyId,
            user_id: leaveData.id,
            employee_id: leaveData['employee_table.id'],
            attendance_id: leaveData['attendance_tables.attendanceId'],
            status: leaveData['attendance_tables.leaveStatus'],
            check_in: true,
            check_out: false,
            reason: 'Check-out missed',
            is_deleted: false,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_by: req.keyId,
          },{transaction:tscn});
        }
        else if(leaveData['attendance_tables.leaveStatus'] == 'ABSENT'){
          //new entry for absent
          await EmployeeLeaveModel.create({
            date: yesterday,
            company_id: req.companyId,
            user_id: leaveData.id,
            employee_id: leaveData['employee_table.id'],
            attendance_id: leaveData['attendance_tables.attendanceId'],
            status: leaveData['attendance_tables.leaveStatus'],
            check_in: false,
            check_out: false,
            reason: 'Was absent',
            is_deleted: false,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_by: req.keyId,
          },{transaction:tscn});
        }
      }

      // await EmployeeLeaveModel.bulkCreate(employeeLeaveBulk)

      //write a success log of companies entries
      const momentDate = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
      const successLogPath = path.join(__dirname, '..', 'public', 'log-success', momentDate);

      if (fs.existsSync(successLogPath)) {
        await fs.promises.appendFile(path.join(successLogPath, 'success.log'),"\n"+new Date()+"\n\tcompany id : "+ req.companyId,);
      } else {
        fs.mkdirSync(successLogPath, { recursive: true });
        await fs.promises.writeFile(path.join(successLogPath, 'success.log'), "\n"+new Date()+"\n\tcompany id : "+req.companyId,);
      }


      
    // }
  }
  catch(error:any){
    //create error.log file in public folder and write a error log
    const momentDate = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
    const errorLogPath = path.join(__dirname, '..', 'public', 'log-error', momentDate);
    if (fs.existsSync(errorLogPath)) {
      await fs.promises.appendFile(path.join(errorLogPath, 'error.log'),"\n"+new Date()+"\n"+ error.message);
    } else {
      fs.mkdirSync(errorLogPath, { recursive: true });
      await fs.promises.writeFile(path.join(errorLogPath, 'error.log'), error.message);
    }
  }
  
}

export {getEmployeeLeavesDetails,getEmployeeLeavesReport,everyDayLeavesCronJobOfCompanies}