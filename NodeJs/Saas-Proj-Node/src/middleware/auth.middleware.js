const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/admin.model');

module.exports = async (req,res,next) => {
    let step = 1;
    try{
        const authHeader = req.get('Authorization');
        if(!authHeader || authHeader === null){
            console.log(`middleware step ${step} error`)
            req.isAuth = false;
            return next();
        }

        const accessToken = authHeader.split(" ")[1];
        const refreshToken = authHeader.split(" ")[2];

        const decodeAccessToken = jwt.verify(accessToken,process.env.JWT_TOKEN_KEY);
        const decodeRefreshToken = jwt.verify(refreshToken,process.env.JWT_TOKEN_KEY);

        req.loginAuthData = {expiredTime:decodeAccessToken.expiredTime,userId:decodeAccessToken.userId,email:decodeAccessToken.email,companyId:decodeAccessToken.cmpId};
        step = 2;
        if(!decodeAccessToken || !decodeRefreshToken){
            console.log(`middleware step ${step} error`)
            req.isAuth = false;
            return next();
        }

        step = 3;
        if(moment().isAfter(req.loginAuthData.expiredTime)){
            console.log(`middleware step ${step} error`)
            req.isAuth = false;
            return next();
        }

        if(req.isRefreshNeed){
            let userId = req.loginAuthData.userId;
            step = 4;
            const getUserRefreshToken = await User.findById(userId).select("refreshToken").lean();
            if(!getUserRefreshToken || getUserRefreshToken !== refreshToken ){
                console.log(`middleware step ${step} error`)
                req.isAuth = false;
                return next();
            }
            const jwtAccessToken = jwt.sign({userId:decodeAccessToken.userId,expiredTime:moment().add(`${process.env.ACCESSTOKEN_LIFE}`,`${process.env.ACCESSTOKEN_LIFE_TYPE}`)});
            const jwtRefreshToken = jwt.sign({userId:decodeRefreshToken.userId,expiredTime:moment().add(`${process.env.REFRESSTOKEN_LIFE}`,`${process.env.REFRESHTOKEN_LIFE_TYPE}`)});

            const updatingOldRefreshToken = await User.updateOne({_id:decodeRefreshToken.userId},{refreshToken:jwtRefreshToken},{upsert:false});
            if(updatingOldRefreshToken.acknowledged === true && updatingOldRefreshToken.modifiedCount === 1){
                req.isAuth = true;
                req.tokens = {
                    accessToken:jwtAccessToken,
                    refreshToken: jwtRefreshToken
                }

                return next();
            }
            step =5;
            console.log(`middleware step ${step} error`)
            req.isAuth = false;
            return next();
            
        }

        let futurePastTimeNodes = moment(req.loginAuthData.expiredTime).subtract(3,'minutes');

        if(moment().isBetween(futurePastTimeNodes,req.loginAuthData.expiredTime)){
            //check if the refresh token available
            let userId = req.loginAuthData.userId;
            const getUserRefreshToken = await User.findById(userId).select("refreshToken").lean();
            if(!getUserRefreshToken || getUserRefreshToken !== refreshToken ){
                step = 6;
                console.log(`middleware step ${step} error`)
                req.isAuth = false;
                return next();
            }
            req.isAuth = true;
            req.refreshNeed = true;
            return next()
        }

        if(moment().isBefore(req.loginAuthData.expiredTime)){
            req.isAuth = true;
            return next();
        }
        else{
            req.isAuth = false;
            return next();
        }

        // return next();

    }
    catch(error){
        console.log(`middleware step ${step} error ${error}`)
        req.authMiddlewareError = error.message;
        req.isAuth = false;
        return next();
    }
}