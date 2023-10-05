
//modules imports below
import validator from "validator";
import moment from 'moment';
require('dotenv').config();
// import path from "path";

import fs from "fs";


import bcrypt from 'bcrypt';
import { Op, Sequelize } from "sequelize";
import UserTableModel from "../abstractions/models/user-table-model";
import sequelize from "../utilities/database-connect";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";
import ActionTableModel from "../abstractions/models/action-table-model";
import CompanyTableModel from "../abstractions/models/company-table-model";
import { CompanyData } from "../abstractions/classes/interfaces/company-model";
import { UserSignUpData } from "../abstractions/classes/interfaces/user-sign-up-model";
import EmployeeTableModel from "../abstractions/models/employee-table-model";
import * as SMTP from "../services/smtp-mail.service";
import path from "path";
import pug from "pug";
import RoleTableModel from "../abstractions/models/role-table-model";
import { generatePassword } from "../services/generate-password.service";
import { CompanyValidationErrors } from "../abstractions/errors/validation-errors";
import { d } from "vitest/dist/types-e3c9754d";
import AdministrationTableModel from "../abstractions/models/administration-model";
const companyDefaultConfigValues = require("../abstractions/seeds/companyDefaultConfig.json");

const companyFormRegister = async (req: any, res: any, next: any) => {
    let step = 1, status = 200;
    try{

        const companyData:any = req.body;
        if(validator.isEmpty(companyData.compName)){
            status = 400;
            throw new Error("Company name cannot be empty");
        }

        if(validator.isEmpty(companyData.employerName) || validator.isEmpty(companyData.email) || !validator.isEmail(companyData.email)){
            status = 400;
            throw new Error("Invalid data, employee name, email must be provided");
        }

        let picture:any;
        let attachment:any;
        step = 2;
        // @ts-ignore
        if (!req.isBlob) {
            picture = null;
            // status = 403;
            // throw new Error("Invalid input of picture file!")
        }
        else{
           picture = req.files.picture;
           attachment = {
                filename: picture[0].originalname,
                content: picture[0].buffer
            };
        }

        
        

        let htmlFilePath:string = path.join(__dirname,'..','emails','company-registration-contact-form-template.html');
            
        let htmlContent = pug.renderFile(htmlFilePath,{
            companyName:companyData.compName,
            address:companyData.companyAddress1,
            email:companyData.email,
            phone:companyData.officeNumber,
            superAdminName:companyData.employerName,
            message:companyData.message,
            attMessage: picture == null ? "No attachment" : "The attached image is the picture submitted by the user.",
            website:companyData.companyWebsite,
            teamName:process.env.PROJECT_SUPPORT_EMAIL
        });

        //get the all admin email
        const adminData:any = await AdministrationTableModel.findAll({where:{is_deleted:false},attributes:["email"],raw:true});

        //get all the mail except "amol.amalapure@gunadhyasoft.com"
        const adminEmails:any = adminData.filter((obj:any) => obj.email != "amol.amalapure@gunadhyasoft.com");
        let adminCc:any = [];
        if(adminEmails.length > 0){
            adminCc = adminEmails.map((obj:any) => obj.email.trim().toLowerCase());
        }
 
        if(picture == null){
            new SMTP.SmtpService().sendMail("amol.amalapure@gunadhyasoft.com",htmlContent,"Time Tango | Compay-Details",null,adminCc);
        }
        else{
            new SMTP.SmtpService().sendMail("amol.amalapure@gunadhyasoft.com",htmlContent,"Time Tango | Compay-Details",attachment,adminCc);
        }
       
        return res.status(status).json({
            status:"success",
            message:"We'll contact with you soon!",
        });

    }
    catch(error:any){
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
          status: "error",
          message: error.message
        });
    }
}

