const jwt =require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();

exports.auth = (req, res, next)=>{

    try {
        // const token =req.body.token;
        console.log("cookie" , req.cookies.token);
        console.log("body" , req.body.token);
        console.log("header", req.header("Authorization"));
       
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if(!token || token === undefined){
           return res.status(400).json({
                success:false,
                message:"token is missing"
            })
        }

        try {
            const decoded= jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            req.user= decoded;


        } catch (error) {
            console.error(error);
            return res.status(401).json({
                success:false,
                message:"incorrect the token"
            })
        }
        
        next();

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })
    }
}

exports.isStudent= (req, res, next)=>{
    try {
        if(req.user.role!="Student"){
           return res.status(401).json({
                success:false,
                message:"this is protected route for student"
            })
        }
    } catch (error) {
    return res.status(401).json({
        success:false,
        message:"something went wrong"
     })   
    }
    next();
}

exports.isAdmin= (req, res, next)=>{
    try {
        if(req.user.role!="Admin"){
           return res.status(401).json({
                success:false,
                message:"this is protected route for Admin"
            })
        }
    } catch (error) {
    return res.status(401).json({
        success:false,
        message:"something went wrong"
     })   
    }
    next();
}