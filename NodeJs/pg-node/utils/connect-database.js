const {Sequelize} = require('sequelize');
const sequelize =  new Sequelize('metromony','postgres','root',
{dialect:'postgres',host:'localhost'})

module.exports =sequelize;
//this file has database connection of postgresql with your program