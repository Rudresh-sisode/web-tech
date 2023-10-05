//modules imports below
import validator from "validator";
import { Model, Op, Sequelize } from "sequelize";
import moment from 'moment';
require('dotenv').config();
import path from "path";
import pug from "pug";
import * as SMTP from "../services/smtp-mail.service";
import bcrypt from 'bcrypt';
import { Response } from "express";

import UserTableModel from "../abstractions/models/user-table-model";
import ResourceTableModel from "../abstractions/models/resource-table-model";
import EmployeeTableModel from "../abstractions/models/employee-table-model";
import {Holiday} from '../abstractions/classes/holiday-abstract-class';
import sequelize from "../utilities/database-connect";
import { EmployeeData } from "../abstractions/classes/interfaces/employee-model";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";
import DepartmentTableModel from "../abstractions/models/department-table-model";
import DesignationTableModel from "../abstractions/models/designation-table-model";
import RoleTableModel from "../abstractions/models/role-table-model";
import { EmployeeEditData } from "../abstractions/classes/interfaces/employee-edit-model";
import { generatePassword } from "../services/generate-password.service";
import EmployeeDeviceModel from "../abstractions/models/employee-device-model";
import HolidayTableModel from "../abstractions/models/holiday-calender-table-model";

type HolidayRequestData = {
    holidayDate:string;
    holidayEventName:string;
};

