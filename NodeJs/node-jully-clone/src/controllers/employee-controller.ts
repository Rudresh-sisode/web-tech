//modules imports below
import validator from "validator";
import { Op, Sequelize } from "sequelize";
import moment from 'moment';
require('dotenv').config();
import path from "path";
import pug from "pug";
import * as SMTP from "../services/smtp-mail.service";
import bcrypt from 'bcrypt';

import UserTableModel from "../abstractions/models/user-table-model";
import ResourceTableModel from "../abstractions/models/resource-table-model";
import EmployeeTableModel from "../abstractions/models/employee-table-model";
import sequelize from "../utilities/database-connect";
import { EmployeeData } from "../abstractions/classes/interfaces/employee-model";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";
import DepartmentTableModel from "../abstractions/models/department-table-model";
import DesignationTableModel from "../abstractions/models/designation-table-model";
import RoleTableModel from "../abstractions/models/role-table-model";
import { EmployeeEditData } from "../abstractions/classes/interfaces/employee-edit-model";
import { generatePassword } from "../services/generate-password.service";
import EmployeeDeviceModel from "../abstractions/models/employee-device-model";
import { Response } from "express";

const userEditEmployeeById = async (req: UserRequest, res:any, next: any) => {

    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try {
        //getting employee data from request body
        let employeeData: EmployeeData = req.body;
        if ( validator.isEmpty(employeeData.firstName)  || !validator.isMobilePhone(employeeData.mobile,'en-IN')) {
            status = 400;
            throw new Error("Invalid employee data");
        }

        step = 2;
        //checking if user already exists and active
        let user: any = await UserTableModel.findOne({ where: { id: req.keyId, is_active: true, company_id: req.companyId }, raw: true });
        if (!user || user == null || user == undefined) {
            status = 404;
            throw new Error("User inactive");
        }

        step = 2;
        //checking if user already exists and active
        let userDeleted: any = await UserTableModel.findOne({ where: { id: req.keyId, is_deleted: true, company_id: req.companyId }, raw: true });
        if (userDeleted || userDeleted != null || userDeleted != undefined) {
            status = 404;
            throw new Error("User deleted");
        }

        step = 3;
        //checking if employee already exists
        let employeeExist:any = await EmployeeTableModel.findOne({ where: { user_id:req.keyId, is_deleted: false, company_id: req.companyId }, raw: true });
        if (!employeeExist && employeeExist == null && employeeExist == undefined) {
            status = 400;
            throw new Error("Employee don't exists");
        }

        step = 4;
        //checking if employee active in other company
        let isEmployeeActiveInAnother = await EmployeeTableModel.findOne({
            where: {
                [Op.and]: [
                    { is_active: true },
                    Sequelize.literal(`EXISTS (SELECT 1 FROM employee_tables WHERE employee_tables.company_id <> '${req.companyId}' AND employee_tables.personal_email = '${employeeData.personalEmail}')`)
                ],
            }, raw: true
        });

        if (isEmployeeActiveInAnother || isEmployeeActiveInAnother != null || isEmployeeActiveInAnother != undefined) {
            status = 400;
            throw new Error("Employee already active in another company");
        }

        step = 5;

        //update the employee 
        let employeeUpdateStatus: any = await EmployeeTableModel.update({
            first_name: employeeData.firstName,
            // middle_name: employeeData.middleName,
            // last_name: employeeData.lastName,
            // date_of_birth: employeeData.dateOfBirth,
            // joining_date: employeeData.joiningDate,
            // personal_email: employeeData.personalEmail,
            mobile: employeeData.mobile,
            // current_address: employeeData.currentAddress,
            // permanent_address: employeeData.permanentAddress,
            // emergency_contact: employeeData.emergencyContact,
            // both_address_same: employeeData.bothAddressSame,
        },
        { where: { user_id:req.keyId, company_id: req.companyId, is_deleted:false }, transaction: tscn });
        

        if (!('0' in employeeUpdateStatus) || employeeUpdateStatus['0'] == null || employeeUpdateStatus['0'] == undefined || employeeUpdateStatus['0'] == 0) {
            status = 500;
            throw new Error("Employee updation failed");
        }

        step = 6;
        //commit the transaction
        await tscn.commit();

        return res.status(status).json({
            status: "success",
            message: "Employee data updated successfully!"
        });

    }
    catch (error: any) {
        console.log(`step ${step}, error: ${error.message}`);
        console.log("Insert new employee details failed!");
        await tscn.rollback();
        return res.status(status === 200 ? 500 : status).json({
            status: "error",
            message: error.message
        });
    }
};


