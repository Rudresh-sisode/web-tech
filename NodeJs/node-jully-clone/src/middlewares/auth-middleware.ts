import jwt from "jsonwebtoken";
import moment from "moment";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";
import UserTableModel from "../abstractions/models/user-table-model";
import AdministrationTableModel from "../abstractions/models/administration-model";
import CompanyTableModel from "../abstractions/models/company-table-model";
import EmployeeTableModel from "../abstractions/models/employee-table-model";

require('dotenv').config();

const authMiddleware = async (req:UserRequest, res: any, next:any) => {
  let step = 1;
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader || authHeader == null) {
      throw new Error("Auth Header missing!");
    }

    //@ts-ignore
    const comingToken = req.headers.authorization.split(" ")[1];
    step = 2; // verifying if token matches or not
    const decodedToken:any = jwt.verify(comingToken, process.env.JWT_TOKEN_KEY as string);
    
    //if token is not valid
    if (!decodedToken) {
      throw new Error("Invalid Token!");
    }

    //check if decodedToken object has admin key
    if (decodedToken.hasOwnProperty("admin")) {
      //if admin key is true
      req.adminEmail = decodedToken.admin;
      req.expiredTime = decodedToken.tokenTime;
      
      if (moment().isAfter(req.expiredTime)) {
        // verifying the expiration time
        throw new Error("Login Expired, Please Login Again.");
      }

      //check if admin exist in database
      const adminData:any = await AdministrationTableModel.findOne({where:{email:req.adminEmail,is_deleted:false},raw:true});
      if(!adminData || adminData == null || adminData == undefined){
        throw new Error("Invalid credentials!");
      }
      else{
        return next();
      }
    }

    else if(decodedToken.hasOwnProperty("emailId")){
        
      // decoding the JWT token
      req.email = decodedToken.emailId;
      req.name = decodedToken.name;
      req.keyId = decodedToken.sKey;
      req.roleId = decodedToken.roleKey;
      req.expiredTime = decodedToken.tokenTime;
      req.companyId = decodedToken.companyId;
      req.employeeId = decodedToken.employeeId;

      if (moment().isAfter(req.expiredTime)) {
        // verifying the expiration time
        throw new Error("Login Expired, Please Login Again.");
      }

      step = 2.5;
      //check if company is not deleted
      const isCompanyExist:any = await CompanyTableModel.findOne({ where: { id: req.companyId, is_deleted: false }, raw: true });
      if(!isCompanyExist || isCompanyExist == undefined || isCompanyExist == null){
        throw new Error("Invalid credentials!");
      }

      step = 3;
      //check if company is active
      if(!isCompanyExist.is_active){
        throw new Error("Invalid credentials!");
      }

      req.companyName = isCompanyExist.company_name;

      step = 3.5; // checking if the user exist or not
      const isUserExist:any = await UserTableModel.findOne({ where: { id: req.keyId, is_deleted: false ,company_id:req.companyId}, raw: true, attributes: ["id", "is_active","work_mode"] });
      if (!isUserExist || isUserExist == undefined || isUserExist == null) {
        throw new Error("Invalid credentials!");
      }

      step = 4; // checking if the user is active or not
      if (!isUserExist.is_active) {
        throw new Error("Invalid credentials!");
      }

      step = 4.5; // checking if the user work mode is employee
      if (isUserExist.work_mode == "employee") {
        throw new Error("Invalid credentials!");
      }

      step = 5; //checking if the employee exist or not
      const isEmployeeExist:any = await EmployeeTableModel.findOne({ where: { user_id: req.keyId, is_deleted: false ,company_id:req.companyId}, raw: true, attributes: ["id", "is_active"] });
      if (!isEmployeeExist || isEmployeeExist == undefined || isEmployeeExist == null) {
        throw new Error("Invalid credentials!");
      }

      step = 6; // checking if the employee is active or not
      if (!isEmployeeExist.is_active) {
        throw new Error("Invalid credentials!");
      }

      console.log("You are authorized, go ahead.", req);
      return next(); // if succeeded, go ahead
    }
    else{
      throw new Error("Invalid authentication!");
    }

  } catch (error:any) {
    console.log(`step ${step}, your auth-middleware error: ${error.message}`);
    console.log("Authorization failed!");
    res.status(401).json({
      status: "error",
      message: error.message === "jwt expired" ? "Please, login again!" : error.message,
    });
  }
};

export default authMiddleware;