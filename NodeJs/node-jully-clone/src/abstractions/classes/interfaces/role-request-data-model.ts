
import UserRequest from "./user-request-data-model";
export interface RoleRequestData extends UserRequest{
    roleName:string;
    roleValue?:string;
    thisRoleId?:string;
    privileges:{
        resourceId:string;
        actions:string[];
    }[];
}