
//modules imports below
import { Op, Sequelize } from "sequelize";
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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
import EmployeeTableModel from "../abstractions/models/employee-table-model";
import sequelize from "../utilities/database-connect";
import RoleTableModel from "../abstractions/models/role-table-model";
import CronJobLogTableModel from "../abstractions/models/cron-job-log-table-model";
import * as common from "../services/common.service";
import AttendanceTableModel from "../abstractions/models/attendance-table-model";
import EmployeeLeaveModel from "../abstractions/models/employee-leave-model";
import HolidayTableModel from "../abstractions/models/holiday-calender-table-model";
import * as HolidayController from "./holiday-controller";

const dailyAttendanceReport = async (req: AttendanceData, res: any,next:any) => {
 
     let step = 1, status = 200;
     const tscn = await sequelize.transaction();
     try{
      //create cron job start log;
      let startedCron:any = await CronJobLogTableModel.create({
        title: 'Compnay daily employee attendance notification',
        description: 'Cron job started',
        created_at: moment().utc().toISOString(),
      }, {transaction: tscn});

      step = 2;
      //get all active company list
      const company:any = await CompanyTableModel.findAll({
        where: {
            is_deleted: false,
            is_active: true
        },
        attributes:[["id","companyId"],["company_name","companyName"],["company_email","companyEmail"]],
      });

      // let today = moment().subtract(1, 'day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');
      let today = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');

      let employeeAttendanceList:any[]=[];
      for(let i=0; i< company.length; i++) {

        if("weekend" in company[i].configuration){
          //get the weekends
          //print the monday to sunday with the help of moment
          let weekend = company[i].configuration['weekend'].split(",");//["Sunday","Saturday"];
          let today  = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');
          const isWeekend = weekend.includes(moment(today).format('dddd'));
  
          if(isWeekend){
            continue;
          }
  
        }
        else{
          //get the default weekends
          let weekend = ["Sunday","Saturday"];
          let today  = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');
          const isWeekend = weekend.includes(moment(today).format('dddd'));
  
          if(isWeekend){
            continue;
          }
        }

        const { companyId, companyName, companyEmail } = company[i].dataValues;
        // console.log(companyId)
        const attendanceList:any = await UserTableModel.findAll({
          where: {
            company_id: companyId,
            is_deleted: false,
            is_active: true
          },
          attributes: [
            ['work_mode', 'workMode']
          ],          
          include: [
            {
              model: EmployeeTableModel,
              where: {
                is_deleted: false,
                is_active: true
              },
             attributes: [
                ['emp_id', 'empId'],
                ['first_name','empName']
              ],
              include: [
                {
                  model: UserAttendanceTableModel,
                  attributes: [
                    ['id','attendanceId'],
                    ['date', 'date'],
                    ['check_in_time', 'checkInTime'],
                    ['check_out_time', 'checkOutTime'],
                    ['total_worked_hours', 'totalWorkedHours'],
                  ],
                  where: {
                    is_deleted: false,
                    date: today,
                  },
                  
                  required: true,
                },
              ],
              order: [
                [UserAttendanceTableModel, 'empId', 'DESC']
              ],  
             
            },
          ],
          order: [
            [sequelize.col('employee_table->attendance_tables.check_in_time'), 'DESC']
          ],
          raw: true,
          subQuery: false,
        });

        step = 3;
        const employeeAttendanceListData = 
        await Promise.all(
          attendanceList.map( async (employeeAttendance: any) => {
            const { userId, userEmail, workMode } = employeeAttendance;

            let checkInTime = employeeAttendance['employee_table.attendance_tables.checkInTime'] ? employeeAttendance['employee_table.attendance_tables.checkInTime']: '';
            let checkOutTime = employeeAttendance['employee_table.attendance_tables.checkOutTime'] ? employeeAttendance['employee_table.attendance_tables.checkOutTime'] : '';
            let workedHours = employeeAttendance['employee_table.attendance_tables.totalWorkedHours'] ? employeeAttendance['employee_table.attendance_tables.totalWorkedHours'] : '';

            // let checkInTimeCalc = checkInTime ? moment(checkInTime, 'HH:mm:ss') : '';
            // let checkOutTimeCalc = checkOutTime ? moment(checkOutTime, 'HH:mm:ss') : '';
            // let workedHours = "";
            // if (checkInTimeCalc &&  checkOutTimeCalc) {
            //   workedHours = await new common.CommonService().calculateTimeDiff(checkInTimeCalc, checkOutTimeCalc);
            // }
            
            return {
              empId: employeeAttendance['employee_table.empId'] ? employeeAttendance['employee_table.empId'] : "",
              empName: employeeAttendance['employee_table.empName'] ? employeeAttendance['employee_table.empName'] : "",
              checkInTime: checkInTime ? checkInTime : "",
              checkOutTime: checkOutTime ? checkOutTime : "",
              workedHours: workedHours,
              workMode
            };
          })
        );
        //below var employeeAttendanceList for testing
        employeeAttendanceList[i] = {
          companyData: company[i].dataValues,
          employeeList: []
        };

        // employeeAttendanceList[i]['employeeList'] = employeeAttendanceListData;

        step = 4;
        //check daily report directory is exists
        const csvDir = path.join(__dirname, '..', 'public', 'report', company[i].dataValues.companyId, 'daily'); // Set the directory to save the csv
        if (!fs.existsSync(csvDir)) {
          fs.mkdirSync(csvDir, { recursive: true }); // Create the directory if it doesn't exist
        }

        // let todayDate = moment().subtract(1, 'day').utcOffset('+05:30').format('YYYY_MM_DD');
        let todayDate = moment().startOf('day').utcOffset('+05:30').format('YYYY_MM_DD');
        let attachmentFileName:string = `${todayDate}_attendance_list_.csv`;
        let attachmentFilePath:string = path.join(csvDir, attachmentFileName);
        
        step = 5;
        const csvWriter = createCsvWriter({
          path: attachmentFilePath,
          header: [
            { id: 'empId', title: 'Employee ID' },
            { id: 'empName', title: 'Employee Name' },
            { id: 'workMode', title: 'Work Mode' },
            { id: 'checkInTime', title: 'CheckIn Time' },
            { id: 'checkOutTime', title: 'CheckOut Time' },
            { id: 'workedHours', title: 'Worked Hours' },
          ]
        });


        step = 6;
        const csvRecords = employeeAttendanceListData.map((attendance) => ({
          empId: attendance['empId'],
          empName: attendance['empName'],
          workMode: attendance['workMode'],
          checkInTime: attendance['checkInTime'],
          checkOutTime: attendance['checkOutTime'],
          workedHours: attendance['workedHours']
        }));

        try {
          step = 7;
          await csvWriter.writeRecords(csvRecords);
          let htmlFilePath:string = path.join(__dirname,'..','emails','company-daily-employee-attendance-email-template.html');
            
          let htmlContent = pug.renderFile(htmlFilePath,{
            userName: 'Admin',
            projectName: process.env.PROJECT_NAME
          });

          //get company admin users list
          step = 8;
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

          step = 9;
          const superAdminUsers:any = await UserTableModel.findAll({
            where: {
              role_id: {
                [Op.in]: superAdminRole.role_ids          
              },
              company_id: companyId,
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
          let adminEmail:string = '';
          let otherAdminEmail:string[] = [];
          for (let i = 0; i < superAdminUsers.length; i++){
            if(i == 0){
              adminEmail = ""+superAdminUsers[i]['adminEmail'];
              // adminEmail = "rakesh.ganeshwade@gunadhyasoft.com";
            } else {
              otherAdminEmail.push(superAdminUsers[i]['adminEmail']);
              // otherAdminEmail.push("rakesh.ganeshwade@gmail.com");
            }          
          }

          step = 10;          //rudresh.sisodiya@gunadhyasoft.com
          new SMTP.SmtpService().sendMail(adminEmail, htmlContent,"Time Tango | Company Daily Attendance Report","", otherAdminEmail, attachmentFilePath,attachmentFileName);
          // if(!mailSend){
          //     status = 500;
          //     throw new Error("Failed to sent daily employee attendance list");
          // }
          console.log(`CSV file created for companyId ${company[i].dataValues.companyId}: ${csvDir}`);
        } catch (error) {
          console.error(`Error creating CSV file for companyId ${company[i].dataValues.companyId}: ${csvDir} -`, error);
        }
      }
      
      res.status(status).json({
          status:"success",
          message:"Daily employee attendance list sent successfully",
          // employeeAttendanceList:employeeAttendanceList
      });

      step = 11;
      //create cron job end log;
      let endedCron:any = await CronJobLogTableModel.create({
        title: 'Compnay daily employee attendance notification',
        description: 'Cron job ended',
        created_at: moment().utc().toISOString(),
      }, {transaction: tscn});
      await tscn.commit();
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

const dailyComplainceHoursMissedReport = async (req: AttendanceData, res: any,next:any) => {
  let status = 200, step = 1;
  const tscn = await sequelize.transaction();
  try{
    //create cron job start log;
    let startedCron:any = await CronJobLogTableModel.create({
      title: 'Compnay daily employee complaince missed notification',
      description: 'Cron job started',
      created_at: moment().utc().toISOString(),
    }, {transaction: tscn});

    step = 2;
    //get all active company list
    const company:any = await CompanyTableModel.findAll({
      where: {
          is_deleted: false,
          is_active: true
      },
      attributes:[["id","companyId"],["company_name","companyName"],["company_email","companyEmail"],"configuration"],
      raw:true
    });


    let today = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');    
    // let today = moment().subtract(1, 'day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');    
    
    let employeeComplianceMissedListData:any[]=[];
    let employeeComplianceMissedList:any[]=[];
    for(let i = 0; i < company.length; i++){

      if("weekend" in company[i].configuration){
        //get the weekends
        //print the monday to sunday with the help of moment
        let weekend = company[i].configuration['weekend'].split(",");//["Sunday","Saturday"];
        let today  = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');
        const isWeekend = weekend.includes(moment(today).format('dddd'));

        if(isWeekend){
          continue;
        }

      }
      else{
        //get the default weekends
        let weekend = ["Sunday","Saturday"];
        let today  = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');
        const isWeekend = weekend.includes(moment(today).format('dddd'));

        if(isWeekend){
          continue;
        }
      }

      const { companyId, companyName, companyEmail } = company[i];

      const attendanceList:any = await UserTableModel.findAll({
        where: {
          company_id: companyId,
          is_deleted: false,
          is_active: true
        },
        attributes: [
          ['work_mode', 'workMode']
        ],          
        include: [
          {
            model: EmployeeTableModel,
            where: {
              is_deleted: false,
              is_active: true
            },
           attributes: [
              ['emp_id', 'empId'],
              ['first_name', 'empName'],
            ],
            include: [
              {
                model: UserAttendanceTableModel,
                attributes: [
                  ['id','attendanceId'],
                  ['date', 'date'],
                  ['check_in_time', 'checkInTime'],
                  ['check_out_time', 'checkOutTime'],
                  ['total_worked_hours', 'totalWorkedHours'],
                  [sequelize.literal(`CASE WHEN COALESCE(total_worked_hours, '') = '' THEN true WHEN CAST(total_worked_hours AS TIME) < CAST('${company[i].configuration["work_hours"]}' AS TIME) THEN true ELSE false END`), 'isComplianceMissed']
                ],
                where: {
                  [Op.and]:[
                    {
                      date: today,
                    },
                    {
                      company_id:companyId,
                    },
                    {
                      is_deleted:false
                    }
                  ],                  
                },
                required: true,
              },
            ],
            order: [
              [UserAttendanceTableModel, 'empId', 'DESC']
            ],  
          },
        ],
        order: [
          [sequelize.col('employee_table->attendance_tables.check_in_time'), 'DESC']
        ],
        raw: true,
        subQuery: false,
      });

      // employeeComplianceMissedListData.push(attendanceList);
      employeeComplianceMissedListData[i] = attendanceList.filter((attendance:any) => {
        return attendance['employee_table.attendance_tables.isComplianceMissed'] === true;
      });

      //below var employeeComplianceMissedList  for testing
      employeeComplianceMissedList[i] = {
        companyData: company[i],
        employeeList: []
      };

      employeeComplianceMissedList[i]['employeeList'] = employeeComplianceMissedListData[i];

      step = 4;
      //check daily report directory is exists
      const csvDir = path.join(__dirname, '..', 'public', 'report', company[i].companyId, 'dailycomplaince'); // Set the directory to save the csv
      if (!fs.existsSync(csvDir)) {
        fs.mkdirSync(csvDir, { recursive: true }); // Create the directory if it doesn't exist
      }

      // let todayDate = moment().subtract(1, 'day').utcOffset('+05:30').format('YYYY_MM_DD');
      let todayDate = moment().startOf('day').utcOffset('+05:30').format('YYYY_MM_DD');

      let attachmentFileName:string = `${todayDate}_complaince_missed_attendance_list_.csv`;
      let attachmentFilePath:string = path.join(csvDir, attachmentFileName);
      
      step = 5;
      const csvWriter = createCsvWriter({
        path: attachmentFilePath,
        header: [
          { id: 'empId', title: 'Employee ID' },
          { id: 'empName', title: 'Employee Name' },
          { id: 'workMode', title: 'Work Mode' },
          { id: 'checkInTime', title: 'CheckIn Time' },
          { id: 'checkOutTime', title: 'CheckOut Time' },
          { id: 'workedHours', title: 'Worked Hours' },
        ]
      });

      step = 6;
      let empData  = employeeComplianceMissedListData[i];
      const csvRecords = empData.map((attendance) => ({
        empId: attendance['employee_table.empId'],
        empName: attendance['employee_table.empName'],
        workMode: attendance['workMode'],
        checkInTime: attendance['employee_table.attendance_tables.checkInTime'] == null ? '' : attendance['employee_table.attendance_tables.checkInTime'],
        checkOutTime: attendance['employee_table.attendance_tables.checkOutTime'] == null ? '' :   attendance['employee_table.attendance_tables.checkOutTime'],
        workedHours: attendance['employee_table.attendance_tables.totalWorkedHours'] == null ? '' : attendance['employee_table.attendance_tables.totalWorkedHours']
      }));

      try {
        step = 7;
        await csvWriter.writeRecords(csvRecords);
        let htmlFilePath:string = path.join(__dirname,'..','emails','company-daily-complaince-missed-employee-attendance-email-template.html');
          
        let htmlContent = pug.renderFile(htmlFilePath,{
          userName: 'Admin',
          projectName: process.env.PROJECT_NAME
        });

        //get company admin users list
        step = 8;
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

        step = 9;
        const superAdminUsers:any = await UserTableModel.findAll({
          where: {
            role_id: {
              [Op.in]: superAdminRole.role_ids          
            },
            company_id: companyId,
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
        let adminEmail:string = '';
        let otherAdminEmail:string[] = [];
        for (let i = 0; i < superAdminUsers.length; i++){
          if(i == 0){
            adminEmail = ""+superAdminUsers[i]['adminEmail'];
            // adminEmail = "rakesh.ganeshwade@gunadhyasoft.com";
          } else {
            otherAdminEmail.push(superAdminUsers[i]['adminEmail']);
            // otherAdminEmail.push("deepak.kshirsagar@gunadhyasoft.com");
          }          
        }

        step = 10;          
        new SMTP.SmtpService().sendMail(adminEmail, htmlContent,"Time Tango | Employee's Daily Missed Compliance Report","", otherAdminEmail, attachmentFilePath,attachmentFileName);
        // if(!mailSend){
        //     status = 500;
        //     throw new Error("Failed to sent daily employee attendance list");
        // }
        console.log(`CSV file created for companyId ${company[i].companyId}: ${csvDir}`);
      } catch (error) {
        console.error(`Error creating CSV file for companyId ${company[i].companyId}: ${csvDir} -`, error);
      }

    }

    res.status(200).json({
      status:"success",
      message:"Daily employee complaince missed list sent successfully",
      // employeeComplianceMissedList:employeeComplianceMissedList
    });
    step = 11;
    //create cron job end log;
    let endedCron:any = await CronJobLogTableModel.create({
      title: 'Compnay daily employee complaince missed notification',
      description: 'Cron job ended',
      created_at: moment().utc().toISOString(),
    }, {transaction: tscn});
    await tscn.commit();
   
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

const everyDayLeavesCronJobOfCompanies = async(req: any, res: any,next:any)=>{
  let step = 1;
  
  const tscn = await sequelize.transaction();
  try{

    // take the active company and not deleted company
    let listOfCompany:any = await CompanyTableModel.findAll({
      where:
      {
        is_deleted: false, 
        is_active : true
      },
      // include:[
      //   {
      //     model:HolidayTableModel,
      //     where:{
      //       is_deleted:false,
      //       // is_active:true,
      //       holiday_date:{
      //         [Op.gte]:moment().startOf('year').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
      //         [Op.lte]:moment().endOf('year').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')
      //       },
           
      //     },
      //     attributes:[["holiday_date","holidayDate"]],
      //     required:false
      //   }
      // ],
      raw:true
    });



    if(listOfCompany.length == 0){
      throw new Error("No company found");
    }
    let insertedCompanyIds = "success :";
    let failedCompanyIds = "failed :";
    //today's date 
    let today = moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');
    // let today = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');
    await CronJobLogTableModel.create({
      title: 'Compnay daily employee leaves missing entry',
      description: 'Cron job started',
      created_at: moment().utc().toISOString(),
    }, {transaction: tscn});
 
    for(let company = 0; company < listOfCompany.length; company++){

      if(listOfCompany[company].id != '5bfada30-3772-11ee-bf8f-d9e01d248025'){
        continue;
      }//5bfada30-3772-11ee-bf8f-d9e01d248025    |    bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa

      //provide global state for company
      global.companyState = {
        companyId: listOfCompany[company].id,
      }
      
      let fetchWhere = {

      }
      //read holiday of the company and check the holiday is there or not
      const allHolidayFetchData:any = await HolidayController.getAllHolidayData(fetchWhere);

        if(typeof(allHolidayFetchData) == 'boolean'){
           
            throw new Error("No any holiday data found!");
        }
        else if(typeof(allHolidayFetchData) == 'string'){
            //exception occured while reading the data.
           
            throw new Error("Server Unavailble, try again later!");
        }

      if("weekend" in listOfCompany[company].configuration){
        //get the weekends
        //print the monday to sunday with the help of moment
        let weekend = listOfCompany[company].configuration['weekend'].split(",");//["Sunday","Saturday"];
        let today  = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');
        const isWeekend = weekend.includes(moment(today).format('dddd'));

        if(isWeekend){
          continue;
        }

        //read the holiday of the company

      }
      else{
        //get the default weekends
        let weekend = ["Sunday","Saturday"];
        let today  = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');
        const isWeekend = weekend.includes(moment(today).format('dddd'));

        if(isWeekend){
          continue;
        }
      }

      let complainceHours = listOfCompany[company].configuration['work_hours'];
      let halfHours = Math.round(new common.CommonService().calculateTotalHours(complainceHours) / 2);
      complainceHours = new common.CommonService().calculateTotalHours(complainceHours);

      //getting all absent employee list along with check-out missed and half day completed
      let allAbsentEmployeeList: any = await UserTableModel.findAll({
        where: {
          is_deleted: false,
          is_active: true,
          company_id: listOfCompany[company].id,
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
              ) / 3600.0 < ${complainceHours}
            `),

          ],
          id:{
            [Op.notIn]:sequelize.literal(`(SELECT user_id FROM employee_leaves WHERE date = '${today}' AND is_deleted = false and company_id = '${listOfCompany[company].id}')`)
          }
        },
        include: [
          {
            model: AttendanceTableModel,
            where: {
              date: today,
              company_id: listOfCompany[company].id,
            },
            attributes: [
              [
                sequelize.literal(`CASE WHEN date IS NULL THEN 'ABSENT' WHEN check_out_time IS NULL THEN 'C-LEAVE' WHEN (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600.0 >= 0 AND (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600.0 < ${halfHours} THEN 'LEAVE'  WHEN (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600.0 >= ${halfHours} AND (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600.0 < ${complainceHours} THEN 'HALF-DAY' ELSE 'PRESENT' END`),
                'leaveStatus',
              ],
              // [Sequelize.fn('SUM', Sequelize.literal(`SUBSTRING(total_worked_hours, 1, 2)::integer * 3600 + SUBSTRING(total_worked_hours, 4, 2)::integer * 60 + SUBSTRING(total_worked_hours, 7, 2)::integer`)), 'totalSeconds'],
             
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
        // group: ['user_table.id', 'attendance_table.id', 'employee_table.id'],
      });

      if(allAbsentEmployeeList.length == 0){
        continue;
      }

      //get the today's record of company

      //create the bulk for employee-leave table
      const employeeLeaveBulk:any = [];
      for (const leaveData of allAbsentEmployeeList) {
        let status = leaveData['attendance_tables.leaveStatus'];
        const checkIn = status === 'HALF-DAY' || status === 'LEAVE' || status === 'C-LEAVE';
        let checkOut = status === 'C-LEAVE' ? false : status === 'ABSENT' ? false : true;

        const reason =
          status === 'HALF-DAY'
            ? 'Half day work'
            : status === 'C-LEAVE'
            ? 'Check-out missed'
            : status == 'LEAVE' ? 'Half day compliance missed' : 'Was absent';

        if(status == 'C-LEAVE'){
          status = 'LEAVE';
        }
        employeeLeaveBulk.push({
          date: today,
          company_id: listOfCompany[company].id,
          user_id: leaveData.id,
          employee_id: leaveData['employee_table.id'],
          attendance_id: leaveData['attendance_tables.attendanceId'],
          status,
          check_in: checkIn,
          check_out: checkOut,
          reason: reason,
          is_deleted: false,
          created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
          created_by: 'cron-job',
        });

      }

      try{
        //storing success entry in employee-leave table
        await EmployeeLeaveModel.bulkCreate(employeeLeaveBulk);
        insertedCompanyIds += listOfCompany[company].id + ",";
      }
      catch(error:any){
        //storing failed entry in employee-leave table
        failedCompanyIds += listOfCompany[company].id + ",";
      }
          
      //write a success log of companies entries
      const momentDate = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
      const successLogPath = path.join(__dirname, '..', 'public', 'log-success', momentDate);

      if (fs.existsSync(successLogPath)) {
        await fs.promises.appendFile(path.join(successLogPath, 'success.log'),"\n"+new Date()+"\n\tcompany id : "+ listOfCompany[company].id);
      } else {
        fs.mkdirSync(successLogPath, { recursive: true });
        await fs.promises.writeFile(path.join(successLogPath, 'success.log'), "\n"+new Date()+"\n\tcompany id : "+listOfCompany[company].id);
      }
      
    }

    await CronJobLogTableModel.create({
      title: 'Compnay daily employee leaves missing entry',
      description: 'Cron job ended'+insertedCompanyIds+failedCompanyIds,
      created_at: moment().utc().toISOString(),
    }, {transaction: tscn});

    await tscn.commit();
    global.companyState = null;


    return res.status(200).json({
      status:"success",
      message:"Today's leaves entry created successfully",
      // employeeAttendanceList:employeeAttendanceList
    });

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

    await tscn.rollback();
    global.companyState = null;
    console.log(`step ${step} error: ${error}`);
    return res.status(500).json({
        status:"error",
        message:"Company daily employee leaves missing entry failed"
    });
  }
  
}

const attendanceStatusReportCronJob = async(req: any, res: any,next:any)=>{
  let step = 1, status = 200;
  try{

    const tscn = await sequelize.transaction(); 

    await CronJobLogTableModel.create({
      title: 'Compnay daily employee attendance status report',
      description: 'Cron job started',
      created_at: moment().utc().toISOString(),
    }, {transaction: tscn});

    //read all the companies
    let listOfCompany:any = await CompanyTableModel.findAll({ where:{is_deleted: false, is_active : true}, raw:true})

    if(listOfCompany.length == 0){
      throw new Error("No company found");
    }

    let yesterdayDate = moment().subtract(1, 'day').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');

    for(let i = 0; i < listOfCompany.length; i++){

      if(listOfCompany[i].id != '5bfada30-3772-11ee-bf8f-d9e01d248025'){
        continue;
      }//5bfada30-3772-11ee-bf8f-d9e01d248025    |    bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa


      if("weekend" in listOfCompany[i].configuration){
        //get the weekends
        //print the monday to sunday with the help of moment
        let weekend = listOfCompany[i].configuration['weekend'].split(",");//["Sunday","Saturday"];
        // let today  = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');
        const isWeekend = weekend.includes(moment(yesterdayDate).format('dddd'));

        if(isWeekend){
          continue;
        }

      }
      else{
        //get the default weekends
        let weekend = ["Sunday","Saturday"];
        // let today  = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD 00:00:00Z');
        const isWeekend = weekend.includes(moment(yesterdayDate).format('dddd'));

        if(isWeekend){
          continue;
        }
      }
     
      //read the one day before employee leave table of this company
      let employeeLeaveList:any = await EmployeeLeaveModel.findAll({
        where:{
          company_id: listOfCompany[i].id,
          is_deleted: false,
          date: yesterdayDate,
          is_mail_sent:false
        },
        attributes:[
          "status",
          "id",
          "reason"
        ],
        include:[
          {
            model:EmployeeTableModel,
            attributes:[
              ["first_name","employeeName"],
            ]
          },
          {
            model:UserTableModel,
            attributes:[
              "email"
            ]
          }
        ],
        raw:true
      });

      if(employeeLeaveList.length == 0){
        continue;
      }

      

      for(let j = 0; j < employeeLeaveList.length; j++){
        
        //send email to the employee
        let htmlFilePath:string = path.join(__dirname,'..','emails','employee-leave-template.html');
                  
        let htmlContent = pug.renderFile(htmlFilePath,{
          userFullName:employeeLeaveList[j]["employee_table.employeeName"],
          companyName:listOfCompany[i]["company_name"],
          date:moment(yesterdayDate,"YYYY-MM-DD").format('YYYY-MM-DD'),
          reason:employeeLeaveList[j]["reason"],
          attendanceStatus:employeeLeaveList[j]["status"],
          teamName:process.env.PROJECT_SUPPORT_EMAIL
        });

        step = 6;
        // let mailSend = 
        let userEmail = employeeLeaveList[j]["user_table.email"];
        new SMTP.SmtpService().sendMail(userEmail, htmlContent, "Time Tango | Attendance Status Report");

        //now update the is_mail_sent to true
        await EmployeeLeaveModel.update({
          is_mail_sent:true
          },{
          where:{
            id:employeeLeaveList[j].id
          }, 
          transaction: tscn
        });

       
      }//employee list for loop end
      
    }//company list for loop end

    await CronJobLogTableModel.create({
      title: 'Compnay daily employee attendance status report',
      description: 'Cron job Finished',
      created_at: moment().utc().toISOString(),
    },{transaction: tscn});

    await tscn.commit();

    return res.status(200).json({
      status:"success",
      message:"Employee leave status report sent successfully",
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

export {attendanceStatusReportCronJob, dailyAttendanceReport, dailyComplainceHoursMissedReport , everyDayLeavesCronJobOfCompanies };