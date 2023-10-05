import { Sequelize } from "sequelize";
require('dotenv').config();

const sequelize = new Sequelize('checkinout',process.env.PG_ADMIN_USER as string,process.env.PG_ADMIN_PASS,{
    dialect:'postgres',
    host:'localhost',
    pool:{
        max:10,
        min:0,
        acquire:30000,
        idle:10000
    },
    timezone:'+05:30'
});

export default sequelize;