const registerCompany = async (req: UserRequest | any, res: any, next: any) => {
    let status = 200, step = 1;
    const tscn = await sequelize.transaction();
    try {

        const companyData:any = req.body;
       

        if(validator.isEmpty(companyData.employerName) || validator.isEmpty(companyData.email) || !validator.isEmail(companyData.email)){
            status = 400;
            throw new Error("Invalid data, employee name, email must be provided");
        }

        let picturesArray:any;
        step = 2;
        //@ts-ignore
        if (!req.isBlob) {
            picturesArray = null;
            // status = 403;
            // throw new Error("Invalid input of picture file!")
        }
        else{
            //@ts-ignore
            picturesArray = Array.isArray(req.files.picture) ? req.files.picture.flat() : null; 
        }

        
        // const images:any = [];
        // picturesArray.forEach((x:any) => {
        //     const base64Image:string = Buffer.from(x.buffer, 'binary').toString('base64'); 
        //     images.push(base64Image);
        // })

        // companyData.companyLogo = images[0];

        step = 3;
        //check if the user email exist in the user table
        const userEmailExist = await UserTableModel.findOne({
            where: {
                email: companyData.email,
                is_deleted: false,
                is_active:true
            }
        });

        if(userEmailExist){
            status = 400;
            throw new Error("Employee email already exist, please use another email");
        }

        step = 4;
        //check if email exist in the company table
        const company = await CompanyTableModel.findOne({
            where: {
                company_email:  companyData.email,
                is_deleted: false,
                is_active:true
            }
        });

        if(company){
            status = 400;
            throw new Error("Email already exist, please use another email");
        }

        step = 5;
        //check if email exist in the user table
        const user = await UserTableModel.findOne({
            where: {
                email:  companyData.email,
                is_deleted: false,
                is_active:true
            }
        });

        if(user){
            status = 400;
            throw new Error("Email already exist, please use another email");
        }

        step = 7;
        if(!validator.isEmpty(companyData.officeNumber)){
            //check if the office phone number exist in the company table
            const officePhone = await CompanyTableModel.findOne({
                where: {
                    office_number: companyData.officeNumber,
                    is_deleted: false,
                    is_active:true
                }
            });

            if(officePhone){
                status = 400;
                throw new Error("Company number already exist");
            }
        }
    
        step = 8;
        
        let momentDate:string =  moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
        const imageDir = path.join(__dirname, '..', 'public', 'companyImages'); // Set the directory to save the image
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true }); // Create the directory if it doesn't exist
        }

        let images: any = [];
        if (picturesArray != null) {
          for (const picture of picturesArray) {
            const pictureName = `${Date.now()}-${picture.originalname}`;
            const picturePath = path.join(imageDir, pictureName);
            // await picture.mv(picturePath);
            await fs.promises.writeFile(picturePath, picture.buffer);
            images.push(`/companyImages/${momentDate}/${pictureName}`);
          }
          companyData.companyLogo = images[0];
        }
        else{
            companyData.companyLogo = null;
        }

        let configValues = companyDefaultConfigValues;


        step = 10;
        //create company
        let comCreatedData:any = await CompanyTableModel.create({
            company_name: companyData.compName,
            company_email: companyData.email,
            company_address1: companyData.companyAddress1,
            company_website: companyData.companyWebsite,
            company_logo: companyData.companyLogo,
            office_number: companyData.officeNumber,
            configuration:configValues,
            added_by:req.adminEmail,
            is_deleted: false,
            is_active:true,
            created_by: req.keyId,
            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
        }, {transaction: tscn});

        if(CompanyValidationErrors.companyErrors.length > 0){
            status = 400;
            throw new Error(CompanyValidationErrors.companyErrors.join(", "));
        }
        
        //find the role id from the role table where role name is super admin
        const role:any = await RoleTableModel.findOne({
            where: {
                role_name: "SUPER-ADMIN",
                is_deleted: false,
            },
            raw:true,
        });

        step = 11;
        //bycrypt the password
        const randomPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(randomPassword,12);

        step = 12;
        //create user
        let userCreatedData:any = await UserTableModel.create({
            email: companyData.email,
            password:hashedPassword ,
            role_id: role.id,
            company_id: comCreatedData.id,
            created_by: req.keyId,
            is_active: true,
            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
        }, {transaction: tscn});

        step = 13;
        //create employee
        await EmployeeTableModel.create({
            first_name: companyData.employerName,
            emp_id: "1001",
            is_active: true,
            company_id: comCreatedData.id,
            created_by: companyData.email,
            user_id: userCreatedData.id,
            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
        }, {transaction: tscn});

        let htmlFilePath:string = path.join(__dirname,'..','emails','company-registration.html');
            
        let htmlContent = pug.renderFile(htmlFilePath,{
            companyName:comCreatedData.company_name,
            userEmail:companyData.email,
            userPassword:randomPassword,
            teamName:process.env.PROJECT_SUPPORT_EMAIL
        });

        new SMTP.SmtpService().sendMail( companyData.email.trim().toLowerCase(),htmlContent,"Time Tango | Compay-Registration");
        // if(!mailSend){
        //     status = 500;
        //     throw new Error("Mail send failed!");
        // }

        await tscn.commit();
        res.status(status).json({
            status:"success",
            message:"Company registered successfully!",
        });
    }
    catch (error: any) {

        await tscn.rollback();
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
          status: "error",
          message: error.message
        });
      }
}

