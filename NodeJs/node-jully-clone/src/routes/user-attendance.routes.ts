import express from 'express';
const router = express.Router();

import * as attendanceController from '../controllers/user-attendance-controller';
import authMiddleware from '../middlewares/auth-middleware';
import companyAuthAttendanceMiddleware from '../middlewares/company-attendance-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';

router.post('/user-attendance-checkIn',authMiddleware,roleAuchCheck,attendanceController.checkInUserAttendance);
router.put('/user-attendance-checkout',authMiddleware,roleAuchCheck,attendanceController.checkOutUserAttendance);
router.post('/company-attendance-device-sigin',attendanceController.companyRequestForSignInFromDevice);
router.post('/validate-company-attendance-device-sigin-otp',attendanceController.validateCompanyRequestForSignInFromDeviceWithOtp);
router.post('/company-attendance-device-checkin',companyAuthAttendanceMiddleware,attendanceController.deviceCheckInUserAttendance);
router.post('/company-attendance-device-checkout',companyAuthAttendanceMiddleware,attendanceController.deviceCheckOutUserAttendance);
router.get('/users-attendance-list',authMiddleware,roleAuchCheck,attendanceController.userAttendanceList);
router.get('/company-attendance-list/:date',companyAuthAttendanceMiddleware,attendanceController.deviceCheckInUsersAttendanceList);
router.get('/employee-attendance-list/:date',companyAuthAttendanceMiddleware,attendanceController.deviceEmployeeList);
router.get('/current-employee-attendance-list',companyAuthAttendanceMiddleware,attendanceController.currentDateDeviceEmployeeList);
router.put('/admin-side-checkinout-editable-today-yesterday',authMiddleware,roleAuchCheck,attendanceController.adminSideCheckInOutEditableOnTodayAndYesterday);
router.get('/admin-side-checkinout-reset',authMiddleware,roleAuchCheck,attendanceController.adminSideCheckInOutResetEditableOnTodayAndYesterday);
router.get('/get-attendance-by-id/:attendanceId',authMiddleware,roleAuchCheck,attendanceController.attendanceBasedOnAttendanceId);


router.put('/admin-handler-user-checkIn-attendance',authMiddleware,roleAuchCheck,attendanceController.adminHandlerCheckInUserAttendance);
router.put('/admin-handler-user-checkout-attendance',authMiddleware,roleAuchCheck,attendanceController.adminHandlerCheckOutUserAttendance);
router.get('/current-month-employee-attendance-list',authMiddleware,roleAuchCheck,attendanceController.employeesCurrentMonthList);
router.get('/current-month-login-employee-list/:employeeId',authMiddleware,roleAuchCheck,attendanceController.singleEmployeesMonthAttendanceList);
router.get('/current-employee-attendance-list/:date',authMiddleware,roleAuchCheck,attendanceController.adminSideAttendanceListBasedOnDate);
router.post('/otp-send-to-user-from-device',companyAuthAttendanceMiddleware,attendanceController.beforeCheckInCheckOutDeviceOtp);
router.post('/validate-otp-send-to-user-from-device',companyAuthAttendanceMiddleware,attendanceController.beforeCheckInCheckOutDeviceOtpValidation);
router.get('/filter-report',authMiddleware,roleAuchCheck,attendanceController.reportFilter);

router.get('/get-company-configuration-app', companyAuthAttendanceMiddleware, attendanceController.getCompanyConfigurationApp);
router.get('/get-company-configuration-web',authMiddleware,roleAuchCheck, attendanceController.getCompanyConfigurationWeb);
router.get('/admin-get-company-configuration',authMiddleware,roleAuchCheck, attendanceController.adminGetCompanyConfiguration);
router.put('/admin-update-company-configuration',authMiddleware,roleAuchCheck, attendanceController.adminUpdateCompanyConfiguration);
router.get('/absent-employee-list/:date',authMiddleware,attendanceController.absentEmployeeList);
router.post('/add-absent-employee-attendance',authMiddleware,attendanceController.addAbsentEmployeeAttendance);

router.get('/attendance-complaince-report',authMiddleware,roleAuchCheck,attendanceController.attendanceComplainceReport);

export default router;