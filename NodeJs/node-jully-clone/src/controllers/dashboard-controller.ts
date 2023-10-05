//modules imports below
import validator from "validator";
import moment from 'moment';
require('dotenv').config();
import { Op, Sequelize } from "sequelize";

import UserTableModel from "../abstractions/models/user-table-model";
import sequelize from "../utilities/database-connect";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";
import EmployeeTableModel from "../abstractions/models/employee-table-model";
import UserAttendanceTableModel from "../abstractions/models/attendance-table-model";
import AttendanceTableModel from "../abstractions/models/attendance-table-model";
import CompanyTableModel from "../abstractions/models/company-table-model";

const getDashboardPresentAbsentCount = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  try {
    
    const presentAndAbsentCount = await countTotalAbsentAndPresentEmployeeByDate(req.companyId);
    return res.status(status).json({
        status: "success",
        message: "Dashbaord present absent record!",
        presentAndAbsentCount
    });

  }
  catch (error: any) {
      return res.status(status === 200 ? 500 : status).json({
          status: "error",
          message: error.message
      });
  }
}

const getDashboardYearlyAverage = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  try {
    
    const yearlyAverage = await calculateYearlyAttendanceAverage(req.companyId);
    return res.status(status).json({
        status: "success",
        message: "Dashbaord yearly average record!",
        yearlyAverage
    });

  }
  catch (error: any) {
      return res.status(status === 200 ? 500 : status).json({
          status: "error",
          message: error.message
      });
  }
}

const getDashboardMonthlyAverage = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  try {
    
    const monthlyAverage = await calculateMonthlyAttendanceAverage(req.companyId);
    return res.status(status).json({
        status: "success",
        message: "Dashbaord monthly average record!",
        monthlyAverage
    });

  }
  catch (error: any) {
      return res.status(status === 200 ? 500 : status).json({
          status: "error",
          message: error.message
      });
  }
}

const getDashboardPresentAbsentEmployeeList = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  try {
    
    const presentAndAbsentList = await totalPresentAbsentEmployeeListByDate(req.companyId);
    return res.status(status).json({
        status: "success",
        message: "Dashbaord present absent record!",
        presentAndAbsentList
    });

  }
  catch (error: any) {
      return res.status(status === 200 ? 500 : status).json({
          status: "error",
          message: error.message
      });
  }
}

const getDashboardDailyAverage = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  try {
    
    const dailyAverage = await calculateDailyAttendanceAverage(req.companyId);
    return res.status(status).json({
        status: "success",
        message: "Dashbaord weekly average record",
        dailyAverage
    });

  }
  catch (error: any) {
      return res.status(status === 200 ? 500 : status).json({
          status: "error",
          message: error.message
      });
  }
}

const getMonthlyAchivers = async (req:UserRequest,res:any, next:any) =>{
  let step = 1, status = 200;
  try{

    let date = req.query.date as string || ""
    if (moment(date, 'YYYY-MM', true).isValid()) {
      date = moment(date, 'YYYY-MM').format('YYYY-MM-DD HH:mm:ssZ');
    }
    else{
      date = moment().startOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
    }
    const monthlyMostComplainceAchivers = await calculateMonthlyComplainceAchivers(req.companyId,'DESC',date);
    if(typeof(monthlyMostComplainceAchivers) === 'string'){
      throw new Error(monthlyMostComplainceAchivers);
    }

    const monthlyLeastComplainceAchivers = await calculateMonthlyComplainceAchivers(req.companyId,'ASC',date);
    if(typeof(monthlyLeastComplainceAchivers) === 'string'){
      throw new Error(monthlyLeastComplainceAchivers);
    }
    const monthlyMostAchivers = await calculateMonthlyAchiversTimeSpend(req.companyId,'DESC',date);
    if(typeof(monthlyMostAchivers) === 'string'){
      throw new Error(monthlyMostAchivers);
    }
    const monthlyLeastAchivers = await calculateMonthlyAchiversTimeSpend(req.companyId,'ASC',date);
    if(typeof(monthlyLeastAchivers) === 'string'){
      throw new Error(monthlyLeastAchivers);
    }

    return res.status(status).json({
      status: "success",
      message: "Dashbaord monthly achivers record!",
      monthlyMostAchivers,
      monthlyLeastAchivers,
      monthlyMostComplainceAchivers,
      monthlyLeastComplainceAchivers
    });


  }
  catch(error:any){
    console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller getMonthlyAchivers failed!");
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }

}


