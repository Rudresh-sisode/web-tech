import jwt from "jsonwebtoken";
import moment from "moment";
import { AttendanceData } from "../abstractions/classes/interfaces/attendance-model";
import CompanyTableModel from "../abstractions/models/company-table-model";
require('dotenv').config();

const companyAuthAttendanceMiddleware = async (req:AttendanceData, res: any, next:any) => {
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
    req.compId = decodedToken.compId;
    req.compEmail = decodedToken.compEmail;
    req.expiredTime = decodedToken.tokenTime;

    if (moment().isAfter(req.expiredTime)) {
      // verifying the expiration time
      throw new Error("Your session has expired, Please Login Again!");
    }

    //check if company exists in database
    const company:any = await CompanyTableModel.findOne({
      where: {
        id: req.compId,
        company_email: req.compEmail,
        is_deleted: false,
      },
      raw: true,
    });


    if (!company) {
      throw new Error("Company not found!");
    }

    req.companyConfig = company.configuration;
 
    console.log("authorized!", req);
    return next(); // if succeeded, go ahead
  } catch (error:any) {
    console.log(`step ${step}, your auth-middleware error: ${error.message}`);
    console.log("Authorization failed!");
    res.status(401).json({
      status: "error",
      message: error.message === "jwt expired" ? "Please, login again!" : error.message,
    });
  }
};

export default companyAuthAttendanceMiddleware;