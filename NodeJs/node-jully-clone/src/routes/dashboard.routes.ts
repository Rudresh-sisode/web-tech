import express from 'express';
const router = express.Router();

import * as dashboardController from '../controllers/dashboard-controller';
import authMiddleware from '../middlewares/auth-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';

router.get('/get-dashboard-present-absent-count',authMiddleware,roleAuchCheck,dashboardController.getDashboardPresentAbsentCount);
router.get('/get-dashboard-present-absent-list', authMiddleware,roleAuchCheck,dashboardController.getDashboardPresentAbsentEmployeeList);
router.get('/get-dashboard-achivers', authMiddleware,roleAuchCheck,dashboardController.getMonthlyAchivers);
router.get('/get-dashboard-yearly-average', authMiddleware,roleAuchCheck,dashboardController.getDashboardYearlyAverage);
router.get('/get-dashboard-monthly-average', authMiddleware,roleAuchCheck,dashboardController.getDashboardMonthlyAverage);
router.get('/get-dashboard-daily-average', authMiddleware,roleAuchCheck,dashboardController.getDashboardDailyAverage);

export default router;