
import authMiddleware from '../middlewares/auth-middleware';
import express from 'express';
const router = express.Router();


import * as HolidayController from "../controllers/holiday-controller";


router.post('/bulk-insert',authMiddleware,HolidayController.holidayBulkInsert);

router.post('/single-create',authMiddleware,HolidayController.createHoliday);

router.put('/update-holiday-record',authMiddleware,HolidayController.updateHolidayRecord);

router.delete('/delete-holiday-record',authMiddleware,HolidayController.deleteHolidayRecord);

router.get('/get-single-holiday',authMiddleware);

router.get('/get-all-holiday-calender',authMiddleware,HolidayController.getWholeHolidayData);



export default router;