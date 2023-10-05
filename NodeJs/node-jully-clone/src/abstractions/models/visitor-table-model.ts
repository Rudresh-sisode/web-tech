import { DataTypes } from "sequelize";
import sequelize from "../../utilities/database-connect";
import { VisitorValidationErrors } from "../errors/validation-errors";
import validator from "validator";

//table model inseration
import UserTableModel from "./user-table-model";

const VisitorAttendanceTableModel = sequelize.define('visitor_attendance_table',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV1,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        // allowNull:false,
        validate:{
            isItEmpty(value:string){
                if(value == null || value == undefined || value.length == 0 ){
                    VisitorValidationErrors.visitorErrors.push("Visitor's name cannot be empty");
                }
            }
        }
    },
    mobile:{
        type:DataTypes.STRING,
    },
    address:{
        type:DataTypes.STRING,
    },
    device_id:{
        type:DataTypes.STRING,
        
    },
    check_in_path:{
        type:DataTypes.STRING,
    },
    check_out_path:{
        type:DataTypes.STRING,
    },
    date:{
        type:DataTypes.DATE,
        // allowNull:false
    },
    check_in_time:{
        type:DataTypes.TIME,
    },
    reason_for_visit:{
        type:DataTypes.STRING,
    },
    check_out_time:{
        type:DataTypes.TIME
    },
    total_visited_time:{
        type:DataTypes.STRING,
    },
    pre_approved_visit:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    pre_approved_by:{
        type:DataTypes.UUID,
        validate:{
            isValidUUID(value:string){
                if(!validator.isUUID(value)){
                    VisitorValidationErrors.visitorErrors.push("Invalid pre-approved by id");
                }
            },
            async checkContrains(value:string,companyId:string = global.appState.companyId){
                //check if the value is UUID
                if(validator.isUUID(value)){
                    //check if the user is exist in the table or not
                    let isUserExist = await UserTableModel.findOne({
                        where:{
                            id : value,
                            company_id : companyId
                        },
                        raw : true
                    });
                    if(!isUserExist){
                        VisitorValidationErrors.visitorErrors.push("Employee doesn't exist");
                    }
                    
                }
            },
            
        }
    },
    document:{
        type:DataTypes.STRING,
    },
    time:{
        type:DataTypes.JSON,
        defaultValue:{
            start_time:null,
            end_time:null
        }
    },
    document_image_path:{
        type:DataTypes.STRING,
    },
    created_at:{
        type:DataTypes.DATE,
        defaultValue:null,
    },
    created_by:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    updated_at:{
        type:DataTypes.DATE,
        defaultValue:null
    },
    updated_by:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    is_deleted:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    deleted_at:{
        type:DataTypes.DATE,
        defaultValue:null
    },
    deleted_by:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    
},{
    timestamps: false
});

export default VisitorAttendanceTableModel;