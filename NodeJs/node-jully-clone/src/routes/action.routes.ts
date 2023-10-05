import express from 'express';
const router = express.Router();

import * as actionController from '../controllers/actions-controller';

import authMiddleware from '../middlewares/auth-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';

router.get('/all-actions',authMiddleware,roleAuchCheck,actionController.getAllActions);
router.get('/get-action-by-id/:actionId',authMiddleware,roleAuchCheck,actionController.getActionById);
router.post('/add-action',authMiddleware,roleAuchCheck,actionController.addAction);
router.put('/update-action/:actionId',authMiddleware,roleAuchCheck,actionController.updateAction);
router.delete('/delete-action/:actionId',authMiddleware,roleAuchCheck,actionController.deleteAction);
export default router;