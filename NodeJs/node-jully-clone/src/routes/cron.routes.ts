import express from 'express';
const router = express.Router();

import * as cronController from '../controllers/cron-controller';

router.get('/dailyattendancereport',cronController.dailyAttendanceReport);
router.get('/cron-daily-leaves-entry',cronController.everyDayLeavesCronJobOfCompanies);
router.get('/dailymissedcompliancereport',cronController.dailyComplainceHoursMissedReport);
router.get('/attendance-status-report',cronController.attendanceStatusReportCronJob);

export default router;