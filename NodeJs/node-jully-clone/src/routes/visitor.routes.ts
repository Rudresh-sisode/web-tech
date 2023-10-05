import express from 'express';
const router = express.Router();

import * as visitorController from '../controllers/visitors-controller';
import authMiddleware from '../middlewares/auth-middleware';
import companyAuthAttendanceMiddleware from '../middlewares/company-attendance-middleware';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';

router.post('/register-visiter-entry',(req:any,res:any,next:any)=>{
    let data:any = req.body;
    let contentHeader = req.headers['content-type'];
    try{
        
        if(contentHeader == "application/json"){
            let isApproved: boolean = JSON.parse(data.preApproved as string);
            if(isApproved){
                return next();
            }
        }
        
        //check if the data has filter key or not
        data.filter = JSON.parse(data.filter);
        if(data.filter["entry"] == "check-out"){
            req.body = data;
           return next();
        }
        else if(data.filter["entry"] == "pre-approved-check-in"){
            req.body = data;
            return next();
        }
        else{
            req.body = data;
            return next();
        }
       
    }
    catch(err){
       return res.status(400).json({
            status:"error",
            message:"Invalid Json Data"
        });
    }
},companyAuthAttendanceMiddleware,visitorController.registerVisitor);
router.get('/employee-list',companyAuthAttendanceMiddleware,visitorController.getAllEmployeeList);

router.get('/visitors-list',companyAuthAttendanceMiddleware,visitorController.getAllVisitorList);
router.get('/admin-visitors-list',authMiddleware,visitorController.getAllVisitorList);

export default router;
