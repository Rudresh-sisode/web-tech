import express from 'express';
const router = express.Router();
import * as desktopEmployeeController from '../controllers/desktop-employee-controller';
import desktopAuthMiddleware from '../middlewares/desktop-auth-middleware';
import authMiddleware from '../middlewares/auth-middleware';
import companyAuthAttendanceMiddleware from '../middlewares/company-attendance-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';

router.post('/signin',desktopEmployeeController.desktopEmployeeSignIn);
router.post('/todays-attendance-data',desktopAuthMiddleware,desktopEmployeeController.getDesktopEmployeeTodaysAttendanceDetails);
router.post('/checkin',desktopAuthMiddleware,desktopEmployeeController.desktopEmployeeCheckin);
router.post('/checkout',desktopAuthMiddleware,desktopEmployeeController.desktopEmployeeCheckout);
router.post('/attendance-list',desktopAuthMiddleware,desktopEmployeeController.getDesktopEmployeeAttendanceList);
router.get('/get-company-configuration-desktop',desktopAuthMiddleware,desktopEmployeeController.getCompanyConfigurationDesktop);

router.get('/deviceauthrequests',authMiddleware,roleAuchCheck,desktopEmployeeController.desktopEmployeeDeviceAuthRequests);
router.put('/deviceauthrequeststatuschange',authMiddleware,roleAuchCheck,desktopEmployeeController.desktopEmployeeDeviceAuthRequestStatusChange);

export default router;