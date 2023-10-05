import { DataTypes } from "sequelize";
import sequelize from "../../utilities/database-connect";

const DesignationTableModel = sequelize.define('designation_table',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV1,
        allowNull:false,
        primaryKey:true
    },
    designation_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    designation_value:{
        type:DataTypes.STRING,
        allowNull:false
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
    }
},{
    timestamps: false
});

export default DesignationTableModel;