const express=require("express");
const routes= require("./routes/routes");

const app=express();

require("dotenv").config();
const PORT=process.env.PORT||4000;

app.use(express.json());

const cookieParser= require("cookie-parser");
app.use(cookieParser());

require("./config/database").connect();

app.use("/api/v1",routes);

app.listen(PORT,()=>{
    console.log(`server started on port${PORT}`);
})

