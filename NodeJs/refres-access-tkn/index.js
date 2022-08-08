const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

function auth(req,res,next){
    let token = req.headers['authorization'];
    token = token.split(' ')[1];//access token
    console.log("lsls") 
    jwt.verify(token,"aCceSs",(err,user)=>{
        if(!err){
            req.user = user;
            next();
        }
        else{
            return res.status(401).json({
                message:"Not allow"
            })
        }
       
    })

    //
}

app.post("/renewAccessToken", (req,res,next)=>{
    const refreshToken = req.body.token;
    if(!refreshToken){
        return res.status(401).json({
            message:"User not"
        })
    }
    jwt.verify(refreshToken,"rEfResH",(err,user)=>{
        if(!err){
            const accessToken = jwt.sign(user,"aCceSs",{expiresIn:'2m'})
            return res.status(201).json({
                accessToken
            })
        }
        else{
            return res.status(403).json({
                message:'user not authenticated!'
            })
        }
    })
})

app.post('/renewAccessToken',(req,res,next)=>{
    const {token:refreshToken} = req.body;
})

app.post('/protected',auth, (req,res,next)=>{
    res.send("inside protected route")
})
app.post('/login',(req,res,next)=>{
    
    const user= req.body.user

    if(!user){
        res.status(404).json({
            message:"body is empty~"
        })
    }

    let accessToken = jwt.sign(user,'aCceSs',{expiresIn:'2m'});
    let refreshToken = jwt.sign(user,"rEfResH",{expiresIn:'1m'});

    return res.status(201).json({
        accessToken,
        refreshToken
    })
})

console.log("on port ~3000")
app.listen(3000);