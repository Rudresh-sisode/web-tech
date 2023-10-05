import { DataTypes } from "sequelize";
import sequelize from "../../utilities/database-connect";

const EmployeeTableModel = sequelize.define('employee_table',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV1,
        allowNull:false,
        primaryKey:true
    },
    emp_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    first_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    middle_name:{
        type:DataTypes.STRING
    },
    last_name:{
        type:DataTypes.STRING
    },
    otp:{
        type:DataTypes.STRING,
    },
    otp_date:{
        type:DataTypes.DATE
    },
    date_of_birth:{
        type:DataTypes.DATE
    },
    joining_date:{
        type:DataTypes.DATE
    },
    personal_email:{
        type:DataTypes.STRING
        
    },
    mobile:{
        type:DataTypes.STRING

    },
    current_address:{
        type: DataTypes.JSON
    },
    permanent_address:{
        type: DataTypes.JSON
    },
    emergency_contact:{
        type: DataTypes.JSON
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    both_address_same:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
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

export default EmployeeTableModel;