const adminEditEmployeeById = async (req: UserRequest, res: any, next: any) => {

    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try {
        //getting employee data from request body
        let {empGeneratedId,firstName,workMode,officeEmail,isActive} = req.body;
        let employeeId = req.params.empId;
        //check is workmode is wfh, office or hybrid
        // if(!['wfh','office','hybrid'].includes(workMode)){
        //     status = 400;
        //     throw new Error("Invalid work mode");
        // }
        // if ( !validator.isEmail(employeeData.officeEmail as string) || 
        // !validator.isUUID(employeeData.roleId) || 
        // !validator.isUUID(employeeId) || 
        // validator.isEmpty(employeeData.firstName) || 
        // validator.isEmpty(employeeData.empGeneratedId as string) || 
        // validator.isEmpty(employeeData.middleName) || 
        // validator.isEmpty(employeeData.mobile) || 
        // // !validator.isMobilePhone(employeeData.mobile,'en-IN') ||
        // validator.isEmpty(employeeData.personalEmail) || 
        // validator.isEmpty(employeeData.joiningDate) || 
        // validator.isEmpty(employeeData.dateOfBirth) || 
        // validator.isEmpty(employeeData.departmentId as string) || 
        // validator.isEmpty(employeeData.designationId as string) || 
        // !validator.isBoolean(employeeData.bothAddressSame.toString()) || 
        // validator.isEmpty(employeeData.currentAddress.addressLine1) || 
        // validator.isEmpty(employeeData.currentAddress.addressLine2) || 
        // validator.isEmpty(employeeData.currentAddress.city) || 
        // validator.isEmpty(employeeData.currentAddress.state) || 
        // validator.isEmpty(employeeData.currentAddress.country) || 
        // validator.isEmpty(employeeData.currentAddress.pincode) || 
        // validator.isEmpty(employeeData.permanentAddress.addressLine1) || 
        // validator.isEmpty(employeeData.permanentAddress.addressLine2) || 
        // validator.isEmpty(employeeData.permanentAddress.city) || 
        // validator.isEmpty(employeeData.permanentAddress.state) || 
        // validator.isEmpty(employeeData.permanentAddress.country) || 
        // validator.isEmpty(employeeData.permanentAddress.pincode) || 
        // validator.isEmpty(employeeData.emergencyContact.personName) || 
        // validator.isEmpty(employeeData.emergencyContact.personMobile) || 
        // !validator.isMobilePhone(employeeData.emergencyContact.personMobile,'en-IN') ||
        // validator.isEmpty(employeeData.emergencyContact.personEmail) || 
        // validator.isEmpty(employeeData.emergencyContact.personAddress) || 
        // validator.isEmpty(employeeData.emergencyContact.personRelation) ||
        // !validator.isBoolean(""+employeeData.isActive)
        //  ) {
        //     status = 400;
        //     throw new Error("Invalid employee data");
        // }

        step = 3;
        //checking if employee exists
        let employeeExist:any = await EmployeeTableModel.findOne({ where: { emp_id: empGeneratedId as string, is_deleted: false, company_id: req.companyId,id:employeeId }, raw: true });
        if (!employeeExist && employeeExist == null && employeeExist == undefined) {
            status = 400;
            throw new Error("Employee don't exists");
        }

        // step = 4;
        // //checking if employee active in other company
        // let isEmployeeActiveInAnother = await UserTableModel.findOne({
        //     where: {
        //         [Op.and]: [
        //             { is_active: true },
        //             Sequelize.literal(`EXISTS (SELECT 1 FROM user_tables WHERE user_tables.company_id <> '${req.companyId}' AND user_tables.email = '${officeEmail.trim().toLowerCase()}')`)
        //         ],
        //     }, raw: true
        // });

        // if (isEmployeeActiveInAnother || isEmployeeActiveInAnother != null || isEmployeeActiveInAnother != undefined) {
        //     status = 400;
        //     throw new Error("Employee already active in another company");
        // }

        // step  = 4.5;
         //checking if any other employee has the same generated empId in same company
        //  let isGeneratedIdHasInAnother = await EmployeeTableModel.findOne({
        //     where: {
        //         [Op.and]: [
        //             { is_active: true },
        //             Sequelize.literal(`EXISTS (SELECT 1 FROM employee_tables WHERE employee_tables.id <> '${employeeId}' AND employee_tables.emp_id = '${empGeneratedId}' AND employee_tables.company_id = '${req.companyId}')`),
        //             {is_deleted:false}
        //         ],
        //     }, raw: true
        // });

        // if (isGeneratedIdHasInAnother || isGeneratedIdHasInAnother != null || isGeneratedIdHasInAnother != undefined) {
        //     status = 400;
        //     throw new Error(`well, ${empGeneratedId} is already taken by another employee in this company`);
        // }

        
        step = 5;
        //update the employee 
        let employeeUpdateStatus: any = await EmployeeTableModel.update({
            emp_id: empGeneratedId,
            first_name: firstName,
            is_active: isActive,
            // middle_name: employeeData.middleName,
            // last_name: employeeData.lastName,
            // date_of_birth: employeeData.dateOfBirth,
            // joining_date: employeeData.joiningDate,
            // personal_email: employeeData.personalEmail,
            // mobile: employeeData.mobile,
            // current_address: employeeData.currentAddress,
            // permanent_address: employeeData.permanentAddress,
            // emergency_contact: employeeData.emergencyContact,
            // both_address_same: employeeData.bothAddressSame,
            // is_active: employeeData.isActive,
            // department_id: employeeData.departmentId,
            // designation_id: employeeData.designationId,
        },
        { where: { emp_id: empGeneratedId, company_id: req.companyId, id:employeeId }, transaction: tscn });

        if (!('0' in employeeUpdateStatus) || employeeUpdateStatus['0'] == null || employeeUpdateStatus['0'] == undefined || employeeUpdateStatus['0'] == 0) {
            status = 500;
            throw new Error("Employee updation failed");
        }

        //update the user
        // let userUpdateStatus: any = await UserTableModel.update({
        //     email: officeEmail,
        //     is_active: isActive,
        //     work_mode: !['wfh','office','hybrid'].includes(workMode.trim().toLowerCase()) ? "office" : workMode,
        //     // role_id: employeeData.roleId,
        //     // designation_id: employeeData.designationId,
        //     // department_id: employeeData.departmentId,
        // },
        // { where: { email: officeEmail, company_id: req.companyId }, transaction: tscn });

        // if (!('0' in userUpdateStatus) || userUpdateStatus['0'] == null || userUpdateStatus['0'] == undefined || userUpdateStatus['0'] == 0) {
        //     status = 500;
        //     throw new Error("Employee updation failed");

        // }

        //check user employee's work mode
        let userWorkMode:any = await UserTableModel.findOne({ where: { email: officeEmail, company_id: req.companyId,is_deleted:false },raw: true });
        if (!userWorkMode || userWorkMode == null || userWorkMode == undefined) {
            status = 404;
            throw new Error("Employee not found!");
        }

        //from hybrid or wfh to office, then remove password authentication
        if(["hybrid","wfh"].includes(userWorkMode.work_mode) && workMode.trim().toLowerCase() == "office"){
              //update the user
            let userUpdateStatus: any = await UserTableModel.update({
                email: officeEmail,
                is_active: isActive,
                work_mode: workMode,
                password: null,
                // role_id: employeeData.roleId,
                // designation_id: employeeData.designationId,
                // department_id: employeeData.departmentId,
            },
            { where: { email: officeEmail.trim().toLowerCase(), company_id: req.companyId }, transaction: tscn });

            if (!('0' in userUpdateStatus) || userUpdateStatus['0'] == null || userUpdateStatus['0'] == undefined || userUpdateStatus['0'] == 0) {
                status = 500;
                throw new Error("Employee updation failed");
            }

            //check if device is assigned or not
            const newEmployeeAuthRequestList = await EmployeeDeviceModel.findOne({
                where:{
                    user_id : employeeExist.user_id,
                },
                raw:true
            });

            if(newEmployeeAuthRequestList){
                const destroyAuthRequestData:any = await EmployeeDeviceModel.update({
                    is_deleted:true,
                    updated_at:moment().utc().toString(),
                    updated_by:req.keyId
                  },{
                    where:{
                      user_id : employeeExist.user_id,
                    },
                    transaction:tscn
                  });
          
                if(!('0' in destroyAuthRequestData) || destroyAuthRequestData['0'] == null || destroyAuthRequestData['0'] == undefined || destroyAuthRequestData['0'] == 0){
                    status = 500;
                    throw new Error("Employee device pending removed failed!");
                }
            }
            

            let htmlFilePath: string = path.join(
                __dirname,
                "..",
                "emails",
                "work-mode-change-template.html"
            );

            let htmlContent = pug.renderFile(htmlFilePath,{
                userFullName: employeeExist.first_name,
                workMode: workMode.trim().toLowerCase(),
                employeeID: empGeneratedId,
                userEmail: officeEmail.trim().toLowerCase(),
                teamName: process.env.PROJECT_SUPPORT_EMAIL,
            });

            // let mailSend = 
            new SMTP.SmtpService().sendMail(
                officeEmail.trim().toLowerCase(),
                htmlContent,
                "Time Tango | Work Mode has been Changed!"
            );
            // if (!mailSend) {
            //     throw new Error("Mail send failed!");
            // }


        }//from office to hybrid or wfh, then add password authentication
        else if(userWorkMode.work_mode == "office" && ["hybrid","wfh"].includes(workMode.trim().toLowerCase())){
            const randomPassword = generatePassword();
            const hashedPassword = await bcrypt.hash(randomPassword,12);
            let userUpdateStatus: any = await UserTableModel.update({
                email: officeEmail,
                is_active: isActive,
                work_mode: workMode,
                password: hashedPassword,
                // role_id: employeeData.roleId,
                // designation_id: employeeData.designationId,
                // department_id: employeeData.departmentId,
            },
            { where: { email: officeEmail.trim().toLowerCase(), company_id: req.companyId }, transaction: tscn });

            if (!('0' in userUpdateStatus) || userUpdateStatus['0'] == null || userUpdateStatus['0'] == undefined || userUpdateStatus['0'] == 0) {
                status = 500;
                throw new Error("Employee updation failed");
            }

            let htmlFilePath: string = path.join(
                __dirname,
                "..",
                "emails",
                "work-mode-change-with-auth-password-template.html"
            );

            let htmlContent = pug.renderFile(htmlFilePath,{
                userFullName: employeeExist.first_name,
                workMode: workMode.trim().toLowerCase(),
                employeeID: empGeneratedId,
                userEmail: officeEmail.trim().toLowerCase(),
                password: randomPassword,
                teamName: process.env.PROJECT_SUPPORT_EMAIL,
            });

            // let mailSend = 
             new SMTP.SmtpService().sendMail(
                officeEmail.trim().toLowerCase(),
                htmlContent,
                "Time Tango | Work Mode has been Changed!"
            );
            // if (!mailSend) {
            //     throw new Error("Mail send failed!");
            // }

        }
        else if((userWorkMode.work_mode == "hybrid" && workMode.trim().toLowerCase() == "wfh") || (userWorkMode.work_mode == "wfh" && workMode.trim().toLowerCase() == "hybrid")){
            let userUpdateStatus: any = await UserTableModel.update({
                email: officeEmail,
                is_active: isActive,
                work_mode: workMode,
                // role_id: employeeData.roleId,
                // designation_id: employeeData.designationId,
                // department_id: employeeData.departmentId,
            },
            { where: { email: officeEmail, company_id: req.companyId }, transaction: tscn });

            if (!('0' in userUpdateStatus) || userUpdateStatus['0'] == null || userUpdateStatus['0'] == undefined || userUpdateStatus['0'] == 0) {
                status = 500;
                throw new Error("Employee updation failed");
            }

            let htmlFilePath: string = path.join(
                __dirname,
                "..",
                "emails",
                "work-mode-change-template.html"
            );

            let htmlContent = pug.renderFile(htmlFilePath,{
                userFullName: employeeExist.first_name,
                workMode: workMode.trim().toLowerCase(),
                employeeID: empGeneratedId,
                userEmail: officeEmail.trim().toLowerCase(),
                
                teamName: process.env.PROJECT_SUPPORT_EMAIL,
            });

            // let mailSend =
             new SMTP.SmtpService().sendMail(
                officeEmail.trim().toLowerCase(),
                htmlContent,
                "Time Tango | Work Mode has been Changed!"
            );
            // if (!mailSend) {
            //     throw new Error("Mail send failed!");
            // }
        
        }
        else{
             //update the user
            let userUpdateStatus: any = await UserTableModel.update({
                email: officeEmail,
                is_active: isActive,
                work_mode: !['wfh','office','hybrid'].includes(workMode.trim().toLowerCase()) ? "office" : workMode,
                // role_id: employeeData.roleId,
                // designation_id: employeeData.designationId,
                // department_id: employeeData.departmentId,
            },
            { where: { email: officeEmail, company_id: req.companyId }, transaction: tscn });

            if (!('0' in userUpdateStatus) || userUpdateStatus['0'] == null || userUpdateStatus['0'] == undefined || userUpdateStatus['0'] == 0) {
                status = 500;
                throw new Error("Employee updation failed");
            }
        }

        step = 6;
        //commit the transaction
        await tscn.commit();

        return res.status(status).json({
            status: "success",
            message: "Employee data updated successfully!"
        });

    }
    catch (error: any) {
        console.log(`step ${step}, error: ${error.message}`);
        console.log("Insert new employee details failed!");
        await tscn.rollback();
        return res.status(status === 200 ? 500 : status).json({
            status: "error",
            message: error.message
        });
    }
};

