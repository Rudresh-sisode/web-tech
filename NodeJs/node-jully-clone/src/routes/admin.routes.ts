import express from 'express';
const router = express.Router();
import * as adminController from '../controllers/system-admin/admin-auth-controller';

import authMiddleware from '../middlewares/auth-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';


router.post('/login',adminController.adminSignIn);
router.post('/add-new-admin',adminController.addNewAdmin);
router.put('/admin-forget-password-request',adminController.adminForgetPasswordRequest);
router.put('/admin-validate-otp',adminController.adminValidatePasswordRequest);
router.put('/admin-reset-password',adminController.adminResetPasswordRequest);


export default router;
