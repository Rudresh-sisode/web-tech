const express = require('express')
const {graphqlHTTP} = require("express-graphql")
const schema = require('./schemas/schema')


require('dotenv').config();
const app = express();

app.use('/graphql',graphqlHTTP({

    schema,
    graphiql:true

}))
app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})