const deleteEmployeeById = async (req: UserRequest, res: any, next: any) => {
    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try {
        //getting employee id from request params
        const employeeId = req.params.empId;
        if (validator.isEmpty(employeeId)) {
            status = 400;
            throw new Error("Invalid employee id");
        }

        /**
         * where: Sequelize.literal(`company_id = '${req.compId}' and is_active = true and is_deleted = false`)
         * 
         * [sequelize.literal(`CASE WHEN date ='${today}' OR date ='${yesterday}' THEN true ELSE false END`), 'isEditAttendance'] 
         */
        step = 3;
        //checking if employee exists
        let employeeExist:any = await EmployeeTableModel.findOne({
            where:{
                 id: employeeId, 
                 is_deleted: false, 
                 company_id: req.companyId 
            },
            include:[
                {
                    model:UserTableModel,
                    where:{
                        is_deleted: false, 
                        company_id: req.companyId 
                    },
                    include:[
                        {
                            model:RoleTableModel,
                            attributes: [["id", "roleId"], ["role_name", "roleName"]],
                        }
                    ],
                    attributes:[
                        ['work_mode','workMode'],
                        ['id','userId']
                        // [sequelize.literal(`CASE WHEN user_table.role_table.roleName = 'SUPER-ADMIN' THEN true ELSE false END`), 'isSuperAdmin'],
                    ]
                }
            ],
            raw: true });

        if (!employeeExist && employeeExist == null && employeeExist == undefined) {
            status = 400;
            throw new Error("Employee doesn't exist");
        }

        if(employeeExist["user_table.role_table.roleName"] == "SUPER-ADMIN" && employeeExist["user_table.userId"] == req.keyId){
            status = 400;
            throw new Error("Super admin can't be deleted self");
        }

        step = 4;
        //delete the employee
        let employeeDeleteStatus: any = await EmployeeTableModel.update({ is_deleted: true, updated_at: moment().utc().toISOString() }, { where: { id: employeeId, company_id: req.companyId }, transaction: tscn });

        if (!('0' in employeeDeleteStatus) || employeeDeleteStatus['0'] == null || employeeDeleteStatus['0'] == undefined || employeeDeleteStatus['0'] == 0) {
            status = 500;
            throw new Error("Employee deletion failed");
        }


        //delete the user associated with employee
        let userDeleteStatus: any = await UserTableModel.update({ is_active: false, updated_at: moment().utc().toISOString() ,is_deleted:true }, { where: { id: employeeExist["user_table.userId"], company_id: req.companyId }, transaction: tscn });
        if (!('0' in userDeleteStatus) || userDeleteStatus['0'] == null || userDeleteStatus['0'] == undefined || userDeleteStatus['0'] == 0) {
            status = 500;
            throw new Error("Employee deletion failed");
        }

        const newEmployeeAuthRequestList = await EmployeeDeviceModel.findOne({
            where:{
                user_id : employeeExist["user_table.userId"],
                // employee_id:employeeId,
            },
            raw:true
        });

        if(newEmployeeAuthRequestList){
            //delete the user device information
            const destroyAuthRequestData:any = await EmployeeDeviceModel.update({
                is_deleted:true,
                updated_at:moment().utc().toString(),
                updated_by:req.keyId
                },{
                where:{
                    user_id : employeeExist["user_table.userId"],
                    // employee_id:employeeId,
                },
                transaction: tscn 
            });

            if(!('0' in destroyAuthRequestData) || destroyAuthRequestData['0'] == null || destroyAuthRequestData['0'] == undefined || destroyAuthRequestData['0'] == 0){
                status = 500;
                throw new Error("Employee device information removed failed!");
            }
        }



        //commit the transaction
        await tscn.commit();

        return res.status(status).json({
            status: "success",
            message: "Employee data deleted successfully!"
        });
    }
    catch (error: any) {
        console.log(`step ${step}, error: ${error.message}`);
        console.log("Delete employee details failed!");
        await tscn.rollback();
        return res.status(status === 200 ? 500 : status).json({
            status: "error",
            message: error.message
        });
    }
};


