
//modules imports below
import validator from "validator";
import { Op, Sequelize } from "sequelize";
import moment from 'moment';
require('dotenv').config();

import UserTableModel from "../abstractions/models/user-table-model";
import ResourceTableModel from "../abstractions/models/resource-table-model";
import sequelize from "../utilities/database-connect";
import { RoleRequestData } from "../abstractions/classes/interfaces/role-request-data-model";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";

const addResource = async (req: RoleRequestData, res: any, next: any) => {
    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try{

        const resourceName:string = req.body.resourceName;
        if(validator.isEmpty(resourceName)){
            status = 400;
            throw new Error("Input value is invalid!");
        }

        //check if user is exist or not
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
            
        //check if resource is exist or not
        const isResourceExist:any = await ResourceTableModel.findOne({where:{resource_value:resourceName.toLowerCase(),is_deleted:false},raw:true});
        if(isResourceExist || isResourceExist != null || isResourceExist != undefined){
            status = 409;
            throw new Error("Resource already exist!");
        }

        //add resource to database
         await ResourceTableModel.create({
            resource_name:resourceName.toUpperCase(),
            resource_value:resourceName.toLowerCase(),
            is_deleted:false,
            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
            created_by: req.keyId
        },{transaction:tscn});

        await tscn.commit();
        return res.status(status).json({
            status:"success",
            message:"Resource added successfully!"
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

const getSingleResourceById = async (req: UserRequest, res: any, next: any) => {

    let step = 1, status = 200;
    try{
        //get resource id from request params
        const resourceId:string = req.params.resourceId;
        if(validator.isEmpty(resourceId) || !validator.isUUID(resourceId)){
            status = 400;
            throw new Error("Input value is invalid!");
        }

        step = 2;
        //is user exist or not
        const isUserExist:any = await UserTableModel.findOne({where:{email:req.email,is_deleted:false,is_active:true},raw:true});
        if(!isUserExist || isUserExist == null || isUserExist == undefined){
            status = 404;
            throw new Error("User does not exist!");
        }

        step = 3;
        //is user active or not
        const isUserActive:any = await UserTableModel.findOne({where:{email:req.email,is_active:true},raw:true});
        if(!isUserActive || isUserActive == null || isUserActive == undefined){
            status = 404;
            throw new Error("User does not active!");
        }

        step = 4;
        //get the resource
        const resource:any = await ResourceTableModel.findOne({where:{id:resourceId,is_deleted:false},raw:true,attributes:[["id","resourceId"],["resource_name","resourceName"]]});

        if(!resource || resource == null || resource == undefined){
            status = 404;
            throw new Error("Resource does not exist!");
        }

        return res.status(status).json({
            status:"success",
            message:"Resource found successfully!",
            data:resource
        });

    }
    catch(error:any){
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
};

const getAllResources = async (req: UserRequest, res: any, next: any) => {
    
    let step = 1, status = 200;
    try{

        //is user exist or not
        const isUserExist:any = await UserTableModel.findOne({where:{email:req.email,is_deleted:false,is_active:true},raw:true});
        if(!isUserExist || isUserExist == null || isUserExist == undefined){
            status = 404;
            throw new Error("User does not exist!");
        }

        step = 2;
        //is user active or not
        const isUserActive:any = await UserTableModel.findOne({where:{email:req.email,is_active:true},raw:true});
        if(!isUserActive || isUserActive == null || isUserActive == undefined){
            status = 404;
            throw new Error("User does not active!");
        }

        step = 3;
        //get the resource
        const resource:any = await ResourceTableModel.findAll({where:{is_deleted:false},raw:true,attributes:[["id","resourceId"],["resource_name","resourceName"]]});

        if(!resource || resource == null || resource == undefined){
            status = 404;
            throw new Error("Resource does not exist!");
        }

        return res.status(status).json({
            status:"success",
            message:"Resource found!",
            data:resource
        });

    }
    catch(error:any){
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
};



const updateResourceById = async (req: UserRequest, res: any, next: any) => {
    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try {
        // Get resource id from request params
        const resourceId: string = req.params.resourceId;
        const { resourceName } = req.body;
        if (validator.isEmpty(resourceId) || !validator.isUUID(resourceId) || validator.isEmpty(resourceName)) {
            status = 400;
            throw new Error("Input value is invalid!");
        }

        step = 2;
        // Check if user exists
        const isUserExist: any = await UserTableModel.findOne({ where: { email: req.email, is_deleted: false}, raw: true });
        if (!isUserExist || isUserExist == null || isUserExist == undefined) {
            status = 404;
            throw new Error("User does not exist!");
        }

        step = 3;
        // Check if user exists and is active
        const isUserActive = await UserTableModel.findOne({ where: { email: req.email, is_active: true }, raw: true });
        if (!isUserActive || isUserActive == null || isUserActive == undefined) {
            status = 404;
            throw new Error("User does not active!");
        }

        step = 4;
        // Get the resource
        let resource: any = await ResourceTableModel.findOne({ where: { id: resourceId, is_deleted: false }, raw: true });
        if (!resource || resource == null || resource == undefined) {
            status = 404;
            throw new Error("Resource does not exist!");
        }

        step = 5;
        let updatedResource:any = await ResourceTableModel.update({resource_name:resourceName.toUpperCase(),resource_value:resourceName.toLowerCase(),updated_at:moment().format('YYYY-MM-DD HH:mm:ss'),updated_by:req.keyId},{where:{id:resourceId,is_deleted:false},transaction:tscn},);
        if(!('0' in updatedResource) || updatedResource['0'] == null || updatedResource['0'] == undefined || updatedResource['0'] == 0){
            status = 500;
            throw new Error("Resource updatation failed!");
        }

        await tscn.commit();

        return res.status(status).json({
            status: "success",
            message: "Resource updated successfully!",
            data: resource
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
};

const deleteResourceById = async (req: UserRequest, res: any, next: any) => {

    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try {
        // Get resource id from request params
        const resourceId: string = req.params.resourceId;
        if (validator.isEmpty(resourceId) || !validator.isUUID(resourceId)) {
            status = 400;
            throw new Error("Input value is invalid!");
        }

        step = 2;
        // Check if user exists
        const isUserExist: any = await UserTableModel.findOne({ where: { email: req.email, is_deleted: false}, raw: true });
        if (!isUserExist || isUserExist == null || isUserExist == undefined) {
            status = 404;
            throw new Error("User does not exist!");
        }

        step = 3;
        // Check if user exists and is active
        const isUserActive = await UserTableModel.findOne({ where: { email: req.email, is_active: true }, raw: true });
        if (!isUserActive || isUserActive == null || isUserActive == undefined) {
            status = 404;
            throw new Error("User does not active!");
        }

        step = 4;
        // Get the resource
        let resource: any = await ResourceTableModel.findOne({ where: { id: resourceId, is_deleted: false }, raw: true });
        if (!resource || resource == null || resource == undefined) {
            status = 404;
            throw new Error("Resource does not exist!");
        }

        step = 5;
        let updatedResource:any = await ResourceTableModel.update({is_deleted:true,deleted_at:moment().format('YYYY-MM-DD HH:mm:ss'),deleted_by:req.keyId},{where:{id:resourceId,is_deleted:false},transaction:tscn},);
        if(!('0' in updatedResource) || updatedResource['0'] == null || updatedResource['0'] == undefined || updatedResource['0'] == 0){
            status = 500;
            throw new Error("Resource deletion failed!");
        }

        await tscn.commit();

        return res.status(status).json({
            status: "success",
            message: "Resource deleted successfully!",
            data: resource
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

};

export {addResource,getSingleResourceById,getAllResources,updateResourceById,deleteResourceById};