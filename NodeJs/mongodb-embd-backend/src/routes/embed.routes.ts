import express from 'express';
const router = express.Router();
import * as userController from '../controller/embedding';
// import authMiddleware from '../middleware/auth-middleware';
// import roleAuchCheck from '../middleware/role-access-middleware';

router.post('/embedd-data', userController.doEmbeddingData);

export default router;
