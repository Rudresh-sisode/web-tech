import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';

//routes imports below
import userRouter from './routes/user-router.routes';
import roleRouter from './routes/role.routes';
import addentanceRouter from './routes/user-attendance.routes';
import resourceRouter from './routes/resource.routes';
import employeeRouter from './routes/employee.routes';
import actionRouter from './routes/action.routes';
import departmentRouter from './routes/department.routes';
import designationRouter from './routes/designation.routes';
import cronRouter from './routes/cron.routes';
import visitorRouter from './routes/visitor.routes';
import leavRouter from './routes/leaves.routes';
import holidayRouter from './routes/holiday.routes';

import desktopEmployeeRouter from './routes/desktop-employee.routes';
import companyRouter from './routes/company.routes';
import adminRouter from './routes/admin.routes';
import dashboardRouter from './routes/dashboard.routes';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const fileFilter = (req:any, file:any, cb:any) => {
  
  if(file.fieldname === 'picture'){
  if ((file.mimetype === 'image/png' && file.fieldname === 'picture') || (file.mimetype === 'image/jpg' && file.fieldname === 'picture') || (file.mimetype === 'image/jpeg' && file.fieldname === 'picture')) {
      req.isBlob = true;
      cb(null, true);
    }
    else {
      req.isBlob = false;
      cb(null, false);
    }
  }
  else if(file.fieldname === 'documentImage'){
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      req.isDocPictureBlob = true;
      cb(null, true);
    } else {
      req.isDocPictureBlob = false;
      cb(null, false);
    }
  }
 

}

app.use(multer({ limits : { fileSize : 1024 * 1024 * 1  }, fileFilter : fileFilter }).fields([{ name : "picture", maxCount : 1 },{ name : "documentImage" , maxCount : 1 }]));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  next();
});

/**Note: following routes arrangement is solely define and guide for the role check middleware, Do not make any change unless you understood the design and architecture.  */
app.use("/systems",userRouter);
app.use("/dashboard",userRouter);
app.use("/systems/resource",resourceRouter);
app.use("/systems/role",roleRouter);
app.use("/attendence",addentanceRouter);
app.use("/systems/attendance",addentanceRouter);
app.use("/dashboard",employeeRouter);
app.use("/systems/employee",employeeRouter);
app.use("/systems/action",actionRouter);
app.use("/systems/department",departmentRouter);
app.use("/systems/designation",designationRouter);
app.use("/dashboard/admin",dashboardRouter);
app.use("/systems/holiday",holidayRouter);

app.use("/desktop",desktopEmployeeRouter);
app.use("/cron",cronRouter);
app.use("/administrative/company",companyRouter);
app.use("/administrative",adminRouter);
app.use("/attendence/visitor",visitorRouter);
app.use("/leave",leavRouter);

export default app;