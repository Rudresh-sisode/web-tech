import { DataTypes } from "sequelize";
import sequelize from "../../utilities/database-connect";

const HistoryTableModel = sequelize.define('history_table',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV1,
        allowNull:false,
        primaryKey:true
    },
    file_name:{
        type:DataTypes.STRING,
    },
    action_table:{
        type:DataTypes.STRING,
    },
    inserted_data:{
        type:DataTypes.JSON,
    },
    succeed_count:{
        type:DataTypes.INTEGER,
    },
    failed_data:{
        type:DataTypes.JSON,
    },
    failed_count:{
        type:DataTypes.INTEGER,
    },
    failed_message_data:{
        type:DataTypes.JSON,
    },
    action_type:{
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
    }
},{
    timestamps: false
});

export default HistoryTableModel;