import { DataTypes } from "sequelize";
import sequelize from "../../utilities/database-connect";

const RoleTableModel = sequelize.define('role_table',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV1,
        allowNull:false,
        primaryKey:true
    },
    role_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    role_value:{
        type:DataTypes.STRING,
        allowNull:false
    },
    privileges:{
        type:DataTypes.JSON,
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

export default RoleTableModel;