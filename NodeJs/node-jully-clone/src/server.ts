import { debug } from "util";
import app from "./app";
import http from "http";

require('dotenv').config();
//system modules imports below
import sequelize from "./utilities/database-connect";

import CompanyTableModel from "./abstractions/models/company-table-model";
import UserTableModel from "./abstractions/models/user-table-model";
import AttendanceTableModel from "./abstractions/models/attendance-table-model";
import EmployeeTableModel from "./abstractions/models/employee-table-model";
import DepartmentTableModel from "./abstractions/models/department-table-model";
import DesignationTableModel from "./abstractions/models/designation-table-model";
import RoleTableModel from "./abstractions/models/role-table-model";
import CronJobLogTableModel from "./abstractions/models/cron-job-log-table-model";
import * as seedsChecks from "./abstractions/seeds/services/seedsCheck";
import HistoryTableModel from "./abstractions/models/history-log-info-model";
import EmployeeDeviceModel from "./abstractions/models/employee-device-model";
import VisitorAttendanceTable from "./abstractions/models/visitor-table-model";
import EmployeeLeaveModel from "./abstractions/models/employee-leave-model";
import HolidayTableModel from './abstractions/models/holiday-calender-table-model';

//json file imports below
const userSeeds = require("./abstractions/seeds/user-seeds.json");
const companySeeds = require("./abstractions/seeds/company-seeds.json");


function normalizePort(val: string): number | string | boolean {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

const onError = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = (): void => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "8080");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);


/**
 * @description
 * Table associativity below (Basically primary - foreign key association/relation).
 */

CompanyTableModel.hasMany(VisitorAttendanceTable,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'company_id'});
VisitorAttendanceTable.belongsTo(CompanyTableModel,{foreignKey:'company_id'});

UserTableModel.hasMany(VisitorAttendanceTable,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'user_id'});
VisitorAttendanceTable.belongsTo(UserTableModel,{foreignKey:'user_id'});

CompanyTableModel.hasMany(HistoryTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'company_id'});
HistoryTableModel.belongsTo(CompanyTableModel,{foreignKey:'company_id'});


CompanyTableModel.hasMany(UserTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'company_id'});
UserTableModel.belongsTo(CompanyTableModel,{foreignKey:'company_id'});

CompanyTableModel.hasMany(AttendanceTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'company_id'});
AttendanceTableModel.belongsTo(CompanyTableModel,{foreignKey:'company_id'});

UserTableModel.hasMany(AttendanceTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'user_id'});
AttendanceTableModel.belongsTo(UserTableModel,{foreignKey:'user_id'});

EmployeeTableModel.hasMany(AttendanceTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'employee_id'});
AttendanceTableModel.belongsTo(EmployeeTableModel,{foreignKey:'employee_id'});

CompanyTableModel.hasMany(EmployeeTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'company_id'});
EmployeeTableModel.belongsTo(CompanyTableModel,{foreignKey:'company_id'});

RoleTableModel.hasMany(UserTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'role_id'});
UserTableModel.belongsTo(RoleTableModel,{foreignKey:'role_id'});

DepartmentTableModel.hasMany(UserTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'department_id'});
UserTableModel.belongsTo(DepartmentTableModel,{foreignKey:'department_id'});

DesignationTableModel.hasMany(UserTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'designation_id'});
UserTableModel.belongsTo(DesignationTableModel,{foreignKey:'designation_id'});

DepartmentTableModel.hasMany(EmployeeTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'department_id'});
EmployeeTableModel.belongsTo(DepartmentTableModel,{foreignKey:'department_id'});

DesignationTableModel.hasMany(EmployeeTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'designation_id'});
EmployeeTableModel.belongsTo(DesignationTableModel,{foreignKey:'designation_id'});

UserTableModel.hasOne(EmployeeTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'user_id'});
EmployeeTableModel.belongsTo(UserTableModel,{foreignKey:'user_id'});

UserTableModel.hasOne(EmployeeDeviceModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'user_id'});
EmployeeDeviceModel.belongsTo(UserTableModel,{foreignKey:'user_id'});

CompanyTableModel.hasMany(EmployeeDeviceModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'company_id'});
EmployeeDeviceModel.belongsTo(CompanyTableModel,{foreignKey:'company_id'});

CompanyTableModel.hasMany(EmployeeLeaveModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'company_id'});
EmployeeLeaveModel.belongsTo(CompanyTableModel,{foreignKey:'company_id'});

UserTableModel.hasMany(EmployeeLeaveModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'user_id'});
EmployeeLeaveModel.belongsTo(UserTableModel,{foreignKey:'user_id'});

EmployeeTableModel.hasMany(EmployeeLeaveModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'employee_id'});
EmployeeLeaveModel.belongsTo(EmployeeTableModel,{foreignKey:'employee_id'});

CompanyTableModel.hasMany(HolidayTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'company_id'});
HolidayTableModel.belongsTo(CompanyTableModel,{foreignKey:'company_id'});



//use sync({force:true}) to drop all tables and create new ones
//use sync({alter:true}) to alter the tables (add/remove columns)
sequelize.sync().then(async (_)=>{

  /**
   * @description
   * Adding seeds into the database
   */

  const isUserAvailable = await UserTableModel.findOne({where:{is_deleted:false,is_active:true},raw:true}); 
  const isCompanyAvailable = await CompanyTableModel.findOne({where:{is_deleted:false},raw:true});
  if((!isUserAvailable || isUserAvailable == null) && (!isCompanyAvailable || isCompanyAvailable == null)){
    await seedsChecks.initSeedsIntoDB();
  }

  console.log("\n***************************************");
  console.log(`***\tserver port ${port}\t*******`);
  server.listen(port);
  console.info("***\tserver successfully started! **");
  console.log("***************************************");
}).catch(err=>{
  console.error(`~unable to start server ${err}~`);
});

process.on('uncaughtException', (err) => {
  console.error(`~uncaughtException ${err}~`);
});