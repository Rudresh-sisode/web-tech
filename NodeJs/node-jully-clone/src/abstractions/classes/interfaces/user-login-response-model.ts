import { EmployeeData } from "./employee-model";

export interface LoginResponse{
    userName:string;
    userEmail:string;
    employeeId:string;
    tokenData:string;
    employeeData:EmployeeData;
}