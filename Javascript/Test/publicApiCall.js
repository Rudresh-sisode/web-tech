// pubic api call
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.get('/github',async (req,res)=>{
    try{

        const response = await axios.get('https://api.github.com/users/Rudresh-Sisode')
        console.log(res.data);
        res.send(response.data)

    }
    catch(error){
        console.log(error);
        res.status(503).send('Service isn\'t available ')
    }
})

app.listen(port,()=>{
    console.log("server is started on port number ",port)
});