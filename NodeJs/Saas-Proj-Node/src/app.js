const express = require('express');
const mongoose = require('mongoose');
const {graphqlHTTP} = require('express-graphql');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const graphqlSchema = require('./graphQL/schema.graphql');
const graphqlResolver = require('./graphQL/resolver.graphql');
const authMiddleware = require('./middleware/auth.middleware');
const roleAccessMiddleware = require("./middleware/role-access.middleware");
const bcrypt = require('bcryptjs');
const moment = require('moment');

/***************************************************************** */
const Company = require("./models/company.model");
const Admin = require("./models/admin.model");
const Roles = require("./models/role.model");
const Resource = require("./models/resource.model");
const Actions = require("./models/action.model");
const States = require('./models/states.model');

/***************************************************************** */

const actionSeed = require("./data/action.seeds.json");
const adminSeed = require("./data/administrative.seeds.json");
const companySeed = require('./data/company.seeds.json');
const resourceSeed = require("./data/resource.seeds.json");
const roleSeed = require("./data/role.seeds.json");
const statesSeeds = require("./data/states.seeds.json");

/***************************************************************** */

const {color,log} = require('console-log-colors');
const {red,green,cyan} = color;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Roles");
    res.setHeader("Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS,PATCH");
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})

app.use(authMiddleware);//auth-gaurd middleware
app.use(roleAccessMiddleware)//check role access of user request

app.use('/graphql',graphqlHTTP({
    schema:graphqlSchema,
    rootValue:graphqlResolver,
    graphiql:true,
    customFormatErrorFn(err){
        console.log(!err.originalError);
        if(!err.originalError){
            return err;
        }
        const data = err.originalError.data
        const message = err.message;
        const status = "error";
        const code = err.originalError.status;
        const lcl = err.path
        return {
            responseStatus: status,
            message: message,
            data: data || null,
            statusCode: code || 500,
            locations:lcl
        }
    }
}))

//
//-----------------------------------mongo database---------------------------------------
//

mongoose.connect(`${process.env.URL_PATH}/${process.env.DATABASE}`)
.then(async succ=>{
    console.log(cyan("~Database Connected Successfully~"));
    //if company not found in db insert the seed data
    const companyResult = await Company.findOne().lean();
    if(!companyResult || companyResult === null){
        //insert the company seed data to db

        const states = [];
        for(let i = 0; i < statesSeeds.length; i++){
            states.push({city_name:statesSeeds[i].name,state_name:statesSeeds[i].state});
        }

        await States.insertMany(states);
        
        let stateIdResult = await States.findOne({city_name:companySeed.city}).select("_id");
       


        await Company.create({cmp_name:companySeed.companyName,
        cmp_email:companySeed.companyEmail,
        cmp_address:companySeed.address1,
        cmp_address2:companySeed.address2,
        city:companySeed.city,
        zipcode:companySeed.zipcode,
        state_key:stateIdResult._id,
        office_number:companySeed.officeNumber,
        mobile_number:companySeed.mobileNumber,
        fax:companySeed.fax,
        is_active:true,
        website:companySeed.website,
        is_system_entry:true,
        createdAt:moment(),
        createdBy:"e-System"});

        //if resource not found in db insert the seed data
        const resourceResult = await Resource.findOne().lean();

        if(!resourceResult || resourceResult === null){
            //insert the resource seed data to db
            const resourceData = [];
            for(let i = 0; i < resourceSeed.name.length;i++){
                resourceData.push({name:resourceSeed.name[i],
                    value:resourceSeed.value[i],
                    is_system_entry:true,
                    createdAt:moment(),
                    createdBy:"e-System"})
            }
            
            await Resource.insertMany(resourceData);

        }

        //if actions not found in db insert the actions seed data
        const actionResult = await Actions.findOne().lean();
        if(!actionResult || actionResult === null){
            //insert the action seed data to db
            const actionData =[];
            for(let i = 0; i < actionSeed.actionValue.length; i++){
                actionData.push({name:actionSeed.action_name[i],value:actionSeed.actionValue[i],is_system_entry:true,createdAt:moment(),createdBy:"e-System"});
            }
            await Actions.insertMany(actionData);
        }

        const ACTIONS = await Actions.find().select("_id name value").lean();
        const RESOURCE = await Resource.find().select("_id name value").lean();
        const rolesResult = await Roles.find().lean();

        if(!rolesResult || rolesResult === null || rolesResult.length === 0){
            const ROLES = [];

            for(let a=0; a < ACTIONS.length; a++){
                for(let i = 0; i < RESOURCE.length; i++){
                    ROLES.push({role_name:roleSeed.roleName,role_value:roleSeed.roleValue,
                    resource_name:RESOURCE[i].name, resource_value:RESOURCE[i].value,
                    resource_id:RESOURCE._id, action_name:ACTIONS[a].name,action_value:ACTIONS[a].value,
                    action_id:ACTIONS[a]._id,is_system_entry:true,createdAt:moment(),createdBy:"e-System"})
                }
            }

            const roleIResult = await Roles.insertMany(ROLES);
            

            const roleFoundResult = await Roles.findOne().select("role_name role_value").lean();


            const brcPasswordResult = await bcrypt.hash(adminSeed.password,12);
            const compId = await Company.findOne();
            const adminLogin = new Admin({
                name:adminSeed.name,
                email:adminSeed.email,
                password:brcPasswordResult,
                role_value:roleFoundResult.role_value,
                role_name:roleFoundResult.role_name,
                department:adminSeed.department,
                designation:adminSeed.designation,
                cmp_id:compId._id,
                is_active:true,
                is_system_entry:true,
                createdAt:moment(),
                createdBy:'e-System'
            })

            await adminLogin.save();
            
        }

    }
    

})
.catch(err=>{
    console.log(red("~Database Connection Failed~"+err))
})

module.exports = app;