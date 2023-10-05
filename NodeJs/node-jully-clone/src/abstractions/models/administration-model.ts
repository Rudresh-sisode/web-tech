import { DataTypes } from "sequelize";
import sequelize from "../../utilities/database-connect";
import { AdministratorValidator } from "../errors/validation-errors";
import validator from "validator";

const AdministrationTableModel = sequelize.define('admin_table',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV1,
        allowNull:false,
        primaryKey:true
    },
    first_name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isItEmpty(value:string){
                if(value.length == 0){
                    // throw new Error("First name cannot be empty");
                    AdministratorValidator.adminErrors.push("First name cannot be empty");
                }
            }
        }
    },
    last_name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isItEmpty(value:string){
                if(value.length == 0){
                    // throw new Error("Last name cannot be empty");
                    AdministratorValidator.adminErrors.push("Last name cannot be empty");
                }
            }
        }
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isItEmail(value:string){
                if(!validator.isEmail(value)){
                    // throw new Error("Invalid email format");
                    AdministratorValidator.adminErrors.push("Invalid email format");
                }
            }
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isItEmpty(value:string){
                if(value.length == 0){
                    // throw new Error("Password cannot be empty");
                    AdministratorValidator.adminErrors.push("Password cannot be empty");
                }
            },
            isItStrong(value:string){
                if(!validator.isLength(value,{min:8})){
                    // throw new Error("Password must be strong");
                    AdministratorValidator.adminErrors.push("Password must be strong min 8 characters required");
                }
            }
        }
    },
    temporary_password:{
        type:DataTypes.STRING,
    },
    temporary_password_expiry_date:{
        type:DataTypes.DATE,
        defaultValue:null
    },
    mobile:{
        type:DataTypes.STRING,
        allowNull:false
    },
    created_by:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    created_at:{
        type:DataTypes.DATE,
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
    }
},{
    timestamps: false
});

export default AdministrationTableModel;
