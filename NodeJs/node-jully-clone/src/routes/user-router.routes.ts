import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user-controller';
import authMiddleware from '../middlewares/auth-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';

router.post('/register-new-user',authMiddleware,roleAuchCheck,userController.createUserEmployee);
router.post('/user/login',userController.userSignIn);
router.put('/user-forget-password-request',userController.userForgetPasswordRequest);
router.put('/user-validate-password',userController.userValidatePasswordRequest);
router.put('/user-reset-password',userController.userResetPasswordRequest);
router.put('/user-update-data',authMiddleware,roleAuchCheck,userController.editUser);
router.put('/sign-in-user-reset-password',authMiddleware,roleAuchCheck,userController.signInUserResetPassword);
router.delete('/delete-user/:userId',authMiddleware,roleAuchCheck,userController.deleteUser);
router.post('/bulk-user-register',authMiddleware,roleAuchCheck,userController.bulkRegisterUserEmployee);
router.post('/contact-us',userController.contactUs);


export default router;