const getEmployeeByEmpId = async (req: UserRequest, res: any, next: any) => {
    let step = 1, status = 200;
    try {
        //getting employee id from request params
        const employeeId = req.params.empId;
        if (validator.isEmpty(employeeId) || !validator.isUUID(employeeId)) {
            status = 400;
            throw new Error("Invalid employee id");
        }
        step = 2;
        //is user exist and active
        let user: any = await UserTableModel.findOne({ where: { id: req.keyId, is_active: true }, raw: true });
        if (!user || user == null || user == undefined) {
            status = 404;
            throw new Error("User inactive");
        }

        step = 2.5;
        let userDeleted: any = await UserTableModel.findOne({ where: { id: req.keyId, is_deleted: true, company_id: req.companyId }, raw: true });
        if (userDeleted || userDeleted != null || userDeleted != undefined) {
            status = 404;
            throw new Error("User deleted");
        }

        // step = 2.5;
        // //check if employee is not active
        // let employeeActive: any = await EmployeeTableModel.findOne({ where: { id: employeeId, is_active: true, company_id: req.companyId }, raw: true });
        // if (!employeeActive || employeeActive == null || employeeActive == undefined) {
        //     status = 404;
        //     throw new Error("Employee inactive");
        // }

        step = 2.5;
        let employeeDeleted: any = await EmployeeTableModel.findOne({ where: { id: employeeId, is_deleted: true, company_id: req.companyId }, raw: true });
        if (employeeDeleted || employeeDeleted != null || employeeDeleted != undefined) {
            status = 404;
            throw new Error("Employee deleted");
        }

        step = 3;
        //get the employee details of the user
        let employeeData: any = await EmployeeTableModel.findOne({
            where: { company_id: req.companyId, id: employeeId, is_deleted: false }, attributes: [["emp_id", "empGeneratedId"], ["first_name", "firstName"],
            // ["middle_name", "middleName"],
            // ["last_name", "lastName"],
            // ["date_of_birth", "dateOfBirth"],
            // ["joining_date", "joiningDate"],
            // ["personal_email", "personalEmail"],
            // ["mobile", "mobile"],
            // ["current_address", "currentAddress"],
            // ["permanent_address", "permanentAddress"],
            // ["emergency_contact", "emergencyContact"],
            // ["both_address_same", "bothAddressSame"],
            ["is_active", "isActive"],
            // ["company_id", "companyId"],

            ['id', 'employeeId']
            ], raw: true,
            include: [
            //     {
            //     model: DepartmentTableModel,
          
            //     attributes: [["id", "departmentId"], ["department_name", "departmentName"]],
               
            // },
            // {
            //     model: DesignationTableModel,
             
            //     attributes: [["id", "designationId"], ["designation_name", "designationName"]],
               
            // },
            {
                model:UserTableModel,
                attributes: [["id", "userId"], ["email", "userEmail"],["work_mode","workMode"]],
                include: [{
                    model:RoleTableModel,
                    attributes: [["id", "roleId"], ["role_name", "roleName"]],
                }]
            }
        ]
        });

        step = 4;
        if (!employeeData || employeeData == null || employeeData == undefined) {
            status = 404;
            throw new Error("Employee not found");
        }

        employeeData = {
            empGeneratedId: employeeData.empGeneratedId,
            userEmail: employeeData['user_table.userEmail'],
            firstName: employeeData.firstName,
            // middleName: employeeData.middleName,
            // lastName: employeeData.lastName,
            // dateOfBirth: employeeData.dateOfBirth,
            // joiningDate: employeeData.joiningDate,
            // personalEmail: employeeData.personalEmail,
            // mobile: employeeData.mobile,
            // currentAddress: employeeData.currentAddress,
            // permanentAddress: employeeData.permanentAddress,
            // emergencyContact: employeeData.emergencyContact,
            // bothAddressSame: employeeData.bothAddressSame,
            isActive: employeeData.isActive,
            companyId: employeeData.companyId,
            // department:{depId:employeeData['department_table.departmentId'],depName:employeeData['department_table.departmentName']},
            // designation:{desId:employeeData['designation_table.designationId'],desName:employeeData['designation_table.designationName']},
            user:{userId:employeeData['user_table.userId'],email:employeeData['user_table.email'],workMode:employeeData['user_table.workMode']},
            role:{roleId:employeeData['user_table.role_table.roleId'],roleName:employeeData['user_table.role_table.roleName']},
            empId: employeeData.employeeId,
            
            userId: employeeData.userId,


        }

        //send the employee details
        return res.status(status).json({
            status: "success",
            message: "Employee details fetched successfully!",
            data: employeeData
        });

    }
    catch (error: any) {
        console.log(`step ${step}, error: ${error.message}`);
        console.log("Get employee details failed!");
        return res.status(status === 200 ? 500 : status).json({
            status: "error",
            message: error.message
        });
    }
};



