import express from 'express';
const router = express.Router();
import * as companyController from '../controllers/company-controller';

import authMiddleware from '../middlewares/auth-middleware';

router.post('/company-form-details',companyController.companyFormRegister);

router.post('/register-company',authMiddleware,authMiddleware,companyController.registerCompany);

router.get('/get-all-companies',authMiddleware,companyController.companiesList);

router.put('/action-against-company',authMiddleware,companyController.actionAgainstCompany);





export default router;