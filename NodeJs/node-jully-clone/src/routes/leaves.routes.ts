import express from 'express';
const router = express.Router();
import * as leaveController from '../controllers/leave-controller';

import authMiddleware from '../middlewares/auth-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';


router.get('/employe-leave-list',authMiddleware,roleAuchCheck,leaveController.getEmployeeLeavesReport);
router.get('/employe-leave-list-details',authMiddleware,roleAuchCheck,leaveController.getEmployeeLeavesDetails);

export default router;