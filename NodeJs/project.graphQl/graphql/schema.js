const { build, buildSchema } = require('graphql');

module.export = buildSchema(`
    type TestData{
        text:String!
        views:Int!
    }

    type RootQuery{
        hello:TestData!
    }

    schema{
        query:RootQuery
    }    
`)