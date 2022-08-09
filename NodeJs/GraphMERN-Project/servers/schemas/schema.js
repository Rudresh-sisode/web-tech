const { project, client} = require('../sampleData');


const {GraphQLObjectType, GraphQLID, GraphQLString} = require('graphql');

const ClientType = new GraphQLObjectType({
    name:'Client',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        phone:{type:GraphQLString}
    })
})

const RootQuery = new GraphQLObjectType({
    name:'RotQueryType',
    fields{
        client:{
            type:ClientType
        }
    }
})
