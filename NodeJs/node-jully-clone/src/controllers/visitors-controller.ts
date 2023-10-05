
//modules imports below
import validator from "validator";
import bcrypt from 'bcrypt';
import { Op, Sequelize, where } from "sequelize";
import jwt from "jsonwebtoken";
import moment from 'moment';
import tz from 'moment-timezone';

require('dotenv').config();
import path from "path";
import fs from "fs";
import pug from "pug";

//local imports below
import * as Services from "../services/common.service";
import UserTableModel from "../abstractions/models/user-table-model";
import VisitorAttendanceTableModel from "../abstractions/models/visitor-table-model";
import CompanyTableModel from "../abstractions/models/company-table-model";
import * as SMTP from "../services/smtp-mail.service";
import { CompanyData, configuration } from "../abstractions/classes/interfaces/company-model";
import EmployeeTableModel from "../abstractions/models/employee-table-model";
import { EmployeeData } from "../abstractions/classes/interfaces/employee-model";
import sequelize from "../utilities/database-connect";
import sharp from "sharp";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";
import { VisitorAttendanceData } from "../abstractions/classes/interfaces/visitor-entry-model";
import { AttendanceData } from "../abstractions/classes/interfaces/attendance-model";
import { VisitorValidationErrors } from "../abstractions/errors/validation-errors";

