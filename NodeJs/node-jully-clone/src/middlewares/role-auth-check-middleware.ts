
import url from 'url';

import RoleTableModel from "../abstractions/models/role-table-model";
import ResourceTableModel from "../abstractions/models/resource-table-model";
import ActionTableModel from "../abstractions/models/action-table-model";
import { Sequelize } from 'sequelize';
import UserRequest from '../abstractions/classes/interfaces/user-request-data-model';
import { RoleCheckPriviledge } from '../abstractions/classes/interfaces/_role_check-priviledge-model';

require('dotenv').config();

const roleAuchCheck = async(req:UserRequest, res: any, next:any) => {

    let step = 0, status = 200;
    try{
        console.log("your request ",req);
        step = 1;
        const roleId = req.roleId;
        if(!roleId){
            status = 400;
            throw new Error("Invalid Operation!");
        }

        step = 2;
        const roleDataresult:any = await RoleTableModel.findOne({where:{id:roleId,is_deleted:false},raw:true,attributes:['privileges']});
        if(!roleDataresult || roleDataresult == undefined || roleDataresult == null || !('privileges' in roleDataresult)){
            status = 404;
            throw new Error("This role might have been removed");
        }

        //getting method name
        const method = req.method;
        //getting pathname
        const parsedUrl:any = url.parse(req.originalUrl, true);
        const path:String = parsedUrl.pathname;
        const resourceNameFromPath = path.split("/")[1];

        step = 3;
        const resourceData:any = await ResourceTableModel.findOne({where:{resource_name:resourceNameFromPath.toUpperCase(),is_deleted:false},raw:true,attributes:['id']});
        if(!resourceData){
            status = 404;
            throw new Error("Invalid Resource!");
        }
        //checking what action is allowed for this resource
        const filteredData = roleDataresult.privileges.filter((obj:any) => obj.resourceId == resourceData.id);
        const actionIds = filteredData.map((obj :any)=> obj.actionId);
        if(actionIds.length == 0){
            status = 403;
            throw new Error("Denied priviledge!");
        }

        step = 4;//get the action name
        let actionData:any = await ActionTableModel.findAll({where:Sequelize.literal(`id IN (${actionIds.map(uuid => `'${uuid}'`).join(',')})`),raw:true,attributes:['action_name']});
        actionData = actionData.map((obj:any)=> obj.action_name);

        if(method == 'GET' && actionData.includes('READ')){
            next();
        }
        else if((method == 'POST' && actionData.includes('WRITE')) || (method == 'PUT' && actionData.includes('WRITE')) || (method == 'DELETE' && actionData.includes('WRITE'))){
            next();
        }
        else{
            status = 403;
            throw new Error("Denied priviledge!");
        }
    }
    catch(error:any){
        console.log(`step ${step}, your auth-middleware error: ${error.message}`);
        console.log("Auth Check Role Not Priviledge (Failed)!");
        res.status(status === 200 ? 500 : status).json({
            status: "error",
            message: error.message,
        });
    }
}

export default roleAuchCheck;