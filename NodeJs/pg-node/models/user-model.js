const {Sequelize} = require('sequelize');
const DataTypes = require('sequelize')
const sequelize = require('../utils/connect-database');

const User = sequelize.define('user',{
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    key:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV1,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    mobile:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    is_forget_password:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    forgot_temp_code:{
        type:DataTypes.STRING
    },
    forgot_temp_code_expiration:{
        type:DataTypes.DATE
    },
    is_active:{
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
    }
},{
    timestamps: false
})

module.exports = User;