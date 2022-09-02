const Department = require("../models/department.model");
const moment = require("moment");
const validator = require('validator');

exports.addDepartment = async ({departmentInput},req)=>{
    let step = 1;
    try{
        if(!req.isAuth){
            throw new Error("Not Authorized!");
        }
        if(!req.hasRoleAccess){
            throw new Error("Access Denied!");
        }
        
        step = 2;
        const {depValue} = departmentInput;
        if(!depValue || validator.isEmpty(depValue.trim())){
            throw new Error("Invalid Input!");
        }
        
        const depName = depValue.trim().split(" ").join("_").toLowerCase();

        step = 3;
        let isExist = await Department.findOne({is_deleted:false,name:depName}).lean()
        if(isExist || isExist !== null){
            throw new Error("Department already exist!");
        }
        step = 4;
        await Department.create({name:depName,value:depValue,companyId:req.loginAuthData.companyId,created_at:moment().utc().toString(),created_by: req.loginAuthData.userId});

        return {
            status:"success",
            message:"Department Added!",
            statusCode:200
        }
    }
    catch(error){
        console.log(`step ${step} error ${error}`);
        throw error;
    }
}

exports.addMultipleDepartment = async ({multiDepartmentInput},req)=>{
    let step = 1;
    try{
        
        if(!req.isAuth){
            throw new Error("Not Authorized!");
        }
        if(!req.hasRoleAccess){
            throw new Error("Access Denied!");
        }

        const {depValues} = multiDepartmentInput;
        step = 2;
        if(depValues.length <= 0){
            throw new Error("Invalid inputs!");
        }
        const depNames = depValues.map(x=> x.trim().split(" ").join("_").toLowerCase());
        const cmpId = req.loginAuthData.companyId;
        const multiDepartmentStorages = [];
        step = 3;
        let departmentDatas = await Department.find({is_deleted:false,companyId:cmpId}).select("name -_id").lean();
        if(departmentDatas.length === 0){
            let obj = {};
            for(let i = 0; i < depNames.length; i++){
                obj.name=depNames[i];
                obj.value=depValues[i];
                obj.companyId= req.loginAuthData.companyId;
                obj.created_at = moment().utc().toString();
                obj.created_by = req.loginAuthData.userId;
                multiDepartmentStorages.push(obj);
                obj = {}
            }
            step = 4;
            await Department.insertMany(multiDepartmentStorages);

            return {
                status:"success",
                message:"Department Added!",
                statusCode:200
            }
        }
        else{
            let dupCount = 0;

            for(let i = 0; i <departmentDatas.length; i++ ){
                for(let j =0; j< depNames.length; j++){
                    if(departmentDatas[i].name == depNames[j]){
                        depValues.splice(j,1);
                        depNames.splice(j,i);
                        dupCount++
                    }
                }
            }
            step = 5;
            if(depNames.length === 0 || depValues.length === 0){
                throw new Error("Dupblicate can't insert!");
            }
            let obj = {};
            for(let i = 0; i < depNames.length; i++){
                obj.name=depNames[i];
                obj.value=depValues[i];
                obj.companyId= req.loginAuthData.companyId;
                obj.created_at = moment().utc().toString();
                obj.created_by = req.loginAuthData.userId;
                multiDepartmentStorages.push(obj);
                obj = {}
            }
            step = 6;
            await Department.insertMany(multiDepartmentStorages);

            return {
                status:"success",
                message:"Department Added!",
                statusCode:200
            }
        }
    }
    catch(error){
        console.log(`step ${step} error ${error}`);
        throw error;
    }
}