const registerVisitor = async (req: AttendanceData, res: any, next: any) => {
    let step = 1, status = 200;
    const tscn = await sequelize.transaction();
    try {
        //getting data from request body
        const attendanceData: VisitorAttendanceData | any = req.body;
        console.log(typeof (attendanceData));
        let contentHeader = req.headers['content-type'];
        //pre-approved visitor entry
        if (contentHeader == "application/json") {
            let isApproved: boolean = JSON.parse(attendanceData.preApproved as string | 'true');
            if (isApproved) {
                if (!validator.isUUID(attendanceData.whomToMeet as string)) {
                    status = 400;
                    throw new Error("Please provide a valid input for whom to meet!");
                }
                if (!validator.isUUID(attendanceData.approvedBy as string)) {
                    status = 400;
                    throw new Error("Please provide a valid input for approved by!");
                }
                //find if whom to meet is exist
                let employeeData: any = await UserTableModel.findOne({ where: { id: attendanceData.whomToMeet, is_deleted: false, company_id: req.compId }, raw: true });
                if (!employeeData) {
                    status = 404;
                    throw new Error("Employee doesn't available!");
                }

                // let configTime = req.companyConfig["visitors"].time;
                let configTime = await CompanyTableModel.findOne({where:{id:req.compId,is_deleted:false},attributes:["configuration"],raw:true});
                
                if(configTime){
                    if(typeof(attendanceData.time) == 'object'){
                        if(configTime["configuration"].visitors['time'] != false){
                            //check the date format is "YYYY-MM-DD" with moment
                            const dateFormat = 'YYYY-MM-DD';
                            if(!validator.isDate(attendanceData.date as string, { format: dateFormat }) || validator.isEmpty(attendanceData.date as string)){
                                status = 400;
                                throw new Error("Invalid date, date format should be YYYY-MM-DD");
                            }

                            //if the attendance date is past date, don't allow
                            if(moment(attendanceData.date as string).isBefore(moment().startOf('day'))){
                                status = 400;
                                throw new Error("Date should be today or future date!");
                            }

                            if(validator.isEmpty(attendanceData.time["startTime"] as string) || !moment(attendanceData.time["startTime"] as string,"HH:mm:ss").isValid()){
                                status = 400;
                                throw new Error("Invalid start-time format should be HH:mm:ss");
                            }
                            
                            if(validator.isEmpty(attendanceData.time["endTime"] as string) || !moment(attendanceData.time["endTime"] as string,"HH:mm:ss").isValid()){
                                status = 400;
                                throw new Error("Invalid end-time format should be HH:mm:ss");
                            }
                            if(validator.isEmpty(attendanceData.time["startTime"] as string) || !moment(attendanceData.time["startTime"] as string,"HH:mm:ss").isValid()){
                                status = 400;
                                throw new Error("Invalid start-time format should be HH:mm:ss");
                            }
                            
                            if(validator.isEmpty(attendanceData.time["endTime"] as string) || !moment(attendanceData.time["endTime"] as string,"HH:mm:ss").isValid()){
                                status = 400;
                                throw new Error("Invalid end-time format should be HH:mm:ss");
                            }

                            //if checkInTime is greater than out time then throw error
                            if(moment(attendanceData.time["startTime"] as string,"HH:mm:ss A").isAfter(moment(attendanceData.time["endTime"] as string,"HH:mm:ss A"))){
                                status = 400;
                                throw new Error("start-time is greater than end-time!");
                            } 
                        }
                        
                    }
                   
                }

                //provided global state
                global.appState = {
                    companyId: req.compId
                };

                let visitTime: any = {
                    start_time: attendanceData.time?.startTime,
                    end_time: attendanceData.time?.endTime,
                }
                if(!("date" in attendanceData)){
                    attendanceData.date = '';
                }
                if(validator.isEmpty(attendanceData.date as string)){
                    attendanceData.date = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
                }

                let visitDate = moment(attendanceData.date as string, 'YYYY-MM-DD').startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
                
                //create visitor entry
                await VisitorAttendanceTableModel.create({
                    name: attendanceData.visitorName,
                    mobile: attendanceData.mobile,
                    address: attendanceData.address,
                    device_id: attendanceData.deviceId,
                    date: configTime ? visitDate : moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                    reason_for_visit: attendanceData.reasonForVisit,
                    pre_approved_visit: attendanceData.preApproved,
                    pre_approved_by: attendanceData.approvedBy,
                    time: configTime ? visitTime : null,
                    user_id: attendanceData.whomToMeet,
                    company_id: req.compId,
                    is_deleted: false,
                    created_at: moment().utc().toISOString(),
                    created_by: req.compId,
                });

                if (VisitorValidationErrors.visitorErrors.length > 0) {
                    status = 400;
                    throw new Error(VisitorValidationErrors.visitorErrors.join(", "));
                }

                await tscn.commit();
                return res.status(status).json({
                    status:"success",
                    message:"Visitor's pre-approved record added",
                });
            }
        }
        if (attendanceData.filter["entry"] == "pre-approved-check-in") {

            // if (!('documentId' in attendanceData)) {
            // attendanceData.documentId = "";
            // }
            // @ts-ignore
            if (!req.isBlob) {
                status = 403;
                throw new Error("Invalid input of picture file!");
            }
            //@ts-ignore
            // if(req.companyConfig.visitors["document"] == true && (validator.isEmpty(attendanceData.documentId) || !req.isDocPictureBlob)){
            // status = 400;
            // throw new Error("Please provide a document information!");
            // }

            //if any one of the document (Id or image) is missing then throw error
            if (("documentId" in attendanceData && !req.isDocPictureBlob) || (req.isDocPictureBlob && !("documentId" in attendanceData))) {
                status = 400;
                throw new Error("Please provide both document id and image!");
            }

            let visitorData: any = await VisitorAttendanceTableModel.findOne({ where: { id: attendanceData.visitorId, is_deleted: false }, raw: true });
            if (!visitorData) {
                status = 404;
                throw new Error("Visitor does not exist!");
            }
            //check if visitor already checked in or not
            if (visitorData.check_in_time != null) {
                status = 400;
                throw new Error("Visitor already checked in!");
            }
            //check if visitor already checked out or not
            if (visitorData.check_out_time != null) {
                status = 400;
                throw new Error("Visitor already checked out!");
            }

            //@ts-ignore
            const picturesArray = Array.isArray(req.files.picture) ? req.files.picture.flat() : null;
            step = 7;
            let momentDate: string = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
            const imageDir = path.join(__dirname, '..', 'public', 'visitorImage', req.compId as string, momentDate); // Set the directory to save the image
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, { recursive: true }); // Create the directory if it doesn't exist
            }
            let images: any = [];
            if (picturesArray) {
                for (const picture of picturesArray) {
                    const pictureName = `${Date.now()}-in-${picture.originalname}`;
                    const picturePath = path.join(imageDir, pictureName);
                    await fs.promises.writeFile(picturePath, picture.buffer);
                    images.push(`/visitorImage/${req.compId as string}/${momentDate}/${pictureName}`);
                }
            }
            attendanceData.picture = images[0];


            //@ts-ignore
            if (req.isDocPictureBlob) {
                //reading the visitor's document image
                //@ts-ignore
                const docPicturesArray = Array.isArray(req.files.documentImage) ? req.files.documentImage.flat() : null;
                step = 7;
                let docImages: any = [];
                if (docPicturesArray) {
                    for (const picture of docPicturesArray) {
                        const pictureName = `${Date.now()}-doc-${picture.originalname}`;
                        const picturePath = path.join(imageDir, pictureName);
                        await fs.promises.writeFile(picturePath, picture.buffer);
                        docImages.push(`/visitorImage/${req.compId as string}/${momentDate}/${pictureName}`);
                    }
                }
                attendanceData.documentImage = docImages[0];
            }

            let todayDate = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');
            //update visitor entry
            let updatedRecord = await VisitorAttendanceTableModel.update({
                check_in_time: moment().format("HH:mm:ss"),
                document: attendanceData.documentId ? attendanceData.documentId : null,
                document_image_path: attendanceData.documentImage ? attendanceData.documentImage : null,
                check_in_path: attendanceData.picture,//images[0],
                updated_at: moment().utc().toISOString(),
                updated_by: req.compId,

            }, { where: { id: attendanceData.visitorId, is_deleted: false, date: todayDate }, transaction: tscn });

            if (!('0' in updatedRecord) || updatedRecord['0'] == null || updatedRecord['0'] == undefined || updatedRecord['0'] == 0) {
                status = 500;
                throw new Error("Checkin failed!");
            }

            if (VisitorValidationErrors.visitorErrors.length > 0) {
                status = 400;
                throw new Error(VisitorValidationErrors.visitorErrors.join(", "));
            }

            await tscn.commit();

            return res.status(status).json({
                status: "success",
                message: "Visiter's checkin done",
            });

        }
        step = 2;
        if (attendanceData.filter["entry"] == "check-in") {
            // @ts-ignore
            if (!req.isBlob) {
                status = 403;
                throw new Error("Invalid input of picture file!");
            }
            if ("whomToMeet" in attendanceData) {
                if (!validator.isEmpty(attendanceData.whomToMeet as string) && !validator.isUUID(attendanceData.whomToMeet as string)) {
                    status = 400;
                    throw new Error("Please provide a valid input for whom to meet!");
                }
                let employeeData: any = await UserTableModel.findOne({ where: { id: attendanceData.whomToMeet, is_deleted: false, company_id: req.compId }, raw: true });
                if (!employeeData) {
                    status = 404;
                    throw new Error("Employee isn't available!");
                }
            }
            //find if whom to meet is exist
            //check if doc is required
            //@ts-ignore
            // if(req.companyConfig.visitors["document"] == true && ((validator.isEmpty(attendanceData.documentId)) || !req.isDocPictureBlob)){
            // status = 400;
            // throw new Error("Please provide a document information!");
            // }

            //if any one of the document (Id or image) is missing then throw error
            if (("documentId" in attendanceData && !req.isDocPictureBlob) || (req.isDocPictureBlob && !("documentId" in attendanceData))) {
                status = 400;
                throw new Error("Please provide both document id and image!");
            }
            //reading the visitor's picture here
            //@ts-ignore
            const picturesArray = Array.isArray(req.files.picture) ? req.files.picture.flat() : null;
            step = 7;
            let momentDate: string = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
            const imageDir = path.join(__dirname, '..', 'public', 'visitorImage', req.compId as string, momentDate); // Set the directory to save the image
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, { recursive: true }); // Create the directory if it doesn't exist
            }
            let images: any = [];
            if (picturesArray) {
                for (const picture of picturesArray) {
                    const pictureName = `${Date.now()}-in-${picture.originalname}`;
                    const picturePath = path.join(imageDir, pictureName);
                    // await picture.mv(picturePath);
                    await fs.promises.writeFile(picturePath, picture.buffer);
                    images.push(`/visitorImage/${req.compId as string}/${momentDate}/${pictureName}`);
                }
            }
            attendanceData.picture = images[0];

            //@ts-ignore
            if (req.isDocPictureBlob) {
                //reading the visitor's document image
                //@ts-ignore
                const docPicturesArray = Array.isArray(req.files.documentImage) ? req.files.documentImage.flat() : null;
                step = 7;
                let docImages: any = [];
                if (docPicturesArray) {
                    for (const picture of docPicturesArray) {
                        const pictureName = `${Date.now()}-doc-${picture.originalname}`;
                        const picturePath = path.join(imageDir, pictureName);
                        // await picture.mv(picturePath);
                        await fs.promises.writeFile(picturePath, picture.buffer);
                        docImages.push(`/visitorImage/${req.compId as string}/${momentDate}/${pictureName}`);
                    }
                }
                attendanceData.documentImage = docImages[0];
            }
            //create visitor entry
            await VisitorAttendanceTableModel.create({
                name: attendanceData.visitorName ? attendanceData.visitorName : "",
                mobile: attendanceData.mobile,
                address: attendanceData.address,
                device_id: attendanceData.deviceId,
                check_in_path: attendanceData.picture, //images[0],
                date: moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ'),
                check_in_time: moment().format("HH:mm:ss"),
                reason_for_visit: attendanceData.reasonForVisit,
                document: attendanceData.documentId ? attendanceData.documentId : null,
                document_image_path: attendanceData.documentImage ? attendanceData.documentImage : null,
                user_id: "whomToMeet" in attendanceData ? attendanceData.whomToMeet : null,
                company_id: req.compId,
                is_deleted: false,
                created_at: moment().utc().toISOString(),
                created_by: req.compId
            });

            if (VisitorValidationErrors.visitorErrors.length > 0) {
                status = 400;
                throw new Error(VisitorValidationErrors.visitorErrors.join(", "));
            }

            await tscn.commit();

            return res.status(status).json({
                status: "success",
                message: "Visiter's record added",
            });
        }
        else if (attendanceData.filter["entry"] == "check-out") {
            if (validator.isEmpty(attendanceData.visitorId as string) || !validator.isUUID(attendanceData.visitorId as string)) {
                status = 400;
                throw new Error("Please provide a valid visitor id!");
            }

            let visitorData: any = await VisitorAttendanceTableModel.findOne({ where: { id: attendanceData.visitorId, is_deleted: false }, raw: true });
            if (!visitorData) {
                status = 404;
                throw new Error("Visitor does not exist!");
            }

            if (visitorData.check_in_time == null) {
                status = 400;
                throw new Error("Visitor didn't check in!");
            }

            if (visitorData.check_out_time != null) {
                status = 400;
                throw new Error("Visitor already checked out!");
            }

            let picturesArray: any;
            let images: any = [];
            if (req.companyConfig.visitors["checkout"]) {
                // @ts-ignore
                if (!req.isBlob) {
                    status = 403;
                    throw new Error("Invalid input of picture file!");
                }
                //@ts-ignore
                picturesArray = Array.isArray(req.files.picture) ? req.files.picture.flat() : null;
                step = 7;
                let momentDate: string = moment().startOf('day').utcOffset('+05:30').format('YYYY-MM-DD');
                const imageDir = path.join(__dirname, '..', 'public', 'visitorImage', req.compId as string, momentDate); // Set the directory to save the image
                if (!fs.existsSync(imageDir)) {
                    fs.mkdirSync(imageDir, { recursive: true }); // Create the directory if it doesn't exist
                }
                if (picturesArray) {
                    for (const picture of picturesArray) {
                        const pictureName = `${Date.now()}-out-${picture.originalname}`;
                        const picturePath = path.join(imageDir, pictureName);
                        // await picture.mv(picturePath);
                        await fs.promises.writeFile(picturePath, picture.buffer);
                        images.push(`/visitorImage/${req.compId as string}/${momentDate}/${pictureName}`);
                    }
                }

            }
            else {
                images.push(null);
            }

            attendanceData.picture = images[0];
            //calculate the total hour, minutes, seconds
            let checkInTime: any = moment(visitorData.check_in_time, "HH:mm:ss"); // format will be HH:MM:SS
            let totalTime = new Services.CommonService().calculateDuration(checkInTime);
            //update visitor entry
            let updatedRecord = await VisitorAttendanceTableModel.update({
                check_out_path: images[0],
                device_id: attendanceData.deviceId,
                check_out_time: moment().format("HH:mm:ss"),
                total_visited_time: totalTime,
                updated_at: moment().utc().toISOString(),
                updated_by: req.compId
            }, { where: { id: attendanceData.visitorId, is_deleted: false }, transaction: tscn });

            if (!('0' in updatedRecord) || updatedRecord['0'] == null || updatedRecord['0'] == undefined || updatedRecord['0'] == 0) {
                status = 500;
                throw new Error("Checkout failed!");
            }

            await tscn.commit();

            return res.status(status).json({
                status: "success",
                message: "Visiter's checkout done",
            });
        }
        else {
            status = 400;
            throw new Error("Please provide filter either check-in or check-out!");
        }

    }
    catch (error: any) {
        await tscn.rollback();
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status: "error",
            message: error.message
        });
    }
}

