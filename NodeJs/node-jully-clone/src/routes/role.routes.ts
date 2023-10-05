import express from 'express';
const router = express.Router();

import * as roleController from '../controllers/role-controller';

import authMiddleware from '../middlewares/auth-middleware';
import companyAuthAttendanceMiddleware from '../middlewares/company-attendance-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';


router.get('/all-roles',authMiddleware,roleAuchCheck,roleController.getAllRoles);
router.post('/add-role',authMiddleware,roleAuchCheck,roleController.addRole);
router.put('/update-role/:roleId',authMiddleware,roleAuchCheck,roleController.updateRole);
router.delete('/delete-role/:roleId',authMiddleware,roleAuchCheck,roleController.deleteRole);

export default router;