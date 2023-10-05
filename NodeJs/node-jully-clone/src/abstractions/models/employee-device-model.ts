import { DataTypes } from "sequelize";
import sequelize from "../../utilities/database-connect";

const EmployeeDeviceModel = sequelize.define('employee_device',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV1,
        allowNull:false,
        primaryKey:true
    },
    device_id:{
        type:DataTypes.STRING,
    },
    manufacturer:{
        type:DataTypes.STRING,
    },
    model:{
        type:DataTypes.STRING,
    },
    is_verified:{
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

export default EmployeeDeviceModel;