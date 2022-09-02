const Technology = require("../models/technology.model");
const moment = require("moment");
const validator = require('validator');

exports.addTechnology = async ({technologyInput},req)=>{

    let step = 1;
    try{
        if(!req.isAuth){
            throw new Error("Not Authorized!");
        }
        if(!req.hasRoleAccess){
            throw new Error("Access Denied!");
        }
        
        step = 2;
        const {techValue,departId} = technologyInput;
        if(!techValue || validator.isEmpty(techValue.trim()) || !departId || validator.isEmpty(departId.trim())){
            throw new Error("Invalid Input!");
        }
        
        const techName = techValue.trim().split(" ").join("_").toLowerCase();
        const depatId = departId.trim().split(" ").join("_").toLowerCase()

        step = 3;
        let isExist = await Technology.findOne({is_deleted:false,name:techName,department_id:depatId}).lean()
        if(isExist || isExist !== null){
            throw new Error("Skill already exist!");
        }
        step = 4;
        await Technology.create({name:techName,value:techValue,department_id:depatId,companyId:req.loginAuthData.companyId,created_at:moment().utc().toString(),created_by: req.loginAuthData.userId});

        return {
            status:"success",
            message:"Technology Added!",
            statusCode:200
        }
    }
    catch(error){
        console.log(`step ${step} error ${error}`);
        throw error;
    }
}