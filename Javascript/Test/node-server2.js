 const express = require('express');
 const axios = require('axios');
 const app = express();
 const port = 3000;

 app.get('/profile',async(req,res)=>{
    try{
        const reponse = await axios.get('https://');
        res.json(response.data);
    }
    catch(error){
        console.error(error);
        res.status(500).send('an error occured')
    }
 });

 app.listen(port,()=>{
    console.log(`server is on port ${port}`)
 })