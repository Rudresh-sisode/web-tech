import { DataTypes } from "sequelize";
import sequelize from "../../utilities/database-connect";

const EmployeeLeaveModel = sequelize.define('employee_leave',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV1,
        allowNull:false,
        primaryKey:true
    },
    date:{
        type:DataTypes.DATE,
    },
    reason:{
        type:DataTypes.STRING,
    },
    status:{
        type:DataTypes.STRING,
    },
    check_in:{
        type:DataTypes.BOOLEAN,
    },
    check_out:{
        type:DataTypes.BOOLEAN,
    },
    is_mail_sent:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    attendance_id:{
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

export default EmployeeLeaveModel;