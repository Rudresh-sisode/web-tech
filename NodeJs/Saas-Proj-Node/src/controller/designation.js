const Designation = require("../models/designation.model");
const moment = require("moment");
const validator = require('validator');

exports.addDesignation = async ({designationInput},req)=>{
    let step = 1;
    try{
        if(!req.isAuth){
            throw new Error("Not Authorized!");
        }
        if(!req.hasRoleAccess){
            throw new Error("Access Denied!");
        }
        
        step = 2;
        const {desValue} = designationInput;
        if(!desValue || validator.isEmpty(desValue.trim())){
            throw new Error("Invalid Input!");
        }
        
        const desName = desValue.trim().split(" ").join("_").toLowerCase();

        step = 3;
        let isExist = await Designation.findOne({is_deleted:false,name:desName}).lean()
        if(isExist || isExist !== null){
            throw new Error("Designation already exist!");
        }
        step = 4;
        await Designation.create({name:desName,value:desValue,companyId:req.loginAuthData.companyId,created_at:moment().utc().toString(),created_by: req.loginAuthData.userId});

        return {
            status:"success",
            message:"Designation Added!",
            statusCode:200
        }
    }
    catch(error){
        console.log(`step ${step} error ${error}`);
        throw error;
    }
}

exports.addMultipleDesignation = async({},req)=>{
    let step = 1;
    try{
        
        if(!req.isAuth){
            throw new Error("Not Authorized!");
        }
        if(!req.hasRoleAccess){
            throw new Error("Access Denied!");
        }//desValues

        const {desValues} = multiDesignationInput;
        step = 2;
        if(desValues.length <= 0){
            throw new Error("Invalid inputs!");
        }
        const desNames = desValues.map(x=> x.trim().split(" ").join("_").toLowerCase());
        const cmpId = req.loginAuthData.companyId;
        const multiDesignationStorages = [];
        step = 3;
        let DesignationDatas = await Designation.find({is_deleted:false,companyId:cmpId}).select("name -_id").lean();
        if(DesignationDatas.length === 0){
            let obj = {};
            for(let i = 0; i < desNames.length; i++){
                obj.name=desNames[i];
                obj.value=desValues[i];
                obj.companyId= req.loginAuthData.companyId;
                obj.created_at = moment().utc().toString();
                obj.created_by = req.loginAuthData.userId;
                multiDesignationStorages.push(obj);
                obj = {}
            }
            step = 4;
            await Designation.insertMany(multiDesignationStorages);

            return {
                status:"success",
                message:"Designation Added!",
                statusCode:200
            }
        }
        else{
            let dupCount = 0;

            for(let i = 0; i <DesignationDatas.length; i++ ){
                for(let j =0; j< desNames.length; j++){
                    if(DesignationDatas[i].name == desNames[j]){
                        desValues.splice(j,1);
                        desNames.splice(j,i);
                        dupCount++
                    }
                }
            }
            step = 5;
            if(desNames.length === 0 || desValues.length === 0){
                throw new Error("Dupblicate can't insert!");
            }
            let obj = {};
            for(let i = 0; i < desNames.length; i++){
                obj.name=desNames[i];
                obj.value=desValues[i];
                obj.companyId= req.loginAuthData.companyId;
                obj.created_at = moment().utc().toString();
                obj.created_by = req.loginAuthData.userId;
                multiDesignationStorages.push(obj);
                obj = {}
            }
            step = 6;
            await Designation.insertMany(multiDesignationStorages);

            return {
                status:"success",
                message:"Designation Added!",
                statusCode:200
            }
        }
    }
    catch(error){
        console.log(`step ${step} error ${error}`);
        throw error;
    }
}