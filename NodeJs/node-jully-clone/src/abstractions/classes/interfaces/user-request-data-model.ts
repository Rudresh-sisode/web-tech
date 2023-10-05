import {Request } from 'express';

export default interface UserRequest extends Request {
    email: string;
    adminEmail?: string;
    name: string;
    keyId: string;
    employeeId:string;
    roleId:string;
    expiredTime?: string;
    companyId:string;
    companyName:string;
    tokenDeviceId:string;
    deviceId:string;
    workMode:string;
    deviceEntryId?:string;
}