const Skill = require("../models/skill.model");
const moment = require("moment");
const validator = require('validator');

exports.addSkill = async ({skillInput},req)=>{

    let step = 1;
    try{
        if(!req.isAuth){
            throw new Error("Not Authorized!");
        }
        if(!req.hasRoleAccess){
            throw new Error("Access Denied!");
        }
        
        step = 2;
        const {skillValue,version} = skillInput;
        if(!skillValue || validator.isEmpty(skillValue.trim()) || !version || validator.isEmpty(version.trim())){
            throw new Error("Invalid Input!");
        }
        
        const skillName = skillValue.trim().split(" ").join("_").toLowerCase();
        const skillVersion = version.trim().split(" ").join("_").toLowerCase()

        step = 3;
        let isExist = await Skill.findOne({is_deleted:false,name:skillName,version:skillVersion}).lean()
        if(isExist || isExist !== null){
            throw new Error("Skill already exist!");
        }
        step = 4;
        await Skill.create({name:skillName,value:skillValue,version:skillVersion,companyId:req.loginAuthData.companyId,created_at:moment().utc().toString(),created_by: req.loginAuthData.userId});

        return {
            status:"success",
            message:"Skill Added!",
            statusCode:200
        }
    }
    catch(error){
        console.log(`step ${step} error ${error}`);
        throw error;
    }
}

exports.addMultipleSkill = async ({multiSkillInput},req)=>{
    let step = 1;
    try{
        
        // if(!req.isAuth){
        //     throw new Error("Not Authorized!");
        // }
        // if(!req.hasRoleAccess){
        //     throw new Error("Access Denied!");
        // }//desValues

    
        const {skillInputs} = multiSkillInput;
        if(skillInput.length === 0){
            throw new Error("Invalid Input!");
            
        }

        console.log();
    }
    catch(error){
        console.log(`step ${step} error ${error}`);
        throw error;
    }
}