const getAllVisitorList = async (req: AttendanceData, res: any, next: any) => {
    let status = 200, step = 1;
    try {

        //decide from where the request is coming mobile device or admin console
        let companyId: any = '';
        if ('companyId' in req) {
            //for admin console
            companyId = req.companyId;
        }
        if ('compId' in req) {
            //for mobile device
            companyId = req.compId;
        }


        let name = req.query.name as string || "";
        let mobile = req.query.mobile as string || "";
        let isApproved = req.query.preApproved as string || "";
        let date: string = req.query.date as string || ""; //moment().format('YYYY-MM-DD');
        let date2: string = req.query.date2 as string || "";
        const isExport = req.query.export as string || "false";

        const page = req.query.page as string || "1";
        let limit = req.query.limit as string || "10";
        let isPreapproved: any;
        const offset: number = (+page - 1) * +limit;

        if (isApproved != "") {
            isPreapproved = JSON.parse(isApproved);
        }

        if (!validator.isEmpty(date2) && validator.isEmpty(date)) {
            status = 400;
            throw new Error("Please provide a start date!");
        }
        //if date is empty
        if (validator.isEmpty(date)) {
            date = moment().format('YYYY-MM-DD');
        }

        let dateFormat = 'YYYY-MM-DD';
        if (validator.isEmpty(date) || !validator.isDate(date, { format: dateFormat })) {
            status = 400;
            throw new Error("Invalid date, date format should be YYYY-MM-DD");
        }
        if (!validator.isEmpty(date2) && !moment(date2, 'YYYY-MM-DD', true).isValid()) {
            status = 400;
            throw new Error("Invalid date, end date format should be YYYY-MM-DD");
        }

        let todayDate = moment(date).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ');

        let where: any = {
            company_id: companyId,
            is_deleted: false,
            date: todayDate,
            // [Op.or]: [],
        };

        if (!validator.isEmpty(date2) && moment(date2, 'YYYY-MM-DD', true).isValid()) {
            where.date = {
                [Op.between]: [todayDate, moment(date2).startOf('day').utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ssZ')]
            }
        }

        if (name) {
            where[Op.or] = [];
            where[Op.or].push({
                name: {
                    [Op.iLike]: `%${name}%`,
                },
            });
        }

        if (mobile) {
            if (!name) {
                where[Op.or] = [];
            }
            where[Op.or].push({
                mobile: {
                    [Op.iLike]: `%${mobile}%`,
                },
            });
        }

        if (isPreapproved !== undefined) {
            if (!name && !mobile) {
                where[Op.or] = [];
            }
            where[Op.or].push({
                pre_approved_visit: isPreapproved,
            });
        }

        let getVisitorsData: any = await VisitorAttendanceTableModel.findAndCountAll({
            where,
            attributes: [
                ["id", "visitorId"],
                ["name", "visitorName"],
                ["mobile", "visitorMobile"],
                ["address", "visitorAddress"],
                ["check_in_path", "checkInImagePath"],
                ["check_out_path", "checkOutImagePath"],
                [sequelize.literal(`to_char(date, 'YYYY-MM-DD')`), 'date'],
                ["check_in_time", "checkInTime"],
                ["check_out_time", "checkOutTime"],
                ["reason_for_visit", "reasonForVisit"],
                ["pre_approved_visit", "preApprovedVisit"],
                ["document_image_path", "documentImagePath"],
                // ["pre_approved_by","preApprovedBy"],
                [
                    sequelize.literal(
                        `CASE WHEN pre_approved_visit = true THEN (SELECT first_name FROM employee_tables WHERE user_id = pre_approved_by) ELSE null END`
                    ),
                    "preApprovedBy"
                ],
                ["time", "visitingTime"],
                ["document", "document"],
                ["total_visited_time", "totalVisitedTime"],
            ], raw: true,
            limit: isExport == "true" ? undefined : +limit, // Add limit only if pagination is enabled
            offset: isExport == "true" ? undefined : offset, //same withe offset

            include: [
                {
                    model: UserTableModel,
                    where: { is_deleted: false, company_id: companyId },
                    include: [
                        {
                            model: EmployeeTableModel,
                            where: { is_deleted: false, company_id: companyId },
                        }
                    ],
                    required: false
                },

            ],




        });

        //format the data
        getVisitorsData.rows = getVisitorsData.rows.map((item: any) => {
            return {
                visitorId: item.visitorId,
                visitorName: item.visitorName,
                visitorMobile: item.visitorMobile,
                visitorAddress: item.visitorAddress,
                checkInImagePath: item.checkInImagePath,
                checkOutImagePath: item.checkOutImagePath,
                date: item.date,
                checkInTime: item.checkInTime,
                checkOutTime: item.checkOutTime,
                reasonForVisit: item.reasonForVisit,
                preApprovedVisit: item.preApprovedVisit,
                preApprovedBy: item.preApprovedBy,
                document: item.document,
                visitingTime: item.visitingTime,
                documentImagePath: item.documentImagePath,
                totalVisitedTime: item.totalVisitedTime,
                whomeToMeet: item["user_table.employee_table.first_name"],
                // employeeMobile:item["user_table.employee_table.mobile"]
            }
        });

        return res.status(status).json({
            status: "success",
            message: "Visitor list fetched successfully",
            data: {
                visitorsData: getVisitorsData.rows,
                totalCount: getVisitorsData.count
            }
        });
    }
    catch (error: any) {
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status: "error",
            message: error.message
        });
    }
}

const getAllEmployeeList = async (req: AttendanceData, res: any, next: any) => {
    let step = 1, status = 200;
    try {

        let userEmployee: any = await UserTableModel.findAll({
            where: { is_deleted: false, is_active: true, company_id: req.compId },
            include: [
                {
                    model: EmployeeTableModel,
                    where: { is_deleted: false, is_active: true, company_id: req.compId },
                    attributes: [["first_name", "employeeName"], ["mobile", "employeeMobile"]]
                }
            ],
            attributes: [["id", "userId"]],
            raw: true
        });

        //format the data
        userEmployee = userEmployee.map((item: any) => {
            return {
                userId: item.userId,
                employeeName: item["employee_table.employeeName"],
                employeeMobile: item["employee_table.employeeMobile"]
            }
        });

        return res.status(status).json({
            status: "success",
            message: "Employee list fetched successfully",
            data: userEmployee
        });
    }
    catch (error: any) {
        console.log(`step ${step} error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status: "error",
            message: error.message
        });
    }
}

export { registerVisitor, getAllEmployeeList, getAllVisitorList };