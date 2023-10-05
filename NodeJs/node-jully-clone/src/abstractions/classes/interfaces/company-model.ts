import { Request } from "express";


interface CompanyAddress {
    address: string;
    landmark: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
  }

export interface configuration {
    is_display: {
			time: boolean,
			photo: boolean
		}
}

export interface configurationApp {
  is_display: {
    time: boolean,
    photo: boolean
  }
}
export interface CompanyData extends Request{
 compId?:string;
 compName:string;
 compEmail:string;
 temporaryPassword?:string ;
 temporaryPasswordExpiry?:string;
 companyAddress1:CompanyAddress;
 companyPrefix:string;
 companyAddress2:CompanyAddress;
 companyPhone:string;
 companyWebsite:string;
 companyLogo:Buffer;
 companyFax:string;
 officeNumber:string;
}

export interface configurationVisitor{
  document:boolean;
  checkout:boolean;
}

export interface AdminConfiguration {
  app:configurationApp;
  web:configuration;
  desktop:configuration;
  work_hours:'09:00:00';
  visitor:configurationVisitor;
}