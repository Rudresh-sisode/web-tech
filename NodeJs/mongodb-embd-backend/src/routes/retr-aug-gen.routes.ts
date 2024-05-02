import express from 'express';
const router = express.Router();
import * as ragController from '../controller/retrivalAugumentGenerate';

router.post('/bot-response', ragController.retrivalAugumentGenerate);

export default router;
