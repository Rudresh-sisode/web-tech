import DesktopEmployeeRequest from "./desktop-employee-request-data-model";

type GPS_LOCATION = {
    latitude:string;
    longitude:string;
    address:string;
}
export interface DesktopEmployeeAttendanceData extends DesktopEmployeeRequest{
    attendanceId?:string;
    empId?:string;
    compId?:string;
    compEmail?:string;
    deviceId:string;
    isDeviceVerified?:boolean;
    picture:Buffer;
    attendanceDate?:string;
    checkIntime?:string;
    checkOuttime?:string;
    checkInLocation?:GPS_LOCATION | string;
    checkOutLocation?:GPS_LOCATION | string;
    userId?:string;    
    pageSize?:string;
    currentPage?:string;
}
