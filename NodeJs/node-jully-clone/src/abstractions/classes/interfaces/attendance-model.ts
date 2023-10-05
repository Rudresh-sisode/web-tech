import UserRequest from "./user-request-data-model";
import {AdminConfiguration} from "./company-model";

type GPS_LOCATION = {
    latitude:string;
    longitude:string;
    address:string;
}
export interface AttendanceData extends UserRequest{
    attendanceId?:string;
    empId?:string;
    compId?:string;
    compEmail?:string;
    deviceId:string;
    picture:string;
    attendanceDate?:string;
    checkIntime?:string;
    checkOuttime?:string;
    checkInLocation?:GPS_LOCATION | string;
    checkOutLocation?:GPS_LOCATION | string;
    userId?:string;
    pageSize?:string;
    currentPage?:string;
    configuration: AdminConfiguration;
    companyConfig:any;

}
