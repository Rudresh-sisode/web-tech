import {Request } from 'express';

export default interface DesktopEmployeeRequest extends Request {
    email: string;
    name: string;
    keyId: string;
    roleId:string;
    expiredTime?: string;
    companyId:string;
    tokenDeviceId:string;
    deviceId:string;
    workMode:string;
}