const companiesList = async (req:any,res:any,next:any) =>{
    let status = 200, step = 1;
    try{

        const companyList:any = [];
        // let requiredFields:string[] = req.query.fields.split(",").map((field:string) => field.trim().toLowerCase());
        let searchValue:string = req.query.searchValue || "";
        let companyStatus:string = req.query.status || "";

        //take the pagination values from params
        const page = req.params.page || 1;
        const limit = req.params.limit || 10;
        const offset = (page - 1) * limit;

        if(!validator.isEmpty(companyStatus) && !['not-delete','delete','active','inactive'].includes(companyStatus.trim().toLowerCase())){
            status = 400;
            throw new Error("Invalid status value! It should be either not-delete, delete, active or inactive");
        }
        
        if(!validator.isEmpty(companyStatus) && !validator.isEmpty(searchValue)){

            switch(companyStatus.trim().toLowerCase()){
                case "not-delete":{
                    //count all not deleted
                    let companyCount = await CompanyTableModel.count({where:{is_deleted:false,
                        [Op.or]:[
                            {company_name:{[Op.iLike]:`%${searchValue}%`}},
                            {company_email:{[Op.iLike]:`%${searchValue}%`}}
                        ]}});
                    let companyListData:any = await CompanyTableModel.findAll({
                        where:{is_deleted:false,
                        [Op.or]:[
                            {company_name:{[Op.iLike]:`%${searchValue}%`}},
                            {company_email:{[Op.iLike]:`%${searchValue}%`}}
                        ]},
                        raw:true,
                        attributes:[
                            ["id","companyId"],
                            ["company_name","companyName"],
                            ["company_email","companyEmail"],
                            ["company_address1","firstAddress"],
                            ["company_phone","phoneNumber"],
                            ["company_website","companyWebsite"],
                            ["company_logo","companyLogo"],
                            ["preffix_string","prefixValue"],
                            ["company_fax","fax"],
                            ["office_number","officeNumber"],
                            'configuration',
                            ["is_deleted","deleted"]
                        ],limit:limit,offset:offset});

                    return res.status(status).json({
                        "status":status,
                        "message":"Company List",
                        "data":[{"companyList":companyListData.length == 0 ? [] : companyListData,"totalCount":companyCount}]
                    });
                    break;
                }
                case "delete":{
                    //count all deleted
                    let companyCount = await CompanyTableModel.count({where:{is_deleted:true,
                        [Op.or]:[
                            {company_name:{[Op.iLike]:`%${searchValue}%`}},
                            {company_email:{[Op.iLike]:`%${searchValue}%`}}
                        ]}});
                    let companyListData:any = await CompanyTableModel.findAll({
                        where:{is_deleted:true,
                        [Op.or]:[
                            {company_name:{[Op.iLike]:`%${searchValue}%`}},
                            {company_email:{[Op.iLike]:`%${searchValue}%`}}
                        ]},
                        raw:true,
                        attributes:[
                            ["id","companyId"],
                            ["company_name","companyName"],
                            ["company_email","companyEmail"],
                            ["company_address1","firstAddress"],
                            ["company_phone","phoneNumber"],
                            ["company_website","companyWebsite"],
                            ["company_logo","companyLogo"],
                            ["preffix_string","prefixValue"],
                            ["company_fax","fax"],
                            ["office_number","officeNumber"],
                            'configuration',
                            ["is_deleted","deleted"]
                        ],limit:limit,offset:offset});

                    return res.status(status).json({
                        "status":status,
                        "message":"Company List",
                        "data":[{"companyList":companyListData.length == 0 ? [] : companyListData,"totalCount":companyCount}]
                    });
                    break;
                }
                case "active":{
                    //count all active
                    let companyCount = await CompanyTableModel.count({where:{
                        [Op.or]:[
                            {company_name:{[Op.iLike]:`%${searchValue}%`}},
                            {company_email:{[Op.iLike]:`%${searchValue}%`}}
                        ]}});
                    let companyListData:any = await CompanyTableModel.findAll({
                        where:{
                        [Op.or]:[
                            {company_name:{[Op.iLike]:`%${searchValue}%`}},
                            {company_email:{[Op.iLike]:`%${searchValue}%`}}
                        ]},
                        raw:true,
                        attributes:[
                            ["id","companyId"],
                            ["company_name","companyName"],
                            ["company_email","companyEmail"],
                            ["company_address1","firstAddress"],
                            ["company_phone","phoneNumber"],
                            ["company_website","companyWebsite"],
                            ["company_logo","companyLogo"],
                            ["preffix_string","prefixValue"],
                            ["company_fax","fax"],
                            ["office_number","officeNumber"],
                            'configuration',
                            ["is_active","isActive"]
                        ],limit:limit,offset:offset});

                    return res.status(status).json({
                        "status":status,
                        "message":"Company List",
                        "data":[{"companyList":companyListData.length == 0 ? [] : companyListData,"totalCount":companyCount}]
                    });
                    break;
                }
                case "inactive":{
                    //count all inactive
                    let companyCount = await CompanyTableModel.count({where:{is_active:false,
                        [Op.or]:[
                            {company_name:{[Op.iLike]:`%${searchValue}%`}},
                            {company_email:{[Op.iLike]:`%${searchValue}%`}}
                        ]}});
                    let companyListData:any = await CompanyTableModel.findAll({
                        where:{is_active:false,
                        [Op.or]:[
                            {company_name:{[Op.iLike]:`%${searchValue}%`}},
                            {company_email:{[Op.iLike]:`%${searchValue}%`}}
                        ]},
                        raw:true,
                        attributes:[
                            ["id","companyId"],
                            ["company_name","companyName"],
                            ["company_email","companyEmail"],
                            ["company_address1","firstAddress"],
                            ["company_phone","phoneNumber"],
                            ["company_website","companyWebsite"],
                            ["company_logo","companyLogo"],
                            ["preffix_string","prefixValue"],
                            ["company_fax","fax"],
                            ["office_number","officeNumber"],
                            'configuration',
                            ["is_active","isActive"]
                        ],limit:limit,offset:offset});

                    return res.status(status).json({
                        "status":status,
                        "message":"Company List",
                        "data":[{"companyList":companyListData.length == 0 ? [] : companyListData,"totalCount":companyCount}]
                    });
                    break;
                }
                default:
                    return res.status(400).json({
                        "status":400,
                        "message":"Invalid status value! It should be either not-delete, delete, active or inactive",
                        "data":[]
                    });
            }

        }
        else if(!validator.isEmpty(companyStatus) && validator.isEmpty(searchValue)){
            switch(companyStatus.trim().toLowerCase()){
                case "not-delete":{
                    //count all not deleted
                    let companyCount = await CompanyTableModel.count({where:{is_deleted:false}});
                    let companyListData:any = await CompanyTableModel.findAll({
                        where:{is_deleted:false},
                        raw:true,
                        attributes:[
                            ["id","companyId"],
                            ["company_name","companyName"],
                            ["company_email","companyEmail"],
                            ["company_address1","firstAddress"],
                            ["company_phone","phoneNumber"],
                            ["company_website","companyWebsite"],
                            ["company_logo","companyLogo"],
                            ["preffix_string","prefixValue"],
                            ["company_fax","fax"],
                            ["office_number","officeNumber"],
                            'configuration',
                            ["is_deleted","deleted"]
                        ],limit:limit,offset:offset});

                    return res.status(status).json({
                        "status":status,
                        "message":"Company List",
                        "data":[{"companyList":companyListData.length == 0 ? [] : companyListData,"totalCount":companyCount}]
                    });
                    break;
                }
                case "delete":{
                    //count all deleted
                    let companyCount = await CompanyTableModel.count({where:{is_deleted:true,
                        [Op.or]:[
                            {company_name:{[Op.iLike]:`%${searchValue}%`}},
                            {company_email:{[Op.iLike]:`%${searchValue}%`}}
                        ]}});
                    let companyListData:any = await CompanyTableModel.findAll({
                        where:{is_deleted:true,
                        [Op.or]:[
                            {company_name:{[Op.iLike]:`%${searchValue}%`}},
                            {company_email:{[Op.iLike]:`%${searchValue}%`}}
                        ]},
                        raw:true,
                        attributes:[
                            ["id","companyId"],
                            ["company_name","companyName"],
                            ["company_email","companyEmail"],
                            ["company_address1","firstAddress"],
                            ["company_phone","phoneNumber"],
                            ["company_website","companyWebsite"],
                            ["company_logo","companyLogo"],
                            ["preffix_string","prefixValue"],
                            ["company_fax","fax"],
                            ["office_number","officeNumber"],
                            'configuration',
                            ["is_deleted","deleted"]
                        ],limit:limit,offset:offset});

                    return res.status(status).json({
                        "status":status,
                        "message":"Company List",
                        "data":[{"companyList":companyListData.length == 0 ? [] : companyListData,"totalCount":companyCount}]
                    });
                    break;
                }
                case "active":{
                    //count all active
                    let companyCount = await CompanyTableModel.count({where:{is_active:true}});
                    let companyListData:any = await CompanyTableModel.findAll({
                        where:{is_active:true},
                        raw:true,
                        attributes:[
                            ["id","companyId"],
                            ["company_name","companyName"],
                            ["company_email","companyEmail"],
                            ["company_address1","firstAddress"],
                            ["company_phone","phoneNumber"],
                            ["company_website","companyWebsite"],
                            ["company_logo","companyLogo"],
                            ["preffix_string","prefixValue"],
                            ["company_fax","fax"],
                            ["office_number","officeNumber"],
                            'configuration',
                            ["is_active","isActive"]
                        ],limit:limit,offset:offset});

                    return res.status(status).json({
                        "status":status,
                        "message":"Company List",
                        "data":[{"companyList":companyListData.length == 0 ? [] : companyListData,"totalCount":companyCount}]
                    });
                    break;
                }
                case "inactive":{
                    //count all inactive
                    let companyCount = await CompanyTableModel.count({where:{is_active:false}});
                    let companyListData:any = await CompanyTableModel.findAll({
                        where:{is_active:false},
                        raw:true,
                        attributes:[
                            ["id","companyId"],
                            ["company_name","companyName"],
                            ["company_email","companyEmail"],
                            ["company_address1","firstAddress"],
                            ["company_phone","phoneNumber"],
                            ["company_website","companyWebsite"],
                            ["company_logo","companyLogo"],
                            ["preffix_string","prefixValue"],
                            ["company_fax","fax"],
                            ["office_number","officeNumber"],
                            'configuration',
                            ["is_active","isActive"]
                        ],limit:limit,offset:offset});

                    return res.status(status).json({
                        "status":status,
                        "message":"Company List",
                        "data":[{"companyList":companyListData.length == 0 ? [] : companyListData,"totalCount":companyCount}]
                    });
                    break;
                }
                default:
                    return res.status(400).json({
                        "status":400,
                        "message":"Invalid status value! It should be either not-delete, delete, active or inactive",
                        "data":[]
                    });
            }
        }
        else if(validator.isEmpty(companyStatus) && !validator.isEmpty(searchValue)){
           
            let companyCount = await CompanyTableModel.count({where:{
                [Op.or]:[
                    {company_name:{[Op.iLike]:`%${searchValue}%`}},
                    {company_email:{[Op.iLike]:`%${searchValue}%`}}
                ]}});
            let companyListData:any = await CompanyTableModel.findAll({
                where:{
                [Op.or]:[
                    {company_name:{[Op.iLike]:`%${searchValue}%`}},
                    {company_email:{[Op.iLike]:`%${searchValue}%`}}
                ]},
                raw:true,
                attributes:[
                    ["id","companyId"],
                    ["company_name","companyName"],
                    ["company_email","companyEmail"],
                    ["company_address1","firstAddress"],
                    ["company_phone","phoneNumber"],
                    ["company_website","companyWebsite"],
                    ["company_logo","companyLogo"],
                    ["preffix_string","prefixValue"],
                    ["company_fax","fax"],
                    ["office_number","officeNumber"],
                    'configuration',
                    ["is_deleted","deleted"],
                    ["is_active","isActive"]
                ],limit:limit,offset:offset});

            return res.status(status).json({
                "status":status,
                "message":"Company List",
                "data":[{"companyList":companyListData.length == 0 ? [] : companyListData,"totalCount":companyCount}]
            });
           
        }
        else{
            //return all companies
            let companyCount = await CompanyTableModel.count();
            let companyListData:any = await CompanyTableModel.findAll({
                raw:true,
                attributes:[
                    ["id","companyId"],
                    ["company_name","companyName"],
                    ["company_email","companyEmail"],
                    ["company_address1","firstAddress"],
                    ["company_phone","phoneNumber"],
                    ["company_website","companyWebsite"],
                    ["company_logo","companyLogo"],
                    ["preffix_string","prefixValue"],
                    ["company_fax","fax"],
                    ["office_number","officeNumber"],
                    'configuration',
                    ["is_deleted","deleted"],
                    ["is_active","isActive"]
                ],limit:limit,offset:offset});

            return res.status(status).json({
                "status":status,
                "message":"Company List",
                "data":[{"companyList":companyListData.length == 0 ? [] : companyListData,"totalCount":companyCount}]
            });
        }
    }
    catch(error:any){
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
};

const actionAgainstCompany = async(req:any,res:any,next:any)=>{
    let status = 200, steps = 0;

    //transaction initialization
    const tscn = await sequelize.transaction();
    try{

        const companyId = req.query.companyId;
        const action = req.query.action;

        if(!validator.isUUID(companyId)){
            status = 400;
            throw new Error("Invalid companyId");
        }

        if(!validator.isIn(action,["activate","inactivate","delete","restore"])){
            status = 400;
            throw new Error("Invalid action, provide 'activate, inactivate, delete, restore' any of this.");
        }

        if(action == "activate"){
            //activate company
            const activateCompany = await CompanyTableModel.update({is_active:true,is_deleted:false},{where:{id:companyId},transaction:tscn});
            if(activateCompany[0] == 0){
                status = 400;
                throw new Error("Company not found");
            }
            await tscn.commit();
            return res.status(status).json({
                status:status,
                message:"Company activated successfully"
            });
        }
        else if(action == "inactivate"){
            //inactivate company
            const inactivateCompany = await CompanyTableModel.update({is_active:false},{where:{id:companyId},transaction:tscn});
            if(inactivateCompany[0] == 0){
                status = 400;
                throw new Error("Company not found");
            }
            await tscn.commit();
            return res.status(status).json({
                status:status,
                message:"Company deactivated successfully"
            });
        }
        else if(action == "delete"){
            //delete company
            const deleteCompany = await CompanyTableModel.update({is_deleted:true,is_active:false},{where:{id:companyId},transaction:tscn});
            if(deleteCompany[0] == 0){
                status = 400;
                throw new Error("Company not found");
            }
            await tscn.commit();
            return res.status(status).json({
                status:status,
                message:"Company deleted successfully"
            });
        }
        else if(action == "restore"){
            //restore company
            const restoreCompany = await CompanyTableModel.update({is_deleted:false},{where:{id:companyId},transaction:tscn});
            if(restoreCompany[0] == 0){
                status = 400;
                throw new Error("Company not found");
            }
            await tscn.commit();
            return res.status(status).json({
                status:status,
                message:"Company restored successfully"
            });

        }
        else{
            status = 400;
            throw new Error("Invalid action, provide 'activate, inactivate, delete, restore' any of this.");
        }

    }
    catch(error:any){
        await tscn.rollback();
        console.log(`step ${steps} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
};


export {registerCompany,companyFormRegister,companiesList,actionAgainstCompany};

