
import CompanyTableModel from "../../models/company-table-model";
import UserTableModel from "../../models/user-table-model";
import DepartmentTableModel from "../../models/department-table-model";
import DesignationTableModel from "../../models/designation-table-model";
import RoleTableModel from "../../models/role-table-model";
import ResourceTableModel from "../../models/resource-table-model";
import ActionTableModel from "../../models/action-table-model";

import moment from "moment";
import bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { CurrentAddress, EmpergencyContact, PermanentAddress } from "../../classes/interfaces/employee-model";
import EmployeeTableModel from "../../models/employee-table-model";
import sequelize from "../../../utilities/database-connect";

//seeds imports
const companySeeds = require("../company-seeds.json");
const userSeeds = require("../user-seeds.json");
const departmentSeeds = require("../department-seeds.json");
const designationSeeds = require("../designation-seeds.json");
const roleSeeds = require("../role-seeds.json");
const resourceSeeds = require("../resource-seeds.json");
const actionSeeds = require("../action-seeds.json");
const userEmployeeSeeds = require("../user-employee-seed.json");

export const initSeedsIntoDB = async () => {
    const departmentData: any = [];

    const tscn = await sequelize.transaction();

    try{
        for(let i=0;i<departmentSeeds.length;i++){
              departmentData.push({
                department_name:departmentSeeds[i].name,
                department_value:departmentSeeds[i].value,
                created_at:moment().utc().toString(),
                is_deleted:false,
                created_by:"e-System"
              });
            }
            await DepartmentTableModel.bulkCreate(departmentData,{transaction:tscn});

            const designationData: any = [];

            for(let i=0;i<designationSeeds.length;i++){
              designationData.push({
                designation_name:designationSeeds[i].name,
                designation_value:designationSeeds[i].value,
                created_at:moment().utc().toString(),
                is_deleted:false,
                created_by:"e-System"
              });
            }
            await DesignationTableModel.bulkCreate(designationData,{transaction:tscn});

            const resourceData : any = [];

            for(let i=0;i<resourceSeeds.length;i++){
              resourceData.push({
                resource_name:resourceSeeds[i].name,
                resource_value:resourceSeeds[i].value,
                created_at:moment().utc().toString(),
                is_deleted:false,
                created_by:"e-System"
              });
            }

            await ResourceTableModel.bulkCreate(resourceData,{transaction:tscn});


            const actionData : any = [];

            for(let i=0;i<actionSeeds.length;i++){
              actionData.push({
                action_name:actionSeeds[i].name,
                action_value:actionSeeds[i].value,
                created_at:moment().utc().toString(),
                is_deleted:false,
                created_by:"e-System"
              });
            }

            await ActionTableModel.bulkCreate(actionData,{transaction:tscn});

            //ASSIGN ROLES 
            const availableActions:any = await ActionTableModel.findAll({where:{is_deleted:false},raw:true,transaction:tscn});
            const availableResources:any = await ResourceTableModel.findAll({where:{is_deleted:false},raw:true,transaction:tscn});
            for(let i=0;i<roleSeeds.length;i++){
              let priviledge:any = [];
              switch(roleSeeds[i].name){
                case 'SUPER-ADMIN':
                  console.log("super admin");
                  priviledge = [];
                  for(let j = 0; j < availableResources.length; j++){
                    for(let k = 0; k < availableActions.length; k++){
                      priviledge.push({
                        resourceId: availableResources[j].id,
                        actionId:availableActions[k].id
                      })
                    }
                  }
                  console.log("priviledge",priviledge);
                  //add into role table
                  await RoleTableModel.create({
                    role_name:roleSeeds[i].name,
                    role_value:roleSeeds[i].value,
                    privileges:priviledge,
                    created_at:moment().utc().toString(),
                    is_deleted:false,
                    created_by:"e-System"
                  },{transaction:tscn});
                
                  break;
                case 'ADMIN':
                  console.log("admin");
                  priviledge = [];
                  for(let j = 0; j < availableResources.length; j++){
                    if(availableResources[j].resource_name == "SYSTEMS")
                      continue;

                    for(let k = 0; k < availableActions.length; k++){
                      priviledge.push({
                        resourceId: availableResources[j].id,
                        actionId:availableActions[k].id
                      })
                    }
                  }
                  //add into role table
                  await RoleTableModel.create({
                    role_name:roleSeeds[i].name,
                    role_value:roleSeeds[i].value,
                    privileges:priviledge,
                    created_at:moment().utc().toString(),
                    is_deleted:false,
                    created_by:"e-System"
                  },{transaction:tscn});
                  break;
                case 'HR':
                  console.log("hr");
                  priviledge = [];
                  priviledge = [];
                  for(let j = 0; j < availableResources.length; j++){
                    if(availableResources[j].resource_name == "SYSTEMS")
                      continue;

                    for(let k = 0; k < availableActions.length; k++){
                      priviledge.push({
                        resourceId: availableResources[j].id,
                        actionId:availableActions[k].id
                      })
                    }
                  }
                  //add into role table
                  await RoleTableModel.create({
                    role_name:roleSeeds[i].name,
                    role_value:roleSeeds[i].value,
                    privileges:priviledge,
                    created_at:moment().utc().toString(),
                    is_deleted:false,
                    created_by:"e-System"
                  },{transaction:tscn});
                  break;
                case 'EMPLOYEE':
                  console.log("user");
                  priviledge = [];
                  for(let j = 0; j < availableResources.length; j++){
                    if(availableResources[j].resource_name == "SYSTEMS")
                      continue;

                    for(let k = 0; k < availableActions.length; k++){
                      if((availableResources[j].resource_name == "LEAVE" && availableActions[k].action_name == "WRITE") || (availableResources[j].resource_name == "REPORT" && availableActions[k].action_name == "WRITE"))
                        continue;

                      priviledge.push({
                        resourceId: availableResources[j].id,
                        actionId:availableActions[k].id
                      })
                    }
                  }
                  await RoleTableModel.create({
                    role_name:roleSeeds[i].name,
                    role_value:roleSeeds[i].value,
                    privileges:priviledge,
                    created_at:moment().utc().toString(),
                    is_deleted:false,
                    created_by:"e-System"
                  },{transaction:tscn});
                  break;
                case 'GUEST':
                  console.log("guest");
                  priviledge = [];
                  for(let j = 0; j < availableResources.length; j++){
                    if(availableResources[j].resource_name == "SYSTEMS" || availableResources[j].resource_name == "REPORT")
                      continue;

                    for(let k = 0; k < availableActions.length; k++){
                      if((availableResources[j].resource_name == "ATTENDENCE" && availableActions[k].action_name == "WRITE") || (availableResources[j].resource_name == "LEAVE" && availableActions[k].action_name == "WRITE"))
                        continue;

                      priviledge.push({
                        resourceId: availableResources[j].id,
                        actionId:availableActions[k].id
                      })
                    }
                  }
                  await RoleTableModel.create({
                    role_name:roleSeeds[i].name,
                    role_value:roleSeeds[i].value,
                    privileges:priviledge,
                    created_at:moment().utc().toString(),
                    is_deleted:false,
                    created_by:"e-System"
                  },{transaction:tscn});
                  break;
                default:
                  console.log("default");
              }
            }

            const companyData: any = [];  

            for(let i=0;i<companySeeds.length;i++){
              const imagePath = path.join(__dirname, companySeeds[i].logo);
              const logo = fs.readFileSync(imagePath);
              const logoBuffer = Buffer.from(logo);

              companyData.push({
                company_name:companySeeds[i].name,
                company_email:companySeeds[i].email,
                company_address1:companySeeds[i].address1,
                company_address2:companySeeds[i].address2,
                company_phone:companySeeds[i].phone,
                company_website:companySeeds[i].website,
                company_logo:logoBuffer,
                preffix_string:companySeeds[i].prefixString,
                company_fax:companySeeds[i].fax,
                office_number:companySeeds[i].office_number,
                configuration:companySeeds[i].configuration,
                created_at:moment().utc().toString(),
                is_deleted:false,
                created_by:"e-System"
              });
            }

            await CompanyTableModel.bulkCreate(companyData,{transaction:tscn});
          
            const companyId:any = await CompanyTableModel.findOne({order:[['created_at','DESC']],limit:1,raw:true,transaction:tscn});
            const roleId:any = await RoleTableModel.findOne({where:{is_deleted:false,role_name:'SUPER-ADMIN'},raw:true,attributes:['id'],transaction:tscn});
            const departmentId:any = await DepartmentTableModel.findOne({where:{is_deleted:false,department_name:'MANAGEMENT'},raw:true,attributes:['id'],transaction:tscn});
            const designationId:any = await DesignationTableModel.findOne({where:{is_deleted:false,designation_name:'MANAGER'},raw:true,attributes:['id'],transaction:tscn});

              //user seeds
            const userData: any = [];
            for(let i=0;i<userSeeds.length;i++){
              const brcPasswordResult = await bcrypt.hash(userSeeds[i].password,12);
              userData.push({
                email:userSeeds[i].email,
                username:userSeeds[i].username,
                password:brcPasswordResult,
                is_active:true,
                created_at:moment().utc().toString(),
                is_deleted:false,
                created_by:"e-System",
                company_id:companyId.id,
                role_id:roleId.id,
                department_id:departmentId.id,
                designation_id:designationId.id
              });
            }

            await UserTableModel.bulkCreate(userData,{transaction:tscn});

            //find the first user
            const userId:any = await UserTableModel.findOne({order:[['created_at','DESC']],limit:1,raw:true,attributes:['id'],transaction:tscn});

            //employee seeds
            const employeeData: any = [];
            for(let i=0;i<1;i++){
              let currentData: CurrentAddress = {
                addressLine1:userEmployeeSeeds[i].currentAddress["addressLine1"],
                addressLine2:userEmployeeSeeds[i].currentAddress["addressLine2"],
                city:userEmployeeSeeds[i].currentAddress["city"],
                state:userEmployeeSeeds[i].currentAddress["state"],
                country:userEmployeeSeeds[i].currentAddress["country"],
                pincode:userEmployeeSeeds[i].currentAddress["pincode"]
              }

              let permanentData: PermanentAddress = {
                addressLine1:userEmployeeSeeds[i].permanentAddress["addressLine1"],
                addressLine2:userEmployeeSeeds[i].permanentAddress["addressLine2"],
                city:userEmployeeSeeds[i].permanentAddress["city"],
                state:userEmployeeSeeds[i].permanentAddress["state"],
                country:userEmployeeSeeds[i].permanentAddress["country"],
                pincode:userEmployeeSeeds[i].permanentAddress["pincode"]
              }
              // throw new Error("Test: is Transaction is working or not");
          
              let emergencyContact: EmpergencyContact = {
                personName:userEmployeeSeeds[i].emergencyContact["personName"],
                personMobile:userEmployeeSeeds[i].emergencyContact["personMobile"],
                personRelation:userEmployeeSeeds[i].emergencyContact["personRelation"],
                personEmail:userEmployeeSeeds[i].emergencyContact["personEmail"],
                personAddress:userEmployeeSeeds[i].emergencyContact["personAddress"],
              }

              employeeData.push({
                emp_id:companyId.preffix_string+userEmployeeSeeds[i].employeeId,
                first_name:userEmployeeSeeds[i].firstName,
                middle_name:userEmployeeSeeds[i].middleName,
                last_name:userEmployeeSeeds[i].lastName,
                date_of_birth:userEmployeeSeeds[i].dateOfBirth,
                joining_date:userEmployeeSeeds[i].joiningDate,
                personal_email:userEmployeeSeeds[i].personalEmail,
                mobile:userEmployeeSeeds[i].mobile,
                current_address:currentData,
                permanent_address:permanentData,
                emergency_contact:emergencyContact,
                is_active:true,
                bothAddressSame:userEmployeeSeeds[i].bothAddressSame,
                created_at:moment().utc().toString(),
                created_by:"e-System",
                company_id:companyId.id,
                user_id:userId.id,
                department_id:departmentId.id,
                designation_id:designationId.id
              });

              await EmployeeTableModel.bulkCreate(employeeData,{transaction:tscn});
            }
            await tscn.commit();
    }
    catch(error:any){
        await tscn.rollback();
        console.log("Unable to insert the seed data when initiate first time.\n error in initSeedsIntoDB",error);
    }

    
}
