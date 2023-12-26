const express = require('express');
const axios = require('axios');

const app = express();

app.get('/profile',async (req,res)=>{
    try{
        const response = await axios.get('https://api.github.com/users/Rudresh-sisode');
        res.json(response.data);

    }
    catch(error){
        console.log(error);
        res.status(500).send('an error occured');
    }
});

app.use((req,res)=>{
    res.status(400).send('Not found');
})

app.listen(3001,()=>{
    console.log(`Server is runnig on port ${3000}`)
})