const getEmployeeDetail = async (req: UserRequest, res: any, next: any) => {
    let step = 1, status = 200;
    try {
        //is user exist and active
        let user: any = await UserTableModel.findOne({ where: { id: req.keyId, is_active: true }, raw: true });
        if (!user || user == null || user == undefined) {
            status = 404;
            throw new Error("User inactive");
        }

        step = 1.5;
        let userDeleted: any = await UserTableModel.findOne({ where: { id: req.keyId, is_deleted: true, company_id: req.companyId }, raw: true });
        if (userDeleted || userDeleted != null || userDeleted != undefined) {
            status = 404;
            throw new Error("User deleted");
        }

        step = 2;
        //get the employee details of the user
        let employeeData: any = await EmployeeTableModel.findOne({
            where: { company_id: req.companyId, user_id: req.keyId, is_deleted: false }, attributes: [["id", "empId"],["emp_id", "empGeneratedId"], ["first_name", "firstName"],
            ["middle_name", "middleName"],
            ["last_name", "lastName"],
            ["date_of_birth", "dateOfBirth"],
            ["joining_date", "joiningDate"],
            ["personal_email", "personalEmail"],
            ["mobile", "mobile"],
            ["current_address", "currentAddress"],
            ["permanent_address", "permanentAddress"],
            ["emergency_contact", "emergencyContact"],
            ["both_address_same", "bothAddressSame"],
            ["is_active", "isActive"],
            ["company_id", "companyId"],
            ["department_id", "departmentId"],
            ["designation_id", "designationId"],
            ["user_id", "userId"],
            ['id', 'employeeId']
            ], raw: true,
            include: [{
                model: DepartmentTableModel,
          
                attributes: [["id", "departmentId"], ["department_name", "departmentName"]],
               
            },
            {
                model: DesignationTableModel,
             
                attributes: [["id", "designationId"], ["designation_name", "designationName"]],
               
            },
            {
                model:UserTableModel,
                attributes: [["id", "userId"], ["email", "userEmail"]],
            }]
        });

        


        if (!employeeData || employeeData == null || employeeData == undefined) {
            status = 404;
            throw new Error("Employee not found");
        }

        //map the employee data
        employeeData = {
            empId: employeeData.employeeId,
            empGeneratedId: employeeData.empGeneratedId,
            userEmail: employeeData['user_table.userEmail'],
            firstName: employeeData.firstName,
            middleName: employeeData.middleName,
            lastName: employeeData.lastName,
            dateOfBirth: employeeData.dateOfBirth,
            joiningDate: employeeData.joiningDate,
            personalEmail: employeeData.personalEmail,
            mobile: employeeData.mobile,
            currentAddress: employeeData.currentAddress,
            permanentAddress: employeeData.permanentAddress,
            emergencyContact: employeeData.emergencyContact,
            bothAddressSame: employeeData.bothAddressSame,
            isActive: employeeData.isActive,
            companyId: employeeData.companyId,
            department:{depId:employeeData['department_table.departmentId'],depName:employeeData['department_table.departmentName']},
            designation:{desId:employeeData['designation_table.designationId'],desName:employeeData['designation_table.designationName']},
            userId: employeeData.userId,
        }

        //send the employee details
        return res.status(status).json({
            status: "success",
            message: "Employee details fetched successfully!",
            data: employeeData
        });

    }
    catch (error: any) {
        console.log(`step ${step}, error: ${error.message}`);
        console.log("Get employee details failed!");
        return res.status(status === 200 ? 500 : status).json({
            status: "error",
            message: error.message
        });
    }
}

