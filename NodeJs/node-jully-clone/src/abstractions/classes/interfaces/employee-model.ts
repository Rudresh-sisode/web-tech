import UserRequest from "./user-request-data-model";

export type EmpergencyContact = {
    personName: string;
    personMobile: string;
    personRelation: string;
    personEmail: string;
    personAddress: string;
};

export type CurrentAddress={
    addressLine1:string;
    addressLine2:string;
    city:string;
    state:string;
    country:string;
    pincode:string;
}

export type PermanentAddress={
    addressLine1:string;
    addressLine2:string;
    city:string;
    state:string;
    country:string;
    pincode:string;
}

export interface EmployeeData {
   
    empId?:string;
    empGeneratedId?:string;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    joiningDate: string;
    personalEmail: string;
    mobile: string;
    currentAddress: CurrentAddress;
    permanentAddress: PermanentAddress;
    emergencyContact:EmpergencyContact;
    bothAddressSame:boolean;
    isActive?:boolean;
    userId?:string;
    companyId?:string;
    departmentId?:string;
    designationId?:string;
}