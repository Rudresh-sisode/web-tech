import express from 'express';
const router = express.Router();

import * as employeeController from '../controllers/employee-controller';

import authMiddleware from '../middlewares/auth-middleware';
import companyAuthAttendanceMiddleware from '../middlewares/company-attendance-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';

router.put('/update-employee',authMiddleware,roleAuchCheck,employeeController.userEditEmployeeById);
router.get('/get-employee-data', authMiddleware, roleAuchCheck, employeeController.getEmployeeDetail);
router.get('/get-employee-by-id/:empId', authMiddleware, roleAuchCheck, employeeController.getEmployeeByEmpId);
router.get('/get-all-employee-list', authMiddleware, roleAuchCheck, employeeController.allEmployeeList);
router.get('/export-get-all-employee-list', authMiddleware, roleAuchCheck, employeeController.getExportAllEmployeeList);
router.put('/delete-employee/:empId',authMiddleware,roleAuchCheck,employeeController.deleteEmployeeById);
router.put('/update-employee-admin/:empId',authMiddleware,roleAuchCheck,employeeController.adminEditEmployeeById);




export default router;