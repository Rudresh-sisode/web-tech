import { DataTypes } from "sequelize";
import sequelize from "../../utilities/database-connect";
import { CompanyValidationErrors } from "../errors/validation-errors";
import validator from "validator";

const CompanyTableModel = sequelize.define('company_table',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV1,
        allowNull:false,
        primaryKey:true
    },
    company_name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
           
            isItEmpty(value:string){
                if(value.length == 0){
                    // throw new Error("Company name cannot be empty");
                    CompanyValidationErrors.companyErrors.push("Company name cannot be empty");
                }
            }
        }
    },
    company_email:{
        type:DataTypes.STRING,
        // allowNull:false,
        validate:{
            isItEmail(value:string){
                if(!validator.isEmail(value)){
                    // throw new Error("Invalid email format");
                    CompanyValidationErrors.companyErrors.push("Email must be valid");
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
    company_address1:{
        type:DataTypes.STRING,
        allowNull:false
    },
    company_phone:{
        type:DataTypes.STRING,
        // allowNull:false
    },
    company_website:{
        type:DataTypes.STRING,
        // allowNull:false
    },
    company_logo:{
        type:DataTypes.BLOB,
        // allowNull:false
    },
    preffix_string:{
        type:DataTypes.STRING,
        // allowNull:false
    },
    company_fax:{
        type:DataTypes.STRING,
        // allowNull:false
    },
    office_number:{
        type:DataTypes.STRING,
    },
    configuration:{
        type: DataTypes.JSON
    },
    added_by:{
        type:DataTypes.STRING,
        defaultValue:null
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
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
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

export default CompanyTableModel;