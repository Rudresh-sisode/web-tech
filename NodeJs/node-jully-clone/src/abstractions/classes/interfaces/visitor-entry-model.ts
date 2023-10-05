import UserRequest from "./user-request-data-model";

export interface VisitorAttendanceData{
    visitorId?:string;
    filter:any;
    visitorName:string;
    mobile?:string;
    address?:string;
    deviceId:string;
    picture?:string;
    date?:string;
    reasonForVisit?:string;
    preApproved?:string;
    whomToMeet?:string;
    approvedBy?:string;
    documentId:string;
    documentImage?:string;
    time?:{
        startTime:string;
        endTime:string;
    }
}
