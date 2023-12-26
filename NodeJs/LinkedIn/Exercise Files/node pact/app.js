const express = require('express');
const app = express();

app.use(express.json());

app.get('/resource',(req,res)=>{
    res.send('Get request to the resources');
})

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})