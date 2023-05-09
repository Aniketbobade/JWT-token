const express = require("express");
const router = express.Router();

const {signup,signin}= require("../controller/auth");

const{auth,isStudent,isAdmin}= require("../middleware/auths");

router.post("/signup",signup);
router.get("/signin",signin);

// protected routes
router.get("/test", auth , (req, res)=>{
    res.status(200).json({
        success:true,
        message:"this is test routes"
    });
})

router.get("/student", auth, isStudent, (req, res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to Student routes"
    });
});

router.get("/admin", auth, isAdmin, (req, res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to Admin routes"
    });
})

module.exports = router;