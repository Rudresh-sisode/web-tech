//modules imports below
import validator from "validator";
import { Op, Sequelize } from "sequelize";
import moment from 'moment';
require('dotenv').config();

//models imports below
import ResourceTableModel from "../abstractions/models/resource-table-model";
import RoleTableModel from "../abstractions/models/role-table-model";
import ActionTableModel from "../abstractions/models/action-table-model";
import { RoleRequestData } from "../abstractions/classes/interfaces/role-request-data-model";
import sequelize from "../utilities/database-connect";
import UserTableModel from "../abstractions/models/user-table-model";
import { RoleCheckPriviledge } from "../abstractions/classes/interfaces/_role_check-priviledge-model";


const addRole = async (req: RoleRequestData, res: any, next: any) => {

    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{

        let roleData:RoleRequestData = req.body;
        if(validator.isEmpty(roleData.roleName)  || !roleData.privileges || roleData.privileges.length === 0 || !roleData.privileges.every(privilege => Array.isArray(privilege.actions) && privilege.actions.length > 0 && validator.isUUID(privilege.resourceId) && privilege.actions.every(action => validator.isUUID(action)))){
            status = 400;
            throw new Error("Input value is invalid!");
        }

        const isEmailExist:any = await UserTableModel.findOne({where:{email:req.email,is_deleted:false,is_active:true},raw:true});
        if(!isEmailExist || isEmailExist == null || isEmailExist == undefined){
            status = 404;
            throw new Error("User does not exist!");
        }

        const isUserActive:any = await UserTableModel.findOne({where:{email:req.email,is_active:true},raw:true});
        if(!isUserActive || isUserActive == null || isUserActive == undefined){
            status = 404;
            throw new Error("User does not active!");
        }

        
        let priviledgeData:{resourceId:string,actionId:string}[] = [];

        for(let i = 0; i < roleData.privileges.length; i++){
            if(validator.isEmpty(roleData.privileges[i].resourceId) || !roleData.privileges[i].actions || roleData.privileges[i].actions.length === 0){
                status = 400;
                throw new Error("Input value is invalid!");
            }

            const isResourceExist:any = await ResourceTableModel.findOne({where:{id:roleData.privileges[i].resourceId,is_deleted:false},raw:true});
            if(!isResourceExist || isResourceExist == null || isResourceExist == undefined){
                status = 404;
                throw new Error("Resource does not exist!");
            }

            if(roleData.privileges[i].actions.length == 1){
                if(validator.isEmpty(roleData.privileges[i].actions[0]) || !validator.isUUID(roleData.privileges[i].actions[0])){
                    status = 400;
                    throw new Error("Input value is invalid!");
                }
                const isActionExist:any = await ActionTableModel.findOne({where:{id:roleData.privileges[i].actions[0],is_deleted:false},raw:true});
                if(!isActionExist || isActionExist == null || isActionExist == undefined){
                    status = 404;
                    throw new Error("Action does not exist!");
                }

                priviledgeData.push({
                    resourceId:isResourceExist.id,
                    actionId:isActionExist.id
                });

            }
            else{

                for(let j = 0; j < roleData.privileges[i].actions.length; j++){

                // const isActionExist:any = await ActionTableModel.findAll({where:Sequelize.literal(`id IN (${roleData.privileges[i].actions.map(uuid => `'${uuid}'`).join(', ')}) AND is_deleted = false`),raw:true});
                  const isActionExist:any = await ActionTableModel.findOne({where:{id:roleData.privileges[i].actions[j],is_deleted:false},raw:true});
                  if(!isActionExist || isActionExist == null || isActionExist == undefined ){
                      status = 404;
                      throw new Error("Action does not exist!");
                  }

                  priviledgeData.push({
                      resourceId:isResourceExist.id,
                      actionId:isActionExist.id
                  });

                }
                
            }
        }

        const isRoleExist:any = await RoleTableModel.findOne({where:{role_name:roleData.roleName.trim().toUpperCase(),is_deleted:false},raw:true});
        if(isRoleExist || isRoleExist != null || isRoleExist != undefined){
            status = 400;
            throw new Error("Role already exist!");
        }

        //add role
        await RoleTableModel.create({
            role_name:roleData.roleName.trim().toUpperCase(),
            role_value:roleData.roleName.trim().toLowerCase(),
            privileges:priviledgeData,
            is_deleted:false,
            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
            created_by: req.keyId
        },{transaction:tscn});
        
        await tscn.commit();

        res.status(status).json({
            status:"success",
            message:"Role added successfully!"
        });

    }
    catch(error:any){
        await tscn.rollback();
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
}

const getSingleRoleById = async (req: any, res: any, next: any) => {

};

const getAllRoles = async (req: any, res: any, next: any) => {

    let step = 1, status = 200;
    try{

        const roleData:any = await RoleTableModel.findAll({where:{is_deleted:false},raw:true,attributes:[['id','roleId'],['role_name', 'roleName'],'privileges']});
        if(!roleData || roleData == null || roleData == undefined || roleData.length === 0){
            status = 404;
            throw new Error("No data found!");
        }

        //sorted the priviladge data uniquely
        for(let i =  0; i < roleData.length; i++){
            const result:any = Object.values(roleData[i]["privileges"].reduce((acc:{}, {resourceId, actionId}) => {
                if (acc[resourceId]) {
                  acc[resourceId].actions.push(actionId);
                } else {
                  acc[resourceId] = {resourceId, actions: [actionId]};
                }
                return acc;
              }, {}));

            roleData[i]["privileges"] = result;
        }

        //formatting the data in readeable and understandable way
        for(let i =0; i < roleData.length; i++){
            for(let j = 0; j < roleData[i]["privileges"].length; j++){
                const resourceData:any = await ResourceTableModel.findOne({where:{id:roleData[i]["privileges"][j]["resourceId"],is_deleted:false},raw:true,attributes:['resource_name']});
                roleData[i]["privileges"][j]["resourceName"] = resourceData.resource_name;
                for(let k = 0; k < roleData[i]["privileges"][j]["actions"].length; k++){
                    const actionData:any = await ActionTableModel.findOne({where:{id:roleData[i]["privileges"][j]["actions"][k],is_deleted:false},raw:true,attributes:['action_name']});
                    roleData[i]["privileges"][j]["actions"][k] = {actionName:actionData.action_name,actionId:roleData[i]["privileges"][j]["actions"][k]};
                }
            }
        }

        res.status(status).json({
            status:"success",
            message:"Data fetched successfully!",
            data:roleData
        });

    }
    catch(error:any){
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
    // finally{
    //     sequelize.close();
    // }
};

const updateRole = async (req: RoleRequestData, res: any, next: any) => {
  let step = 1,
    status = 200;
  const tscn = await sequelize.transaction();
  try {
    const roleId = req.params.roleId;
    const roleData: RoleRequestData = req.body;

    if (
      validator.isEmpty(roleData.roleName) ||
      !roleData.privileges ||
      roleData.privileges.length === 0 ||
      !roleData.privileges.every(
        privilege =>
          Array.isArray(privilege.actions) &&
          privilege.actions.length > 0 &&
          validator.isUUID(privilege.resourceId) &&
          privilege.actions.every(action => validator.isUUID(action))
      )
    ) {
      status = 400;
      throw new Error("Input value is invalid!");
    }

    const isRoleExist: any = await RoleTableModel.findOne({
      where: { id: roleId, is_deleted: false },
      raw: true,
    });
    if (!isRoleExist || isRoleExist == null || isRoleExist == undefined) {
      status = 404;
      throw new Error("Role does not exist!");
    }

    let priviledgeData: { resourceId: string; actionId: string }[] = [];

    for (let i = 0; i < roleData.privileges.length; i++) {
      if (
        validator.isEmpty(roleData.privileges[i].resourceId) ||
        !roleData.privileges[i].actions ||
        roleData.privileges[i].actions.length === 0
      ) {
        status = 400;
        throw new Error("Input value is invalid!");
      }

      const isResourceExist: any = await ResourceTableModel.findOne({
        where: { id: roleData.privileges[i].resourceId, is_deleted: false },
        raw: true,
      });
      if (!isResourceExist || isResourceExist == null || isResourceExist == undefined) {
        status = 404;
        throw new Error("Resource does not exist!");
      }

      if (roleData.privileges[i].actions.length == 1) {
        if (validator.isEmpty(roleData.privileges[i].actions[0]) || !validator.isUUID(roleData.privileges[i].actions[0])) {
          status = 400;
          throw new Error("Input value is invalid!");
        }
        const isActionExist: any = await ActionTableModel.findOne({
          where: { id: roleData.privileges[i].actions[0], is_deleted: false },
          raw: true,
        });
        if (!isActionExist || isActionExist == null || isActionExist == undefined) {
          status = 404;
          throw new Error("Action does not exist!");
        }

        priviledgeData.push({
          resourceId: isResourceExist.id,
          actionId: isActionExist.id,
        });
      } else {
        for (let j = 0; j < roleData.privileges[i].actions.length; j++) {
          const isActionExist: any = await ActionTableModel.findOne({
            where: { id: roleData.privileges[i].actions[j], is_deleted: false },
            raw: true,
          });
          if (!isActionExist || isActionExist == null || isActionExist == undefined) {
            status = 404;
            throw new Error("Action does not exist!");
          }

          priviledgeData.push({
            resourceId: isResourceExist.id,
            actionId: isActionExist.id,
          });
        }
      }
    }

    //update role
    await RoleTableModel.update(
      {
        role_name: roleData.roleName.trim().toUpperCase(),
        role_value: roleData.roleName.trim().toLowerCase(),
        privileges: priviledgeData,
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_by: req.keyId,
      },
      { where: { id: roleId }, transaction: tscn }
    );

    await tscn.commit();

    res.status(status).json({
      status: "success",
      message: "Role updated successfully!",
    });
  } catch (error: any) {
    await tscn.rollback();
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteRole = async (req: any, res: any, next: any) => {
  let step = 1,status = 200;
  const tscn = await sequelize.transaction();
  try {
    if (!validator.isUUID(req.params.roleId) || validator.isEmpty(req.params.roleId)) {
      status = 400;
      throw new Error("Provided value is invalid!");
    }

    const isEmailExist: any = await UserTableModel.findOne({
      where: { email: req.email, is_deleted: false, is_active: true },
      raw: true,
    });
    if (!isEmailExist || isEmailExist == null || isEmailExist == undefined) {
      status = 404;
      throw new Error("User does not exist!");
    }

    const isUserActive: any = await UserTableModel.findOne({
      where: { email: req.email, is_active: true },
      raw: true,
    });
    if (!isUserActive || isUserActive == null || isUserActive == undefined) {
      status = 404;
      throw new Error("User does not active!");
    }

    const isRoleExist: any = await RoleTableModel.findOne({
      where: { id: req.params.roleId, is_deleted: false },
      raw: true,
    });
    if (!isRoleExist || isRoleExist == null || isRoleExist == undefined) {
      status = 404;
      throw new Error("Role does not exist!");
    }

    //delete role
    await RoleTableModel.update(
      {
        is_deleted: true,
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_by: req.keyId,
      },
      { where: { id: req.params.roleId }, transaction: tscn }
    );

    await tscn.commit();

    res.status(status).json({
      status: "success",
      message: "Role deleted successfully!",
    });
  } catch (error: any) {
    await tscn.rollback();
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message,
    });
  }
};

export {addRole,getAllRoles,updateRole,deleteRole};