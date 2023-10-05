import express from 'express';
const router = express.Router();

import * as departmentController from '../controllers/department-controller';

import authMiddleware from '../middlewares/auth-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';

router.get('/all-department',authMiddleware,roleAuchCheck,departmentController.getAllDepartments);
router.get('/get-department-by-id/:departmentId',authMiddleware,roleAuchCheck,departmentController.getDepartmentById);
router.post('/add-department',authMiddleware,roleAuchCheck,departmentController.addDepartment);
router.put('/update-department/:departmentId',authMiddleware,roleAuchCheck,departmentController.updateDepartment);
router.delete('/delete-department/:departmentId',authMiddleware,roleAuchCheck,departmentController.deleteDepartment);
export default router;