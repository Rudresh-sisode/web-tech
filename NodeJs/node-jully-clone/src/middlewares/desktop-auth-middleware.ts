import jwt from "jsonwebtoken";
import moment from "moment";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";
import CompanyTableModel from "../abstractions/models/company-table-model";
import UserTableModel from "../abstractions/models/user-table-model";
import EmployeeTableModel from "../abstractions/models/employee-table-model";
import EmployeeDeviceModel from "../abstractions/models/employee-device-model";

require('dotenv').config();

const desktopAuthMiddleware = async (req:UserRequest, res: any, next:any) => {
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
    // decoding the JWT token

    req.email = decodedToken.emailId;
    req.name = decodedToken.name;
    req.keyId = decodedToken.sKey;
    req.roleId = decodedToken.roleKey;
    req.expiredTime = decodedToken.tokenTime;
    req.companyId = decodedToken.companyId;
    req.workMode = decodedToken.workMode;
    req.tokenDeviceId = decodedToken.deviceId;
    req.deviceEntryId = decodedToken.deviceEntryId;

    if (moment().isAfter(req.expiredTime)) {
      // verifying the expiration time
      throw new Error("Login Expired, Please Login Again.");
    }
    
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
      throw new Error("Invalid credentials! It's look like you don't have priviledge to work from home");
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

    //check if device id is valid and active
    let isDeviceIdValid:any = await EmployeeDeviceModel.findOne({ where: { id: req.deviceEntryId ? req.deviceEntryId : null, is_deleted: false, is_verified: true }, raw: true });
    if (!isDeviceIdValid || isDeviceIdValid == undefined || isDeviceIdValid == null) {
       throw new Error("Invalid credentials!");
    }
    else if(!isDeviceIdValid.is_verified){
      throw new Error("Your device isn't verified yet!");
    }
    else if(isDeviceIdValid.device_id != req.tokenDeviceId || req.tokenDeviceId != req.body.deviceId){
      throw new Error("Invalid device ID. Please check that you are using the correct device ID and try again.");
    }

    console.log("You are authorized, go ahead.", req);
    next(); // if succeeded, go ahead
  } catch (error:any) {
    console.log(`step ${step}, your auth-middleware error: ${error.message}`);
    console.log("Authorization failed!");
    return res.status(401).json({
      status: "error",
      message: error.message === "jwt expired" ? "Please, login again!" : error.message,
    });
  }
};

export default desktopAuthMiddleware;