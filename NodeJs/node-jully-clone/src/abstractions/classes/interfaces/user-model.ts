export interface UserData{
    userId?:string;
    userEmail:string;
    userName:string;
    userPassword:string;
    isActive:boolean;
    companyId:string;
    roleId:string;
    departmentId:string;
    designationId:string;
    temporaryPassword?:string;
    temporaryPasswordExpiry?:Date;
}