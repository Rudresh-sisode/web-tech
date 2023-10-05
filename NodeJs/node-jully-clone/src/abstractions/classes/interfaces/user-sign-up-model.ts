import { EmployeeData } from "./employee-model";

export interface UserSignUpData {
    userName: string;
    userEmail: string;
    userPassword?: string;
    companyId?:string;
    roleId:string;
    departmentId:string;
    designationId:string;
    employeeData:EmployeeData;
    empId:string;
    isActive?: boolean;
}