const holidayBulkInsert = async (req:UserRequest,res:any,next:any) =>{
    let step = 1, status = 200;

    const tscn = await sequelize.transaction();
    try {

        const holidayBulkData:HolidayRequestData[] = req.body;

        //if empty record provide by client
        if(holidayBulkData.length == 0){
            status = 400;
            throw new Error("Empty records found\n Empty record not accepted!");
        }

        //check if every object has following the format constraints, if not throw exception.
        if(!holidayBulkData.every((holiday) => {
            const keys = Object.keys(holiday);
            return keys.includes('holidayDate') && keys.includes('holidayEventName') && moment(holiday.holidayDate, 'YYYY-MM-DD', true).isValid();
            })){
            status = 400;
            throw new Error("Please provide data in correct format! (holidayDate, holidayEventName)");
        }

        //check if the records has duplicate date's entry
        let duplicateRecords: any[] = [];
        let isDuplicateFound:boolean = false;
        for (let i = 0; i < holidayBulkData.length; i++) {
            const holiday = holidayBulkData[i];
            const existingHoliday = holidayBulkData.slice(i + 1).find((h: any) => h.holidayDate === holiday.holidayDate);
            if (existingHoliday) {
                duplicateRecords.push({ ...holiday, index: i ,reason:"Duplicate records in provided data!"});
                isDuplicateFound = true;
            }
        }


        let isFirstTimeBulk : boolean = false;
        let fetchWhere = {
            company_id : req.companyId,
            is_deleted:false
        }

        const allHolidayFetchData:any = await getAllHolidayData(fetchWhere);

        if(typeof(allHolidayFetchData) == 'boolean'){
            isFirstTimeBulk = true;
        }
        else if(typeof(allHolidayFetchData) == 'string'){
            //exception occured while reading the data.
            status = 503;
            throw new Error("Server Unavailble, try again later!");
        }

        if(isFirstTimeBulk){
            //if first time inseration, insert the record
            let holidayInsertingData:any = [];
            let insertedRecord:any = [];
            for(let i = 0; i < holidayBulkData.length; i++){

                //if duplicateRecords found, skip the iteration
                if(isDuplicateFound && duplicateRecords.find((record:any) => record.index === i)){
                    continue;
                }

                insertedRecord.push({...holidayBulkData[i],index:i});

                holidayInsertingData.push({
                    holiday_date:moment(holidayBulkData[i].holidayDate).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                    holiday_event_name:holidayBulkData[i].holidayEventName,
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: req.keyId,
                    company_id:req.companyId
                })

                
            }

            //insert bulk
            await HolidayTableModel.bulkCreate(holidayInsertingData,{transaction:tscn});
            await tscn.commit();

            return res.status(status).json({
                status:"success",
                message:"Holiday calender added!",
                duplicateRecords:duplicateRecords,
                insertedRecord

            })
        }

        //keeping the duplicate records in seperate array( a records which db already have )
        let insertFailedRecord: any[] = [];
        let isInsertFailedFound:boolean = false;
        for (let i = 0; i < holidayBulkData.length; i++) {
            const holiday:any = holidayBulkData[i];
            const existingHoliday = allHolidayFetchData.find((h:any) => {
                let date = moment(holiday.holidayDate).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
                let fetchDate = moment(h.holidayDate).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
                return fetchDate == date
            });

            if (existingHoliday) {
                insertFailedRecord.push({...holiday,index:i,reason:"Duplicate records in database!"});
                isInsertFailedFound = true;
            }
        }
        let holidayInsertingData:any = [];
        let insertedRecord:any = []; 
        for(let i = 0; i < holidayBulkData.length; i++){
                
            //if duplicateRecords found, skip the iteration
            if(isDuplicateFound && duplicateRecords.find((record:any) => record.index === i)){
                continue;
            }

            //if insertFailedRecord found, skip the iteration
            if(isInsertFailedFound && insertFailedRecord.find((record:any) => record.index === i)){
                continue;
            }

            insertedRecord.push({...holidayBulkData[i],index:i});
            //insert bulk
            holidayInsertingData.push({
                holiday_date:moment(holidayBulkData[i].holidayDate).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                holiday_event_name:holidayBulkData[i].holidayEventName,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                created_by: req.keyId,
                company_id:req.companyId
            })
            
        }

        if(holidayInsertingData.length == 0){
            //if no any record found to insert
            status = 501;
            return res.status(status).json({
                status:"error",
                message:"No any record found to insert!",
                duplicateRecords,
                insertFailedRecord,
                insertedRecord
            })
        }


        await HolidayTableModel.bulkCreate(holidayInsertingData,{transaction:tscn});
        
        await tscn.commit();
        return res.status(status).json({
            status:"success",
            message:"Bulk inseration done",
            duplicateRecords,
            insertFailedRecord
        })

    }
    catch(error:any){
        await tscn.rollback();
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
};

const createHoliday = async (req: UserRequest, res: any, next: any) => {
    let status = 200;

    const tscn = await sequelize.transaction();
    try {
        const holidayData: HolidayRequestData = req.body;

        // Check if holidayData follows the format constraints, if not throw exception.
        if (
            !(
                holidayData.holidayDate &&
                holidayData.holidayEventName &&
                moment(holidayData.holidayDate, "YYYY-MM-DD", true).isValid()
            )
        ) {
            status = 400;
            throw new Error(
                "Please provide data in correct format! (holidayDate, holidayEventName)"
            );
        }

        // Check if the record has a duplicate date's entry
        const existingHoliday = await HolidayTableModel.findOne({
            where: {
                holiday_date: moment(holidayData.holidayDate)
                    .startOf("day")
                    .utcOffset("+05:30")
                    .format("YYYY-MM-DD HH:mm:ssZ"),
                company_id: req.companyId,
                is_deleted: false,
            },
        });

        if (existingHoliday) {
            status = 400;
            throw new Error("Duplicate record found in database!");
        }

        // Insert the record
        const newHoliday = await HolidayTableModel.create(
            {
                holiday_date: moment(holidayData.holidayDate)
                    .startOf("day")
                    .utcOffset("+05:30")
                    .format("YYYY-MM-DD HH:mm:ssZ"),
                holiday_event_name: holidayData.holidayEventName,
                created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                created_by: req.keyId,
                company_id: req.companyId
            },
            { transaction: tscn }
        );

        await tscn.commit();

        return res.status(status).json({
            status: "success",
            message: "Holiday created!"
        });
    } catch (error: any) {
        await tscn.rollback();
        console.log(`error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status: "error",
            message: error.message,
        });
    }
};


const getWholeHolidayData = async (req:UserRequest,res:any,next:any) =>{
    let step = 1, status = 200;

    try{

        const isExport = req.query.export as string || "false";
        const page = req.query.page as string || "1";
        let limit = req.query.limit as string || "10";
        let filterDate:string = req.query.filterDate as string;
        let dateFormat = 'YYYY';

        const offset:number = (+page - 1) * +limit;


        if(!validator.isEmpty(filterDate)){
            //check which format of date is YYYY or YYYY-MM or YYYY-MM-DD
            if(moment(filterDate,'YYYY',true).isValid()){
                filterDate = moment(filterDate,'YYYY').format('YYYY');
            }
            else if(moment(filterDate,'YYYY-MM',true).isValid()){
                filterDate = moment(filterDate,'YYYY-MM').format('YYYY-MM');
                dateFormat = 'YYYY-MM';
            }
            else if(moment(filterDate,'YYYY-MM-DD',true).isValid()){
                filterDate = moment(filterDate,'YYYY-MM-DD').format('YYYY-MM-DD');
                dateFormat = 'YYYY-MM-DD';
            }
            else{
                status = 400;
                throw new Error("Please provide date in correct format! (YYYY, YYYY-MM, YYYY-MM-DD)");
            }
        }
        else{
            filterDate = moment().format('YYYY');
        }

        let fetchWhere:any = {
            company_id : req.companyId,
            is_deleted:false
        }

        if(dateFormat == 'YYYY'){
            fetchWhere.holiday_date = {
                [Op.gte]:moment(filterDate,'YYYY').startOf('year').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                [Op.lte]:moment(filterDate,'YYYY').endOf('year').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')
            }

        }
        else if(dateFormat == 'YYYY-MM'){
            fetchWhere.holiday_date = {
                [Op.gte]:moment(filterDate,'YYYY-MM').startOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                [Op.lte]:moment(filterDate,'YYYY-MM').endOf('month').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')
            }
        }
        else if(dateFormat == 'YYYY-MM-DD'){
            fetchWhere.holiday_date = {
                [Op.gte]:moment(filterDate,'YYYY-MM-DD').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                [Op.lte]:moment(filterDate,'YYYY-MM-DD').endOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')
            }
        }

        const allHolidayFetchData:any = await getAllHolidayData(fetchWhere,offset,+limit,isExport === "true" ? true : false);

        if(typeof(allHolidayFetchData) == 'boolean'){
            status = 404;
            throw new Error("No any holiday data found!");
        }
        else if(typeof(allHolidayFetchData) == 'string'){
            //exception occured while reading the data.
            status = 503;
            throw new Error("Server Unavailble, try again later!");
        }

        return res.status(status).json({
            status:"success",
            message:"Holiday data found!",
            data:allHolidayFetchData
        })
    }
    catch(error:any){
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
}


const getAllHolidayData =  async (where:any,offset:number = 0, limit:number = 0, pagination:boolean = false) : Promise<boolean | Object | string> => {
    try{
        //get the all holiday data
        let holidayData:any = await HolidayTableModel.findAll({
            where,
            raw:true,
            limit:pagination ? limit : undefined,
            offset:pagination ? offset : undefined,
        })

        if(holidayData.length === 0){
            //if no any data found, stop the execution.
            return false;
        }

        const storedHolidayData:any = [];
        for(let i = 0; i < holidayData.length; i++){
            storedHolidayData[i] = {
                holidayId:holidayData[i].id,
                holidayDate : holidayData[i].holiday_date,
                holidayEventName:holidayData[i].holiday_event_name,
            }
        }

        return storedHolidayData;
        
    }
    catch(error:any){

        return error.message;
    }
};

export {holidayBulkInsert,createHoliday,getWholeHolidayData};