const allEmployeeList = async (req: UserRequest, res: any, next: any) => {
    let step = 1, status = 200;
    try {

        const page = parseInt(req.query.page as string) || 1; // Get the page number from the query parameters, default to 1
        const limit = parseInt(req.query.limit as string) || 10; // Get the page size from the query parameters, default to 10
        const offset = (page - 1) * limit;
        //is user exist and active
        let user: any = await UserTableModel.findOne({ where: { id: req.keyId, is_active: true,company_id: req.companyId }, raw: true });
        if (!user || user == null || user == undefined) {
            status = 404;
            throw new Error("User inactive");
        }

        step = 1.5;
        let userDeleted: any = await UserTableModel.findOne({ where: { id: req.keyId, is_deleted: true, company_id: req.companyId }, raw: true });
        if (userDeleted || userDeleted != null || userDeleted != undefined) {
            status = 404;
            throw new Error("User deleted");
        }

        step = 2;
        //get all employees of the company
        let employeeData: any[] = await EmployeeTableModel.findAll({
            where: { company_id: req.companyId, is_deleted: false },
            attributes: [
                ["id", "empId"],
                ["emp_id", "empGeneratedId"],
                ["first_name", "firstName"],
                // ["middle_name", "middleName"],
                // ["last_name", "lastName"],
                // ["date_of_birth", "dateOfBirth"],
                // ["joining_date", "joiningDate"],
                // ["personal_email", "personalEmail"],
                // ["mobile", "mobile"],
                // ["current_address", "currentAddress"],
                // ["permanent_address", "permanentAddress"],
                // ["emergency_contact", "emergencyContact"],
                // ["both_address_same", "bothAddressSame"],
                ["is_active", "isActive"],
                // ["company_id", "companyId"],
           
                ["user_id", "userId"],
            ],
            include:[
                {
                    model:UserTableModel,
                    attributes:['email',['work_mode','workMode']],
                    // include:[{
                    //     model:RoleTableModel,
                    //     attributes:[["id","roleId"],["role_name","roleName"]]
                    // }]
                }
              
            ],
            raw: true,
            order: [["created_at", "DESC"]],
            limit: limit,
            offset: offset,
            subQuery: false,
        });
        
        //count all active and not deleted employees
        const employeeCount: number = await EmployeeTableModel.count({
            where: { company_id: req.companyId, is_deleted: false },
            });

        //Maping the employeeData
        employeeData = employeeData.map((employee) => {
            employee.userEmail = employee["user_table.email"];
            delete employee["user_table.email"]; 
            employee.workMode = employee["user_table.workMode"];
            delete employee["user_table.workMode"]; 
            // employee.department = {depId:employee["department_table.id"],depName:employee["department_table.department_name"]};
            // delete employee["department_table.id"];
            // delete employee["department_table.department_name"];
            // employee.designation = {desId:employee["designation_table.id"],desName:employee["designation_table.designation_name"]};
            // employee.role = {roleId:employee["user_table.role_table.id"],roleName:employee["user_table.role_table.roleName"]};
            // delete employee["user_table.role_table.roleId"];
            // delete employee["user_table.role_table.role_name"];
            // delete employee["designation_table.id"];
            // delete employee["designation_table.designation_name"];
            return employee;
        });

        //send the employee details
        return res.status(status).json({
            status: "success",
            message: "Employee list fetched successfully!",
            data: employeeData,
            totalEmloyeeCount: employeeCount,
        });
    } catch (error: any) {
        console.log(`step ${step}, error: ${error.message}`);
        console.log("Get all employees failed!");
        return res.status(status === 200 ? 500 : status).json({
            status: "error",
            message: error.message,
        });
    }
};
const getExportAllEmployeeList = async (req: UserRequest, res: any, next: any) => {
    let step = 1, status = 200;
    try {
        //is user exist and active
        let user: any = await UserTableModel.findOne({ where: { id: req.keyId, is_active: true,company_id: req.companyId }, raw: true });
        if (!user || user == null || user == undefined) {
            status = 404;
            throw new Error("User inactive");
        }

        step = 1.5;
        let userDeleted: any = await UserTableModel.findOne({ where: { id: req.keyId, is_deleted: true, company_id: req.companyId }, raw: true });
        if (userDeleted || userDeleted != null || userDeleted != undefined) {
            status = 404;
            throw new Error("User deleted");
        }

        step = 2;
        //get all employees of the company
        let employeeData: any[] = await EmployeeTableModel.findAll({
            where: { company_id: req.companyId, is_deleted: false },
            attributes: [
                ["id", "empId"],
                ["emp_id", "empGeneratedId"],
                ["first_name", "firstName"],
                // ["middle_name", "middleName"],
                // ["last_name", "lastName"],
                // ["date_of_birth", "dateOfBirth"],
                // ["joining_date", "joiningDate"],
                // ["personal_email", "personalEmail"],
                // ["mobile", "mobile"],
                // ["current_address", "currentAddress"],
                // ["permanent_address", "permanentAddress"],
                // ["emergency_contact", "emergencyContact"],
                // ["both_address_same", "bothAddressSame"],
                ["is_active", "isActive"],
                // ["company_id", "companyId"],
           
                ["user_id", "userId"],
            ],
            include:[
                {
                    model:UserTableModel,
                    attributes:['email',['work_mode','workMode']],
                    // include:[{
                    //     model:RoleTableModel,
                    //     attributes:[["id","roleId"],["role_name","roleName"]]
                    // }]
                }
              
            ],
            raw: true,
            order: [["created_at", "DESC"]],
            subQuery: false,
        });
        
        //count all active and not deleted employees
        const employeeCount: number = await EmployeeTableModel.count({
            where: { company_id: req.companyId, is_deleted: false },
            });

        //Maping the employeeData
        employeeData = employeeData.map((employee) => {
            employee.userEmail = employee["user_table.email"];
            delete employee["user_table.email"]; 
            employee.workMode = employee["user_table.workMode"];
            delete employee["user_table.workMode"]; 
            // employee.department = {depId:employee["department_table.id"],depName:employee["department_table.department_name"]};
            // delete employee["department_table.id"];
            // delete employee["department_table.department_name"];
            // employee.designation = {desId:employee["designation_table.id"],desName:employee["designation_table.designation_name"]};
            // employee.role = {roleId:employee["user_table.role_table.id"],roleName:employee["user_table.role_table.roleName"]};
            // delete employee["user_table.role_table.roleId"];
            // delete employee["user_table.role_table.role_name"];
            // delete employee["designation_table.id"];
            // delete employee["designation_table.designation_name"];
            return employee;
        });

        //send the employee details
        return res.status(status).json({
            status: "success",
            message: "Employee list fetched successfully!",
            data: employeeData,
            totalEmloyeeCount: employeeCount,
        });
    } catch (error: any) {
        console.log(`step ${step}, error: ${error.message}`);
        console.log("Get all employees failed!");
        return res.status(status === 200 ? 500 : status).json({
            status: "error",
            message: error.message,
        });
    }
};


export {adminEditEmployeeById, userEditEmployeeById, getEmployeeDetail, getEmployeeByEmpId, deleteEmployeeById, allEmployeeList,getExportAllEmployeeList };