const calculateMonthlyAchiversTimeSpend = async (companyId:string,returnOrder:string, date:string = moment().startOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')) : Promise<Object | String> => {
  let step = 1;
  try{

    // const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
    // const endDate = moment(startDate).endOf('month');

    let startDate:string = moment(date,"YYYY-MM").startOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
    let endDate:string = moment(date,"YYYY-MM").endOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
   

    const companyConfig:any = await getCompanyConfig(companyId);
    const complianceHours = companyConfig && companyConfig.work_hours ? companyConfig.work_hours : '09:00:00';
    let attendanceByEmployee:any = await AttendanceTableModel.findAll({
      attributes: [
        'user_id',
        [Sequelize.fn('SUM', Sequelize.literal(`SUBSTRING(total_worked_hours, 1, 2)::integer * 3600 + SUBSTRING(total_worked_hours, 4, 2)::integer * 60 + SUBSTRING(total_worked_hours, 7, 2)::integer`)), 'totalSeconds'],
        [Sequelize.fn('COUNT', Sequelize.col('attendance_table.id')), 'count'],
        [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN SUBSTRING(total_worked_hours, 1, 2)::integer * 3600 + SUBSTRING(total_worked_hours, 4, 2)::integer * 60 + SUBSTRING(total_worked_hours, 7, 2)::integer >= SUBSTRING('${complianceHours}', 1, 2)::integer * 3600 + SUBSTRING('${complianceHours}', 4, 2)::integer * 60 + SUBSTRING('${complianceHours}', 7, 2)::integer THEN 1 ELSE 0 END`)), 'compliance'],
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
        total_worked_hours: {
          [Op.ne]: null,
        },
        is_deleted: false,
        company_id: companyId,
      },
      group: ['attendance_table.user_id', 'employee_table.id'],
      order: [[Sequelize.fn('SUM', Sequelize.literal(`SUBSTRING(total_worked_hours, 1, 2)::integer * 3600 + SUBSTRING(total_worked_hours, 4, 2)::integer * 60 + SUBSTRING(total_worked_hours, 7, 2)::integer`)), returnOrder]],//'DESC'
      limit: 4,
      raw: true,
      include:[{
        // model: UserTableModel,
        // include: [{
          model: EmployeeTableModel,
          attributes: ['first_name'],
        // }],
      }]
   
    });


    if (!attendanceByEmployee.length) {
      throw new Error('Unable to find any attendance records for the given month');
    }

    attendanceByEmployee.forEach((record: any) => {
      const totalSeconds = record['totalSeconds'];
      const totalDuration = moment.duration(totalSeconds, 'seconds');
      record['totalHours']  = totalDuration.asHours();// 162.09666666666666
    });

    attendanceByEmployee = attendanceByEmployee.map((record:any) => {
      return {
        employeeName: record['employee_table.first_name'],
        totalHours: record['totalHours'],
      };
    });

    return attendanceByEmployee;
    
  }
  catch(error:any){
    console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller calculateMonthlyAchivers failed!");
    return error.message;
  }
}

const calculateMonthlyComplainceAchivers = async (companyId:string,returnOrder:string,date:string = moment().startOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')) : Promise<Object | String> => {

  let step = 1;
  try{

    // const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
    // const endDate = moment(startDate).endOf('month');
    let startDate:string = moment(date,"YYYY-MM").startOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
    let endDate:string = moment(date,"YYYY-MM").endOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
   

    const companyConfig:any = await getCompanyConfig(companyId);
    const complianceHours = companyConfig && companyConfig.work_hours ? companyConfig.work_hours : '09:00:00';
    let attendanceByEmployee:any = await AttendanceTableModel.findAll({
      attributes: [
        'user_id',
        // [Sequelize.fn('SUM', Sequelize.literal(`SUBSTRING(total_worked_hours, 1, 2)::integer * 3600 + SUBSTRING(total_worked_hours, 4, 2)::integer * 60 + SUBSTRING(total_worked_hours, 7, 2)::integer`)), 'totalSeconds'],
        [Sequelize.fn('COUNT', Sequelize.col('attendance_table.id')), 'count'],
        [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN SUBSTRING(total_worked_hours, 1, 2)::integer * 3600 + SUBSTRING(total_worked_hours, 4, 2)::integer * 60 + SUBSTRING(total_worked_hours, 7, 2)::integer >= SUBSTRING('${complianceHours}', 1, 2)::integer * 3600 + SUBSTRING('${complianceHours}', 4, 2)::integer * 60 + SUBSTRING('${complianceHours}', 7, 2)::integer THEN 1 ELSE 0 END`)), 'compliance'],
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
        total_worked_hours: {
          [Op.ne]: null,
        },
        is_deleted: false,
        company_id: companyId,
      },
      group: ['attendance_table.user_id', 'employee_table.id'],
      order: [[Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN SUBSTRING(total_worked_hours, 1, 2)::integer * 3600 + SUBSTRING(total_worked_hours, 4, 2)::integer * 60 + SUBSTRING(total_worked_hours, 7, 2)::integer >= SUBSTRING('${complianceHours}', 1, 2)::integer * 3600 + SUBSTRING('${complianceHours}', 4, 2)::integer * 60 + SUBSTRING('${complianceHours}', 7, 2)::integer THEN 1 ELSE 0 END`)), returnOrder]],//'DESC'
      limit: 4,
      raw: true,
      include:[{
        // model: UserTableModel,
        // include: [{
          model: EmployeeTableModel,
          attributes: ['first_name'],
        // }],
      }]
   
    });


    if (!attendanceByEmployee.length) {
      throw new Error('Unable to find any attendance records for the given month');
    }

   
    attendanceByEmployee = attendanceByEmployee.map((record:any) => {
      return {
        employeeName: record['employee_table.first_name'],
        compliance: record['compliance'],
      };
    });

    return attendanceByEmployee;
    
  }
  catch(error:any){
    console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller calculateMonthlyAchivers failed!");
    return error.message;
  }

}


const calculateMonthlyAchivers = async (companyId:string, month:number = moment().month() + 1, year:number = moment().year()) : Promise<Object | String> => {
  let step = 1;
  try{

    //most time spend
    //calculate the most work time spend by employee in the month
    //start and end date of the month
    const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
    const endDate = moment(startDate).endOf('month');

    //all attendance records within the current month of the company

     //read company compliance hours otherwise 9 hours is default
     let companyConfig:any = await getCompanyConfig(companyId);
     if(typeof(companyConfig) === 'string'){
       companyConfig = "09:00:00"; // default compalince hours
     }
     else{
       //extra check if the companyConfig is not empty
       companyConfig = companyConfig["work_hours"] ? companyConfig["work_hours"] : "09:00:00";
     }
 
     //all attendance records within the current month of the company
     const attendanceRecords:any = await AttendanceTableModel.findAll({
       where: {
         date: {
           [Op.between]: [startDate, endDate]
         },
         total_worked_hours: {
           [Op.ne]: null
         },
         is_deleted: false,
         company_id: companyId
       },
       raw: true,
     });
 
    const attendanceByEmployee = {};
    attendanceRecords.forEach((record:any) => {
      const employeeId = record.user_id;
      if (!attendanceByEmployee[employeeId]) {
        attendanceByEmployee[employeeId] = {
          totalHours: 0,
          count: 0,
          complaince:0
        };
      }
      attendanceByEmployee[employeeId].totalHours += moment.duration(record.total_worked_hours).asHours()
      attendanceByEmployee[employeeId].count++;
      //if the total worked hours is greater than the company compliance hours then add 1 to the compliance
      let totalWorkedHours:any = moment.duration(record.total_worked_hours);
      totalWorkedHours = moment.utc(totalWorkedHours.asMilliseconds()).format('HH:mm:ss');
      const isCompliancePassed = moment(totalWorkedHours, 'HH:mm:ss').isSameOrAfter(moment(companyConfig, 'HH:mm:ss'));
      if(isCompliancePassed){
        attendanceByEmployee[employeeId].complaince++;
      }
    });

    // Find the employee with the max and min complaince average
    let perfectAttendanceComplainceEmployeeId:any;
    let perfectAttendanceComplainceEmployeeHours = -Infinity;
    let leastAttendanceComplainceEmployeeId:any;
    let leastAttendanceComplainceEmployeeHours = Infinity;

    // Find the employee with the max and min total worked hours
    let maxEmployeeId:any;
    let minEmployeeId:any;
    let maxTotalHours = -Infinity;
    let minTotalHours = Infinity;
    for (const employeeId in attendanceByEmployee) {
      const totalHours = attendanceByEmployee[employeeId].totalHours;
      if (totalHours > maxTotalHours) {
        maxTotalHours = totalHours;
        maxEmployeeId = employeeId;
      }
      if (totalHours < minTotalHours) {
        minTotalHours = totalHours;
        minEmployeeId = employeeId;
      }

      //find the max complaince count and min complaince count
      const complainceCount = attendanceByEmployee[employeeId].complaince;
      if (complainceCount > perfectAttendanceComplainceEmployeeHours) {
        perfectAttendanceComplainceEmployeeHours = complainceCount;
        perfectAttendanceComplainceEmployeeId = employeeId;
      }
      if (complainceCount < leastAttendanceComplainceEmployeeHours) {
        leastAttendanceComplainceEmployeeHours = complainceCount;
        leastAttendanceComplainceEmployeeId = employeeId;
      }

    }

    //get the employee details
    const maxEmployeeDetails = await getEmployeeDetails(companyId, maxEmployeeId);
    if(typeof(maxEmployeeDetails) === 'string'){
      throw new Error("Unable to find the employee details");
    }
    let mostTimeSpend = {
      maxEmployeeDetails,
      totalHours: maxTotalHours,
    }

    const minEmployeeDetails = await getEmployeeDetails(companyId, minEmployeeId);
    if(typeof(minEmployeeDetails) === 'string'){
      throw new Error("Unable to find the employee details");
    }
    let leastTimeSpend = {
      minEmployeeDetails,
      totalHours: minTotalHours,
    }

    const perfectAttendanceComplainceEmployeeDetails = await getEmployeeDetails(companyId, perfectAttendanceComplainceEmployeeId);
    if(typeof(perfectAttendanceComplainceEmployeeDetails) === 'string'){
      throw new Error("Unable to find the employee details");
    }
    let perfectAttendanceComplaince = {
      perfectAttendanceComplainceEmployeeDetails,
      totalComplaince: perfectAttendanceComplainceEmployeeHours,
    }

    const leastAttendanceComplainceEmployeeDetails = await getEmployeeDetails(companyId, leastAttendanceComplainceEmployeeId);
    if(typeof(leastAttendanceComplainceEmployeeDetails) === 'string'){
      throw new Error("Unable to find the employee details");
    }
    let leastAttendanceComplaince = {
      leastAttendanceComplainceEmployeeDetails,
      totalComplaince: leastAttendanceComplainceEmployeeHours,
    }

    
    return {
      mostTimeSpend,
      leastTimeSpend,
      perfectAttendanceComplaince,
      leastAttendanceComplaince
    }
  }
  catch(error:any){
    console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller calculateMonthlyAchivers failed!");
    return error.message;
  }
}

const getEmployeeDetails = async (companyId:string, employeeId:string) : Promise<Object | String> => {
  let step = 1;
  try{

    // throw new Error("getEmployeeDetails not implemented!");
    let employeeDetails:any = await UserTableModel.findOne({
      where: {
        id: employeeId,
        company_id: companyId,
        is_deleted: false,
      },
      attributes: [
        'id',
        'email',
      ],
      include: [
        
        {
          model: EmployeeTableModel,
          attributes: [
            ['first_name', 'firstName'],
          ],
        },
      ],
      raw: true,
    });

    if(!employeeDetails){
      throw new Error("Employee not found!");
    }

    return {
      id: employeeDetails.id,
      email: employeeDetails.email,
      firstName: employeeDetails["employee_table.firstName"],
    };


  }
  catch(error:any){
    // console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller getEmployeeDetails failed!");
    return error.message;
  }
}





const countTotalAbsentAndPresentEmployeeByDate = async (companyId:string, date = new Date()) : Promise<Object | String> => {
  let step = 1;
  try{

    let givenDate = moment(date,"YYYY-MM-DD").startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')
    const employeeList:any = await UserTableModel.findAll({
      where: {
        is_deleted: false,
        company_id: companyId,
      },
      attributes: [
        'id',
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
          ],
          required: false,
        },
        {
          model: EmployeeTableModel,
          attributes: [
            ['first_name', 'firstName'],
          ],
        },
      ],
      raw: true,
    });

    const presentEmployeeList = employeeList.filter((employee:any) => employee.isAttendance);
    const absentEmployeeList = employeeList.filter((employee:any) => !employee.isAttendance);

    return{
      presentCount: presentEmployeeList.length,
      absentCount: absentEmployeeList.length,
    }

  }
  catch(error:any){
    console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller countTotalAbsentAndPresentEmployeeByDate failed!");
    return error.message;
  }
}

const totalPresentAbsentEmployeeListByDate = async (companyId:string, date = new Date()) : Promise<Object | String> => {
  let step = 1;
  try{

    let givenDate = moment(date,"YYYY-MM-DD").startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')

    let employeeList:any = await UserTableModel.findAll({
      where: {
        is_deleted: false,
        company_id: companyId,
      },
      attributes: [
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


    employeeList = employeeList.map((employee:any) => {
      return {
        id: employee.id,
        email: employee.email,
        firstName: employee["employee_table.firstName"],
        empId: employee["employee_table.empId"],
        isAttendance: employee.isAttendance,
        date: employee["attendance_tables.date"],
        checkInTime: employee["attendance_tables.checkInTime"],
        checkOutTime: employee["attendance_tables.checkOutTime"],
        checkInPath: employee["attendance_tables.checkInPath"],
        checkOutPath: employee["attendance_tables.checkOutPath"],
        totalWorkedHours: employee["attendance_tables.totalWorkedHours"],
      }
    })

    const presentEmployeeList = employeeList.filter((employee:any) => employee.isAttendance);
    const absentEmployeeList = employeeList.filter((employee:any) => !employee.isAttendance);

    return {
      presentEmployeeList:{
        totalCount: presentEmployeeList.length,
        data: presentEmployeeList
      },

      absentEmployeeList:{
        totalCount: absentEmployeeList.length,
        data:  absentEmployeeList
      }
    }

  }
  catch(error:any){
    console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller totalAbsentEmployee failed!");
    return error.message;
  }
}

//not in use as of now
const totalAbsentPresentEmployeeByDate = async (companyId:string,date = new Date()) : Promise<Object | String> => {
  let step = 1;
  try{

    //count all active and not deleted employees
    const employeeCount: number = await EmployeeTableModel.count({
      where: { company_id:companyId, is_deleted: false },
    });

    step = 2;
    const todayDate =  moment(date).format('YYYY-MM-DD')
    //check if the date is valid
    if (!moment(todayDate, 'YYYY-MM-DD', true).isValid()) {
        throw new Error("Invalid date");
    }

    let today = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');

    step = 3;
    const employeeAttendanceList: any = await UserTableModel.findAndCountAll({
      where:{
        company_id: companyId,
      },
      include: [
        {
          model: EmployeeTableModel,
          where:{
            company_id: companyId,
          },
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
                'created_at',
                ['check_in_path','checkInPath'],
                ['check_out_path','checkOutPath'],
                ['total_worked_hours','totalWorkedHours'],
                'date',
                [sequelize.literal(`CASE WHEN date !='${today}' THEN true ELSE false END`),'isResetAttendance'],
            
              ],
              where:{
                is_deleted: false,
                date: moment(todayDate).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')
              },
              required: true, // Set required to false to return empty attendance for employees who don't have attendance on the specified date
            },
          ],
        },
      ],
      order: [
        [sequelize.col('employee_table->attendance_tables.check_in_time'), 'DESC']
      ],
      raw: true,
      subQuery: false,
    });

    step = 4;
    if(employeeAttendanceList.count == 0 || employeeAttendanceList.rows.length == 0){
      return {
        activeEmployeeTotalCount: employeeCount,
        totalCount: employeeAttendanceList.count,
        totalData: employeeAttendanceList.rows,
      }
    }

    step = 5;
    const employeeAttendanceListWithEmptyAttendance = 
      employeeAttendanceList.rows.map( (employeeAttendance: any) => {
        let empId:string = employeeAttendance["employee_table.empId"];
        let firstName:string = employeeAttendance["employee_table.firstName"];

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

      return {
        activeEmployeeTotalCount: employeeCount,
        totalCount: employeeAttendanceList.count,
        totalData: employeeAttendanceListWithEmptyAttendance,
      }

  }
  catch(error:any){
    console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller totalAbsentPresentEmployeeByDate failed!");
    return error.message;
  }
}

const calculateMonthlyAttendanceAverage = async (companyId:string) : Promise<Object | String> => {
  let step = 1;
  try{
    //start date as last 5 month and end date of the month
    const startDate = moment().subtract(5, 'months').date(1).format('YYYY-MM-DD');
    const endDate = moment().endOf('month');
    
    //read company compliance hours otherwise 9 hours is default
    let companyConfig:any = await getCompanyConfig(companyId);
    if(typeof(companyConfig) === 'string'){
      companyConfig = "09:00:00"; // default compalince hours
    }
    else{
      //extra check if the companyConfig is not empty
      companyConfig = companyConfig["work_hours"] ? companyConfig["work_hours"] : "09:00:00";
    }

    //all attendance records within the current month and last 5 month of the company
    const totalWorkedHoursMonthly = await AttendanceTableModel.findAll({
      attributes: [
        [
          Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('date')),
          'month'
        ],
        [
          Sequelize.literal(`
            AVG(
              SUBSTRING("total_worked_hours"::text, 1, 2)::decimal * 3600 +
              SUBSTRING("total_worked_hours"::text, 4, 2)::decimal * 60 +
              SUBSTRING("total_worked_hours"::text, 7, 2)::decimal
            ) / 3600
          `),
          'total_worked_hours',
        ],
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
        total_worked_hours: {
          [Op.ne]: null,
        },
        is_deleted: false,
        company_id: companyId,
      },
      group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('date'))],
      order: [    
        [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('date')), 'DESC'] // Order by date in descending order
      ],
      limit: 5, // Limit the result to the last 5 months
      raw: true,
    });
    
    const averageAttendanceMonthly = {};
    let i = 0;
    totalWorkedHoursMonthly.forEach((data:any) => {
      const month = data.month ? moment(data.month).format('MMM') : 0;
      const monthYear = data.month ? moment(data.month).format('YYYY') : 0;
      const totalHours: number = data.total_worked_hours ? Number(data.total_worked_hours) : 0;
      let averageTime:any = moment.duration({hours: totalHours});
      averageTime = moment.utc(averageTime.asMilliseconds()).format('HH:mm:ss');
      const isCompliancePassed = moment(averageTime, 'HH:mm:ss').isSameOrAfter(moment(companyConfig, 'HH:mm:ss'));

      averageAttendanceMonthly[i] = {
        monthName: month,
        monthYear: monthYear,
        monthNumber: moment(data.month, 'MMMM').month() + 1,
        averageHours: totalHours,
        averageTime: averageTime,
        isCompliancePassed: isCompliancePassed
      };
      i++;
    });

    //return the average attendance monthly
    return averageAttendanceMonthly
  }
  catch(error:any){
    console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller calculateMonthlyAttendanceAverage failed!");
    return error.message;
  }
}

const calculateDailyAttendanceAverage = async (companyId:string) : Promise<Object | String> => {
  let step = 1;
  try{
    //start and end date of the month
    const startDate = moment().subtract(5, 'day').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    
    //read company compliance hours otherwise 9 hours is default
    let companyConfig:any = await getCompanyConfig(companyId);
    if(typeof(companyConfig) === 'string'){
      companyConfig = "09:00:00"; // default compalince hours
    }
    else{
      //extra check if the companyConfig is not empty
      companyConfig = companyConfig["work_hours"] ? companyConfig["work_hours"] : "09:00:00";
    }

    //all attendance records within the last 5 days of the company
    const totalWorkedHoursDaily= await AttendanceTableModel.findAll({
      attributes: [
        [
          Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('date')),
          'day'
        ],
        [
          Sequelize.literal(`
            AVG(
              SUBSTRING("total_worked_hours"::text, 1, 2)::decimal * 3600 +
              SUBSTRING("total_worked_hours"::text, 4, 2)::decimal * 60 +
              SUBSTRING("total_worked_hours"::text, 7, 2)::decimal
            ) / 3600
          `),
          'total_worked_hours',
        ],
        [
          Sequelize.fn('TO_CHAR', Sequelize.fn('MIN', Sequelize.col('date')), 'YYYY-MM-DD'),
          'startDate'
        ],
        [
          Sequelize.fn('TO_CHAR', Sequelize.fn('MAX', Sequelize.col('date')), 'YYYY-MM-DD'),
          'endDate'
        ]
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
        total_worked_hours: {
          [Op.ne]: null,
        },
        is_deleted: false,
        company_id: companyId,
      },
      // group: [Sequelize.literal(`DATE_TRUNC('month', "date")`)],
      group: [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('date'))],
      order: [    
        [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('date')), 'DESC'] // Order by date in descending order
      ],
      limit: 5, // Limit the result to the last 5 months
      raw: true,
    });
    
    const averageAttendanceDaily = {};
    let dayNumber = 1;
    let i = 0;
    totalWorkedHoursDaily.forEach((data:any) => {      
      let date = data.day ? moment(data.day).format('YYYY-MM-DD') : '';

      const totalHours: number = data.total_worked_hours ? Number(data.total_worked_hours) : 0;
      let averageTime:any = moment.duration({hours: totalHours});
      averageTime = moment.utc(averageTime.asMilliseconds()).format('HH:mm:ss');
      const isCompliancePassed = moment(averageTime, 'HH:mm:ss').isSameOrAfter(moment(companyConfig, 'HH:mm:ss'));

      averageAttendanceDaily[i] = {
        dayNumber : dayNumber++,
        date: date,
        averageHours: totalHours,
        averageTime: averageTime,
        isCompliancePassed: isCompliancePassed
      };
      i++;
    });

    //return the average attendance daily
    return averageAttendanceDaily;
  }
  catch(error:any){
    console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller calculateDailyAttendanceAverage failed!");
    return error.message;
  }
}

const calculateYearlyAttendanceAverage = async (companyId:string) : Promise<Object | String> => {
  let step = 1;
  try{
    //start and end date of the year
    const startDate = moment().subtract(5, 'year').date(1).format('YYYY-MM-DD');
    const endDate = moment().endOf('year');
    
    //read company compliance hours otherwise 9 hours is default
    let companyConfig:any = await getCompanyConfig(companyId);
    if(typeof(companyConfig) === 'string'){
      companyConfig = "09:00:00"; // default compalince hours
    }
    else{
      //extra check if the companyConfig is not empty
      companyConfig = companyConfig["work_hours"] ? companyConfig["work_hours"] : "09:00:00";
    }

    //all attendance records within the current year and last 5 year of the company
    const totalWorkedHoursYearly = await AttendanceTableModel.findAll({
      attributes: [
        [
          Sequelize.fn('DATE_TRUNC', 'year', Sequelize.col('date')),
          'year'
        ],
        [
          Sequelize.literal(`
            AVG(
              SUBSTRING("total_worked_hours"::text, 1, 2)::decimal * 3600 +
              SUBSTRING("total_worked_hours"::text, 4, 2)::decimal * 60 +
              SUBSTRING("total_worked_hours"::text, 7, 2)::decimal
            ) / 3600
          `),
          'total_worked_hours',
        ],
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
        total_worked_hours: {
          [Op.ne]: null,
        },
        is_deleted: false,
        company_id: companyId,
      },
      group: [Sequelize.fn('DATE_TRUNC', 'year', Sequelize.col('date'))],
      order: [    
        [Sequelize.fn('DATE_TRUNC', 'year', Sequelize.col('date')), 'DESC'] // Order by date in descending order
      ],
      limit: 2, // Limit the result to the last 5 months
      raw: true,
    });
    
    const averageAttendanceYearly = {};
    let yearNumber = 1;
    let i = 0;
    totalWorkedHoursYearly.forEach((data:any) => {
      const year = data.year ? moment(data.year).format('YYYY') : 0;
      const totalHours: number = data.total_worked_hours ? Number(data.total_worked_hours) : 0;
      let averageTime:any = moment.duration({hours: totalHours});
      averageTime = moment.utc(averageTime.asMilliseconds()).format('HH:mm:ss');
      const isCompliancePassed = moment(averageTime, 'HH:mm:ss').isSameOrAfter(moment(companyConfig, 'HH:mm:ss'));

      averageAttendanceYearly[i] = {
        yearNumber: yearNumber,
        year: year,
        averageHours: totalHours,
        averageTime: averageTime,
        isCompliancePassed: isCompliancePassed
      };
      i++;
    });

    //return the average attendance yearly
    return averageAttendanceYearly
  }
  catch(error:any){
    console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller calculateYearlyAttendanceAverage failed!");
    return error.message;
  }
}

const calculateWeekyAttendanceAverage = async (companyId:string) : Promise<Object | String> => {
  let step = 1;
  try{
    //start and end date of the month
    const startDate = moment().subtract(5, 'weeks').startOf('week').format('YYYY-MM-DD');
    const endDate = moment().endOf('week').format('YYYY-MM-DD');
    
    //read company compliance hours otherwise 9 hours is default
    let companyConfig:any = await getCompanyConfig(companyId);
    if(typeof(companyConfig) === 'string'){
      companyConfig = "09:00:00"; // default compalince hours
    }
    else{
      //extra check if the companyConfig is not empty
      companyConfig = companyConfig["work_hours"] ? companyConfig["work_hours"] : "09:00:00";
    }

    //all attendance records within the last 5 days of the company
    const totalWorkedHoursDaily= await AttendanceTableModel.findAll({
      attributes: [
        [
          Sequelize.fn('DATE_TRUNC', 'week', Sequelize.col('date')),
          'week'
        ],
        [
          Sequelize.literal(`
            AVG(
              SUBSTRING("total_worked_hours"::text, 1, 2)::decimal * 3600 +
              SUBSTRING("total_worked_hours"::text, 4, 2)::decimal * 60 +
              SUBSTRING("total_worked_hours"::text, 7, 2)::decimal
            ) / 3600
          `),
          'total_worked_hours',
        ],
        [
          Sequelize.fn('TO_CHAR', Sequelize.fn('MIN', Sequelize.col('date')), 'YYYY-MM-DD'),
          'startDate'
        ],
        [
          Sequelize.fn('TO_CHAR', Sequelize.fn('MAX', Sequelize.col('date')), 'YYYY-MM-DD'),
          'endDate'
        ]
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
        total_worked_hours: {
          [Op.ne]: null,
        },
        is_deleted: false,
        company_id: companyId,
      },
      // group: [Sequelize.literal(`DATE_TRUNC('month', "date")`)],
      group: [Sequelize.fn('DATE_TRUNC', 'week', Sequelize.col('date'))],
      order: [    
        [Sequelize.fn('DATE_TRUNC', 'week', Sequelize.col('date')), 'DESC'] // Order by date in descending order
      ],
      limit: 5, // Limit the result to the last 5 months
      raw: true,
    });
    
    const averageAttendanceDaily = {};
    let weekNumber = 1;
    let i = 0;
    totalWorkedHoursDaily.forEach((data:any) => {      
      const totalHours: number = data.total_worked_hours ? Number(data.total_worked_hours) : 0;
      let averageTime:any = moment.duration({hours: totalHours});
      averageTime = moment.utc(averageTime.asMilliseconds()).format('HH:mm:ss');
      const isCompliancePassed = moment(averageTime, 'HH:mm:ss').isSameOrAfter(moment(companyConfig, 'HH:mm:ss'));

      averageAttendanceDaily[i] = {
        weekNumber : weekNumber++,
        averageHours: totalHours,
        averageTime: averageTime,
        isCompliancePassed: isCompliancePassed,
        weekDateRanges: {
          startDate : data.startDate,
          endDate: data.endDate
        }
      };
      i++;
    });

    //return the average attendance daily
    return averageAttendanceDaily;
  }
  catch(error:any){
    console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller calculateWeekyAttendanceAverage failed!");
    return error.message;
  }
}


const getCompanyConfig = async (companyId:string) : Promise<Object | String> => {
  let step = 1;
  try{

    const companyConfig:any = await CompanyTableModel.findOne({
      where: {
        id: companyId,
      },
      raw: true,
      attributes:["configuration"]
    });

    if(!companyConfig){
      throw new Error("Company's configuration not found!'");
    }

    return companyConfig.configuration;

  }
  catch(error:any){
    console.log(`step ${step}, error: ${error.message}`);
    console.log("Controller getCompanyConfig failed!");
    return error.message;
  }
}

export {getMonthlyAchivers, getDashboardPresentAbsentCount, getDashboardPresentAbsentEmployeeList, getDashboardYearlyAverage, getDashboardMonthlyAverage, getDashboardDailyAverage };