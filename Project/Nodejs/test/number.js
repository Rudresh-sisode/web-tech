const {response,request,next} = require('express');
export function tranformToNumber(request,response,next){
    try{
        throw new Error("Not a number")
    }
    catch(error){
        response.status(200).json({
            message:"success",
            content:error.message
        })
        
    }
    
}