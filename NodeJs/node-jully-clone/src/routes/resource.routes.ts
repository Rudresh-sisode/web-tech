import express from 'express';
const router = express.Router();

import * as resourceController from '../controllers/resource-controller';

import authMiddleware from '../middlewares/auth-middleware';
import companyAuthAttendanceMiddleware from '../middlewares/company-attendance-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';

router.post('/resource',authMiddleware,roleAuchCheck,resourceController.addResource);
router.get('/resource/:resourceId',authMiddleware,roleAuchCheck,resourceController.getSingleResourceById);
router.get('/all-resource',authMiddleware,roleAuchCheck,resourceController.getAllResources);


export default router;