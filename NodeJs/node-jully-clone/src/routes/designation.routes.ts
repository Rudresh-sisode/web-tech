import express from 'express';
const router = express.Router();

import * as designationController from '../controllers/designation-controller';

import authMiddleware from '../middlewares/auth-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';

router.get('/all-designation',authMiddleware,roleAuchCheck,designationController.getAllDesignations);
router.get('/get-designation-by-id/:designationId',authMiddleware,roleAuchCheck,designationController.getDesignationById);
router.post('/add-designation',authMiddleware,roleAuchCheck,designationController.addDesignation);
router.put('/update-designation/:designationId',authMiddleware,roleAuchCheck,designationController.updateDesignation);
router.delete('/delete-designation/:designationId',authMiddleware,roleAuchCheck,designationController.deleteDesignation);
export default router;