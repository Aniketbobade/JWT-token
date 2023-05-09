const User = require("../models/User");
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");


exports.signup= async (req,res)=>{

    try {
       const {name,email,password,role}= req.body;
       const existingUser= await User.findOne({email});
       if(existingUser){
        return res.status(400).json({
            success:false,
            message:"email already present"
        })
       }

       let hashPassword;
       try {
            hashPassword= await bcrypt.hash(password,10);
       } catch (error) {
            return res.status(500).json({
                success:false,
                message:"password can not dcrypt occur"
            })
       }
       const user= await User.create({
        name,password:hashPassword,email,role
       });
       return res.status(200).json({
        success:true,
        message:"signup successfully by user",
        data:user
       })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })
    }
}

exports.signin= async(req,res)=>{
    try {
        const {email,password}=req.body;
        // console.log(email+" "+password);
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"please fill all details carefully"
            })
        }
        let user= await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user not exist"
            })
        }
        const payload={
            email:user.email,
            id:user._id,
            role:user.role
        }
        if(await bcrypt.compare(password,user.password)){
            let token= jwt.sign(payload,process.env.JWT_SECRET,
                {
                    expiresIn:"2hr",
                });
        
        user =user.toObject();
        user.token=token;
        user.password=undefined;

        

        const options ={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true
        }

        return res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"User logged In suggessfully"
        })
        }else{
            return res.status(403).json({
                success:false,
                message:"incorrect password"
            })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}