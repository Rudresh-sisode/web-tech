import { DataTypes } from "sequelize";
import sequelize from "../../utilities/database-connect";

const CronJobLogTableModel = sequelize.define('cron_job_log',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV1,
        allowNull:false,
        primaryKey:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    created_at:{
        type:DataTypes.DATE,
        defaultValue:null,
    }
},{
    timestamps: false
});

export default CronJobLogTableModel;
