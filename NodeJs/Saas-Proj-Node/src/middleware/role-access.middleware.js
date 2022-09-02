const Roles = require('../models/role.model');
const Admin = require("../models/admin.model");
const Company = require('../models/company.model');

module.exports = async (req,res,next)=>{

    let step = 1;
    try{
        let roleAccessHeader = req.headers.roles;
        parseRoleAccess = JSON.parse(roleAccessHeader);
        const companyId = req.loginAuthData.companyId;

        const {resource,action} = parseRoleAccess;
        let method = req.method.toLowerCase();

        step  =2;
        
        let isCompanyActive = await Company.findOne({_id:companyId,is_active:true}).lean();
        
        if(!isCompanyActive || isCompanyActive === null || isCompanyActive.length === 0){
            req.hasRoleAccess = false;
            req.isCmpActive = false;
            return next();
        }

        let userAdminRoles = await Admin.findOne({_id:req.loginAuthData.userId,is_active:true}).lean();

        console.log("your user Admin roles ",userAdminRoles);

        let isRoleAccess = await Roles.findOne({role_value:userAdminRoles.role_value,resource_value:resource,action_value:action}).lean()

        step = 3;
        if(!isRoleAccess || isRoleAccess === null || isRoleAccess.length === 0){
            req.hasRoleAccess = false;
            return next();
        }
        else{
            req.hasRoleAccess = false;
            return next();
        }
        
    }
    catch(error){
        console.log(`middleware step ${step} error ${error}`)
        req.roleAccessError = error.message;
        req.hasRoleAccess = false;
        return next();
    }
}